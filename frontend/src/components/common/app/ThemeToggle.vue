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
    @click="themeStore.toggleTheme"
    class="dark:bg-darksecondary bg-secondary px-3 py-2 rounded-md border dark:text-white border-[#e2e8f0] dark:border-[#30363d] cursor-pointer"
  >
    <i class="fa-regular fa-sun text-amber-500" v-show="theme === 'dark'"></i>

    <i class="fa-regular fa-moon text-primary" v-show="theme === 'light'"></i>
  </div>
</template>
