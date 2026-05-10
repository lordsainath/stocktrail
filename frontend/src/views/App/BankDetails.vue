<script setup>
import { onMounted, ref } from 'vue';
import VOtpInput from 'vue3-otp-input';

import BaseButton from '@components/base/BaseButton.vue';

import useWalletStore from '@stores/walletStore';

import { formatCurrency, maskAccountNumber } from '@composables/useWalletHelpers';
import { toast } from 'vue-sonner';

const walletStore = useWalletStore();

const showAddMoneyModal = ref(false);
const showAddBankModal = ref(false);

const openAddBankModal = () => {
  walletStore.resetAddBankForm();

  showAddBankModal.value = true;
};

const openAddMoneyModal = () => {
  if (!walletStore.linkedAccounts.length) {
    toast.info('Add a bank account first');
    return;
  }

  walletStore.resetAddMoneyForm();

  walletStore.addMoneyForm.bankAccountId = walletStore.linkedAccounts[0]?._id || '';

  showAddMoneyModal.value = true;
};

const handleEsc = () => {
  showAddBankModal.value = false;
};

onMounted(walletStore.fetchWalletSummary);
</script>

<template>
  <div
    class="min-h-full p-5 sm:p-7 bg-[linear-gradient(120deg,#dbeafe_0%,#f8fafc_40%,#e2e8f0_100%)] dark:bg-[linear-gradient(130deg,#0f172a_0%,#111827_55%,#020617_100%)]"
  >
    <div class="max-w-6xl mx-auto space-y-5">
      <!-- Header -->

      <section
        class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-xl p-6 sm:p-8"
      >
        <p class="text-xs tracking-[0.22em] font-semibold text-cyan-700 dark:text-cyan-300">
          BANKING HUB
        </p>

        <h1 class="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">
          Bank Account Details
        </h1>

        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Manage linked banks and add money securely with PIN verification.
        </p>

        <div class="mt-5 grid md:grid-cols-3 gap-3">
          <div class="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3">
            <p class="text-xs text-slate-500 dark:text-slate-400">Wallet Balance</p>

            <p class="text-xl font-black text-slate-900 dark:text-slate-100">
              {{ formatCurrency(walletStore.walletBalance) }}
            </p>
          </div>

          <div
            class="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 border border-emerald-200 dark:border-emerald-900/60"
          >
            <p class="text-xs text-emerald-700 dark:text-emerald-300">Verified Accounts</p>

            <p class="text-xl font-black text-emerald-700 dark:text-emerald-300">
              {{ walletStore.verifiedCount }}
            </p>
          </div>

          <div
            class="rounded-2xl bg-amber-50 dark:bg-amber-900/20 px-4 py-3 border border-amber-200 dark:border-amber-900/60"
          >
            <p class="text-xs text-amber-700 dark:text-amber-300">Pending Accounts</p>

            <p class="text-xl font-black text-amber-700 dark:text-amber-300">
              {{ walletStore.pendingCount }}
            </p>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <BaseButton variant="primary" :full-width="false" @click="openAddMoneyModal">
            + Add Money
          </BaseButton>
        </div>
      </section>

      <!-- Main Content -->

      <section class="grid lg:grid-cols-3 gap-5">
        <!-- Linked Banks -->

        <article
          class="lg:col-span-2 rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-lg p-5 sm:p-6"
        >
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">
              Linked Bank Accounts
            </h2>

            <BaseButton variant="secondary" :full-width="false" @click="openAddBankModal">
              + Add Bank
            </BaseButton>
          </div>

          <div class="mt-4 space-y-3">
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
                      {{ account.accountHolder }} •
                      {{ maskAccountNumber(account.accountNumber) }}
                    </p>

                    <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      IFSC: {{ account.ifsc }} • Type:
                      {{ account.accountType }}
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

        <!-- Transactions -->

        <article
          class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-lg p-5 sm:p-6"
        >
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Transfer Logs</h2>

          <div class="mt-4 space-y-3">
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

                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ item.status }}
                </p>
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
                  {{ item.type === 'CREDIT' ? '+' : '-' }}
                  {{ formatCurrency(item.amount) }}
                </p>

                <i
                  v-if="item.status === 'SUCCESS'"
                  class="fa-solid fa-circle-check text-emerald-500"
                ></i>

                <i
                  v-else-if="item.status === 'PENDING'"
                  class="fa-regular fa-clock text-amber-500"
                ></i>

                <i v-else class="fa-solid fa-circle-xmark text-rose-500"></i>
              </div>
            </div>
          </div>
        </article>
      </section>

      <!-- Add Bank Modal -->

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

          <form class="mt-4 grid sm:grid-cols-2 gap-3" @submit.prevent="walletStore.addBankAccount">
            <input
              v-model="walletStore.addBankForm.bankName"
              type="text"
              placeholder="Bank name"
              class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            />

            <input
              v-model="walletStore.addBankForm.accountHolder"
              type="text"
              placeholder="Account holder"
              class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            />

            <input
              v-model="walletStore.addBankForm.accountNumber"
              type="text"
              placeholder="Account number"
              class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            />

            <input
              v-model="walletStore.addBankForm.ifsc"
              type="text"
              placeholder="IFSC"
              class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            />

            <select
              v-model="walletStore.addBankForm.accountType"
              class="sm:col-span-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            >
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </select>

            <div class="sm:col-span-2 flex justify-end gap-2 mt-1">
              <BaseButton
                type="button"
                variant="secondary"
                :full-width="false"
                @click="showAddBankModal = false"
              >
                Cancel
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

      <!-- Add Money Modal -->

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
            v-model="walletStore.addMoneyForm.bankAccountId"
            class="mt-4 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          >
            <option value="">Select bank account</option>

            <option
              v-for="account in walletStore.linkedAccounts"
              :key="account._id"
              :value="account._id"
            >
              {{ account.bankName }} •
              {{ maskAccountNumber(account.accountNumber) }}
            </option>
          </select>

          <input
            v-model="walletStore.addMoneyForm.amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="Enter amount"
            class="mt-3 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          />

          <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Enter 4-digit PIN</p>

          <div class="mt-2 flex justify-center">
            <VOtpInput
              v-model:value="walletStore.addMoneyForm.pin"
              :num-inputs="4"
              input-type="number"
              separator=""
              input-classes="
                w-12 h-12 mx-1 text-center text-base font-semibold
                border border-slate-300 dark:border-slate-600
                rounded-lg bg-white dark:bg-slate-800
                text-slate-900 dark:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-emerald-500
              "
            />
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <BaseButton variant="secondary" :full-width="false" @click="showAddMoneyModal = false">
              Cancel
            </BaseButton>

            <BaseButton
              variant="primary"
              :full-width="false"
              :disabled="walletStore.loading"
              @click="walletStore.addMoneyToWallet"
            >
              {{ walletStore.loading ? 'Processing...' : 'Add Money' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
