<script setup>
import { ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
import apiClient from '../../services/axios';
import { useRegister } from '../../composables/useRegister';

const router = useRouter();
const { formData } = useRegister();
const loading = ref(false);
const panStatus = ref('idle'); // idle | checking | valid | invalid
const panMessage = ref('');
const aadhaarStatus = ref('idle');
const aadhaarMessage = ref('');
let panTimer = null;
let aadhaarTimer = null;

const handleBack = () => router.back();

const debouncedCheckPan = () => {
  clearTimeout(panTimer);
  const value = String(formData.panNumber || '').toUpperCase().trim();
  if (value.length < 10) {
    panStatus.value = 'idle';
    panMessage.value = '';
    return;
  }
  if (!formData.name) {
    panStatus.value = 'invalid';
    panMessage.value = 'Enter full name in previous step to verify PAN';
    return;
  }
  panStatus.value = 'checking';
  panMessage.value = 'Verifying...';
  panTimer = setTimeout(async () => {
    try {
      const res = await apiClient.post('/auth/verify-pan', { panNumber: value, holderName: formData.name });
      panStatus.value = 'valid';
      panMessage.value = res.data?.message || 'PAN verified';
    } catch (err) {
      panStatus.value = 'invalid';
      panMessage.value = err?.response?.data?.message || err?.message || 'PAN verification failed';
    }
  }, 500);
};

const debouncedCheckAadhaar = () => {
  clearTimeout(aadhaarTimer);
  const value = String(formData.aadhaarNumber || '').replace(/\s|-/g, '');
  if (value.length < 12) {
    aadhaarStatus.value = 'idle';
    aadhaarMessage.value = '';
    return;
  }
  if (!formData.name) {
    aadhaarStatus.value = 'invalid';
    aadhaarMessage.value = 'Enter full name in previous step to verify Aadhaar';
    return;
  }
  aadhaarStatus.value = 'checking';
  aadhaarMessage.value = 'Verifying...';
  aadhaarTimer = setTimeout(async () => {
    try {
      const res = await apiClient.post('/auth/verify-aadhaar', { aadhaarNumber: value, holderName: formData.name });
      aadhaarStatus.value = 'valid';
      aadhaarMessage.value = res.data?.message || 'Aadhaar verified';
    } catch (err) {
      aadhaarStatus.value = 'invalid';
      aadhaarMessage.value = err?.response?.data?.message || err?.message || 'Aadhaar verification failed';
    }
  }, 500);
};

// Watchers to trigger debounced checks
watch(() => formData.panNumber, debouncedCheckPan);
watch(() => formData.aadhaarNumber, debouncedCheckAadhaar);

const handleContinue = async () => {
  if (!formData.panNumber || !formData.aadhaarNumber) {
    toast.error('PAN number and Aadhaar number are required');
    return;
  }

  // Client-side format validation
  const pan = String(formData.panNumber || '').toUpperCase().trim();
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
    toast.error('PAN format is invalid (expected: ABCDE1234F)');
    return;
  }

  const aadhaar = String(formData.aadhaarNumber || '').replace(/\s|-/g, '');
  if (!/^\d{12}$/.test(aadhaar)) {
    toast.error('Aadhaar must be a 12-digit number');
    return;
  }

  if (panStatus.value === 'invalid' || aadhaarStatus.value === 'invalid') {
    toast.error('Please fix KYC details before continuing');
    return;
  }
  if (panStatus.value === 'checking' || aadhaarStatus.value === 'checking') {
    toast.error('Verification in progress. Please wait');
    return;
  }

  loading.value = true;
  try {
    await apiClient.post('/auth/register', {
      email: formData.email,
      username: formData.username,
      name: formData.name,
      password: formData.password,
      panNumber: pan,
      aadhaarNumber: aadhaar,
      address: formData.address,
    });

    toast.success('Registration submitted. Check your email for the OTP.');
    router.push({ name: 'RegisterOTP' });
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Registration failed';
    toast.error(message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium text-slate-700 dark:text-slate-200">PAN Number</label>
      <input v-model.trim="formData.panNumber" type="text" maxlength="10" placeholder="ABCDE1234F" class="w-full mt-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all uppercase" />
      <p v-if="panMessage" class="mt-2 text-sm" :class="panStatus === 'valid' ? 'text-emerald-600' : panStatus === 'checking' ? 'text-sky-600' : 'text-slate-500'">{{ panMessage }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Aadhaar Number</label>
      <input v-model.trim="formData.aadhaarNumber" type="text" maxlength="12" placeholder="123412341234" class="w-full mt-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" />
      <p v-if="aadhaarMessage" class="mt-2 text-sm" :class="aadhaarStatus === 'valid' ? 'text-emerald-600' : aadhaarStatus === 'checking' ? 'text-sky-600' : 'text-slate-500'">{{ aadhaarMessage }}</p>
    </div>
    <div class="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
      This step submits your account details to the backend and sends the OTP to your email.
    </div>
    <div class="mt-6 flex gap-4">
      <button @click="handleBack" class="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium">Back</button>
      <button :disabled="loading" @click="handleContinue" class="flex-1 py-3 rounded-xl bg-linear-to-r from-cyan-400 to-indigo-600 hover:from-cyan-500 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50">Continue</button>
   </div>
   </div>
</template>

<style scoped></style>