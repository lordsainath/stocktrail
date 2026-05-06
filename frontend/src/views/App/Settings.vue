<script setup>
import { computed } from 'vue';
import { useThemeStore } from '../../stores/themeStore';




const themeStore = useThemeStore();
const activeTheme = computed(() => themeStore.theme);

const setTheme = (value) => {
  if (themeStore.theme !== value) {
    themeStore.toggleTheme();
  }
};
</script>

<template>
  <div class="min-h-full p-5 sm:p-7 bg-[radial-gradient(circle_at_top_left,#dbeafe_0%,#f8fafc_45%,#f1f5f9_100%)] dark:bg-[radial-gradient(circle_at_top_left,#1f2937_0%,#0f172a_45%,#020617_100%)]">
    <div class="max-w-6xl mx-auto">
      <section class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/85 dark:bg-slate-900/85 shadow-xl backdrop-blur-sm p-6 sm:p-8">
        <p class="text-xs tracking-[0.22em] font-semibold text-cyan-700 dark:text-cyan-300">SETTINGS</p>
        <h1 class="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">Theme Preferences</h1>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Choose how NiftyNest should look while you trade and manage your account.</p>

        <div class="mt-8 grid sm:grid-cols-2 gap-4">
          <button
            @click="setTheme('light')"
            class="text-left rounded-2xl border p-5 transition"
            :class="activeTheme === 'light'
              ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30'
              : 'border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 hover:border-cyan-300'"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Light Theme</h2>
              <i class="fa-regular fa-sun text-amber-500"></i>
            </div>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Crisp and bright layout for daytime use.</p>
          </button>

          <button
            @click="setTheme('dark')"
            class="text-left rounded-2xl border p-5 transition"
            :class="activeTheme === 'dark'
              ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30'
              : 'border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 hover:border-cyan-300'"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Dark Theme</h2>
              <i class="fa-regular fa-moon text-indigo-400"></i>
            </div>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Low-glare interface for focused analysis.</p>
          </button>
        </div>

        <div class="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/70 p-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">Current Theme</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">This setting is saved in your browser.</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">{{ activeTheme.toUpperCase() }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
</style>