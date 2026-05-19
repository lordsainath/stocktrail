// Imports

import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';
import { apiClient } from '@api/httpClients';
import { getErrorMessage } from '@composables/useErrorMessage';
import {
  hasRequiredAddress,
  isValidAadhaar,
  isValidPan,
  isValidPin,
  isValidPassword,
  isValidUsername,
  normalizeAadhaar,
} from '@composables/useRegistrationHelpers';

const createFormData = () => ({
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
  username: '',
  address: {
    line1: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  },
  panNumber: '',
  aadhaarNumber: '',
  otp: '',
  pin: '',
  confirmPin: '',
});

const normalizeDigitCode = (value) => {
  if (Array.isArray(value)) {
    return value.join('').replace(/\D/g, '').trim();
  }
  return String(value || '')
    .replace(/\D/g, '')
    .trim();
};

const isEmptyAddress = (address = {}) =>
  !address.line1 && !address.city && !address.state && !address.country && !address.pincode;

const isEmptyFormData = (data = {}) =>
  !data.email &&
  !data.name &&
  !data.password &&
  !data.confirmPassword &&
  !data.username &&
  isEmptyAddress(data.address) &&
  !data.panNumber &&
  !data.aadhaarNumber &&
  !data.otp &&
  !data.pin &&
  !data.confirmPin;

const STORAGE_KEY = 'stocktrail-registration-formdata';

let panTimer = null;
let aadhaarTimer = null;

export const useRegisterStore = defineStore('register', () => {
  const formData = reactive(createFormData());
  const panStatus = ref('idle');
  const panMessage = ref('');
  const aadhaarStatus = ref('idle');
  const aadhaarMessage = ref('');
  const loading = ref(false);

  // ===================================
  // PERSISTENCE FUNCTIONS
  // ===================================

  const persistFormData = () => {
    if (isEmptyFormData(formData)) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...formData,
        savedAt: new Date().toISOString(),
      })
    );
  };

  const hydrateFormData = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Remove savedAt property before assigning
        const { savedAt, ...formDataOnly } = data;
        Object.assign(formData, formDataOnly);
      } catch (error) {
        console.error('Failed to restore registration data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  // ===================================
  // WATCHER FOR AUTO-PERSISTENCE
  // ===================================

  watch(
    () => formData,
    () => {
      persistFormData();
    },
    { deep: true }
  );

  // ===================================
  // FORM METHODS
  // ===================================

  const resetRegisterForm = () => {
    Object.assign(formData, createFormData());
    panStatus.value = 'idle';
    panMessage.value = '';
    aadhaarStatus.value = 'idle';
    aadhaarMessage.value = '';
    loading.value = false;
    clearTimeout(panTimer);
    clearTimeout(aadhaarTimer);
  };

  const checkEmail = async (email) => {
    if (!email) {
      throw new Error('Email is required');
    }

    const response = await apiClient.post('/auth/check-email', { email });
    return response.data;
  };

  const checkUsername = async () => {
    if (!isValidUsername(formData.username)) {
      throw new Error('Username must be at least 3 characters long');
    }

    const response = await apiClient.post('/auth/check-username', {
      username: formData.username,
    });
    const data = response?.data?.data || response?.data || {};

    if (!data.available) {
      throw new Error(data.message || 'Username not available');
    }

    return data;
  };

  const schedulePanVerification = () => {
    clearTimeout(panTimer);

    const pan = String(formData.panNumber || '')
      .toUpperCase()
      .trim();

    if (!pan) {
      panStatus.value = 'idle';
      panMessage.value = '';
      return;
    }

    if (pan.length < 10) {
      panStatus.value = 'idle';
      panMessage.value = '';
      return;
    }

    if (!formData.name) {
      panStatus.value = 'invalid';
      panMessage.value = 'Enter full name in the previous step to verify PAN';
      return;
    }

    panStatus.value = 'checking';
    panMessage.value = 'Verifying...';
    panTimer = setTimeout(async () => {
      try {
        const response = await apiClient.post('/auth/verify-pan', {
          panNumber: pan,
          holderName: formData.name,
        });
        panStatus.value = 'valid';
        panMessage.value = response?.data?.message || response?.message || 'PAN verified';
      } catch (error) {
        panStatus.value = 'invalid';
        panMessage.value = getErrorMessage(error, 'PAN verification failed');
      }
    }, 500);
  };

  const scheduleAadhaarVerification = () => {
    clearTimeout(aadhaarTimer);

    const aadhaar = normalizeAadhaar(formData.aadhaarNumber);

    if (!aadhaar) {
      aadhaarStatus.value = 'idle';
      aadhaarMessage.value = '';
      return;
    }

    if (aadhaar.length < 12) {
      aadhaarStatus.value = 'idle';
      aadhaarMessage.value = '';
      return;
    }

    if (!formData.name) {
      aadhaarStatus.value = 'invalid';
      aadhaarMessage.value = 'Enter full name in the previous step to verify Aadhaar';
      return;
    }

    aadhaarStatus.value = 'checking';
    aadhaarMessage.value = 'Verifying...';
    aadhaarTimer = setTimeout(async () => {
      try {
        const response = await apiClient.post('/auth/verify-aadhaar', {
          aadhaarNumber: aadhaar,
          holderName: formData.name,
        });
        aadhaarStatus.value = 'valid';
        aadhaarMessage.value = response?.data?.message || response?.message || 'Aadhaar verified';
      } catch (error) {
        aadhaarStatus.value = 'invalid';
        aadhaarMessage.value = getErrorMessage(error, 'Aadhaar verification failed');
      }
    }, 500);
  };

  const submitRegistration = async () => {
    if (
      !formData.email ||
      !formData.username ||
      !formData.name ||
      !formData.password ||
      !formData.panNumber ||
      !formData.aadhaarNumber ||
      !hasRequiredAddress(formData.address)
    ) {
      throw new Error('All registration fields are required');
    }

    if (!isValidUsername(formData.username)) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (!isValidPassword(formData.password)) {
      throw new Error('Password must be at least 8 characters');
    }

    if (formData.password !== formData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (!isValidPan(formData.panNumber)) {
      throw new Error('PAN format is invalid (expected: ABCDE1234F)');
    }

    if (!isValidAadhaar(formData.aadhaarNumber)) {
      throw new Error('Aadhaar must be a 12-digit number');
    }

    if (panStatus.value === 'invalid' || aadhaarStatus.value === 'invalid') {
      throw new Error('Please fix KYC details before continuing');
    }

    if (panStatus.value === 'checking' || aadhaarStatus.value === 'checking') {
      throw new Error('Verification in progress. Please wait');
    }

    loading.value = true;
    try {
      const response = await apiClient.post('/auth/register', {
        email: formData.email,
        username: formData.username,
        name: formData.name,
        password: formData.password,
        panNumber: String(formData.panNumber || '')
          .toUpperCase()
          .trim(),
        aadhaarNumber: normalizeAadhaar(formData.aadhaarNumber),
        address: formData.address,
      });
      return response.data;
    } finally {
      loading.value = false;

    }
  };

  const verifyOtpCode = async (otpValue = formData.otp) => {
    const otp = normalizeDigitCode(otpValue);
    formData.otp = otp;

    if (!otp) {
      throw new Error('OTP is required');
    }

    const response = await apiClient.post('/auth/verify-otp', {
      email: formData.email,
      otp,
    });

    return response.data;
  };

  const setPinCode = async (pinValue = formData.pin) => {
    const pin = normalizeDigitCode(pinValue);
    formData.pin = pin;

    if (!isValidPin(pin)) {
      throw new Error('PIN must be exactly 4 digits');
    }

    const response = await apiClient.post('/auth/set-pin', {
      email: formData.email,
      pin,
    });

    return response.data;
  };

  // ===================================
  // INITIALIZATION
  // ===================================

  // Load persisted data on store creation
  hydrateFormData();

  return {
    formData,
    panStatus,
    panMessage,
    aadhaarStatus,
    aadhaarMessage,
    loading,
    resetRegisterForm,
    checkEmail,
    checkUsername,
    schedulePanVerification,
    scheduleAadhaarVerification,
    submitRegistration,
    verifyOtpCode,
    setPinCode,
  };
});

export default useRegisterStore;
