<script setup>
import { storeToRefs } from 'pinia';
import { useThemeStore } from '../../stores/themeStore';
import { useLogin } from '../../composables/useLogin';
import BaseInput from '../../components/base/BaseInput.vue';
import { ref, nextTick } from 'vue';

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

const {
  email,
  password,
  pin,
  loading,
  step,
  errors,
  handleCredentials,
  handlePin,
  backToCredentials,
} = useLogin();

const emailRef = ref(null)
const passwordRef = ref(null)
const pinRef = ref(null)

async function onCredentialsSubmit() {
  const res = await handleCredentials()
  if (res && res.success === false && res.firstError) {
    const refMap = {
      email: emailRef,
      password: passwordRef,
    }
    await nextTick()
    const target = refMap[res.firstError]
    if (target?.value?.focus) target.value.focus()
  }
}

async function onPinSubmit() {
  const res = await handlePin()
  if (res && res.success === false && res.firstError) {
    const refMap = {
      pin: pinRef,
    }
    await nextTick()
    const target = refMap[res.firstError]
    if (target?.value?.focus) target.value.focus()
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-65px)] bg-linear-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 transition-colors duration-300">
    <div class="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left info card -->
      <div class="bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col justify-between border border-slate-200 dark:border-slate-700">
        <div>
          <div class="text-sm text-cyan-600 dark:text-cyan-400 font-semibold tracking-widest uppercase">StockTrail Access</div>
          <h2 class="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Market-ready workspace for focused investors.</h2>
          <p class="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">Continue with secure sign in, then verify PIN to unlock your dashboard, watchlists, and portfolio controls.</p>
        </div>

        <div class="mt-8 grid grid-cols-2 gap-4">
          <div class="bg-linear-to-br from-cyan-50 to-cyan-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-4 border border-cyan-200 dark:border-slate-600">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">Security</div>
            <div class="font-semibold text-slate-900 dark:text-white">2-step Login</div>
          </div>
          <div class="bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-4 border border-indigo-200 dark:border-slate-600">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">Access</div>
            <div class="font-semibold text-slate-900 dark:text-white">PIN Protected</div>
          </div>
        </div>
      </div>

      <!-- Right form card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-slate-200 dark:border-slate-700">
        <div class="flex flex-col items-center mb-8">
          <div class="w-14 h-14 bg-linear-to-br from-cyan-400 to-indigo-600 dark:from-cyan-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
            </svg>
          </div>
          <h3 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{{ step === 'credentials' ? 'Welcome Back' : 'Verify PIN' }}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">{{ step === 'credentials' ? 'Sign in to continue with StockTrail.' : 'Enter the 4-digit PIN linked to your account.' }}</p>
        </div>

        <form v-if="step === 'credentials'" @submit.prevent="onCredentialsSubmit" class="space-y-5">
           <BaseInput
    ref="emailRef"
    v-model="email"
    label="Email Address"
    type="email"
    placeholder="you@example.com"
    :error="errors.email"
    required
  />

          <BaseInput
            ref="passwordRef"
            v-model="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            :error="errors.password"
            required
          />

          <button :disabled="loading" type="submit" class="w-full mt-6 py-3 px-4 rounded-xl bg-linear-to-r from-cyan-400 to-indigo-600 hover:from-cyan-500 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="!loading">Continue To PIN</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          </button>

          <div class="text-center text-slate-600 dark:text-slate-400 text-sm mt-4">
            New to StockTrail? <router-link to="/auth/register/email" class="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">Create account</router-link>
          </div>
        </form>

        <form v-else @submit.prevent="onPinSubmit" class="space-y-5">
          <BaseInput
            ref="pinRef"
            v-model="pin"
            label="4-digit PIN"
            type="password"
            placeholder="••••"
            inputmode="numeric"
            maxlength="4"
            :error="errors.pin"
            required
          />

          <button :disabled="loading" type="submit" class="w-full mt-6 py-3 px-4 rounded-xl bg-linear-to-r from-cyan-400 to-indigo-600 hover:from-cyan-500 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="!loading">Unlock Dashboard</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying PIN...
            </span>
          </button>

          <button type="button" @click="backToCredentials" class="w-full py-3 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-semibold">
            Back to login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>