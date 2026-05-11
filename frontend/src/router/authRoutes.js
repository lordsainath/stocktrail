export const authRoutes = [
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
        meta: { title: 'Login' },
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
            meta: { title: 'Register Email' },
          },

          {
            path: 'basic',
            name: 'RegisterBasic',
            component: () => import('@components/register/StepBasic.vue'),
            meta: { title: 'Basic Information' },
          },

          {
            path: 'address',
            name: 'RegisterAddress',
            component: () => import('@components/register/StepAddress.vue'),
            meta: { title: 'Address Information' },
          },

          {
            path: 'username',
            name: 'RegisterUsername',
            component: () => import('@components/register/StepUsername.vue'),
            meta: { title: 'Username' },
          },

          {
            path: 'kyc',
            name: 'RegisterKYC',
            component: () => import('@components/register/StepKYC.vue'),
            meta: { title: 'KYC Verification' },
          },

          {
            path: 'otp',
            name: 'RegisterOTP',
            component: () => import('@components/register/StepOTP.vue'),
            meta: { title: 'OTP Verification' },
          },

          {
            path: 'pin',
            name: 'RegisterPIN',
            component: () => import('@components/register/StepPIN.vue'),
            meta: { title: 'PIN Setup' },
          },
        ],
      },
    ],
  },
];
