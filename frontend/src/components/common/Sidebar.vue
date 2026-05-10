<script setup>
import { useRouter, useRoute } from 'vue-router';
import useUiStore from '../../stores/uiStore';

const uiStore = useUiStore();

const router = useRouter();
const route = useRoute();

const appNavItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'fa-solid fa-gauge',
  },
  {
    name: 'Portfolio',
    path: '/portfolio',
    icon: 'fa-solid fa-briefcase',
  },
  {
    name: 'Watchlist',
    path: '/watchlist',
    icon: 'fa-solid fa-star',
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: 'fa-solid fa-user',
  },
  {
    name: 'Bank Details',
    path: '/bank-details',
    icon: 'fa-solid fa-building-columns',
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: 'fa-solid fa-gear',
  },
];

const navigate = (path) => {
  // uiStore.closeMobileMenu();
  router.push(path);
};
</script>

<template>
  <aside
    :class="[
      'hidden lg:flex h-[calc(100vh-4rem)] border-r transition-all duration-300 flex-col px-3 py-3 bg-white/75 dark:bg-slate-900/75 backdrop-blur-sm',
      uiStore.isSidebarOpen ? 'w-64' : 'w-20 items-center',
      'dark:text-white dark:border-slate-800 border-[#e2e8f0]',
    ]"
  >
    <!-- TOP -->
    <div class="flex items-center justify-between p-2 mb-2">
      <span
        v-if="uiStore.isSidebarOpen"
        class="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
        >Menu</span
      >

      <button
        class="cursor-pointer outline-none w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        @click="uiStore.toggleSidebar"
      >
        <i class="fa-solid fa-bars-staggered"></i>
      </button>
    </div>

    <!-- Navbar -->
    <nav class="flex-1 mt-2 space-y-2">
      <div
        v-for="item in appNavItems"
        :key="item.name"
        class="group flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl transition-all duration-200 border"
        :class="[
          route.path === item.path
            ? 'bg-linear-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-200/70 dark:border-cyan-900/40 shadow-sm'
            : 'text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/70',
          uiStore.isSidebarOpen ? '' : 'justify-center',
        ]"
        @click="navigate(item.path)"
      >
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
        >
          <i :class="item.icon"></i>
        </div>
        <span v-if="uiStore.isSidebarOpen" class="text-sm font-semibold">
          {{ item.name }}
        </span>
      </div>
    </nav>
  </aside>
</template>

<style scoped></style>
