<script setup>
// imports
import NavbarSearch from '@/components/NavbarSearch.vue';
import ProfileDropdown from './ProfileDropdown.vue';
import ThemeToggle from './ThemeToggle.vue';
import UserInfo from './UserInfo.vue';
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
  >
    <div class="grid grid-cols-3 items-center px-5 py-3">
      
      <!-- LEFT -->
      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold"
        >
          S
        </div>

        <h1 class="font-semibold tracking-wide">
          StockTrail
        </h1>
      </div>

      <!-- CENTER -->
      <div class="flex justify-center">
        <NavbarSearch />
      </div>

      <!-- RIGHT -->
      <div class="flex items-center justify-end gap-3">
        <ThemeToggle />
        <UserInfo />
        <ProfileDropdown />
      </div>

    </div>
  </header>
</template>