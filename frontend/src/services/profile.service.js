import apiClient from './axios';

export const fetchCurrentProfile = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const updateProfilePhoto = async (photoUrl) => {
  const response = await apiClient.put('/auth/update-photo', { photoUrl });
  return response.data;
};

export const updatePassword = async (password) => {
  const response = await apiClient.put('/auth/update-password', { password });
  return response.data;
};

export const updatePin = async (pin) => {
  const response = await apiClient.put('/auth/update-pin', { pin });
  return response.data;
};