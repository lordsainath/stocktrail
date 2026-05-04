<script setup>
import { useRouter } from 'vue-router';
import { useRegister } from '../../composables/useRegister';
const router = useRouter();
const { formData } = useRegister();

const handleBack = () => router.back();
const handleContinue = () => {
  if (!formData.name) return;
  if (!formData.password) return;
  if (formData.password !== formData.confirmPassword) return;
  router.push({ name: 'RegisterAddress' });
}
</script>

<template>
  <div class="space-y-4">
    <input v-model="formData.name" placeholder="Full name" type="text" class="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" />
    <input v-model="formData.password" type="password" placeholder="Password" class="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" />
    <input v-model="formData.confirmPassword" type="password" placeholder="Confirm password" class="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" />

    <div class="mt-6 flex gap-4">
      <button @click="handleBack" class="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium">Back</button>
      <button @click="handleContinue" class="flex-1 py-3 rounded-xl bg-linear-to-r from-cyan-400 to-indigo-600 hover:from-cyan-500 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">Continue</button>
    </div>
  </div>
</template>

<style scoped></style>