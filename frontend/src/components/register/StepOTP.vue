<script setup>
import { ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useRegister } from '../../composables/useRegister';
import VOtpInput from 'vue3-otp-input';
import BaseButton from '../base/BaseButton.vue';
import { registerOtpSchema, validateForm } from '../../utils/validationSchemas';


const router = useRouter();
const { formData, verifyOtpCode } = useRegister();
const loading = ref(false);
const errors = ref({});

const handleBack = () => router.back();

// clear OTP error when user edits
watch(() => formData.otp, (val) => {
  if (errors.value?.otp) errors.value.otp = null;
});

const handleContinue = async () => {
  // Validate OTP format
  const { isValid, errors: validationErrors } = await validateForm(registerOtpSchema, {
    otp: formData.otp,
  });

  if (!isValid) {
    errors.value = validationErrors;
    await nextTick();
    document.querySelector('#otp-inputs input')?.focus();
    return;
  }

  errors.value = {};
  loading.value = true;
  try {
    await verifyOtpCode();

    toast.success('Email verified. Set your PIN to finish registration.');
    router.push({ name: 'RegisterPIN' });
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'OTP verification failed';
    toast.error(message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center flex-col gap-5">
      <div id="otp-inputs">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3 block">Enter OTP</label>
        <v-otp-input
          v-model:value="formData.otp"
          :num-inputs="6"
          input-type="number"
          separator=""
          :should-auto-focus="true"
          :is-input-num="true"
          input-classes="w-12 h-12 mx-1 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-center text-2xl font-bold"
        />
        <p v-if="errors.otp" class="mt-2 text-sm text-red-500">
          {{ errors.otp }}
        </p>
      </div>
    </div>
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