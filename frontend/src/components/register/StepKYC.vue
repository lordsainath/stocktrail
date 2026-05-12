<script setup>
import { watch, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import { storeToRefs } from 'pinia';
import useRegisterStore from '@stores/registerStore';
import BaseInput from '@components/base/BaseInput.vue';
import BaseButton from '@components/base/BaseButton.vue';
import { registerKycSchema } from '@composables/useValidationSchemas';
import BaseLoader from '../base/BaseLoader.vue';

const router = useRouter();
const registerStore = useRegisterStore();
const { panStatus, panMessage, aadhaarStatus, aadhaarMessage, loading } =
  storeToRefs(registerStore);
const { schedulePanVerification, scheduleAadhaarVerification, submitRegistration } = registerStore;
const formData = registerStore.formData;
const panRef = ref(null);
const aadhaarRef = ref(null);

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: registerKycSchema,
  initialValues: {
    panNumber: formData.panNumber || '',
    aadhaarNumber: formData.aadhaarNumber || '',
  },
});

const [panNumber] = defineField('panNumber');
const [aadhaarNumber] = defineField('aadhaarNumber');

watch(panNumber, (value) => {
  formData.panNumber = value || '';
});

watch(aadhaarNumber, (value) => {
  formData.aadhaarNumber = value || '';
});

const handleBack = () => router.back();

watch(() => formData.panNumber, schedulePanVerification);
watch(() => formData.aadhaarNumber, scheduleAadhaarVerification);

// Final Registration Submission
const handleContinue = handleSubmit(
  async () => {
    try {
      await submitRegistration();

      toast.success('Registration submitted. Check your email for the OTP.');
      router.push({ name: 'RegisterOTP' });
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Registration failed';
      toast.error(message);
    }
  },
  async () => {
    const firstKey = Object.keys(errors.value || {})[0];
    await nextTick();
    if (firstKey === 'panNumber' && panRef.value?.focus) panRef.value.focus();
    if (firstKey === 'aadhaarNumber' && aadhaarRef.value?.focus) aadhaarRef.value.focus();
  }
);
</script>

<template>
  <div class="space-y-4">
    <BaseInput
      ref="panRef"
      v-model.trim="panNumber"
      required
      label="PAN Number"
      type="text"
      maxlength="10"
      placeholder="ABCDE1234F"
      input-class="uppercase"
      :error="errors.panNumber"
      :message="panMessage"
      :message-class="
        panStatus === 'valid'
          ? 'text-emerald-600'
          : panStatus === 'checking'
            ? 'text-sky-600'
            : 'text-slate-500'
      "
      @keyup.enter="aadhaarRef?.focus?.()"
    />

    <BaseInput
      ref="aadhaarRef"
      v-model.trim="aadhaarNumber"
      required
      label="Aadhaar Number"
      type="text"
      inputmode="numeric"
      maxlength="12"
      placeholder="123412341234"
      :error="errors.aadhaarNumber"
      :message="aadhaarMessage"
      :message-class="
        aadhaarStatus === 'valid'
          ? 'text-emerald-600'
          : aadhaarStatus === 'checking'
            ? 'text-sky-600'
            : 'text-slate-500'
      "
      @keyup.enter="handleContinue"
    />

    <div class="mt-6 flex gap-4">
      <BaseButton variant="secondary" @click="handleBack"> Back </BaseButton>
      <BaseButton variant="primary" :disabled="loading" @click="handleContinue">
        <span v-if="!loading">Continue</span>
        <span v-else class="flex items-center justify-center gap-2">
          <BaseLoader size="sm" />
          Submitting...
        </span>
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
