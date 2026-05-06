import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import apiClient from '../services/axios';

const useUserStore = defineStore('user', () => {
	const token = ref(localStorage.getItem('token') || '');
	const tempToken = ref(sessionStorage.getItem('tempToken') || '');
	const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

	const isAuthenticated = computed(() => Boolean(token.value));

	const syncApiToken = () => {
		if (token.value) {
			apiClient.defaults.headers.common.Authorization = `Bearer ${token.value}`;
		} else {
			delete apiClient.defaults.headers.common.Authorization;
		}
	};

	syncApiToken();

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

		syncApiToken();
	};

	const setTempToken = (value) => {
		tempToken.value = value || '';

		if (value) {
			sessionStorage.setItem('tempToken', value);
		} else {
			sessionStorage.removeItem('tempToken');
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
		tempToken.value = '';
		user.value = null;

		localStorage.removeItem('token');
		localStorage.removeItem('user');
		sessionStorage.removeItem('tempToken');
		syncApiToken();
	};

	return {
		token,
		tempToken,
		user,
		isAuthenticated,
		setSession,
		setTempToken,
		setUser,
		clearSession,
		updateUser
	};
})

export default useUserStore;