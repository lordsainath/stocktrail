<script setup>
import Navbar from '../components/common/Navbar.vue';


</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-cyan-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
    <Navbar variant="app" />
    <main class="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

