// ===================================
// IMPORTS
// ===================================

import { computed } from 'vue';

import { useRoute } from 'vue-router';

// ===================================
// REGISTER STEPS
// ===================================

const REGISTER_STEPS = [
  'RegisterEmail',
  'RegisterBasic',
  'RegisterAddress',
  'RegisterUsername',
  'RegisterKYC',
  'RegisterOTP',
  'RegisterPIN',
];

// ===================================
// REGISTER STEP TITLES
// ===================================

const REGISTER_STEP_TITLES = {
  RegisterEmail: 'Enter Your Email',

  RegisterBasic: 'Basic Details',

  RegisterAddress: 'Address Details',

  RegisterUsername: 'Choose Username',

  RegisterKYC: 'KYC Details',

  RegisterOTP: 'Enter OTP',

  RegisterPIN: 'Set a PIN',
};

// ===================================
// COMPOSABLE
// ===================================

export function useRegisterStepper() {
  // ===================================
  // ROUTE
  // ===================================

  const route = useRoute();

  // ===================================
  // CURRENT INDEX
  // ===================================

  const currentIndex = computed(() => {
    const name = route.name || '';

    const index = REGISTER_STEPS.indexOf(name.toString());

    return index >= 0 ? index : 0;
  });

  // ===================================
  // PROGRESS WIDTH
  // ===================================

  const progressWidth = computed(() => {
    return (currentIndex.value / (REGISTER_STEPS.length - 1)) * 100 + '%';
  });

  // ===================================
  // PROGRESS PERCENTAGE
  // ===================================

  const progressPercentage = computed(() => {
    return Math.round((currentIndex.value / (REGISTER_STEPS.length - 1)) * 100);
  });

  // ===================================
  // CURRENT STEP NAME
  // ===================================

  const currentStepName = computed(() => {
    return route.name ? route.name.toString().replace('Register', '') : 'Email';
  });

  // ===================================
  // CURRENT TITLE
  // ===================================

  const currentTitle = computed(() => {
    return REGISTER_STEP_TITLES[route.name] || 'Setup Account';
  });

  return {
    route,
    currentIndex,
    progressWidth,
    progressPercentage,
    currentStepName,
    currentTitle,
    steps: REGISTER_STEPS,
  };
}

export default useRegisterStepper;
