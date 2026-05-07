<script setup>
import { useRouter } from 'vue-router';
import { ref, nextTick } from 'vue';

import useRegisterStore from '../../stores/registerStore';
import BaseInput from '../base/BaseInput.vue';
import BaseButton from '../base/BaseButton.vue';
import { registerBasicSchema, validateForm } from '../../utils/validationSchemas';

const router = useRouter();
const registerStore = useRegisterStore();
const formData = registerStore.formData;
const errors = ref({});
const nameRef = ref(null)
const passwordRef = ref(null)
const confirmRef = ref(null)

const handleBack = () => router.back();
const handleContinue = async () => {
  // Validate form data
  const { isValid, errors: validationErrors } = await validateForm(registerBasicSchema, {
    name: formData.name,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  });

  if (!isValid) {
    errors.value = validationErrors;
    const firstKey = Object.keys(validationErrors)[0];
    const refMap = { name: nameRef, password: passwordRef, confirmPassword: confirmRef };
    await nextTick();
    const target = refMap[firstKey];
    if (target?.value?.focus) target.value.focus();
    return;
  }

  errors.value = {};
  router.push({ name: 'RegisterAddress' });
}
</script>

<template>
  <div class="space-y-4">
   <BaseInput
    ref="nameRef"
    v-model="formData.name"
    @input="errors.name = null"
    label="Full Name"
    placeholder="Full name"
    :error="errors.name"
    required
  />

  <BaseInput
    ref="passwordRef"
    v-model="formData.password"
    @input="errors.password = null"
    label="Password"
    type="password"
    placeholder="Password"
    :error="errors.password"
    required
  />

  <BaseInput
    ref="confirmRef"
    v-model="formData.confirmPassword"
    @input="errors.confirmPassword = null"
    label="Confirm Password"
    type="password"
    placeholder="Confirm password"
    :error="errors.confirmPassword"
    required
  />
    <div class="mt-6 flex gap-4">

  <BaseButton
    variant="secondary"
    @click="handleBack"
  >
    Back
  </BaseButton>

  <BaseButton
    variant="primary"
    @click="handleContinue"
  >
    Continue
  </BaseButton>

</div>
  </div>
</template>

<style scoped></style>