<script setup>
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
import { useRegister } from '../../composables/useRegister';

const router = useRouter();
const { formData, verifyOtpCode } = useRegister();
const loading = ref(false);

const handleBack = () => router.back();

const handleContinue = async () => {
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
    <div>
      <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Enter OTP</label>
      <input v-model="formData.otp" maxlength="6" class="w-full mt-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" placeholder="6-digit code" />
    </div>
    <div class="mt-6 flex gap-4">
      <button @click="handleBack" class="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium">Back</button>
      <button :disabled="loading" @click="handleContinue" class="flex-1 py-3 rounded-xl bg-linear-to-r from-cyan-400 to-indigo-600 hover:from-cyan-500 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50">Continue</button>
   </div>
   </div>
</template>

<style scoped></style>