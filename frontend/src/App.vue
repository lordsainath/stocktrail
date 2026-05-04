<script setup>
import { storeToRefs } from 'pinia';
import { useThemeStore } from './stores/themeStore';



const { theme } = storeToRefs(useThemeStore());


</script>

<template>
    <Toaster :theme="theme" richColors closeButton closeButtonPosition="top-right" position="top-right" duration="1000"
        :offset="70" :mobile-offset="16" :toast-options="{
            classes: {
                toast: 'w-auto min-w-72 max-w-[420px] rounded-xl border border-slate-200 bg-white text-slate-900 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
                title: 'text-sm font-semibold',
                description: 'text-xs text-slate-600 dark:text-slate-300'
            }
        }" />
    <router-view></router-view>

</template>

<style scoped></style>