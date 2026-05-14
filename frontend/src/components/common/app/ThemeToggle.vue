<script setup>
// imports
import { storeToRefs } from 'pinia';
import { Sun, Moon } from '@lucide/vue';

import { useThemeStore } from '@stores/themeStore';

// stores
const themeStore = useThemeStore();

const { theme } = storeToRefs(themeStore);
</script>

<template>
  <div
    class="dark:bg-darksecondary bg-secondary px-3 py-2 rounded-md border dark:text-white border-[#e2e8f0] dark:border-[#30363d] hover:border-primary cursor-pointer transition-colors"
    @click="themeStore.toggleTheme"
  >
    <Sun v-show="theme === 'dark'" class="w-5 h-5 text-amber-500" />

    <Moon v-show="theme === 'light'" class="w-5 h-5 text-primary" />
  </div>
</template>
