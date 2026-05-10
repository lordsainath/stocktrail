<!--  ===================================
      Script Started
      =================================== -->
<script setup>
import AppNavbar from '@/components/common/app/AppNavbar.vue';
import Appsidebar from '@/components/common/app/AppSidebar.vue';

// imports
</script>
<!--  ===================================
      Script Ended
      =================================== -->

<!--  ===================================
      Template Started
      =================================== -->
<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <AppNavbar />
    <div class="flex h-[calc(100vh-4rem)]">
      <Appsidebar />

      <div class="flex-1 flex flex-col overflow-hidden">
        <main class="flex-1 overflow-auto pb-24 lg:pb-0">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<!--  ===================================
      Template Ended
      =================================== -->
