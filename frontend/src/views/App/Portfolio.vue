<script setup>
import { computed, onMounted } from 'vue';

import { useTradeStore } from '@stores/tradeStore';
import useWalletStore from '@stores/walletStore';

import PortfolioSummary from '@components/portfolio/PortfolioSummary.vue';
import PortfolioHoldings from '@components/portfolio/PortfolioHoldings.vue';
import PortfolioOrders from '@components/portfolio/PortfolioOrders.vue';

const tradeStore = useTradeStore();
const walletStore = useWalletStore();

const holdings = computed(() => tradeStore.holdings);
const orders = computed(() => tradeStore.orders);

onMounted(async () => {
  await walletStore.fetchWalletSummary().catch(() => null);
  await tradeStore.init();
  await tradeStore.refreshHoldingPrices();
});
</script>


<!-- Script Ended -->
<!-- Template Started -->

<template>
  <div class="min-h-full bg-slate-50 p-5 sm:p-7 dark:bg-slate-950">
    <div class="mx-auto max-w-6xl space-y-5">
      <PortfolioSummary
        :cash-balance="walletStore.walletBalance || tradeStore.cashBalance"
        :portfolio-value="tradeStore.portfolioValue"
        :total-equity="tradeStore.totalEquity"
        :total-investment="tradeStore.totalInvestment"
        :total-unrealized-pnl="tradeStore.totalUnrealizedPnL"
        :holding-count="holdings.length"
      />

      <section class="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
        <PortfolioHoldings :holdings="tradeStore.holdingsWithPnL" />
        <PortfolioOrders :orders="orders" />
      </section>
    </div>
  </div>
</template>
<!-- Template Ended -->
<!-- Style Started  -->
<style scoped>

</style>
<!-- Style Ended  -->
