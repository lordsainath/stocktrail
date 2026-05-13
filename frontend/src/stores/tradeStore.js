// Imports

import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';

import useMarketStore from '@stores/marketStore';
import useUserStore from '@stores/userStore';
import useWalletStore from '@stores/walletStore';

const STORAGE_PREFIX = 'stocktrail-trading';

const roundMoney = (value) => Number(Number(value || 0).toFixed(2));

const normalizeKey = (value) =>
  String(value || 'guest')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

const createDefaultState = () => ({
  cashBalance: 0,
  holdings: [],
  orders: [],
  updatedAt: null,
});

export const useTradeStore = defineStore('trade', () => {
  const marketStore = useMarketStore();
  const userStore = useUserStore();
  const walletStore = useWalletStore();

  const loading = ref(false);
  const initialized = ref(false);
  const seededFromWallet = ref(false);

  const cashBalance = ref(0);
  const holdings = ref([]);
  const orders = ref([]);
  const livePrices = ref({});

  const storageKey = computed(() => {
    const user = userStore.user || {};
    const userKey = user.id || user._id || user.email || user.phone || 'guest';

    return `${STORAGE_PREFIX}:${normalizeKey(userKey)}`;
  });

  const availableCash = computed(() => roundMoney(cashBalance.value));

  const totalInvestment = computed(() =>
    roundMoney(
      holdings.value.reduce(
        (sum, item) => sum + Number(item.avgPrice || 0) * Number(item.quantity || 0),
        0
      )
    )
  );

  const portfolioValue = computed(() =>
    roundMoney(
      holdings.value.reduce(
        (sum, item) =>
          sum + Number(item.lastPrice || item.avgPrice || 0) * Number(item.quantity || 0),
        0
      )
    )
  );

  const totalEquity = computed(() => roundMoney(availableCash.value + portfolioValue.value));

  const holdingsWithPnL = computed(() =>
    holdings.value.map((item) => {
      const currentPrice = roundMoney(
        livePrices.value[item.symbol] ?? item.lastPrice ?? item.avgPrice ?? 0
      );
      const quantity = Number(item.quantity || 0);
      const costBasis = roundMoney(Number(item.avgPrice || 0) * quantity);
      const currentValue = roundMoney(currentPrice * quantity);
      const unrealizedPnL = roundMoney(currentValue - costBasis);
      const unrealizedPnLPercent =
        costBasis > 0 ? roundMoney((unrealizedPnL / costBasis) * 100) : 0;

      return {
        ...item,
        currentPrice,
        marketValue: currentValue,
        unrealizedPnL,
        unrealizedPnLPercent,
        isProfit: unrealizedPnL >= 0,
      };
    })
  );

  const totalUnrealizedPnL = computed(() =>
    roundMoney(
      holdingsWithPnL.value.reduce((sum, item) => sum + Number(item.unrealizedPnL || 0), 0)
    )
  );

  const totalProfitLoss = computed(() => totalUnrealizedPnL.value);

  const getHolding = (symbol) => holdings.value.find((item) => item.symbol === symbol) || null;

  const getAvailableQuantity = (symbol) => Number(getHolding(symbol)?.quantity || 0);

  const persistState = () => {
    localStorage.setItem(
      storageKey.value,
      JSON.stringify({
        cashBalance: availableCash.value,
        holdings: holdings.value,
        orders: orders.value,
        updatedAt: new Date().toISOString(),
      })
    );
  };

  const hydrateState = () => {
    const raw = localStorage.getItem(storageKey.value);

    if (!raw) {
      cashBalance.value = 0;
      holdings.value = [];
      orders.value = [];
      initialized.value = false;
      seededFromWallet.value = false;
      return;
    }

    try {
      const parsed = JSON.parse(raw) || createDefaultState();

      cashBalance.value = roundMoney(parsed.cashBalance || 0);
      holdings.value = Array.isArray(parsed.holdings) ? parsed.holdings : [];
      orders.value = Array.isArray(parsed.orders) ? parsed.orders : [];
      initialized.value = true;
      seededFromWallet.value = true;
    } catch (error) {
      cashBalance.value = 0;
      holdings.value = [];
      orders.value = [];
      initialized.value = false;
      seededFromWallet.value = false;
    }
  };

  const seedFromWalletIfNeeded = async () => {
    if (seededFromWallet.value) {
      return;
    }

    if (!walletStore.hasStoredBalance && walletStore.walletBalance <= 0) {
      return;
    }

    if (!walletStore.walletBalance || walletStore.walletBalance <= 0) {
      await walletStore.fetchWalletSummary().catch(() => null);
    }

    if (!cashBalance.value) {
      cashBalance.value = roundMoney(walletStore.walletBalance);
      seededFromWallet.value = true;
      initialized.value = true;
      persistState();
    }
  };

  const init = async () => {
    hydrateState();
    await seedFromWalletIfNeeded();
  };

  const resetState = () => {
    cashBalance.value = 0;
    holdings.value = [];
    orders.value = [];
    livePrices.value = {};
    initialized.value = false;
    seededFromWallet.value = false;
    localStorage.removeItem(storageKey.value);
  };

  const refreshHoldingPrices = async () => {
    if (!holdings.value.length) {
      livePrices.value = {};
      return {};
    }

    try {
      const quoteEntries = await Promise.all(
        holdings.value.map(async (item) => {
          const quoteData = await marketStore.getQuoteData(item.symbol);

          return [item.symbol, Number(quoteData?.c || item.lastPrice || item.avgPrice || 0)];
        })
      );

      livePrices.value = Object.fromEntries(quoteEntries);

      return livePrices.value;
    } catch (error) {
      toast.error('Failed to refresh holding prices');

      livePrices.value = {};

      return {};
    }
  };

  const appendOrder = ({ side, symbol, name, quantity, price, total }) => {
    orders.value = [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        side,
        symbol,
        name,
        quantity,
        price: roundMoney(price),
        total: roundMoney(total),
        timestamp: new Date().toISOString(),
      },
      ...orders.value,
    ].slice(0, 100);
  };

  const placeBuy = ({ symbol, name, quantity, price }) => {
    const qty = Number(quantity);
    const tradePrice = roundMoney(price);

    if (!symbol) {
      throw new Error('Stock symbol is required');
    }

    if (!Number.isInteger(qty) || qty <= 0) {
      throw new Error('Please enter a valid quantity');
    }

    if (!Number.isFinite(tradePrice) || tradePrice <= 0) {
      throw new Error('Current price is not available');
    }

    const total = roundMoney(qty * tradePrice);

    if (availableCash.value < total) {
      throw new Error(`Insufficient wallet balance. You need $${total.toFixed(2)}.`);
    }

    const currentHolding = getHolding(symbol);

    if (currentHolding) {
      const previousQty = Number(currentHolding.quantity || 0);
      const previousCost = roundMoney(Number(currentHolding.avgPrice || 0) * previousQty);
      const updatedQty = previousQty + qty;
      const updatedAvg = roundMoney((previousCost + total) / updatedQty);

      currentHolding.quantity = updatedQty;
      currentHolding.avgPrice = updatedAvg;
      currentHolding.lastPrice = tradePrice;
      currentHolding.marketValue = roundMoney(updatedQty * tradePrice);
    } else {
      holdings.value = [
        ...holdings.value,
        {
          symbol,
          name: name || symbol,
          quantity: qty,
          avgPrice: tradePrice,
          lastPrice: tradePrice,
          marketValue: total,
        },
      ];
    }

    cashBalance.value = roundMoney(availableCash.value - total);
    walletStore.setWalletBalance(cashBalance.value);

    appendOrder({
      side: 'BUY',
      symbol,
      name: name || symbol,
      quantity: qty,
      price: tradePrice,
      total,
    });

    persistState();

    return {
      success: true,
      cashBalance: availableCash.value,
      total,
      holding: getHolding(symbol),
    };
  };

  const placeSell = ({ symbol, name, quantity, price }) => {
    const qty = Number(quantity);
    const tradePrice = roundMoney(price);
    const currentHolding = getHolding(symbol);

    if (!symbol) {
      throw new Error('Stock symbol is required');
    }

    if (!currentHolding) {
      throw new Error('You do not own this stock yet');
    }

    if (!Number.isInteger(qty) || qty <= 0) {
      throw new Error('Please enter a valid quantity');
    }

    if (qty > Number(currentHolding.quantity || 0)) {
      throw new Error(`You can only sell up to ${currentHolding.quantity} shares`);
    }

    if (!Number.isFinite(tradePrice) || tradePrice <= 0) {
      throw new Error('Current price is not available');
    }

    const total = roundMoney(qty * tradePrice);
    const remainingQty = Number(currentHolding.quantity || 0) - qty;

    if (remainingQty > 0) {
      currentHolding.quantity = remainingQty;
      currentHolding.lastPrice = tradePrice;
      currentHolding.marketValue = roundMoney(remainingQty * tradePrice);
    } else {
      holdings.value = holdings.value.filter((item) => item.symbol !== symbol);
    }

    cashBalance.value = roundMoney(availableCash.value + total);
    walletStore.setWalletBalance(cashBalance.value);

    appendOrder({
      side: 'SELL',
      symbol,
      name: name || symbol,
      quantity: qty,
      price: tradePrice,
      total,
    });

    persistState();

    return {
      success: true,
      cashBalance: availableCash.value,
      total,
      holding: getHolding(symbol),
    };
  };

  watch(
    storageKey,
    () => {
      hydrateState();
      seedFromWalletIfNeeded();
    },
    { immediate: true }
  );

  watch(
    () => walletStore.walletBalance,
    () => {
      seedFromWalletIfNeeded();
    }
  );

  return {
    loading,
    initialized,

    cashBalance: availableCash,
    holdings,
    holdingsWithPnL,
    orders,

    totalInvestment,
    portfolioValue,
    totalEquity,
    totalUnrealizedPnL,
    totalProfitLoss,

    getHolding,
    getAvailableQuantity,
    init,
    resetState,
    refreshHoldingPrices,
    placeBuy,
    placeSell,
  };
});

export default useTradeStore;
