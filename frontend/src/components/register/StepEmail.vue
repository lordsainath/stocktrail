<script setup>
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useRegister } from '../../composables/useRegister';

const router = useRouter();
const { formData, checkEmail } = useRegister();

const checkValid = async () => {
    if (!formData.email) return toast.error('Email is required');
    try {
    const response = await checkEmail(formData.email);
    const status = response?.data?.data?.status;
        if (status === 'NEW_USER') return router.push({ name: 'RegisterBasic' });
        if (status === 'NOT_VERIFIED') return router.push({ name: 'RegisterOTP' });
        if (status === 'NO_PIN') return router.push({ name: 'RegisterPIN' });
        if (status === 'READY_TO_LOGIN') {
            toast.info('Email is already registered. Please login.');
            router.push({ name: 'Login' });
        }
    } catch (e) {
        console.error(e);
      toast.error(e?.message || 'Failed to check email');
    }
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Email Address</label>
      <input @keydown.enter="checkValid" v-model="formData.email" type="email" placeholder="you@example.com" class="w-full mt-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" />
    </div>
    <div class="mt-6 flex justify-end gap-3">
      <button @click="checkValid" class="px-6 py-3 rounded-xl bg-linear-to-r from-cyan-400 to-indigo-600 hover:from-cyan-500 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">Continue</button>
    </div>
  </div>
</template>

<style scoped></style>