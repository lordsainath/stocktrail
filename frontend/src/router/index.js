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
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: () => import('../views/App/Dashboard.vue')
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
        if (token) return '/';
    } else {
        if (!token) return '/auth/login';
    }
});

export default router