<script setup>
// imports
import useUserStore from '@/stores/userStore';

// stores
const userStore = useUserStore();
</script>

<template>
  <div class="text-right hidden sm:block">
    <p class="text-sm font-medium dark:text-white">
      {{ userStore.user?.username }}
    </p>

    <p class="text-xs text-gray-400">
      {{ userStore.user?.email }}
    </p>
  </div>
</template>
