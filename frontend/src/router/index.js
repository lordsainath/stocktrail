// ===================================
// IMPORTS
// ===================================


import { createRouter, createWebHistory } from 'vue-router';

// ============================================
// ROUTER CONFIGURATION
// Define application routes with lazy loading
// ============================================

const routes = [
  {
    path: '/auth',

    component: () => import('@layout/AuthLayout.vue'),

    children: [
      {
        path: '',
        redirect: '/auth/login',
      },

      {
        path: 'login',
        name: 'Login',
        component: () => import('@views/Auth/Login.vue'),
        
      },

      {
        path: 'register',

        component: () => import('@views/Auth/Register.vue'),

        children: [
          {
            path: '',
            redirect: 'email',
          },

          {
            path: 'email',
            name: 'RegisterEmail',
            component: () => import('@components/register/StepEmail.vue'),
            meta: {title: 'Register Email'},
          },

          {
            path: 'basic',
            name: 'RegisterBasic',
            component: () => import('@components/register/StepBasic.vue'),
            meta : {title: 'Basic Information'},
          },

          {
            path: 'address',
            name: 'RegisterAddress',
            component: () => import('@components/register/StepAddress.vue'),
              meta : {title: 'Address Information'},
          },

          {
            path: 'username',
            name: 'RegisterUsername',
            component: () => import('@components/register/StepUsername.vue'),
              meta : {title: 'Username'},
          },

          {
            path: 'kyc',
            name: 'RegisterKYC',
            component: () => import('@components/register/StepKYC.vue'),
              meta : {title: 'KYC Verification'},
          },

          {
            path: 'otp',
            name: 'RegisterOTP',
            component: () => import('@components/register/StepOTP.vue'),
            meta : {title: 'OTP Verification'},
          },

          {
            path: 'pin',
            name: 'RegisterPIN',
            component: () => import('@components/register/StepPIN.vue'),
            meta : {title: 'PIN Setup'},
          },
        ],
      },
    ],
  },

  {
    path: '/',

    component: () => import('@layout/AppLayout.vue'),

    redirect: '/dashboard',

    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@views/App/Dashboard.vue'),
        meta : {title: 'Dashboard' , requiresAuth: true },
      },

      {
        path: 'portfolio',
        name: 'Portfolio',
        component: () => import('@views/App/Portfolio.vue'),
        meta : {title: 'Portfolio' , requiresAuth: true },
      },

      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@views/App/Profile.vue'),
        meta : {title: 'Profile' , requiresAuth: true },
      },

      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@views/App/Settings.vue'),
        meta : {title: 'Settings' , requiresAuth: true },
      },

      {
        path: 'watchlist',
        name: 'WatchList',
        component: () => import('@views/App/WatchList.vue'),
        meta : {title: 'WatchList' , requiresAuth: true },
      },

      {
        path: 'bank-details',
        name: 'BankDetails',
        component: () => import('@views/App/BankDetails.vue'),
        meta : {title: 'Bank Details' , requiresAuth: true },

      },

      {
        path: 'company/:symbol',
        name: 'CompanyDetails',
        component: () => import('@views/App/CompanyDetails.vue'),
        meta : {title: 'Company Details' , requiresAuth: true },
      },
    ],
  },

  {
    path: '/login',
    redirect: '/auth/login',
  },

  {
    path: '/register',
    redirect: '/auth/register',
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

// ===================================
// ROUTER
// ===================================

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ===================================
// ROUTE GUARD
// ===================================

router.beforeEach((to) => {
  const token = localStorage.getItem('token');

  // AUTH ROUTES
  if (to.path.startsWith('/auth')) {
    if (token) {
      return '/dashboard';
    }
  }

  // PROTECTED ROUTES
  else {
    if (!token) {
      return '/auth/login';
    }
  }
});

// ============================================
// NAVIGATION GUARD
// Update document title based on route meta
// ============================================
router.afterEach((to) => {
  const title = to.meta.title || 'Department of Higher Education & Workforce Development'
  const projectName = 'Department of Higher Education & Workforce Development'
  document.title = `${title} | ${projectName}`
})

export default router;
