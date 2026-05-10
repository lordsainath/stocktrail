import * as yup from 'yup';

const normalizeDigitCode = (value) => {
  if (Array.isArray(value)) {
    return value.join('').replace(/\D/g, '').trim();
  }

  return String(value || '')
    .replace(/\D/g, '')
    .trim();
};

// ============================================
// LOGIN SCHEMAS
// ============================================
export const loginCredentialsSchema = yup.object({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const loginPinSchema = yup.object({
  pin: yup
    .string()
    .length(4, 'PIN must be exactly 4 digits')
    .matches(/^\d+$/, 'PIN must contain only numbers')
    .required('PIN is required'),
});

// ============================================
// REGISTER SCHEMAS
// ============================================
export const registerEmailSchema = yup.object({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
});

export const registerBasicSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .required('Full name is required')
    .matches(/^[a-zA-Z\s]*$/, 'Full name can only contain letters'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const registerAddressSchema = yup.object({
  country: yup
    .string()
    .min(2, 'Country must be at least 2 characters')
    .required('Country is required'),
  state: yup.string().min(2, 'State must be at least 2 characters').required('State is required'),
  city: yup.string().min(2, 'City must be at least 2 characters').required('City is required'),
  line1: yup
    .string()
    .min(5, 'Address line must be at least 5 characters')
    .required('Address line is required'),
  pincode: yup.string().matches(/^$|^\d{6}$/, 'Pincode must be 6 digits'),
});

export const registerUsernameSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .required('Username is required')
    .matches(/^[a-zA-Z0-9_]*$/, 'Username can only contain letters, numbers, and underscores'),
});

export const registerKycSchema = yup.object({
  panNumber: yup.string().required('PAN is required'),
  aadhaarNumber: yup
    .string()
    .required('Aadhaar is required')
    .matches(/^\d{12}$/, 'Aadhaar must be 12 digits'),
});

export const registerOtpSchema = yup.object({
  otp: yup
    .string()
    .transform((_, originalValue) => normalizeDigitCode(originalValue))
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^\d+$/, 'OTP must contain only numbers')
    .required('OTP is required'),
});

export const registerPinSchema = yup.object({
  pin: yup
    .string()
    .transform((_, originalValue) => normalizeDigitCode(originalValue))
    .length(4, 'PIN must be exactly 4 digits')
    .matches(/^\d+$/, 'PIN must contain only numbers')
    .required('PIN is required'),
  confirmPin: yup
    .string()
    .transform((_, originalValue) => normalizeDigitCode(originalValue))
    .oneOf([yup.ref('pin')], 'PINs must match')
    .required('Confirm PIN is required'),
});

// ============================================
// PROFILE SCHEMAS
// ============================================
export const profilePhotoSchema = yup.object({
  photoUrl: yup
    .string()
    .url('Please enter a valid image URL')
    .required('Profile image URL is required'),
});

export const passwordSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm password is required'),
});

export const pinSchema = yup.object({
  pin: yup
    .string()
    .transform((_, originalValue) => normalizeDigitCode(originalValue))
    .length(4, 'PIN must be exactly 4 digits')
    .matches(/^\d+$/, 'PIN must contain only numbers')
    .required('PIN is required'),
  confirmPin: yup
    .string()
    .transform((_, originalValue) => normalizeDigitCode(originalValue))
    .oneOf([yup.ref('pin')], 'PINs do not match')
    .required('Confirm PIN is required'),
});

// ============================================
// WALLET SCHEMAS
// ============================================
export const addBankSchema = yup.object({
  bankName: yup.string().required('Bank name is required'),
  accountHolder: yup.string().required('Account holder is required'),
  accountNumber: yup
    .string()
    .min(6, 'Account number is too short')
    .required('Account number is required'),
  ifsc: yup.string().min(6, 'IFSC code is too short').required('IFSC code is required'),
  accountType: yup.string().required('Account type is required'),
});

export const addMoneySchema = yup.object({
  bankAccountId: yup.string().required('Please select a bank account'),
  amount: yup
    .number()
    .typeError('Please enter a valid amount')
    .moreThan(0, 'Amount must be greater than zero')
    .required('Amount is required'),
  pin: yup
    .string()
    .transform((_, originalValue) => normalizeDigitCode(originalValue))
    .length(4, 'PIN must be exactly 4 digits')
    .matches(/^\d+$/, 'PIN must contain only numbers')
    .required('PIN is required'),
});
