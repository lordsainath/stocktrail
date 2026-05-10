import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { apiClient } from '@stores/httpClients';

export const useWalletStore = defineStore('wallet', () => {
  const loading = ref(false);

  const walletBalance = ref(0);
  const linkedAccounts = ref([]);
  const recentTransfers = ref([]);

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

      walletBalance.value = response?.data?.data?.balance || 0;
      linkedAccounts.value = response?.data?.data?.bankAccounts || [];
      recentTransfers.value = response?.data?.data?.transactions || [];

      return response.data;
    } finally {
      loading.value = false;
    }
  };

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
    linkedAccounts,
    recentTransfers,

    verifiedCount,
    pendingCount,

    addBankForm,
    addMoneyForm,

    resetAddBankForm,
    resetAddMoneyForm,

    fetchWalletSummary,
    addBankAccount,
    addMoneyToWallet,
  };
});

export default useWalletStore;
