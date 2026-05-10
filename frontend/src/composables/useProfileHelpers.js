// ============================================
// PROFILE HELPERS
// ============================================
export const formatAddress = (address) => {
  if (!address) {
    return 'Not available';
  }

  const parts = [
    address.line1,
    address.city,
    address.state,
    address.country,
    address.pincode,
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Not available';
};

export default function useProfileHelpers() {
  return { formatAddress };
}
