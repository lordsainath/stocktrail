<script setup>
import { useRouter } from 'vue-router';
import { ref, nextTick, watch } from 'vue';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';

import useRegisterStore from '@stores/registerStore';
import BaseInput from '@components/base/BaseInput.vue';
import BaseButton from '@components/base/BaseButton.vue';
import { registerUsernameSchema } from '@composables/useValidationSchemas';

const router = useRouter();
const registerStore = useRegisterStore();
const formData = registerStore.formData;
const usernameRef = ref(null);

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: registerUsernameSchema,
  initialValues: {
    username: formData.username || '',
  },
});

const [username] = defineField('username');

watch(username, (value) => {
  formData.username = value || '';
});

const handleBack = () => router.back();
const handleContinue = handleSubmit(
  async () => {
    try {
      await registerStore.checkUsername();
      router.push({ name: 'RegisterKYC' });
    } catch (e) {
      toast.error(e?.message || 'Username check failed');
    }
  },
  async () => {
    await nextTick();
    if (errors.value.username && usernameRef.value?.focus) usernameRef.value.focus();
  }
);
</script>

<template>
  <div class="space-y-4">
   <BaseInput
  ref="usernameRef"
  v-model="username"
  label="Username"
  type="text"
  placeholder="Enter your username"
  :error="errors.username"
  required
  @keyup.enter="handleContinue"
/>
    <div class="mt-6 flex gap-4">
      <BaseButton variant="secondary" @click="handleBack"> Back </BaseButton>
      <BaseButton variant="primary" @click="handleContinue"> Continue </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
