<script setup>
import { onMounted } from 'vue';
import VOtpInput from 'vue3-otp-input';
import { useProfile } from '../../composables/useProfile';

const {
  user,
  formattedAddress,
  showProfileModal,
  showPasswordModal,
  showPinModal,
  loadingProfile,
  profileForm,
  passwordForm,
  pinForm,
  openProfileModal,
  openPasswordModal,
  openPinModal,
  closeProfileModal,
  closePasswordModal,
  closePinModal,
  fetchProfile,
  updateProfile,
  updatePassword,
  updatePin,
} = useProfile();

onMounted(fetchProfile);
</script>

<template>
  <div class="min-h-full p-5 sm:p-7 bg-[linear-gradient(120deg,#dbeafe_0%,#f8fafc_40%,#e2e8f0_100%)] dark:bg-[linear-gradient(130deg,#0f172a_0%,#111827_55%,#020617_100%)]">
    <div class="max-w-6xl mx-auto space-y-5">
      <section class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/85 dark:bg-slate-900/85 shadow-xl backdrop-blur-sm p-6 sm:p-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div class="flex items-center gap-4">
            <div class="relative">
              <img :src="user?.photoUrl" alt="Profile avatar" class="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-700 shadow-lg" />
              <div v-if="loadingProfile" class="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-cyan-500 text-white text-[10px] flex items-center justify-center">...</div>
            </div>
            <div>
              <p class="text-xs tracking-[0.22em] font-semibold text-cyan-700 dark:text-cyan-300">ACCOUNT PROFILE</p>
              <h1 class="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">{{ user?.name || 'NiftyNest User' }}</h1>
              <p class="text-sm text-slate-600 dark:text-slate-300">{{ user?.email || 'No email available' }}</p>
            </div>
          </div>

          <button
            @click="openProfileModal"
            class="self-start lg:self-auto px-4 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm shadow-lg hover:opacity-95 transition"
          >
            Edit Profile
          </button>
        </div>
      </section>

      <section class="grid lg:grid-cols-3 gap-5">
        <article class="lg:col-span-2 rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-lg p-5 sm:p-6">
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Account Details</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Your verified profile and KYC details in a clean summary format.</p>

          <div class="mt-5 space-y-4">
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/70 p-4">
              <h3 class="text-xs tracking-wide font-semibold text-slate-500 dark:text-slate-400">IDENTITY</h3>
              <dl class="mt-3 grid sm:grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <dt class="text-xs text-slate-500 dark:text-slate-400">Full Name</dt>
                  <dd class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ user?.name || 'Not available' }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-500 dark:text-slate-400">Username</dt>
                  <dd class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ user?.username || 'Not available' }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-500 dark:text-slate-400">Email</dt>
                  <dd class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ user?.email || 'Not available' }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-500 dark:text-slate-400">KYC Status</dt>
                  <dd class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{{ user?.kycStatus || 'Not available' }}</dd>
                </div>
              </dl>
            </div>

            <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/70 p-4">
              <h3 class="text-xs tracking-wide font-semibold text-slate-500 dark:text-slate-400">KYC DOCUMENTS</h3>
              <dl class="mt-3 grid sm:grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <dt class="text-xs text-slate-500 dark:text-slate-400">PAN Number</dt>
                  <dd class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ user?.panNumber || 'Not available' }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-500 dark:text-slate-400">Aadhaar Number</dt>
                  <dd class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ user?.aadhaarNumber || 'Not available' }}</dd>
                </div>
              </dl>
            </div>

            <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/70 p-4">
              <h3 class="text-xs tracking-wide font-semibold text-slate-500 dark:text-slate-400">ADDRESS</h3>
              <p class="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ formattedAddress }}</p>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-lg p-5 sm:p-6">
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Security Controls</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your login protection from here.</p>

          <div class="mt-5 space-y-3">
            <button @click="openPasswordModal" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Change Password</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Open secure form to update your password.</p>
            </button>

            <button @click="openPinModal" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Change PIN</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Update your 4-digit transaction PIN.</p>
            </button>

            <div class="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-3">
              <p class="text-xs text-slate-500 dark:text-slate-400">PIN Status</p>
              <p class="text-sm font-semibold mt-1" :class="user?.isPinSet ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
                {{ user?.isPinSet ? 'PIN is configured' : 'PIN is not set yet' }}
              </p>
            </div>
          </div>
        </article>
      </section>

      <div v-if="showProfileModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
        <div class="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Edit Profile Image</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Update your display photo using an image URL.</p>
          <input
            v-model="profileForm.photoUrl"
            type="url"
            placeholder="https://example.com/profile.jpg"
            class="mt-4 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <div class="mt-4 flex justify-end gap-2">
            <button @click="closeProfileModal" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm">Cancel</button>
            <button @click="updateProfile" :disabled="profileForm.loading" class="px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-semibold disabled:opacity-60">
              {{ profileForm.loading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="showPasswordModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
        <div class="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Change Password</h3>
          <input
            v-model="passwordForm.password"
            type="password"
            placeholder="New password"
            class="mt-4 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="Confirm password"
            class="mt-3 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div class="mt-4 flex justify-end gap-2">
            <button @click="closePasswordModal" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm">Cancel</button>
            <button @click="updatePassword" :disabled="passwordForm.loading" class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold disabled:opacity-60">
              {{ passwordForm.loading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="showPinModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
        <div class="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Change PIN</h3>
          <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Enter new PIN</p>
          <div class="mt-2 flex justify-center">
            <VOtpInput
              v-model:value="pinForm.pin"
              :num-inputs="4"
              input-type="number"
              separator=""
              input-classes="w-12 h-12 mx-1 text-center text-base font-semibold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Confirm new PIN</p>
          <div class="mt-2 flex justify-center">
            <VOtpInput
              v-model:value="pinForm.confirmPin"
              :num-inputs="4"
              input-type="number"
              separator=""
              input-classes="w-12 h-12 mx-1 text-center text-base font-semibold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div class="mt-4 flex justify-end gap-2">
            <button @click="closePinModal" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm">Cancel</button>
            <button @click="updatePin" :disabled="pinForm.loading" class="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60">
              {{ pinForm.loading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>