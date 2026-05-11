import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '');
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

  const isAuthenticated = computed(() => Boolean(token.value));

  const setSession = ({ token: accessToken, user: profile }) => {
    token.value = accessToken || '';
    user.value = profile || null;

    if (accessToken) {
      localStorage.setItem('token', accessToken);
    }

    if (profile) {
      localStorage.setItem('user', JSON.stringify(profile));
    } else {
      localStorage.removeItem('user');
    }
  };

  const updateUser = (payload) => {
    const current = user.value || {};
    user.value = { ...current, ...payload };
    localStorage.setItem('user', JSON.stringify(user.value));
  };

  const setUser = (profile) => {
    user.value = profile || null;

    if (profile) {
      localStorage.setItem('user', JSON.stringify(profile));
    } else {
      localStorage.removeItem('user');
    }
  };

  const clearSession = () => {
    token.value = '';
    user.value = null;

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    token,
    user,
    isAuthenticated,
    setSession,
    setUser,
    clearSession,
    updateUser,
  };
});

export default useUserStore;
