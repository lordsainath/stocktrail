<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import { toast } from 'vue-sonner';

import BaseButton from '@components/base/BaseButton.vue';
import BaseInput from '@components/base/BaseInput.vue';

import useWalletStore from '@stores/walletStore';
import useTradeStore from '@stores/tradeStore';
import { formatCurrency } from '@/composables/useWalletHelpers';

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    default: '',
  },
  currentPrice: {
    type: Number,
    default: 0,
  },
});

const walletStore = useWalletStore();
const tradeStore = useTradeStore();

const side = ref('buy');
const quantity = ref('');
const submitting = ref(false);

const currentPrice = computed(() => Number(props.currentPrice || 0));
const quantityValue = computed(() => Number(quantity.value || 0));
const estimatedValue = computed(() =>
  Number((quantityValue.value * currentPrice.value).toFixed(2))
);
const currentHolding = computed(() => tradeStore.getHolding(props.symbol));
const availableQuantity = computed(() => Number(currentHolding.value?.quantity || 0));
const cashBalance = computed(() => walletStore.walletBalance ?? tradeStore.cashBalance.valueOf());

const canSell = computed(() => availableQuantity.value > 0);
const maxQuantity = computed(() => (side.value === 'sell' ? availableQuantity.value : null));

const activeSideLabel = computed(() => (side.value === 'buy' ? 'Buy' : 'Sell'));
const buttonLabel = computed(() => `Confirm ${activeSideLabel.value}`);



const clearQuantity = () => {
  quantity.value = '';
};

const switchSide = (nextSide) => {
  if (side.value === nextSide) return;

  side.value = nextSide;
  clearQuantity();
};

const validateQuantity = () => {
  const qty = Number(quantity.value);

  if (!Number.isInteger(qty) || qty <= 0) {
    throw new Error('Enter a valid whole quantity');
  }

  if (side.value === 'sell' && qty > availableQuantity.value) {
    throw new Error(`You can only sell up to ${availableQuantity.value} shares`);
  }

  return qty;
};

const handlePlaceOrder = async () => {
  try {
    submitting.value = true;

    const qty = validateQuantity();

    if (!currentPrice.value) {
      throw new Error('Current price is unavailable');
    }

    const payload = {
      symbol: props.symbol,
      name: props.companyName || props.symbol,
      quantity: qty,
      price: currentPrice.value,
    };

    const result =
      side.value === 'buy' ? tradeStore.placeBuy(payload) : tradeStore.placeSell(payload);

    toast.success(
      `${side.value === 'buy' ? 'Bought' : 'Sold'} ${qty} ${props.symbol} shares successfully`
    );

    clearQuantity();

    return result;
  } catch (error) {
    toast.error(error?.message || 'Unable to place order');
    return null;
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  if (!walletStore.hasStoredBalance) {
    await walletStore.fetchWalletSummary().catch(() => null);
  }

  await tradeStore.init();
});

watch(
  () => props.symbol,
  async () => {
    clearQuantity();
    await tradeStore.init();
  }
);
</script>

<template>
  <aside
    class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-lg font-bold text-slate-900 dark:text-white">
          Buy or Sell {{ props.symbol }}
        </h2>

        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Current price {{ formatCurrency(currentPrice) }}
        </p>
      </div>

      <div class="rounded-xl border border-slate-200 px-3 py-2 text-right dark:border-slate-700">
        <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Cash</p>
        <p class="text-sm font-semibold text-slate-900 dark:text-white">
          {{ formatCurrency(cashBalance) }}
        </p>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
      <button
        type="button"
        class="rounded-xl cursor-pointer px-3 py-2 text-sm font-semibold transition"
        :class="
          side === 'buy'
            ? 'bg-emerald-500 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300'
        "
        @click="switchSide('buy')"
      >
        Buy
      </button>

      <button
        type="button"
        class="rounded-xl cursor-pointer px-3 py-2 text-sm font-semibold transition"
        :class="
          side === 'sell'
            ? 'bg-rose-500 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300'
        "
        @click="switchSide('sell')"
      >
        Sell
      </button>
    </div>

    <div class="mt-4 space-y-4">
      <BaseInput
        v-model="quantity"
        type="number"
        min="1"
        :max="maxQuantity || undefined"
        label="Quantity"
        placeholder="Enter quantity"
        input-class="mt-1"
        :message="
          side === 'sell'
            ? `Available: ${availableQuantity}`
            : `Wallet balance: ${formatCurrency(cashBalance)}`
        "
      />

      <div
        class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Estimated order value
          </p>
          <p class="text-xl font-bold text-slate-900 dark:text-white">
            {{ formatCurrency(estimatedValue) }}
          </p>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Owned stock</p>
            <p class="mt-1 font-semibold text-slate-900 dark:text-white">
              {{ availableQuantity }}
            </p>
          </div>

          <div>
            <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Status</p>
            <p class="mt-1 font-semibold" :class="canSell ? 'text-emerald-500' : 'text-slate-500'">
              {{ side === 'sell' && !canSell ? 'No shares to sell' : 'Ready' }}
            </p>
          </div>
        </div>
      </div>

      <BaseButton
        variant="primary"
        :disabled="submitting || !currentPrice || !quantityValue || (side === 'sell' && !canSell)"
        @click="handlePlaceOrder"
      >
        {{ submitting ? 'Processing...' : buttonLabel }}
      </BaseButton>
    </div>
  </aside>
</template>
