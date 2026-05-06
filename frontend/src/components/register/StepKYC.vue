<script setup>
import { watch } from 'vue';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
import { useRegister } from '../../composables/useRegister';
import useRegisterStore from '../../stores/registerStore';

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

const handleBack = () => router.back();

watch(() => formData.panNumber, schedulePanVerification);
watch(() => formData.aadhaarNumber, scheduleAadhaarVerification);



// Final Registration Submission
const handleContinue = async () => {
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
    <div>
      <label class="text-sm font-medium text-slate-700 dark:text-slate-200">PAN Number</label>
      <input v-model.trim="formData.panNumber" type="text" maxlength="10" placeholder="ABCDE1234F"
        class="w-full mt-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all uppercase" />
      <p v-if="panMessage" class="mt-2 text-sm"
        :class="panStatus === 'valid' ? 'text-emerald-600' : panStatus === 'checking' ? 'text-sky-600' : 'text-slate-500'">
        {{ panMessage }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Aadhaar Number</label>
      <input v-model.trim="formData.aadhaarNumber" type="text" maxlength="12" placeholder="123412341234"
        class="w-full mt-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" />
      <p v-if="aadhaarMessage" class="mt-2 text-sm"
        :class="aadhaarStatus === 'valid' ? 'text-emerald-600' : aadhaarStatus === 'checking' ? 'text-sky-600' : 'text-slate-500'">
        {{ aadhaarMessage }}</p>
    </div>

    <div class="mt-6 flex gap-4">
      <button @click="handleBack"
        class="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium">Back</button>
      <button :disabled="loading" @click="handleContinue"
        class="flex-1 py-3 rounded-xl bg-linear-to-r from-cyan-400 to-indigo-600 hover:from-cyan-500 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50">Continue</button>
    </div>
  </div>
</template>

<style scoped></style>