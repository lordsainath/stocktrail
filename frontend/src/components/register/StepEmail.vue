<script setup>
import { useRouter } from 'vue-router';
import { ref, nextTick, watch } from 'vue';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import useRegisterStore from '@stores/registerStore';
import BaseInput from '@components/base/BaseInput.vue';
import BaseButton from '@components/base/BaseButton.vue';
import { registerEmailSchema } from '@composables/useValidationSchemas';

const router = useRouter();

const registerStore = useRegisterStore();
const formData = registerStore.formData;
const emailRef = ref(null);

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: registerEmailSchema,
  initialValues: {
    email: formData.email || '',
  },
});

const [email] = defineField('email');

watch(email, (value) => {
  formData.email = value || '';
});

watch(
  () => formData.email,
  (value) => {
    if (email.value !== value) {
      email.value = value || '';
    }
  }
);

const checkValid = handleSubmit(
  async (values) => {
    formData.email = values.email;

    try {
      const response = await registerStore.checkEmail(formData.email);

      const status = response?.data?.status;
      if (status === 'NEW_USER') return router.push({ name: 'RegisterBasic' });
      if (status === 'NOT_VERIFIED') return router.push({ name: 'RegisterOTP' });
      if (status === 'NO_PIN') return router.push({ name: 'RegisterPIN' });
      if (status === 'READY_TO_LOGIN') {
        toast.info('Email is already registered. Please login.');
        router.push({ name: 'Login' });
      }
    } catch (e) {
      console.error(e);
      toast.error(e?.message || 'Failed to check email');
    }
  },
  async () => {
    await nextTick();
    if (errors.value.email && emailRef.value?.focus) emailRef.value.focus();
  }
);
</script>

<template>
  <div class="space-y-4">
    <BaseInput
      ref="emailRef"
      v-model="email"
      label="Email Address"
      type="email"
      placeholder="Enter email address"
      :error="errors.email"
      required
      @keydown.enter="checkValid"
    />
    <div class="mt-6 flex justify-end gap-3">
      <BaseButton variant="primary" @click="checkValid"> Continue </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
