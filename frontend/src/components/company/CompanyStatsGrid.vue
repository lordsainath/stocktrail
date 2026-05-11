<script setup>
import CompanyStatCard from './CompanyStatCard.vue';

defineProps({
  quote: {
    type: Object,
    default: () => ({}),
  },

  profile: {
    type: Object,
    default: () => ({}),
  },

  formatMarketCap: {
    type: Function,
    default: (value) => value,
  },
});
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
    <CompanyStatCard label="Day Range" :value="`$${quote?.l} - $${quote?.h}`" />

    <CompanyStatCard label="Market Cap" :value="formatMarketCap(profile?.marketCapitalization)" />

    <CompanyStatCard label="IPO Date" :value="profile?.ipo" />

    <CompanyStatCard label="Country" :value="profile?.country" />
  </div>
</template>
