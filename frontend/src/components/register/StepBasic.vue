<script setup>
import { useRouter } from 'vue-router';
import { ref, nextTick, watch } from 'vue';
import { useForm } from 'vee-validate';

import useRegisterStore from '@stores/registerStore';
import BaseInput from '@components/base/BaseInput.vue';
import BaseButton from '@components/base/BaseButton.vue';
import { registerBasicSchema } from '@composables/useValidationSchemas';

const router = useRouter();
const registerStore = useRegisterStore();
const formData = registerStore.formData;
const nameRef = ref(null);
const passwordRef = ref(null);
const confirmRef = ref(null);

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: registerBasicSchema,
  initialValues: {
    name: formData.name || '',
    password: formData.password || '',
    confirmPassword: formData.confirmPassword || '',
  },
});

const [name] = defineField('name');
const [password] = defineField('password');
const [confirmPassword] = defineField('confirmPassword');

watch(name, (value) => {
  formData.name = value || '';
});

watch(password, (value) => {
  formData.password = value || '';
});

watch(confirmPassword, (value) => {
  formData.confirmPassword = value || '';
});

const handleBack = () => router.back();
const handleContinue = handleSubmit(
  async () => {
    router.push({ name: 'RegisterAddress' });
  },
  async () => {
    const firstKey = Object.keys(errors.value || {})[0];
    const refMap = { name: nameRef, password: passwordRef, confirmPassword: confirmRef };
    await nextTick();
    const target = refMap[firstKey];
    if (target?.value?.focus) target.value.focus();
  }
);
</script>

<template>
  <div class="space-y-4">
 <BaseInput
  ref="nameRef"
  v-model="name"
  label="Full Name"
  placeholder="Enter full name"
  :error="errors.name"
  required
  @keyup.enter="passwordRef?.focus?.()"
/>

<BaseInput
  ref="passwordRef"
  v-model="password"
  label="Password"
  type="password"
  placeholder="Enter password"
  :error="errors.password"
  required
  @keyup.enter="confirmRef?.focus?.()"
/>

<BaseInput
  ref="confirmRef"
  v-model="confirmPassword"
  label="Confirm Password"
  type="password"
  placeholder="Enter confirm password"
  :error="errors.confirmPassword"
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
