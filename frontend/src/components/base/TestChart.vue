<script setup>
import { ref } from 'vue';
import BaseChart from './BaseChart.vue';

const series = [
  {
    name: 'AAPL',
    data: [120, 140, 135, 160, 170, 165],
  },
];

const categories = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM'];
</script>

<template>
  <div class="bg-white p-5 rounded-2xl">
    <BaseChart
    type="area"
    :series="series"
    :categories="categories"
  />
  </div>
</template>