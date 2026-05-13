import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_apiBaseUrl,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const finnhubApi = axios.create({
  baseURL: import.meta.env.VITE_stockBaseUrl,
  timeout: 10000,
});

finnhubApi.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_finnhubKey;

  if (apiKey) {
    config.params = { ...config.params, token: apiKey };
  }

  return config;
});

finnhubApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { apiClient, finnhubApi };