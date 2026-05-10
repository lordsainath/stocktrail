<!--  ===================================
      Script Started
      =================================== -->

<script setup>
// imports
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue-sonner';

import { useThemeStore } from '@stores/themeStore';
import useUserStore from '@stores/userStore';
import useUiStore from '@stores/uiStore';

// stores
const themeStore = useThemeStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const { theme } = storeToRefs(themeStore);

// router
const router = useRouter();
const route = useRoute();

// props
const props = defineProps({
  variant: {
    type: String,
    default: 'auth',
  },
});

// Computed properties
const isAuthPage = computed(() => props.variant === 'auth');

const isRegisterRoute = computed(() => route.path.startsWith('/auth/register'));

const isLoginRoute = computed(() => route.path.startsWith('/auth/login'));

// methods
const handleLogout = () => {
  userStore.clearSession();

  toast.success('Logged out successfully');

  router.push('/auth/login');
};

const goTo = async (path) => {
  uiStore.closeMobileMenu?.();

  router.push(path);
};
</script>

<!--  ===================================
      Script Ended
      =================================== -->

<!--  ===================================
      Template Started
      =================================== -->

<template>
  <div
    class="sticky top-0 z-40 border-b border-b-[#e2e8f0] dark:border-b-[#30363d] bg-white/90 dark:bg-darksecondary/90 backdrop-blur-sm"
  >
    <div class="flex justify-between items-center px-5 py-3">
      <!-- LEFT -->
      <div class="flex items-center gap-2">
        <p
          class="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center font-bold"
        >
          S
        </p>

        <h1 class="font-semibold tracking-wide dark:text-white">StockTrail</h1>
      </div>

      <!-- RIGHT -->
      <div class="flex gap-3 items-center">
        <!-- THEME -->
        <div
          class="dark:bg-darksecondary bg-secondary px-3 py-2 rounded-md border dark:text-white border-[#e2e8f0] dark:border-[#30363d] cursor-pointer"
          @click="themeStore.toggleTheme"
        >
          <!-- <Sun size="18"/> -->
          <i v-show="theme === 'dark'" class="fa-regular fa-sun text-amber-500"></i>
          <i v-show="theme === 'light'" class="fa-regular fa-moon text-primary"></i>
          <!-- <MoonIcon size="18" v-show="theme === 'light'" /> -->
        </div>

        <!-- AUTH NAVBAR -->
        <template v-if="isAuthPage">
          <router-link
            v-if="isRegisterRoute"
            class="bg-primary text-white px-5 py-2 rounded-md cursor-pointer"
            to="/auth/login"
          >
            Login
          </router-link>

          <router-link
            v-if="isLoginRoute"
            class="bg-primary text-white px-5 py-2 rounded-md cursor-pointer"
            to="/auth/register/email"
          >
            Register
          </router-link>
        </template>

        <!-- APP NAVBAR -->
        <template v-else>
          <!-- USER -->
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium">
              {{ userStore.user?.username }}
            </p>

            <p class="text-xs text-gray-400">
              {{ userStore.user?.email }}
            </p>
          </div>

          <!-- PROFILE -->
          <div class="relative group/profile hidden sm:block">
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

              <button
                class="w-full cursor-pointer px-4 py-3 text-sm text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3"
                @click="goTo('/profile')"
              >
                <i class="fa-solid fa-user text-slate-500"></i>

                <span>PROFILE</span>
              </button>

              <button
                class="w-full cursor-pointer px-4 py-3 text-sm text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3"
                @click="goTo('/bank-details')"
              >
                <i class="fa-solid fa-building-columns text-slate-500"></i>

                <span>BANK ACCOUNT</span>
              </button>

              <button
                class="w-full cursor-pointer px-4 py-3 text-sm text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3"
                @click="goTo('/settings')"
              >
                <i class="fa-solid fa-gear text-slate-500"></i>

                <span>SETTINGS</span>
              </button>

              <button
                class="w-full cursor-pointer px-4 py-3 text-sm text-left font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition flex items-center gap-3 rounded-b-2xl"
                @click="handleLogout"
              >
                <i class="fa-solid fa-arrow-right-from-bracket"></i>

                <span>Logout</span>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<!--  ===================================
      Template Ended
      =================================== -->
