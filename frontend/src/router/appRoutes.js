// App Route configurations for authenticated users

export const appRoutes = [
  {
    path: '/',

    component: () => import('@layout/AppLayout.vue'),

    redirect: '/dashboard',

    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@views/App/Dashboard.vue'),
        meta: { title: 'Dashboard', requiresAuth: true },
      },

      {
        path: 'portfolio',
        name: 'Portfolio',
        component: () => import('@views/App/Portfolio.vue'),
        meta: { title: 'Portfolio', requiresAuth: true },
      },

      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@views/App/Profile.vue'),
        meta: { title: 'Profile', requiresAuth: true },
      },

      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@views/App/Settings.vue'),
        meta: { title: 'Settings', requiresAuth: true },
      },

      {
        path: 'watchlist',
        name: 'WatchList',
        component: () => import('@views/App/WatchList.vue'),
        meta: { title: 'WatchList', requiresAuth: true },
      },

      {
        path: 'bank-details',
        name: 'BankDetails',
        component: () => import('@views/App/BankDetails.vue'),
        meta: { title: 'Bank Details', requiresAuth: true },
      },

      {
        path: 'company/:symbol',
        name: 'CompanyDetails',
        component: () => import('@views/App/CompanyDetails.vue'),
        meta: { title: 'Company Details', requiresAuth: true },
      },
    ],
  },
];
