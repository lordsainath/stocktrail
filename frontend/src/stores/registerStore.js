import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { checkEmail as checkEmailRequest, checkUsername as checkUsernameRequest, registerUser as registerUserRequest, setPin as setPinRequest, verifyAadhaar as verifyAadhaarRequest, verifyOtp as verifyOtpRequest, verifyPan as verifyPanRequest } from '../services/auth.service';
import { getErrorMessage } from '../utils/error';
import { hasRequiredAddress, isValidAadhaar, isValidPan, isValidPin, isValidPassword, isValidUsername, normalizeAadhaar } from '../utils/registration';

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
  return String(value || '').replace(/\D/g, '').trim();
};

let panTimer = null;
let aadhaarTimer = null;

export const useRegisterStore = defineStore('register', () => {
  const formData = reactive(createFormData());
  const panStatus = ref('idle');
  const panMessage = ref('');
  const aadhaarStatus = ref('idle');
  const aadhaarMessage = ref('');
  const loading = ref(false);

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

    return checkEmailRequest(email);
  };

  const checkUsername = async () => {
    if (!isValidUsername(formData.username)) {
      throw new Error('Username must be at least 3 characters long');
    }

    const response = await checkUsernameRequest(formData.username);
    const data = response?.data || {};

    if (!data.available) {
      throw new Error(data.message || 'Username not available');
    }

    return data;
  };

  const schedulePanVerification = () => {
    clearTimeout(panTimer);

    const pan = String(formData.panNumber || '').toUpperCase().trim();

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
        const response = await verifyPanRequest(pan, formData.name);
        panStatus.value = 'valid';
        panMessage.value = response?.message || 'PAN verified';
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
        const response = await verifyAadhaarRequest(aadhaar, formData.name);
        aadhaarStatus.value = 'valid';
        aadhaarMessage.value = response?.message || 'Aadhaar verified';
      } catch (error) {
        aadhaarStatus.value = 'invalid';
        aadhaarMessage.value = getErrorMessage(error, 'Aadhaar verification failed');
      }
    }, 500);
  };

  const submitRegistration = async () => {
    if (!formData.email || !formData.username || !formData.name || !formData.password || !formData.panNumber || !formData.aadhaarNumber || !hasRequiredAddress(formData.address)) {
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
      const response = await registerUserRequest({
        email: formData.email,
        username: formData.username,
        name: formData.name,
        password: formData.password,
        panNumber: String(formData.panNumber || '').toUpperCase().trim(),
        aadhaarNumber: normalizeAadhaar(formData.aadhaarNumber),
        address: formData.address,
      });

      return response;
    } finally {
      loading.value = false;
    }
  };

  const verifyOtpCode = async () => {
    const otp = normalizeDigitCode(formData.otp);
    formData.otp = otp;

    if (!otp) {
      throw new Error('OTP is required');
    }

    return verifyOtpRequest(formData.email, otp);
  };

  const setPinCode = async () => {
    const pin = normalizeDigitCode(formData.pin);
    formData.pin = pin;

    if (!isValidPin(pin)) {
      throw new Error('PIN must be exactly 4 digits');
    }

    return setPinRequest(formData.email, pin);
  };

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