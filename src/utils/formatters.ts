// Currency and number formatting helper functions for FC and USD

export function formatFC(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 FC';
  try {
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0,
    }).format(Math.round(amount)) + ' FC';
  } catch {
    return Math.round(amount).toLocaleString() + ' FC';
  }
}

export function formatUSD(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return '$' + Number(amount).toFixed(2);
  }
}

export function parseFormattedNumber(val: string | number): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const sanitized = String(val).replace(/\s/g, '').replace(',', '.');
  const num = parseFloat(sanitized);
  return isNaN(num) ? 0 : num;
}

