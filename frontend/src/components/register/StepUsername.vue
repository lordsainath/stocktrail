<script setup>
import { useRouter } from 'vue-router';
import { ref, nextTick } from 'vue';
import { toast } from 'vue-sonner';

import useRegisterStore from '../../stores/registerStore';
import BaseInput from '../base/BaseInput.vue';
import BaseButton from '../base/BaseButton.vue';
import { registerUsernameSchema, validateForm } from '../../utils/validationSchemas';

const router = useRouter();
const registerStore = useRegisterStore();
const formData = registerStore.formData;
const errors = ref({});
const usernameRef = ref(null)

const handleBack = () => router.back();
const handleContinue = async () => {
  // Validate username format first
  const { isValid, errors: validationErrors } = await validateForm(registerUsernameSchema, {
    username: formData.username,
  });

  if (!isValid) {
    errors.value = validationErrors;
    await nextTick();
    const firstKey = Object.keys(validationErrors)[0];
    if (firstKey === 'username' && usernameRef.value?.focus) usernameRef.value.focus();
    return;
  }

  errors.value = {};
  try {
    await registerStore.checkUsername();
    router.push({ name: 'RegisterKYC' });
  } catch (e) {
    toast.error(e?.message || 'Username check failed');
  }
}
</script>

<template>
  <div class="space-y-4">
  <BaseInput
  ref="usernameRef"
  v-model="formData.username"
  @input="errors.username = null"
  label="Choose username"
  type="text"
  placeholder="Enter your username"
  :error="errors.username"
/>
    <div class="mt-6 flex gap-4">
      <BaseButton variant="secondary" @click="handleBack">
        Back
      </BaseButton>
      <BaseButton variant="primary" @click="handleContinue">
        Continue
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>