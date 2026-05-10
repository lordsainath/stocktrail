import { defineStore } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import { apiClient } from '@stores/httpClients';

import useUserStore from '@stores/userStore';

const STORAGE_PREFIX = 'stocktrail-wallet-balance';

const normalizeKey = (value) =>
  String(value || 'guest')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

export const useWalletStore = defineStore('wallet', () => {
  const userStore = useUserStore();

  const loading = ref(false);

  const walletBalance = ref(0);
  const hasStoredBalance = ref(false);
  const linkedAccounts = ref([]);
  const recentTransfers = ref([]);

  const storageKey = computed(() => {
    const user = userStore.user || {};
    const userKey = user.id || user._id || user.email || user.phone || 'guest';

    return `${STORAGE_PREFIX}:${normalizeKey(userKey)}`;
  });

  const persistWalletBalance = () => {
    localStorage.setItem(storageKey.value, String(Number(walletBalance.value || 0)));
  };

  const hydrateWalletBalance = () => {
    const raw = localStorage.getItem(storageKey.value);

    if (raw === null) {
      hasStoredBalance.value = false;
      return;
    }

    const parsed = Number(raw);
    walletBalance.value = Number.isFinite(parsed) ? parsed : 0;
    hasStoredBalance.value = true;
  };

  const setWalletBalance = (value) => {
    walletBalance.value = Number.isFinite(Number(value)) ? Number(value) : 0;
    hasStoredBalance.value = true;
    persistWalletBalance();
  };

  const adjustWalletBalance = (delta) => {
    setWalletBalance(Number(walletBalance.value || 0) + Number(delta || 0));
  };

  const addBankForm = reactive({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    ifsc: '',
    accountType: 'Savings',
  });

  const addMoneyForm = reactive({
    amount: '',
    bankAccountId: '',
    pin: '',
  });

  const verifiedCount = computed(
    () => linkedAccounts.value.filter((item) => item.status === 'VERIFIED').length
  );

  const pendingCount = computed(
    () => linkedAccounts.value.filter((item) => item.status === 'PENDING').length
  );

  const resetAddBankForm = () => {
    addBankForm.bankName = '';
    addBankForm.accountHolder = '';
    addBankForm.accountNumber = '';
    addBankForm.ifsc = '';
    addBankForm.accountType = 'Savings';
  };

  const resetAddMoneyForm = () => {
    addMoneyForm.amount = '';
    addMoneyForm.bankAccountId = '';
    addMoneyForm.pin = '';
  };

  const fetchWalletSummary = async () => {
    loading.value = true;

    try {
      const response = await apiClient.get('/wallet/summary');

      const remoteBalance = response?.data?.data?.balance || 0;

      if (!hasStoredBalance.value) {
        walletBalance.value = remoteBalance;
        persistWalletBalance();
      }

      linkedAccounts.value = response?.data?.data?.bankAccounts || [];
      recentTransfers.value = response?.data?.data?.transactions || [];

      return response.data;
    } finally {
      loading.value = false;
    }
  };

  watch(
    storageKey,
    () => {
      hydrateWalletBalance();
    },
    { immediate: true }
  );

  const addBankAccount = async () => {
    if (
      !addBankForm.bankName ||
      !addBankForm.accountHolder ||
      !addBankForm.accountNumber ||
      !addBankForm.ifsc
    ) {
      throw new Error('Please fill all required bank fields');
    }

    loading.value = true;

    try {
      const response = await apiClient.post('/wallet/banks', {
        bankName: addBankForm.bankName,
        accountHolder: addBankForm.accountHolder,
        accountNumber: addBankForm.accountNumber,
        ifsc: addBankForm.ifsc,
        accountType: addBankForm.accountType,
      });

      resetAddBankForm();

      await fetchWalletSummary();

      return response.data;
    } finally {
      loading.value = false;
    }
  };

  const addMoneyToWallet = async () => {
    const amount = Number(addMoneyForm.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Please enter a valid amount');
    }

    if (!/^\d{4}$/.test(String(addMoneyForm.pin))) {
      throw new Error('Please enter a valid 4-digit PIN');
    }

    loading.value = true;

    try {
      const response = await apiClient.post('/wallet/add-money', {
        amount,
        bankAccountId: addMoneyForm.bankAccountId || null,
        pin: addMoneyForm.pin,
      });

      resetAddMoneyForm();

      await fetchWalletSummary();

      return response.data;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,

    walletBalance,
    hasStoredBalance,
    linkedAccounts,
    recentTransfers,

    verifiedCount,
    pendingCount,

    addBankForm,
    addMoneyForm,

    resetAddBankForm,
    resetAddMoneyForm,

    setWalletBalance,
    adjustWalletBalance,

    fetchWalletSummary,
    addBankAccount,
    addMoneyToWallet,
  };
});

export default useWalletStore;
