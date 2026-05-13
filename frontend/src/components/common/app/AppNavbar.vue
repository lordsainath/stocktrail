<script setup>
// imports
import { RouterLink } from 'vue-router';

import NavbarSearch from '@/components/NavbarSearch.vue';
import useUiStore from '@/stores/uiStore';
import ProfileDropdown from './ProfileDropdown.vue';
import ThemeToggle from './ThemeToggle.vue';
import UserInfo from './UserInfo.vue';

const uiStore = useUiStore();
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
  >
    <div class="flex items-center justify-between gap-3 px-4 sm:px-5 py-3">
      <!-- LEFT -->
      <RouterLink to="/" class="flex items-center gap-2 w-fit transition-opacity hover:opacity-80">
        <div
          class="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold"
        >
          S
        </div>

        <h1 class="font-semibold tracking-wide text-slate-900 dark:text-white">StockTrail</h1>
      </RouterLink>

      <!-- CENTER -->
      <div class="hidden lg:flex flex-1 justify-center">
        <NavbarSearch />
      </div>

      <!-- RIGHT -->
      <div class="flex items-center justify-end gap-3">
        <div class="hidden lg:block">
          <ThemeToggle />
        </div>
        <UserInfo />
        <ProfileDropdown />

        <button
          type="button"
          class="inline-flex lg:hidden w-9 h-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle menu"
          @click="uiStore.toggleSidebar"
        >
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>
  </header>
</template>
