/**
 * FinLoan Currency Formatter
 * Formats monetary amounts in Kenya Shillings (KES / KSh).
 */

export const formatKES = (amount: number): string => {
  return `KES ${Number(amount || 0).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatCompactKES = (amount: number): string => {
  const num = Number(amount || 0);
  if (num >= 1_000_000) {
    return `KES ${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `KES ${(num / 1_000).toFixed(1)}K`;
  }
  return `KES ${num.toLocaleString()}`;
};
