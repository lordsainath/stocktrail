<!-- <script setup>
import { onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import apiClient from '../../services/axios';
import useUserStore from '../../stores/userStore';

const userStore = useUserStore();
const loading = ref(true);
const profile = ref(userStore.user);

const loadProfile = async () => {
  try {
    if (profile.value) {
      loading.value = false;
      return;
    }

    const response = await apiClient.get('/auth/me');
    profile.value = response.data.data;
    userStore.setUser(profile.value);
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Unable to load dashboard');
  } finally {
    loading.value = false;
  }
};

onMounted(loadProfile);

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(value || 0);
</script>

<template>
  <div class="space-y-6">
    <section class="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-cyan-900 px-6 py-8 text-white shadow-2xl dark:border-slate-700 sm:px-8 lg:px-10">
      <div class="max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Portfolio overview</p>
        <h1 class="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {{ profile?.name || profile?.username || 'Investor' }}.</h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">Your account is active, your wallet is ready, and your KYC status is visible below.</p>
      </div>
      <div class="mt-8 grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-300">Wallet balance</p>
          <p class="mt-3 text-2xl font-semibold">{{ formatCurrency(profile?.wallet?.balance) }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-300">KYC status</p>
          <p class="mt-3 text-2xl font-semibold">{{ profile?.kycStatus || 'NOT_SUBMITTED' }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-300">PIN</p>
          <p class="mt-3 text-2xl font-semibold">{{ profile?.isPinSet ? 'Enabled' : 'Pending' }}</p>
        </div>
      </div>
    </section>

    <section v-if="loading" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      Loading dashboard...
    </section>

    <section v-else class="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Quick actions</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">What you can do next from this account.</p>
          </div>
          <span class="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">Live</span>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <p class="text-sm font-medium text-slate-900 dark:text-slate-100">Verify wallet</p>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Link or confirm bank details for transfers.</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <p class="text-sm font-medium text-slate-900 dark:text-slate-100">Update PIN</p>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Keep your account access secure.</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <p class="text-sm font-medium text-slate-900 dark:text-slate-100">Review profile</p>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Check your registration and KYC details.</p>
          </div>
        </div>
      </div>

      <aside class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Account snapshot</h2>
        <dl class="mt-5 space-y-4 text-sm">
          <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 dark:border-slate-800">
            <dt class="text-slate-500 dark:text-slate-400">Email</dt>
            <dd class="font-medium text-slate-900 dark:text-slate-100">{{ profile?.email }}</dd>
          </div>
          <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 dark:border-slate-800">
            <dt class="text-slate-500 dark:text-slate-400">Username</dt>
            <dd class="font-medium text-slate-900 dark:text-slate-100">{{ profile?.username }}</dd>
          </div>
          <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 dark:border-slate-800">
            <dt class="text-slate-500 dark:text-slate-400">PAN</dt>
            <dd class="font-medium text-slate-900 dark:text-slate-100">{{ profile?.panNumber || 'Not added' }}</dd>
          </div>
          <div class="flex items-center justify-between gap-4">
            <dt class="text-slate-500 dark:text-slate-400">Aadhaar</dt>
            <dd class="font-medium text-slate-900 dark:text-slate-100">{{ profile?.aadhaarNumber ? 'Linked' : 'Not added' }}</dd>
          </div>
        </dl>
      </aside>
    </section>
  </div>
</template> -->



<script setup>

</script>

<template>
  <h1>HEllo from dashboard</h1>
</template>

<style scoped>

</style>