<script setup>
import { computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import VOtpInput from 'vue3-otp-input';
import { toast } from 'vue-sonner';

import BaseButton from '@components/base/BaseButton.vue';
import BaseStatCard from '@/components/base/BaseStatCard.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';

import useWalletStore from '@stores/walletStore';
import { formatCurrency, maskAccountNumber } from '@composables/useWalletHelpers';
import { addBankSchema, addMoneySchema } from '@composables/useValidationSchemas';

const walletStore = useWalletStore();

const showAddMoneyModal = ref(false);
const showAddBankModal = ref(false);

const {
  errors: bankErrors,
  defineField: defineBankField,
  handleSubmit: handleBankSubmit,
  resetForm: resetBankForm,
} = useForm({
  validationSchema: addBankSchema,
});

const [bankName] = defineBankField('bankName');
const [accountHolder] = defineBankField('accountHolder');
const [accountNumber] = defineBankField('accountNumber');
const [ifsc] = defineBankField('ifsc');
const [accountType] = defineBankField('accountType');

const {
  errors: moneyErrors,
  defineField: defineMoneyField,
  handleSubmit: handleMoneySubmit,
  resetForm: resetMoneyForm,
} = useForm({
  validationSchema: addMoneySchema,
});

const [bankAccountId] = defineMoneyField('bankAccountId');
const [amount] = defineMoneyField('amount');
const [pin] = defineMoneyField('pin');

const otpInputClasses = computed(() => {
  const base =
    'w-12 h-12 mx-1 text-center text-base font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2';

  return moneyErrors.value.pin
    ? `${base} border border-red-500 focus:ring-red-400`
    : `${base} border border-slate-300 dark:border-slate-600 focus:ring-emerald-500`;
});

const openAddBankModal = () => {
  if (walletStore.hasLinkedBankAccount) {
    toast.info('Only one bank account can be linked.');
    return;
  }

  resetBankForm({
    values: {
      bankName: '',
      accountHolder: '',
      accountNumber: '',
      ifsc: '',
      accountType: 'Savings',
    },
  });

  showAddBankModal.value = true;
};

const openAddMoneyModal = () => {
  if (!walletStore.linkedAccounts.length) {
    toast.info('Add a bank account first');
    return;
  }

  resetMoneyForm({
    values: {
      bankAccountId: walletStore.linkedAccounts[0]?._id || '',
      amount: '',
      pin: '',
    },
  });

  showAddMoneyModal.value = true;
};

const handleAddBank = handleBankSubmit(async (values) => {
  const result = await walletStore.addBankAccount(values);

  if (result) {
    resetBankForm();
    showAddBankModal.value = false;
  }
});

const handleAddMoney = handleMoneySubmit(async (values) => {
  const result = await walletStore.addMoneyToWallet(values);

  if (result) {
    resetMoneyForm();
    showAddMoneyModal.value = false;
  }
});

const handleEsc = () => {
  showAddBankModal.value = false;
};

onMounted(walletStore.fetchWalletSummary);
</script>

<template>
  <div class="min-h-full bg-slate-50 p-5 sm:p-7 dark:bg-slate-950">
    <div class="max-w-6xl mx-auto space-y-5">
      <section
        class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-xl p-6 sm:p-8"
      >
        <div>
          <p class="heading-sm">BANKING HUB</p>
          <h1 class="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">
            Bank Account Details
          </h1>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Manage linked banks and add money securely.
          </p>
        </div>

        <div class="mt-5 grid gap-3 md:grid-cols-3">
          <BaseStatCard title="Wallet Balance" :value="formatCurrency(walletStore.walletBalance)" />
          <BaseStatCard
            title="Verified Accounts"
            :value="walletStore.verifiedCount"
            variant="success"
          />
          <BaseStatCard
            title="Pending Accounts"
            :value="walletStore.pendingCount"
            variant="warning"
          />
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <BaseButton variant="primary" :full-width="false" @click="openAddMoneyModal">
            + Add Money
          </BaseButton>
        </div>
      </section>

      <section class="grid lg:grid-cols-3 gap-5">
        <article
          class="lg:col-span-2 rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-lg p-5 sm:p-6 min-h-115"
        >
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">
              Linked Bank Accounts
            </h2>
            <BaseButton
              variant="secondary"
              :full-width="false"
              :disabled="walletStore.hasLinkedBankAccount"
              @click="openAddBankModal"
            >
              {{ walletStore.hasLinkedBankAccount ? 'Bank Linked' : '+ Add Bank' }}
            </BaseButton>
          </div>

          <div class="mt-4 space-y-3 max-h-90 overflow-y-auto pr-1">
            <div v-if="walletStore.loading" class="text-sm text-slate-500 dark:text-slate-400">
              Loading bank data...
            </div>
            <div
              v-else-if="!walletStore.linkedAccounts.length"
              class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-sm text-slate-500 dark:text-slate-400"
            >
              No bank accounts added yet.
            </div>
            <div
              v-for="account in walletStore.linkedAccounts"
              :key="account._id"
              class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/70 p-4"
            >
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div class="flex items-start gap-3">
                  <div
                    class="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-cyan-600 dark:text-cyan-300"
                  >
                    <i class="fa-solid fa-building-columns"></i>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {{ account.bankName }}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {{ account.accountHolder }} • {{ maskAccountNumber(account.accountNumber) }}
                    </p>
                    <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      IFSC: {{ account.ifsc }} • Type: {{ account.accountType }}
                    </p>
                  </div>
                </div>
                <span
                  class="text-xs font-semibold px-2.5 py-1 rounded-full"
                  :class="
                    account.status === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                  "
                >
                  {{ account.status }}
                </span>
              </div>
            </div>
          </div>
        </article>

        <article
          class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-lg p-5 sm:p-6 min-h-115"
        >
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Transfer Logs</h2>
          <div class="mt-4 space-y-3 max-h-90 overflow-y-auto pr-1">
            <div
              v-if="!walletStore.recentTransfers.length"
              class="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-3 text-sm text-slate-500 dark:text-slate-400"
            >
              No transactions yet.
            </div>
            <div
              v-for="item in walletStore.recentTransfers"
              :key="item.createdAt + item.reference"
              class="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50/70 dark:bg-slate-800/50"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {{ item.reference }}
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {{ new Date(item.createdAt).toLocaleString() }}
                  </p>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.status }}</p>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <p
                  class="text-sm font-bold"
                  :class="
                    item.type === 'CREDIT'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  "
                >
                  {{ item.type === 'CREDIT' ? '+' : '-' }} {{ formatCurrency(item.amount) }}
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <div
        v-if="showAddBankModal"
        tabindex="0"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
        @keydown.esc="handleEsc"
      >
        <div
          class="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5"
        >
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Bank Account</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fill bank details securely. Account starts as pending verification.
          </p>

          <form class="mt-4 grid sm:grid-cols-2 gap-3" @submit.prevent="handleAddBank">
            <BaseInput
              v-model="bankName"
              label="Bank Name"
              placeholder="Enter bank name"
              required
              :error="bankErrors.bankName"
            />
            <BaseInput
              v-model="accountHolder"
              label="Account Holder"
              placeholder="Enter account holder name"
              required
              :error="bankErrors.accountHolder"
            />
            <BaseInput
              v-model="accountNumber"
              label="Account Number"
              placeholder="Enter account number"
              required
              :error="bankErrors.accountNumber"
            />
            <BaseInput
              v-model="ifsc"
              label="IFSC Code"
              placeholder="Enter IFSC code"
              required
              :error="bankErrors.ifsc"
              class="uppercase"
            />
            <div class="sm:col-span-2">
              <BaseSelect v-model="accountType" label="Account Type" required>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
              </BaseSelect>
              <p v-if="bankErrors.accountType" class="mt-1 text-sm text-red-500">
                {{ bankErrors.accountType }}
              </p>
            </div>
            <div class="sm:col-span-2 flex justify-end gap-2 mt-1">
              <BaseButton
                type="button"
                variant="secondary"
                :full-width="false"
                @click="showAddBankModal = false"
                >Cancel
              </BaseButton>
              <BaseButton
                type="submit"
                variant="primary"
                :full-width="false"
                :disabled="walletStore.loading"
              >
                {{ walletStore.loading ? 'Adding...' : 'Add Bank Account' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>

      <div
        v-if="showAddMoneyModal"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
      >
        <div
          class="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5"
        >
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Add Money</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose bank, amount and verify with your PIN.
          </p>

          <select
            v-model="bankAccountId"
            class="mt-4 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          >
            <option value="">Select bank account</option>
            <option
              v-for="account in walletStore.linkedAccounts"
              :key="account._id"
              :value="account._id"
            >
              {{ account.bankName }} • {{ maskAccountNumber(account.accountNumber) }}
            </option>
          </select>
          <p v-if="moneyErrors.bankAccountId" class="mt-1 text-sm text-red-500">
            {{ moneyErrors.bankAccountId }}
          </p>

          <input
            v-model="amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="Enter amount"
            class="mt-3 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          />
          <p v-if="moneyErrors.amount" class="mt-1 text-sm text-red-500">
            {{ moneyErrors.amount }}
          </p>

          <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Enter 4-digit PIN</p>
          <div class="mt-2 flex justify-center">
            <VOtpInput
              v-model:value="pin"
              :num-inputs="4"
              input-type="number"
              separator=""
              :input-classes="otpInputClasses"
            />
          </div>
          <p v-if="moneyErrors.pin" class="mt-2 text-sm text-red-500 text-center">
            {{ moneyErrors.pin }}
          </p>

          <div class="mt-4 flex justify-end gap-2">
            <BaseButton variant="secondary" :full-width="false" @click="showAddMoneyModal = false"
              >Cancel</BaseButton
            >
            <BaseButton
              variant="primary"
              :full-width="false"
              :disabled="walletStore.loading"
              @click="handleAddMoney"
            >
              {{ walletStore.loading ? 'Processing...' : 'Add Money' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
