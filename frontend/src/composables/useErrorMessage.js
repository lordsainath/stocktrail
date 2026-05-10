// ============================================
// ERROR MESSAGE HELPER
// ============================================
export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return error?.response?.data?.message || error?.message || fallback;
}

export default function useErrorMessage() {
  return { getErrorMessage };
}
