<script setup>
import { MoonIcon, Sun } from '@lucide/vue';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import VOtpInput from 'vue3-otp-input';

import { useThemeStore } from '../../stores/themeStore';
import useUserStore from '../../stores/userStore';
import useUiStore from '../../stores/uiStore';

import { useWallet } from '../../composables/useWallet';

const themeStore = useThemeStore();
const userStore = useUserStore();
const uiStore = useUiStore();

const router = useRouter();
const route = useRoute();

const { theme } = storeToRefs(themeStore);

const props = defineProps({
    variant: {
        type: String,
        default: 'auth'
    }
});

const isAuthPage = computed(() => props.variant === 'auth');

const isRegisterRoute = computed(() =>
    route.path.startsWith('/auth/register')
);

const isLoginRoute = computed(() =>
    route.path.startsWith('/auth/login')
);

const {
    walletVisible,
    walletLoading,
    walletDisplay,
    showWalletPinModal,
    walletPin,
    verifyingWalletPin,
    toggleWalletVisibility,
    verifyWalletPin,
    closeWalletPinModal,
} = useWallet();

const handleLogout = () => {
    userStore.clearSession();

    toast.success('Logged out successfully');

    router.push('/auth/login');
};

const goTo = async (path) => {
    uiStore.closeMobileMenu?.();

    await router.push(path);
};
</script>

<template>
    <div
        class="sticky top-0 z-40 border-b border-b-[#e2e8f0] dark:border-b-[#30363d] bg-white/90 dark:bg-darksecondary/90 backdrop-blur-sm">

        <div class="flex justify-between items-center px-5 py-3">

            <!-- LEFT -->
            <div class="flex items-center gap-2">
                <p
                    class="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center font-bold">
                    S
                </p>

                <h1 class="font-semibold tracking-wide dark:text-white">
                    StockTrail
                </h1>
            </div>

            <!-- RIGHT -->
            <div class="flex gap-3 items-center">

                <!-- THEME -->
                <div
                    @click="themeStore.toggleTheme"
                    class="dark:bg-darksecondary bg-secondary px-3 py-2 rounded-md border dark:text-white border-[#e2e8f0] dark:border-[#30363d] cursor-pointer">

                    <Sun size="18" v-show="theme === 'dark'" />

                    <MoonIcon size="18" v-show="theme === 'light'" />
                </div>

                <!-- AUTH NAVBAR -->
                <template v-if="isAuthPage">

                    <router-link
                        v-if="isRegisterRoute"
                        class="bg-primary text-white px-5 py-2 rounded-md cursor-pointer"
                        to="/auth/login">

                        Login
                    </router-link>

                    <router-link
                        v-if="isLoginRoute"
                        class="bg-primary text-white px-5 py-2 rounded-md cursor-pointer"
                        to="/auth/register/email">

                        Register
                    </router-link>
                </template>

                <!-- APP NAVBAR -->
                <template v-else>

                    <!-- WALLET -->
                    <!-- <button
                        @click="toggleWalletVisibility"
                        class="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition">

                        <span
                            class="text-xs font-semibold text-slate-500 dark:text-slate-300">
                            Wallet
                        </span>

                        <span
                            class="text-sm font-bold text-slate-900 dark:text-slate-100 min-w-22 text-right">

                            {{ walletLoading ? 'Loading...' : walletDisplay }}
                        </span>

                        <i
                            :class="walletVisible
                                ? 'fa-regular fa-eye-slash'
                                : 'fa-regular fa-eye'"
                            class="text-slate-500">
                        </i>
                    </button> -->

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
                            class="w-10 h-10 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 outline-none ring-2 ring-transparent group-hover/profile:ring-cyan-500 transition">

                            <img
                                :src="userStore.user?.photoUrl"
                                alt="User profile"
                                class="w-full h-full object-cover cursor-pointer" />
                        </button>

                        <!-- DROPDOWN -->
                        <div
                            class="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl opacity-0 invisible translate-y-2 group-hover/profile:opacity-100 group-hover/profile:visible group-hover/profile:translate-y-0 group-focus-within/profile:opacity-100 group-focus-within/profile:visible group-focus-within/profile:translate-y-0 transition-all duration-200 z-50">

                            <div
                                class="px-4 py-4 border-b border-slate-200 dark:border-slate-700">

                                <p
                                    class="text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400">

                                    ACTIVE OPERATIVE
                                </p>

                                <p
                                    class="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">

                                    {{ userStore.user?.username || 'User' }}
                                </p>

                                <p
                                    class="text-sm text-slate-500 dark:text-slate-400 truncate">

                                    {{ userStore.user?.email || 'No email' }}
                                </p>
                            </div>

                            <button
                                @click="goTo('/profile')"
                                class="w-full cursor-pointer px-4 py-3 text-sm text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3">

                                <i class="fa-regular fa-user text-slate-500"></i>

                                <span>PROFILE</span>
                            </button>

                            <button
                                @click="goTo('/bank-details')"
                                class="w-full cursor-pointer px-4 py-3 text-sm text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3">

                                <i class="fa-solid fa-id-card text-slate-500"></i>

                                <span>BANK ACCOUNT</span>
                            </button>

                            <button
                                @click="goTo('/settings')"
                                class="w-full cursor-pointer px-4 py-3 text-sm text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3">

                                <i class="fa-solid fa-gear text-slate-500"></i>

                                <span>SETTINGS</span>
                            </button>

                            <button
                                @click="handleLogout"
                                class="w-full cursor-pointer px-4 py-3 text-sm text-left font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition flex items-center gap-3 rounded-b-2xl">

                                <i
                                    class="fa-solid fa-arrow-right-from-bracket"></i>

                                <span>TERMINATE SESSION</span>
                            </button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <!-- WALLET MODAL -->
    <!-- <div
        v-if="showWalletPinModal"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">

        <div
            class="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">

            <h3
                class="text-lg font-bold text-slate-900 dark:text-slate-100">

                Verify PIN
            </h3>

            <p
                class="text-sm text-slate-500 dark:text-slate-400 mt-1">

                Enter your PIN to view wallet balance.
            </p>

            <div class="mt-4 flex justify-center">

                <v-otp-input
                    v-model:value="walletPin"
                    :num-inputs="4"
                    input-type="number"
                    separator=""
                    input-classes="w-12 h-12 mx-1 text-center text-base font-semibold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>

            <div class="mt-5 flex justify-end gap-2">

                <button
                    @click="closeWalletPinModal"
                    class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm">

                    Cancel
                </button>

                <button
                    @click="verifyWalletPin"
                    :disabled="verifyingWalletPin"
                    class="px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-semibold disabled:opacity-60">

                    {{ verifyingWalletPin ? 'Verifying...' : 'Verify' }}
                </button>
            </div>
        </div>
    </div> -->
</template>