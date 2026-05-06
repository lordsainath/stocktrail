import apiClient from './axios';

export const checkEmail = async (email) => {
  const response = await apiClient.post('/auth/check-email', { email });
  return response.data;
};

export const checkUsername = async (username) => {
  const response = await apiClient.post('/auth/check-username', { username });
  return response.data;
};

export const verifyPan = async (panNumber, holderName) => {
  const response = await apiClient.post('/auth/verify-pan', { panNumber, holderName });
  return response.data;
};

export const verifyAadhaar = async (aadhaarNumber, holderName) => {
  const response = await apiClient.post('/auth/verify-aadhaar', { aadhaarNumber, holderName });
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await apiClient.post('/auth/verify-otp', { email, otp });
  return response.data;
};

export const setPin = async (email, pin) => {
  const response = await apiClient.post('/auth/set-pin', { email, pin });
  return response.data;
};

export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const verifyLoginPin = async (tempToken, pin) => {
  const response = await apiClient.post('/auth/verify-pin', { tempToken, pin });
  return response.data;
};