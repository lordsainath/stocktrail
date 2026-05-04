<script setup>
import { Moon, MoonIcon, Sun } from '@lucide/vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '../../stores/themeStore';
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import useUserStore from '../../stores/userStore';
import useUiStore from '../../stores/uiStore';

const themestore = useThemeStore();
const userStore = useUserStore();
const uiStore = useUiStore();

const router = useRouter();
const route = useRoute();


const isRegisterRoute = computed(() => route.path.startsWith('/auth/register'));
const isLoginRoute = computed(() => route.path.startsWith('/auth/login'));


const { theme } = storeToRefs(themestore);

const props = defineProps({
    variant: {
        type: String,
        default: 'auth'
    }
})

const isAuthPage = computed(() => props.variant === 'auth');


const handleLogout = () => {
    userStore.clearSession();
    toast.success('Logged out successfully');
    router.push('/auth/login');
}


const goTo = async (path) => {
    
    await router.push(path);
};


</script>

<template>
    <div
        class="flex justify-between  items-center px-5 py-3 bg-white border-b border-b-[#e2e8f0] dark:border-b-[#30363d]  dark:bg-darksecondary dark:text-white">
        <div class="flex items-center gap-2">
            <p class="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center font-bold">S
            </p>
            <h1 class="font-semibold">StockTrail</h1>
        </div>

        <div class="flex gap-2 items-center">

            <div @click="themestore.toggleTheme"
                class="dark:bg-darksecondary  bg-secondary px-3 py-2 rounded-md border border-[#e2e8f0] dark:border-[#30363d] cursor-pointer">
                <Sun size="18" v-show="theme === 'dark'" />
                <MoonIcon size="18" v-show="theme === 'light'" />
            </div>




            <!-- Auth Page Navbar -->
            <template v-if="isAuthPage">
                <router-link v-if="isRegisterRoute" class="bg-primary text-white px-5 py-2 rounded-md cursor-pointer"
                    to="/auth/login">Login
                </router-link>
                <router-link v-if="isLoginRoute" class="bg-primary text-white px-5 py-2 rounded-md cursor-pointer"
                    to="/auth/register/email">
                    Register</router-link>


            </template>


            <!-- App Page Navbar -->
            <template v-else>
                <div class="text-right hidden sm:block">
                    <p class="text-sm font-medium">{{ userStore.user?.username }}</p>
                    <p class="text-xs text-gray-400">{{ userStore.user?.email }}</p>
                </div>
                <div class="relative group/profile hidden sm:block">
                    <button
                        class="w-10 h-10 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 outline-none ring-2 ring-transparent group-hover/profile:ring-cyan-500 transition">
                        <img src="https://imgv3.fotor.com/images/slider-image/A-clear-image-of-a-woman-wearing-red-sharpened-by-Fotors-image-sharpener.jpg"
                            alt="User profile" class="w-full cursor-pointer h-full object-cover" />
                    </button>
                    <div
                        class="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl opacity-0 invisible translate-y-2 group-hover/profile:opacity-100 group-hover/profile:visible group-hover/profile:translate-y-0 group-focus-within/profile:opacity-100 group-focus-within/profile:visible group-focus-within/profile:translate-y-0 transition-all duration-200 z-50">
                        <div class="px-4 py-4 border-b border-slate-200 dark:border-slate-700">
                            <p class="text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400">
                                ACTIVE OPERATIVE</p>
                            <p class="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{{
                                userStore.user?.username || 'User' }}</p>
                            <p class="text-sm text-slate-500 dark:text-slate-400 truncate">{{
                                userStore.user?.email || 'No email' }}</p>
                        </div>

                        <button @click="goTo('/profile')"
                            class="w-full px-4 py-3 text-sm text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3">
                            <i class="fa-regular fa-user text-slate-500"></i>
                            <span>PROFILE</span>
                        </button>

                        <button @click="goTo('/bank-details')"
                            class="w-full px-4 py-3 text-sm text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3">
                            <i class="fa-solid fa-id-card text-slate-500"></i>
                            <span>BANK ACCOUNT</span>
                        </button>

                        <button @click="goTo('/settings')"
                            class="w-full px-4 py-3 text-sm text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3">
                            <i class="fa-solid fa-gear text-slate-500"></i>
                            <span>SETTINGS</span>
                        </button>

                        <button @click="handleLogout"
                            class="w-full px-4 py-3 text-sm text-left font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition flex items-center gap-3 rounded-b-2xl">
                            <i class="fa-solid fa-arrow-right-from-bracket"></i>
                            <span>TERMINATE SESSION</span>
                        </button>
                    </div>
                </div>

            </template>



        </div>
    </div>
</template>
