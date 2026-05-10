<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'area',
  },

  height: {
    type: Number,
    default: 350,
  },

  series: {
    type: Array,
    required: true,
  },

  categories: {
    type: Array,
    default: () => [],
  },

  color: {
    type: String,
    default: '#22c55e',
  },

  sparkline: {
    type: Boolean,
    default: false,
  },

  price: {
    type: Number,
    default: 0,
  },
});

const chartOptions = computed(() => ({
  chart: {
    toolbar: {
      show: false,
    },

    zoom: {
      enabled: false,
    },

    background: 'transparent',

    animations: {
      enabled: true,

      easing: 'easeinout',

      speed: 800,
    },
  },

  stroke: {
    curve: 'smooth',

    width: 3,
  },

  colors: [props.color],

  dataLabels: {
    enabled: false,
  },

  grid: {
    show: !props.sparkline,

    borderColor: '#334155',

    strokeDashArray: 4,

    xaxis: {
      lines: {
        show: false,
      },
    },
  },

  tooltip: {
    enabled: !props.sparkline,

    theme: 'dark',

    x: {
      show: true,
    },

    y: {
      formatter: (value) => `$${value.toFixed(2)}`,
    },
  },

  xaxis: {
    categories: props.categories,

    labels: {
      show: !props.sparkline,

      style: {
        colors: '#94a3b8',
      },
    },

    axisBorder: {
      show: !props.sparkline,
    },

    axisTicks: {
      show: !props.sparkline,
    },
  },

  yaxis: {
    show: !props.sparkline,

    opposite: true,

    labels: {
      style: {
        colors: '#94a3b8',
      },

      formatter: (value) => `$${value.toFixed(2)}`,
    },
  },

  fill: {
    type: 'gradient',

    gradient: {
      shadeIntensity: 1,

      opacityFrom: 0.35,

      opacityTo: 0.03,

      stops: [0, 100],
    },
  },

  markers: {
    size: 0,

    hover: {
      sizeOffset: 5,
    },
  },

  responsive: [
    {
      breakpoint: 768,

      options: {
        chart: {
          height: 280,
        },
      },
    },
  ],
}));
</script>

<template>
  <div class="w-full">
    <apexchart :type="type" :height="height" :options="chartOptions" :series="series" />
  </div>
</template>
