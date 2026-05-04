<script setup>
import Navbar from '../components/common/Navbar.vue';
import Sidebar from '../components/common/Sidebar.vue';


</script>

<template>
  <div
    class="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-cyan-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
    <Navbar variant="app" />
    <div class="flex h-[calc(100vh-4rem)]">
      <Sidebar />

      <div class="flex-1 flex flex-col overflow-hidden">
        <main class="flex-1 overflow-auto pb-24 lg:pb-0">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>
