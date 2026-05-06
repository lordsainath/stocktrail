<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';
import VOtpInput from 'vue3-otp-input';
import apiClient from '../../services/axios';


const loading = ref(false);
const walletBalance = ref(0);
const linkedAccounts = ref([]);
const recentTransfers = ref([]);

const showAddMoneyModal = ref(false);
const showAddBankModal = ref(false);

const addBankForm = reactive({
  bankName: '',
  accountHolder: '',
  accountNumber: '',
  ifsc: '',
  accountType: 'Savings',
  loading: false,
});

const addMoneyForm = reactive({
  amount: '',
  bankAccountId: '',
  pin: '',
  loading: false,
});

const formattedBalance = computed(() => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
}).format(walletBalance.value || 0));

const formatTransferAmount = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
}).format(Number(value || 0));

const verifiedCount = computed(() => linkedAccounts.value.filter((item) => item.status === 'VERIFIED').length);
const pendingCount = computed(() => linkedAccounts.value.filter((item) => item.status === 'PENDING').length);

const maskedAccount = (accountNumber) => {
  const last4 = String(accountNumber || '').slice(-4);
  return `XXXXXX${last4}`;
};

const fetchSummary = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get('/wallet/summary');
  
    
    walletBalance.value = response?.data?.data?.balance || 0;
    linkedAccounts.value = response?.data?.data?.bankAccounts || [];
    recentTransfers.value = response?.data?.data?.transactions || [];
  } catch (error) {
    toast.error(error);
  } finally {
    loading.value = false;
  }
};

const addBankAccount = async () => {
  if (!addBankForm.bankName || !addBankForm.accountHolder || !addBankForm.accountNumber || !addBankForm.ifsc) {
    toast.error('Please fill all required bank fields');
    return;
  }

  try {
    addBankForm.loading = true;
    const response = await apiClient.post('/wallet/banks', {
      bankName: addBankForm.bankName,
      accountHolder: addBankForm.accountHolder,
      accountNumber: addBankForm.accountNumber,
      ifsc: addBankForm.ifsc,
      accountType: addBankForm.accountType,
    });

    toast.success(response?.message || 'Bank account added');
    addBankForm.bankName = '';
    addBankForm.accountHolder = '';
    addBankForm.accountNumber = '';
    addBankForm.ifsc = '';
    addBankForm.accountType = 'Savings';
    showAddBankModal.value = false;
    await fetchSummary();
  } catch (error) {
    toast.error(error);
  } finally {
    addBankForm.loading = false;
  }
};

const openAddBankModal = () => {
  addBankForm.bankName = '';
  addBankForm.accountHolder = '';
  addBankForm.accountNumber = '';
  addBankForm.ifsc = '';
  addBankForm.accountType = 'Savings';
  showAddBankModal.value = true;
};

const openAddMoneyModal = () => {
  if (!linkedAccounts.value.length) {
    toast.info('Add a bank account first to continue');
    return;
  }

  addMoneyForm.amount = '';
  addMoneyForm.bankAccountId = linkedAccounts.value[0]?._id || '';
  addMoneyForm.pin = '';
  showAddMoneyModal.value = true;
};

const addMoney = async () => {
  const amount = Number(addMoneyForm.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    toast.error('Please enter a valid amount');
    return;
  }

  if (!/^\d{4}$/.test(String(addMoneyForm.pin))) {
    toast.error('Please enter a valid 4-digit PIN');
    return;
  }

  try {
    addMoneyForm.loading = true;
    const response = await apiClient.post('/wallet/add-money', {
      amount,
      bankAccountId: addMoneyForm.bankAccountId || null,
      pin: addMoneyForm.pin,
    });

    toast.success(response?.message || 'Money added successfully');
    showAddMoneyModal.value = false;
    await fetchSummary();
  } catch (error) {
    toast.error(error);
  } finally {
    addMoneyForm.loading = false;
  }
};

const  handleEsc = ()=>{
  showAddBankModal.value = false;
}

onMounted(fetchSummary);
</script>

<template>
  <div class="min-h-full p-5 sm:p-7 bg-[linear-gradient(120deg,#dbeafe_0%,#f8fafc_40%,#e2e8f0_100%)] dark:bg-[linear-gradient(130deg,#0f172a_0%,#111827_55%,#020617_100%)]">
    <div class="max-w-6xl mx-auto space-y-5">
      <section class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-xl p-6 sm:p-8">
        <p class="text-xs tracking-[0.22em] font-semibold text-cyan-700 dark:text-cyan-300">BANKING HUB</p>
        <h1 class="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">Bank Account Details</h1>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Manage linked banks and add money securely with PIN verification.</p>

        <div class="mt-5 grid md:grid-cols-3 gap-3">
          <div class="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3">
            <p class="text-xs text-slate-500 dark:text-slate-400">Wallet Balance</p>
            <p class="text-xl font-black text-slate-900 dark:text-slate-100">{{ formattedBalance }}</p>
          </div>
          <div class="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 border border-emerald-200 dark:border-emerald-900/60">
            <p class="text-xs text-emerald-700 dark:text-emerald-300">Verified Accounts</p>
            <p class="text-xl font-black text-emerald-700 dark:text-emerald-300">{{ verifiedCount }}</p>
          </div>
          <div class="rounded-2xl bg-amber-50 dark:bg-amber-900/20 px-4 py-3 border border-amber-200 dark:border-amber-900/60">
            <p class="text-xs text-amber-700 dark:text-amber-300">Pending Accounts</p>
            <p class="text-xl font-black text-amber-700 dark:text-amber-300">{{ pendingCount }}</p>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
            <button @click="openAddMoneyModal" class="px-4 py-2.5 cursor-pointer rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:opacity-95 transition">
            + Add Money
          </button>
          <!-- Add new click event -->
          <button class="px-4 py-2.5 cursor-pointer rounded-xl bg-linear-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:opacity-95 transition">
           Withdraw
          </button>
        
        </div>
      </section>

      <section class="grid lg:grid-cols-3 gap-5">
        <article class="lg:col-span-2 rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-lg p-5 sm:p-6">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Linked Bank Accounts</h2>
            <button @click="openAddBankModal" class="text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              + Add Bank
            </button>
          </div>

          <div class="mt-4 space-y-3">
            <div v-if="loading" class="text-sm text-slate-500 dark:text-slate-400">Loading bank data...</div>
            <div v-else-if="!linkedAccounts.length" class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-sm text-slate-500 dark:text-slate-400">No bank accounts added yet.</div>
            <div v-for="account in linkedAccounts" :key="account._id" class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/70 p-4">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div class="flex items-start gap-3">
                  <div class="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-cyan-600 dark:text-cyan-300">
                    <i class="fa-solid fa-building-columns"></i>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ account.bankName }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ account.accountHolder }} • {{ maskedAccount(account.accountNumber) }}</p>
                    <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">IFSC: {{ account.ifsc }} • Type: {{ account.accountType }}</p>
                  </div>
                </div>
                <span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="account.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'">
                  {{ account.status }}
                </span>
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-lg p-5 sm:p-6">
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Transfer Logs</h2>
          <div class="mt-4 space-y-3">
            <div v-if="!recentTransfers.length" class="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-3 text-sm text-slate-500 dark:text-slate-400">No transactions yet.</div>
            <div v-for="item in recentTransfers" :key="item.createdAt + item.reference" class="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50/70 dark:bg-slate-800/50">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ item.reference }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ new Date(item.createdAt).toLocaleString() }}</p>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.status }}</p>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <p class="text-sm font-bold" :class="item.type === 'CREDIT' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
                  {{ item.type === 'CREDIT' ? '+' : '-' }} {{ formatTransferAmount(item.amount) }}
                </p>
                <i class="fa-solid fa-circle-check text-emerald-500" v-if="item.status === 'SUCCESS'"></i>
                <i class="fa-regular fa-clock text-amber-500" v-else-if="item.status === 'PENDING'"></i>
                <i class="fa-solid fa-circle-xmark text-rose-500" v-else></i>
              </div>
            </div>
          </div>
        </article>
      </section>

      <div v-if="showAddBankModal" @keydown.esc="handleEsc" tabindex="0" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
        <div class="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Bank Account</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Fill bank details securely. Account starts as pending verification.</p>

          <form class="mt-4 grid sm:grid-cols-2 gap-3" @submit.prevent="addBankAccount">
            <input v-model="addBankForm.bankName" type="text" placeholder="Bank name" class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
            <input v-model="addBankForm.accountHolder" type="text" placeholder="Account holder" class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
            <input v-model="addBankForm.accountNumber" type="text" placeholder="Account number" class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
            <input v-model="addBankForm.ifsc" type="text" placeholder="IFSC" class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
            <select v-model="addBankForm.accountType" class="sm:col-span-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </select>

            <div class="sm:col-span-2 flex justify-end gap-2 mt-1">
              <button type="button" @click="showAddBankModal = false" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm">Cancel</button>
              <button type="submit" :disabled="addBankForm.loading" class="px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-semibold disabled:opacity-60">
                {{ addBankForm.loading ? 'Adding...' : 'Add Bank Account' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="showAddMoneyModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
        <div class="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Add Money</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose bank, amount and verify with your PIN.</p>

          <select v-model="addMoneyForm.bankAccountId" class="mt-4 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <option value="">Select bank account</option>
            <option v-for="account in linkedAccounts" :key="account._id" :value="account._id">
              {{ account.bankName }} • {{ maskedAccount(account.accountNumber) }}
            </option>
          </select>

          <input v-model="addMoneyForm.amount" type="number" min="1" step="0.01" placeholder="Enter amount" class="mt-3 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />

          <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Enter 4-digit PIN</p>
          <div class="mt-2 flex justify-center">
            <v-otp-input
              v-model:value="addMoneyForm.pin"
              :num-inputs="4"
              input-type="number"
              separator=""
              input-classes="w-12 h-12 mx-1 text-center text-base font-semibold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button @click="showAddMoneyModal = false" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm">Cancel</button>
            <button @click="addMoney" :disabled="addMoneyForm.loading" class="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60">
              {{ addMoneyForm.loading ? 'Processing...' : 'Add Money' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
