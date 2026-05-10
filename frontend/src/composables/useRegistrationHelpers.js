// ============================================
// REGISTRATION FORM HELPERS
// ============================================
export const isValidUsername = (username) => Boolean(username && username.length >= 3);

export const isValidPassword = (password) => Boolean(password && password.length >= 8);

export const isValidPan = (panNumber) =>
  /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(
    String(panNumber || '')
      .toUpperCase()
      .trim()
  );

export const normalizeAadhaar = (aadhaarNumber) =>
  String(aadhaarNumber || '')
    .replace(/\s|-/g, '')
    .trim();

export const isValidAadhaar = (aadhaarNumber) => /^\d{12}$/.test(normalizeAadhaar(aadhaarNumber));

export const isValidPin = (pin) => /^\d{4}$/.test(String(pin || '').trim());

export const hasRequiredAddress = (address) =>
  Boolean(address?.line1 && address?.city && address?.state && address?.country);

export default function useRegistrationHelpers() {
  return {
    isValidUsername,
    isValidPassword,
    isValidPan,
    normalizeAadhaar,
    isValidAadhaar,
    isValidPin,
    hasRequiredAddress,
  };
}
