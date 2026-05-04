<script setup>
import { Moon, MoonIcon, Sun } from '@lucide/vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '../../stores/themeStore';
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import useUserStore from '../../stores/userStore';

const themestore = useThemeStore();
const userStore = useUserStore();

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



</script>

<template>
    <div
        class="flex justify-between  items-center px-5 py-3 bg-white border-b border-b-[#e2e8f0] dark:border-b-[#30363d]  dark:bg- dark:text-white">
        <div class="flex items-center gap-2">
            <p class="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center font-bold">S
            </p>
            <h1 class="font-semibold">StockTrail</h1>
        </div>

        <div class="flex gap-2 items-center">
            <div @click="themestore.toggleTheme"
                class="dark:bg-darksecondary  bg-secondary px-3 py-2 rounded-md border border-[#e2e8f0] dark:border-[#30363d] cursor-pointer">
                <Sun size="18" v-show="theme === 'light'" />
                <MoonIcon size="18" v-show="theme === 'dark'" />
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
                <button @click="handleLogout"
                    class="bg-red-500 text-white px-5 py-2 cursor-pointer rounded-md">Logout</button>
            </template>



        </div>
    </div>
</template>
