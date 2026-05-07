<script setup>
import { useRouter } from 'vue-router';
import { ref, nextTick } from 'vue';
import { toast } from 'vue-sonner';
import useRegisterStore from '../../stores/registerStore';
import BaseInput from '../base/BaseInput.vue';
import BaseButton from '../base/BaseButton.vue';
import { registerEmailSchema, validateForm } from '../../utils/validationSchemas';


const router = useRouter();

const registerStore = useRegisterStore();
const formData = registerStore.formData;
const errors = ref({});
const emailRef = ref(null)


const checkValid = async () => {
  // Validate email format first
  const { isValid, errors: validationErrors } = await validateForm(registerEmailSchema, {
    email: formData.email,
  });

  if (!isValid) {
    errors.value = validationErrors;
    await nextTick()
    if (emailRef.value?.focus) emailRef.value.focus()
    return;
  }

  errors.value = {};
  
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
}
</script>

<template>
  <div class="space-y-4">
    <BaseInput ref="emailRef" v-model="formData.email" label="Email Address" type="email" placeholder="you@example.com"
      :error="errors.email"  @input="errors.email = null"
      @keydown.enter="checkValid" required />
    <div class="mt-6 flex justify-end gap-3">
      <BaseButton variant="primary" @click="checkValid">
        Continue
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>