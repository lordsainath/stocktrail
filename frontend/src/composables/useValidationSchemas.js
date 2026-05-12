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
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const loginPinSchema = yup.object({
  pin: yup
    .string()
    .required('PIN is required')
    .matches(/^\d+$/, {
      message: 'PIN must contain only numbers',
      excludeEmptyString: true,
    })
    .length(4, 'PIN must be exactly 4 digits'),
});

// ============================================
// REGISTER SCHEMAS
// ============================================
export const registerEmailSchema = yup.object({
  email: yup
    .string()
    .trim()
    .max(100, 'Email address must be less than 100 characters')
    .email('Please enter a valid email address')
    .required('Email address is required'),
});

export const registerBasicSchema = yup.object({
  name: yup
    .string()
    .transform((value) => value?.replace(/\s+/g, ' ').trim())
    .required('Full name is required')
    .min(3, 'Full name should be at least 3 characters long')
    .max(100, 'Full name cannot exceed 100 characters')
    .matches(/^[a-zA-Z\s]+$/, {
      message: 'Full name can only contain letters and spaces',
      excludeEmptyString: true,
    }),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password cannot exceed 100 characters'),

  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords and confirm password must match'),
});

export const registerAddressSchema = yup.object({
  country: yup
    .string()
    .trim()
    .transform((value) => value?.replace(/\s+/g, ' '))
    .required('Country is required')
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country cannot exceed 100 characters')
    .matches(/^[a-zA-Z\s]+$/, {
      message: 'Country can only contain letters and spaces',
      excludeEmptyString: true,
    }),

  state: yup
    .string()
    .trim()
    .transform((value) => value?.replace(/\s+/g, ' '))
    .required('State is required')
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State cannot exceed 100 characters')
    .matches(/^[a-zA-Z\s]+$/, {
      message: 'State can only contain letters and spaces',
      excludeEmptyString: true,
    }),

  city: yup
    .string()
    .trim()
    .transform((value) => value?.replace(/\s+/g, ' '))
    .required('City is required')
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City cannot exceed 100 characters')
    .matches(/^[a-zA-Z\s]+$/, {
      message: 'City can only contain letters and spaces',
      excludeEmptyString: true,
    }),

  line1: yup
    .string()
    .trim()
    .transform((value) => value?.replace(/\s+/g, ' '))
    .required('Address line is required')
    .min(5, 'Address line must be at least 5 characters')
    .max(200, 'Address line cannot exceed 200 characters'),

  pincode: yup
  .string()
  .trim()
  .matches(/^\d*$/, 'Pincode can only contain numbers')
  .matches(/^$|^\d{6}$/, 'Pincode must be exactly 6 digits'),
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
  panNumber: yup
    .string()
    .trim()
    .uppercase()
    .required('PAN is required')
    .matches(/^[A-Z0-9]+$/, {
      message: 'PAN can only contain uppercase letters and numbers',
      excludeEmptyString: true,
    })
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number'),

  aadhaarNumber: yup
    .string()
    .trim()
    .required('Aadhaar is required')
    .matches(/^\d+$/, {
      message: 'Aadhaar can only contain numbers',
      excludeEmptyString: true,
    })
    .matches(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
});

export const registerOtpSchema = yup.object({
  otp: yup
    .string()
    .transform((_, originalValue) => normalizeDigitCode(originalValue))
    .required('OTP is required')
    .matches(/^\d+$/, {
      message: 'OTP must contain only numbers',
      excludeEmptyString: true,
    })
    .length(6, 'OTP must be exactly 6 digits'),
});
export const registerPinSchema = yup.object({
  pin: yup
    .string()
    .transform((_, originalValue) => normalizeDigitCode(originalValue))
    .required('PIN is required')
    .matches(/^\d+$/, {
      message: 'PIN must contain only numbers',
      excludeEmptyString: true,
    })
    .length(4, 'PIN must be exactly 4 digits'),

  confirmPin: yup
    .string()
    .transform((_, originalValue) => normalizeDigitCode(originalValue))
    .required('Confirm PIN is required')
    .oneOf([yup.ref('pin')], 'PINs must match'),
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
