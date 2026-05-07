<script setup>
import { watch, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useRegister } from '../../composables/useRegister';
import useRegisterStore from '../../stores/registerStore';
import BaseInput from '../base/BaseInput.vue';
import BaseButton from '../base/BaseButton.vue';
import { registerKycSchema, validateForm } from '../../utils/validationSchemas';

const router = useRouter();
const {

  panStatus,
  panMessage,
  aadhaarStatus,
  aadhaarMessage,
  loading,
  schedulePanVerification,
  scheduleAadhaarVerification,
  submitRegistration,
} = useRegister();
const registerStore = useRegisterStore();
const formData = registerStore.formData;
const errors = ref({});
const panRef = ref(null)
const aadhaarRef = ref(null)

const handleBack = () => router.back();

watch(() => formData.panNumber, schedulePanVerification);
watch(() => formData.aadhaarNumber, scheduleAadhaarVerification);



// Final Registration Submission
const handleContinue = async () => {
  // Validate KYC fields
  const { isValid, errors: validationErrors } = await validateForm(registerKycSchema, {
    panNumber: formData.panNumber,
    aadhaarNumber: formData.aadhaarNumber,
  });

  if (!isValid) {
    errors.value = validationErrors;
    const firstKey = Object.keys(validationErrors)[0];
    await nextTick();
    if (firstKey === 'panNumber' && panRef.value?.focus) panRef.value.focus();
    if (firstKey === 'aadhaarNumber' && aadhaarRef.value?.focus) aadhaarRef.value.focus();
    return;
  }

  errors.value = {};

  try {
    await submitRegistration();

    toast.success('Registration submitted. Check your email for the OTP.');
    router.push({ name: 'RegisterOTP' });
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Registration failed';
    toast.error(message);
  }
};



</script>

<template>
  <div class="space-y-4">
    <BaseInput ref="panRef" required v-model.trim="formData.panNumber" @input="errors.panNumber = null" label="PAN Number" type="text" maxlength="10" placeholder="ABCDE1234F"
      inputClass="uppercase" :error="errors.panNumber" :message="panMessage" :messageClass="panStatus === 'valid'
          ? 'text-emerald-600'
          : panStatus === 'checking'
            ? 'text-sky-600'
            : 'text-slate-500'
        " />
    <BaseInput ref="aadhaarRef" required v-model.trim="formData.aadhaarNumber" @input="errors.aadhaarNumber = null" label="Aadhaar Number" type="text" maxlength="12"
      placeholder="123412341234" :error="errors.aadhaarNumber" :message="aadhaarMessage" :messageClass="aadhaarStatus === 'valid'
          ? 'text-emerald-600'
          : aadhaarStatus === 'checking'
            ? 'text-sky-600'
            : 'text-slate-500'
        " />

    <div class="mt-6 flex gap-4">
      <BaseButton variant="secondary" @click="handleBack">
        Back
      </BaseButton>
      <BaseButton variant="primary" :disabled="loading" @click="handleContinue">
        Continue
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>