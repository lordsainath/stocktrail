<script setup>
// imports
import { useRoute } from 'vue-router';

import ThemeToggle from '../app/ThemeToggle.vue';

// router
const route = useRoute();
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
  >
    <div class="flex items-center justify-between px-5 py-3">
      <!-- LOGO -->
      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold"
        >
          S
        </div>

        <h1 class="font-semibold tracking-wide">StockTrail</h1>
      </div>

      <!-- RIGHT -->
      <div class="flex items-center gap-3">
        <ThemeToggle />

        <router-link
          v-if="route.path.includes('/login')"
          to="/auth/register/email"
          class="bg-primary text-white px-5 py-2 rounded-md"
        >
          Register
        </router-link>

        <router-link
          v-if="route.path.includes('/register')"
          to="/auth/login"
          class="bg-primary text-white px-5 py-2 rounded-md"
        >
          Login
        </router-link>
      </div>
    </div>
  </header>
</template>
