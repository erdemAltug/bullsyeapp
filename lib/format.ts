export function formatPrice(
  value: number,
  currency: string = 'TRY',
  digits = 2
): string {
  if (!Number.isFinite(value)) return '—';
  const formatted = value.toLocaleString('tr-TR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  if (currency === 'USD') return `$${formatted}`;
  if (currency === 'TRY') return `₺${formatted}`;
  return `${formatted} ${currency}`;
}

export function formatPct(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}%${value.toFixed(digits)}`;
}

export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return Intl.NumberFormat('tr-TR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export { formatCountdown as countdownLabel } from '@/lib/economic-calendar';
