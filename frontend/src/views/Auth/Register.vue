<script setup>
// imports
import RegisterInfoCard from '@components/auth/register/RegisterInfoCard.vue';

import RegisterHeader from '@components/auth/register/RegisterHeader.vue';

import RegisterProgressBar from '@components/auth/register/RegisterProgressBar.vue';

import RegisterStepper from '@components/auth/register/RegisterStepper.vue';

import RegisterFooter from '@components/auth/register/RegisterFooter.vue';
</script>

<template>
  <div
    class="min-h-[calc(100vh-65px)] bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
    <div class="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- LEFT INFO CARD -->
      <RegisterInfoCard />

      <!-- RIGHT CARD -->
      <div
        class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 transition-all">
        <!-- HEADER -->
        <RegisterHeader />

        <div class="mt-6 space-y-6">
          <!-- PROGRESS BAR -->
          <RegisterProgressBar />

          <!-- STEPPER -->
          <RegisterStepper />

          <!-- STEP CONTENT -->
          <div class="mt-8 min-h-[25vh] max-h-[50vh] overflow-y-auto p-2">
            <router-view />
          </div>

          <!-- FOOTER -->
          <RegisterFooter />
        </div>
      </div>
    </div>
  </div>
</template>
