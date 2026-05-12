<script setup>
import { ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';

import useRegisterStore from '@stores/registerStore';

import BaseOtpInput from '@components/base/BaseOtpInput.vue';
import BaseButton from '@components/base/BaseButton.vue';

import { registerOtpSchema } from '@composables/useValidationSchemas';

const router = useRouter();

const registerStore = useRegisterStore();

/*
  DON'T use storeToRefs here
  because formData is already a reactive object
*/
const { formData, verifyOtpCode } = registerStore;

const loading = ref(false);

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: registerOtpSchema,
  initialValues: {
    otp: formData.otp || '',
  },
});

const [otp] = defineField('otp');

watch(otp, (value) => {
  formData.otp = value || '';
});

const handleBack = () => router.back();

const handleContinue = handleSubmit(
  async (values) => {
    loading.value = true;

    try {
      formData.otp = values.otp || '';
      await verifyOtpCode(values.otp);

      toast.success('Email verified. Set your PIN to finish registration.');

      router.push({ name: 'RegisterPIN' });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'OTP verification failed';

      toast.error(message);
    } finally {
      loading.value = false;
    }
  },

  async () => {
    await nextTick();
    document.querySelector('#otp-inputs input')?.focus();
  }
);
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center flex-col gap-5">
      <div id="otp-inputs">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3 block">
          Enter OTP
        </label>

        <BaseOtpInput v-model="otp" :num-inputs="6" input-type="number" :should-auto-focus="true" :is-input-num="true"
          @keyup.enter="handleContinue" />

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