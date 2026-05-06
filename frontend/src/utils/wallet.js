export const formatCurrency = (value, locale = 'en-US', currency = 'USD') => new Intl.NumberFormat(locale, {
  style: 'currency',
  currency,
  maximumFractionDigits: 2,
}).format(Number(value || 0));

export const maskAccountNumber = (accountNumber) => {
  const last4 = String(accountNumber || '').slice(-4);
  return `XXXXXX${last4}`;
};

export const getTransferAmountLabel = (value) => formatCurrency(value);