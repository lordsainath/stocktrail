import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/auth',

        component: () => import('../layout/AuthLayout.vue'),

        children: [
            {
                path: "",
                redirect: "/auth/login",
            },
            {
                path: 'login',
                name: 'Login',
                component: () => import('../views/Auth/Login.vue')
            },
            {
                path: 'register',
                component: () => import('../views/Auth/Register.vue'),
                children: [
                    {
                        path: "",
                        redirect: "email"
                    },
                    {
                        path: 'email',
                        name: 'RegisterEmail',
                        component: () => import('../components/register/StepEmail.vue')
                    },
                    {
                        path: 'basic',
                        name: 'RegisterBasic',
                        component: () => import('../components/register/StepBasic.vue')
                    },
                    {
                        path: 'address',
                        name: 'RegisterAddress',
                        component: () => import('../components/register/StepAddress.vue')
                    },
                    {
                        path: 'username',
                        name: 'RegisterUsername',
                        component: () => import('../components/register/StepUsername.vue')
                    },
                    {
                        path: 'kyc',
                        name: 'RegisterKYC',
                        component: () => import('../components/register/StepKYC.vue')
                    },
                    {
                        path: 'otp',
                        name: 'RegisterOTP',
                        component: () => import('../components/register/StepOTP.vue')
                    },
                    {
                        path: 'pin',
                        name: 'RegisterPIN',
                        component: () => import('../components/register/StepPIN.vue')
                    }
                ]
            }
        ]
    }, {
        path: '/',
        component: () => import('../layout/AppLayout.vue'),
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('../views/App/Dashboard.vue')
            }, {
                path: 'portfolio',
                name: 'Portfolio',
                component: () => import('../views/App/Portfolio.vue')
            }, {
                path: 'profile',
                name: 'Profile',
                component: () => import('../views/App/Profile.vue')
            }, {
                path: 'settings',
                name: 'Settings',
                component: () => import('../views/App/Settings.vue')
            }, {
                path: 'watchlist',
                name: 'WatchList',
                component: () => import('../views/App/WatchList.vue')
            }, {
                path: 'bank-details',
                name: 'BankDetails',
                component: () => import('../views/App/BankDetails.vue')
            }, {
                path: 'company/:symbol',
                name: 'CompanyDetails',
                component: () => import('../views/App/CompanyDetails.vue')
            }
        ]
    },


    {
        path: "/login",
        redirect: "/auth/login",
    },
    {
        path: "/register",
        redirect: "/auth/register",
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/",
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach(to => {
    const token = localStorage.getItem('token');

    if (to.path.startsWith('/auth')) {
        if (token) return '/dashboard';
    } else {
        if (!token) return '/auth/login';
    }
});

export default router