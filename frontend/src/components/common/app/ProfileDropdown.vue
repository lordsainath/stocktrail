<script setup>
// imports
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import useUserStore from '@stores/userStore';
import useUiStore from '@stores/uiStore';

// stores
const userStore = useUserStore();
const uiStore = useUiStore();

// router
const router = useRouter();

// methods
const handleLogout = () => {
  userStore.clearSession();

  toast.success('Logged out successfully');

  router.push('/auth/login');
};

const goTo = (path) => {
  uiStore.closeMobileMenu?.();

  router.push(path);
};
</script>

<template>
  <div class="relative group/profile hidden sm:block">
    <!-- PROFILE BUTTON -->
    <button
      class="w-10 h-10 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 outline-none ring-2 ring-transparent group-hover/profile:ring-cyan-500 transition"
    >
      <img
        :src="userStore.user?.photoUrl"
        alt="User profile"
        class="w-full h-full object-cover cursor-pointer"
      />
    </button>

    <!-- DROPDOWN -->
    <div
      class="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl opacity-0 invisible translate-y-2 group-hover/profile:opacity-100 group-hover/profile:visible group-hover/profile:translate-y-0 group-focus-within/profile:opacity-100 group-focus-within/profile:visible group-focus-within/profile:translate-y-0 transition-all duration-200 z-50"
    >
      <!-- HEADER -->
      <div class="px-4 py-4 border-b border-slate-200 dark:border-slate-700">
        <p class="text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400">
          ACTIVE OPERATIVE
        </p>

        <p class="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
          {{ userStore.user?.username || 'User' }}
        </p>

        <p class="text-sm text-slate-500 dark:text-slate-400 truncate">
          {{ userStore.user?.email || 'No email' }}
        </p>
      </div>

      <!-- PROFILE -->
      <button
        @click="goTo('/profile')"
        class="w-full cursor-pointer px-4 py-3 text-sm text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3"
      >
        <i class="fa-solid fa-user text-slate-500"></i>

        <span>PROFILE</span>
      </button>

      <!-- BANK -->
      <button
        @click="goTo('/bank-details')"
        class="w-full cursor-pointer px-4 py-3 text-sm text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3"
      >
        <i class="fa-solid fa-building-columns text-slate-500"></i>

        <span>BANK ACCOUNT</span>
      </button>

      <!-- SETTINGS -->
      <button
        @click="goTo('/settings')"
        class="w-full cursor-pointer px-4 py-3 text-sm text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3"
      >
        <i class="fa-solid fa-gear text-slate-500"></i>

        <span>SETTINGS</span>
      </button>

      <!-- LOGOUT -->
      <button
        @click="handleLogout"
        class="w-full cursor-pointer px-4 py-3 text-sm text-left font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition flex items-center gap-3 rounded-b-2xl"
      >
        <i class="fa-solid fa-arrow-right-from-bracket"></i>

        <span>Logout</span>
      </button>
    </div>
  </div>
</template>
