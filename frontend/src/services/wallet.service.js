import apiClient from './axios';

export const fetchWalletSummary = async () => {
  const response = await apiClient.get('/wallet/summary');
  return response.data;
};

export const addBankAccount = async (payload) => {
  const response = await apiClient.post('/wallet/banks', payload);
  return response.data;
};

export const addMoneyToWallet = async (payload) => {
  const response = await apiClient.post('/wallet/add-money', payload);
  return response.data;
};

export const verifyTransactionPin = async (pin) => {
  const response = await apiClient.post('/auth/verify-transaction-pin', { pin });
  return response.data;
};