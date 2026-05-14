import { defineStore } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import { apiClient } from '@api/httpClients';
import useUserStore from '@stores/userStore';
import { toast } from 'vue-sonner';

const STORAGE_PREFIX = 'stocktrail-wallet-balance';

const roundMoney = (value) => Number(Number(value || 0).toFixed(2));

const normalizeKey = (value) =>
  String(value || 'guest')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

export const useWalletStore = defineStore('wallet', () => {
  const userStore = useUserStore();

  const loading = ref(false);

  const bankBalance = ref(0);
  const tradeBalanceAdjustment = ref(0);
  const walletBalance = computed(() =>
    roundMoney(bankBalance.value + tradeBalanceAdjustment.value)
  );
  const hasStoredBalance = ref(false);
  const linkedAccounts = ref([]);
  const recentTransfers = ref([]);

  const storageKey = computed(() => {
    const user = userStore.user || {};
    const userKey = user.id || user._id || user.email || user.phone || 'guest';

    return `${STORAGE_PREFIX}:${normalizeKey(userKey)}`;
  });

  const persistWalletBalance = () => {
    localStorage.setItem(
      storageKey.value,
      JSON.stringify({
        bankBalance: roundMoney(bankBalance.value),
        tradeBalanceAdjustment: roundMoney(tradeBalanceAdjustment.value),
      })
    );
  };

  const hydrateWalletBalance = () => {
    const raw = localStorage.getItem(storageKey.value);

    if (raw === null) {
      bankBalance.value = 0;
      tradeBalanceAdjustment.value = 0;
      hasStoredBalance.value = false;
      return;
    }

    try {
      const parsed = JSON.parse(raw);

      if (parsed && typeof parsed === 'object') {
        bankBalance.value = roundMoney(parsed.bankBalance || 0);
        tradeBalanceAdjustment.value = roundMoney(parsed.tradeBalanceAdjustment || 0);
      } else {
        bankBalance.value = roundMoney(parsed || 0);
        tradeBalanceAdjustment.value = 0;
      }
    } catch (error) {
      const parsed = Number(raw);

      bankBalance.value = Number.isFinite(parsed) ? roundMoney(parsed) : 0;
      tradeBalanceAdjustment.value = 0;
    }

    hasStoredBalance.value = true;
  };

  const setWalletBalance = (value) => {
    bankBalance.value = Number.isFinite(Number(value)) ? roundMoney(value) : 0;

    hasStoredBalance.value = true;
    persistWalletBalance();
  };

  const adjustWalletBalance = (delta) => {
    tradeBalanceAdjustment.value = roundMoney(
      Number(tradeBalanceAdjustment.value || 0) + Number(delta || 0)
    );

    hasStoredBalance.value = true;
    persistWalletBalance();
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

  const hasLinkedBankAccount = computed(() => linkedAccounts.value.length > 0);

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

      setWalletBalance(remoteBalance);

      linkedAccounts.value = response?.data?.data?.bankAccounts || [];

      recentTransfers.value = response?.data?.data?.transactions || [];

      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch wallet summary');
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

  const addBankAccount = async (payload) => {
    if (hasLinkedBankAccount.value) {
      toast.error('Only one bank account can be linked.');
      return null;
    }

    loading.value = true;

    try {
      const response = await apiClient.post('/wallet/banks', {
        bankName: payload.bankName,
        accountHolder: payload.accountHolder,
        accountNumber: payload.accountNumber,
        ifsc: payload.ifsc,
        accountType: payload.accountType,
      });

      toast.success('Bank account added successfully!');

      resetAddBankForm();

      await fetchWalletSummary();

      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add bank account');
    } finally {
      loading.value = false;
    }
  };

  const addMoneyToWallet = async (payload) => {
    loading.value = true;

    try {
      const response = await apiClient.post('/wallet/add-money', {
        amount: Number(payload.amount),
        bankAccountId: payload.bankAccountId,
        pin: payload.pin,
      });

      toast.success('Money added to wallet successfully!');

      if (response?.data?.data?.balance !== undefined) {
        setWalletBalance(response.data.data.balance);
      }

      resetAddMoneyForm();

      await fetchWalletSummary();

      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add money');
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
    hasLinkedBankAccount,

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
