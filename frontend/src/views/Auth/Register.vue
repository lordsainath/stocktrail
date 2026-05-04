<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from '../../stores/themeStore';
import { storeToRefs } from 'pinia';

const route = useRoute();
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);


const steps = ['RegisterEmail','RegisterBasic','RegisterAddress','RegisterUsername','RegisterKYC','RegisterOTP','RegisterPIN'];
const currentIndex = computed(() => {
  const name = route.name || '';
  const idx = steps.indexOf(name.toString());
  return idx >= 0 ? idx : 0;
});

const progressWidth = computed(() => ((currentIndex.value + 1) / steps.length) * 100 + '%');
const stepTitles = {
  'RegisterEmail': 'Enter Your Email',
  'RegisterBasic': 'Basic Details',
  'RegisterAddress': 'Address Details',
  'RegisterUsername': 'Choose username',
  'RegisterKYC': 'KYC Details',
  'RegisterOTP': 'Enter OTP',
  'RegisterPIN': 'Set a PIN'
};
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 transition-colors duration-300">
    <div class="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left info card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col justify-between border border-slate-200 dark:border-slate-700 transition-all">
        <div>
          <div class="text-sm text-cyan-600 dark:text-cyan-400 font-semibold tracking-widest uppercase">Account Setup</div>
          <h2 class="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Build your secure trading profile step by step.</h2>
          <p class="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">We guide you through verification, identity checks, and security setup so your account is ready from day one.</p>
        </div>

        <div class="mt-8 space-y-3">
          <div class="bg-linear-to-br from-cyan-50 to-cyan-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-4 border border-cyan-200 dark:border-slate-600 transition-all">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">Current Step</div>
            <div class="font-semibold text-slate-900 dark:text-white text-lg">{{ route.name ? route.name.toString().replace('Register','') : 'Email' }}</div>
          </div>
          <div class="bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-4 border border-indigo-200 dark:border-slate-600 transition-all">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">Progress</div>
            <div class="font-semibold text-slate-900 dark:text-white text-lg">{{ Math.round(((currentIndex+1)/steps.length)*100) }}% Complete</div>
          </div>
        </div>
      </div>

      <!-- Right stepper area -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 transition-all">
        <div class="flex items-center justify-between mb-6">
          <div>
            <div class="text-xs text-cyan-600 dark:text-cyan-400 font-semibold tracking-widest uppercase">Onboarding</div>
            <h3 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{{ stepTitles[route.name] || 'Setup Account' }}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">Let us verify your details to continue.</p>
          </div>
          <div class="text-xs bg-linear-to-r from-cyan-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 text-slate-900 dark:text-white px-3 py-2 rounded-full font-semibold border border-slate-200 dark:border-slate-600">
            Step {{ currentIndex + 1 }} / {{ steps.length }}
          </div>
        </div>

        <div class="mt-6 space-y-6">
       
          <div>
            <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div class="h-full rounded-full bg-linear-to-r from-cyan-400 to-indigo-600 dark:from-cyan-500 dark:to-indigo-500 transition-all duration-500" :style="{ width: progressWidth }"></div>
            </div>
          </div>

         
          <div class="flex items-center justify-between text-xs">
            <div v-for="(step, i) in steps" :key="i" class="flex flex-col items-center gap-1">
              <div :class="['w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all', 
                currentIndex >= i 
                  ? 'bg-linear-to-r from-cyan-400 to-indigo-600 text-white' 
                  : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400']">
                {{ i + 1 }}
              </div>
              <span :class="['text-center whitespace-nowrap', 
                currentIndex >= i 
                  ? 'text-slate-900 dark:text-white font-semibold' 
                  : 'text-slate-500 dark:text-slate-400']">
                {{ step.replace('Register','') }}
              </span>
            </div>
          </div>

          <!-- Step content -->
          <div class="mt-8 h-[25vh] overflow-x-scroll p-5">
            <router-view />
          </div>

          <div class="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?
            <router-link to="/auth/login" class="ml-1 font-semibold text-cyan-600 hover:underline dark:text-cyan-400">Login</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
