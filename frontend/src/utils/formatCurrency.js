/**
 * Format a number as PKR currency
 * @param {number} amount
 * @param {string} currency - defaults to PKR
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'PKR') => {
  if (amount === null || amount === undefined) return '—';
  const num = Number(amount);
  if (isNaN(num)) return '—';

  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Format a number with commas (no currency symbol)
 * @param {number} amount
 * @returns {string}
 */
export const formatNumber = (amount) => {
  if (amount === null || amount === undefined) return '0';
  return new Intl.NumberFormat('en-PK').format(Number(amount));
};
