import axios from 'axios';


const API_KEY = import.meta.env.VITE_finnhubKey;

const finnhubApi = axios.create({
    baseURL: 'https://finnhub.io/api/v1',
    timeout: 10000,
});

finnhubApi.interceptors.request.use((config) => {
    if (API_KEY) {
        config.params = { ...config.params, token: API_KEY };
    }
    return config;


});

finnhubApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Finnhub API: Unauthorized. Please check your VITE_FINNHUB_API_KEY in the Secrets panel.');
        } else if (error.response?.status === 403) {
            console.warn('Finnhub API: Forbidden. This endpoint might be restricted for your API tier. Using mock data fallback.');
        } else if (error.response?.status === 429) {
            console.warn('Finnhub API: Rate limit exceeded (429). Throttling backend or using mock data.');
        }
        return Promise.reject(error);
    }
);

export default finnhubApi;