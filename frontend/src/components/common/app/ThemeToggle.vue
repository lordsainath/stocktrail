<script setup>
// imports
import { storeToRefs } from 'pinia';

import { useThemeStore } from '@stores/themeStore';

// stores
const themeStore = useThemeStore();

const { theme } = storeToRefs(themeStore);
</script>

<template>
  <div
    class="dark:bg-darksecondary bg-secondary px-3 py-2 rounded-md border dark:text-white border-[#e2e8f0] dark:border-[#30363d] cursor-pointer"
    @click="themeStore.toggleTheme"
  >
    <i v-show="theme === 'dark'" class="fa-regular fa-sun text-amber-500"></i>

    <i v-show="theme === 'light'" class="fa-regular fa-moon text-primary"></i>
  </div>
</template>
