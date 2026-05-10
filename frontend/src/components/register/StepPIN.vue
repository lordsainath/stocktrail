<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { useRegister } from '@composables/useRegister';
import VOtpInput from 'vue3-otp-input';
import BaseButton from '@components/base/BaseButton.vue';
import { registerPinSchema } from '@composables/useValidationSchemas';

const router = useRouter();
const { formData, setPinCode } = useRegister();
const loading = ref(false);

const { errors, handleSubmit, defineField, setFieldValue } = useForm({
  validationSchema: registerPinSchema,
  initialValues: {
    pin: formData.pin || '',
    confirmPin: formData.confirmPin || '',
  },
});

const [pin] = defineField('pin');
const [confirmPin] = defineField('confirmPin');

watch(pin, (value) => {
  formData.pin = value || '';
});

watch(confirmPin, (value) => {
  formData.confirmPin = value || '';
});

const handleBack = () => router.back();

const handleFinish = handleSubmit(
  async () => {
    loading.value = true;
    try {
      await setPinCode();

      toast.success('PIN set successfully. Please login to continue.');
      router.push('/auth/login');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to set PIN';
      toast.error(message);
    } finally {
      loading.value = false;
    }
  },
  async () => {
    const firstKey = Object.keys(errors.value || {})[0];
    await nextTick();
    if (firstKey === 'pin') {
      document.querySelector('#pin-inputs input')?.focus();
    } else if (firstKey === 'confirmPin') {
      document.querySelector('#confirm-pin-inputs input')?.focus();
    }
  }
);

onUnmounted(() => {
  setFieldValue('pin', '');
  setFieldValue('confirmPin', '');
  formData.pin = '';
  formData.confirmPin = '';
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center flex-col gap-4">
      <div id="pin-inputs" class="w-full">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3 block"
          >Set a 4-digit PIN</label
        >
        <v-otp-input
          v-model:value="pin"
          :num-inputs="4"
          input-type="number"
          separator=""
          :should-auto-focus="true"
          :is-input-num="true"
          input-classes="w-14 h-14 mx-1 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-center text-2xl font-bold"
        />
        <p v-if="errors.pin" class="mt-2 text-sm text-red-500">
          {{ errors.pin }}
        </p>
      </div>

      <div id="confirm-pin-inputs" class="w-full">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3 block"
          >Confirm PIN</label
        >
        <v-otp-input
          v-model:value="confirmPin"
          :num-inputs="4"
          input-type="number"
          separator=""
          :should-auto-focus="false"
          :is-input-num="true"
          input-classes="w-14 h-14 mx-1 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-center text-2xl font-bold"
        />
        <p v-if="errors.confirmPin" class="mt-2 text-sm text-red-500">
          {{ errors.confirmPin }}
        </p>
      </div>
    </div>
    <div class="mt-6 flex gap-4">
      <BaseButton variant="secondary" @click="handleBack"> Back </BaseButton>
      <BaseButton variant="primary" :disabled="loading" @click="handleFinish"> Finish </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
