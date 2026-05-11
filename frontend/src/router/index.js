// ===================================
// IMPORTS
// ===================================

import { createRouter, createWebHistory } from 'vue-router';
import useUserStore from '@stores/userStore';
import { authRoutes } from './authRoutes';
import { appRoutes } from './appRoutes';

// ============================================
// ROUTER CONFIGURATION
// ============================================

const routes = [
  ...authRoutes,
  ...appRoutes,

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
  const userStore = useUserStore();

  if (to.path.startsWith('/auth')) {
    if (userStore.isAuthenticated) {
      return '/dashboard';
    }
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return '/auth/login';
  }

  return true;
});

// ============================================
// NAVIGATION GUARD
// Update document title based on route meta
// ============================================

router.afterEach((to) => {
  const title = to.meta.title || 'StockTrail';
  document.title = `${title} | StockTrail`;
});

export default router;
