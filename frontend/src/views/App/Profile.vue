<!-- Script Started -->

<script setup>
import { onMounted } from 'vue';

import { useProfileStore } from '@stores/profileStore';

import BaseButton from '@components/base/BaseButton.vue';
import EditProfileModal from '@/components/profile/EditProfileModal.vue';
import ChangePasswordModal from '@/components/profile/ChangePasswordModal.vue';
import ChangePinModal from '@/components/profile/ChangePinModal.vue';
import ProfileInfoCard from '@components/profile/ProfileInfoCard.vue';
import ProfileInfoItem from '@components/profile/ProfileInfoItem.vue';
import { storeToRefs } from 'pinia';

const profileStore = useProfileStore();
const { photoUrl, errors } = storeToRefs(profileStore);

onMounted(profileStore.fetchCurrentProfile);
</script>

<!-- Script Ended -->
<!-- Template Started -->

<template>
  <div class="min-h-full bg-slate-50 p-5 sm:p-7 dark:bg-slate-950">
    <div class="max-w-6xl mx-auto space-y-5">
      <section
        class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/85 dark:bg-slate-900/85 shadow-xl backdrop-blur-sm p-6 sm:p-8"
      >
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div class="flex items-center gap-4">
            <div class="relative">
              <img
                :src="profileStore.user?.photoUrl"
                alt="Profile avatar"
                class="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-700 shadow-lg"
              />

              <div
                v-if="profileStore.loadingProfile"
                class="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-cyan-500 text-white text-[10px] flex items-center justify-center"
              >
                ...
              </div>
            </div>

            <div>
              <p class="heading-sm">ACCOUNT PROFILE</p>

              <h1 class="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {{ profileStore.user?.name || 'NiftyNest User' }}
              </h1>

              <p class="text-sm text-slate-600 dark:text-slate-300">
                {{ profileStore.user?.email || 'No email available' }}
              </p>
            </div>
          </div>

          <BaseButton
            variant="primary"
            :full-width="false"
            class="self-start lg:self-auto"
            @click="profileStore.openProfileModal"
          >
            Edit Profile Image
          </BaseButton>
        </div>
      </section>

      <section class="grid lg:grid-cols-3 gap-5">
        <article
          class="lg:col-span-2 rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-lg p-5 sm:p-6"
        >
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Account Details</h2>

          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your verified profile and KYC details in a clean summary format.
          </p>

          <div class="mt-5 space-y-4">
            <ProfileInfoCard title="IDENTITY">
              <dl class="mt-3 grid sm:grid-cols-2 gap-y-3 gap-x-4">
                <ProfileInfoItem label="Full Name" :value="profileStore.user?.name" />

                <ProfileInfoItem label="Username" :value="profileStore.user?.username" />

                <ProfileInfoItem label="Email" :value="profileStore.user?.email" />

                <ProfileInfoItem
                  label="KYC Status"
                  :value="profileStore.user?.kycStatus"
                  value-class="text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                />
              </dl>
            </ProfileInfoCard>

            <ProfileInfoCard title="KYC DOCUMENTS">
              <dl class="mt-3 grid sm:grid-cols-2 gap-y-3 gap-x-4">
                <ProfileInfoItem label="PAN Number" :value="profileStore.user?.panNumber" />

                <ProfileInfoItem label="Aadhaar Number" :value="profileStore.user?.aadhaarNumber" />
              </dl>
            </ProfileInfoCard>

            <ProfileInfoCard title="ADDRESS">
              <p class="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
                {{ profileStore.formattedAddress }}
              </p>
            </ProfileInfoCard>
          </div>
        </article>

        <article
          class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow-lg p-5 sm:p-6"
        >
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Security Controls</h2>

          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your login protection from here.
          </p>

          <!-- Change Password -->

          <div class="mt-5 space-y-3">
            <BaseButton
              variant="secondary"
              class="justify-start p-3 items-start flex-col"
              @click="profileStore.openPasswordModal"
            >
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Change Password
              </p>

              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Open secure form to update your password.
              </p>
            </BaseButton>

            <BaseButton
              variant="secondary"
              class="justify-start p-3 items-start flex-col"
              @click="profileStore.openPinModal"
            >
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Change PIN</p>

              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Update your 4-digit transaction PIN.
              </p>
            </BaseButton>

            <div class="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-3">
              <p class="text-xs text-slate-500 dark:text-slate-400">PIN Status</p>

              <p
                class="text-sm font-semibold mt-1"
                :class="
                  profileStore.user?.isPinSet
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                "
              >
                {{ profileStore.user?.isPinSet ? 'PIN is configured' : 'PIN is not set yet' }}
              </p>
            </div>
          </div>
        </article>
      </section>

      <EditProfileModal
        :show="profileStore.showProfileModal"
        :form="profileStore.profileForm"
        @close="profileStore.closeProfileModal"
      />

      <ChangePasswordModal v-model:show="profileStore.showPasswordModal" />

      <ChangePinModal v-model:show="profileStore.showPinModal" />
    </div>
  </div>
</template>

<!-- Template Ended -->

<!-- Style Started  -->
<style scoped></style>
<!-- Style Ended  -->
