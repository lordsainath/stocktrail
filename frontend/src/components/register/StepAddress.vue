<script setup>
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
import { useRegister } from '../../composables/useRegister';
const router = useRouter();
const { formData } = useRegister();

const handleBack = () => router.back();
const handleContinue = () => {
  const { line1, city, state, country } = formData.address;

  if (!line1 || !city || !state || !country) {
    toast.error('Address line, city, state, and country are required');
    return;
  }

  router.push({ name: 'RegisterUsername' });
};
</script>

<template>
  <div class="space-y-4">
    <input v-model="formData.address.country" placeholder="Country" class="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" />
    <input v-model="formData.address.state" placeholder="State" class="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" />
    <input v-model="formData.address.city" placeholder="City" class="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" />
    <input v-model="formData.address.line1" placeholder="Address line" class="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" />
    <input v-model="formData.address.pincode" placeholder="Pincode (optional)" maxlength="6" class="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all" />

    <div class="mt-6 flex gap-4">
      <button @click="handleBack" class="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium">Back</button>
      <button @click="handleContinue" class="flex-1 py-3 rounded-xl bg-linear-to-r from-cyan-400 to-indigo-600 hover:from-cyan-500 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">Continue</button>
    </div>
  </div>
</template>

<style scoped></style>