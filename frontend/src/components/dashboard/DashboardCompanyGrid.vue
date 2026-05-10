<script setup>
import DashboardCompanyCard from './DashboardCompanyCard.vue';

defineProps({
  companies: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <section>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCompanyCard v-for="company in companies" :key="company.symbol" :company="company" />
    </div>
  </section>
</template>
