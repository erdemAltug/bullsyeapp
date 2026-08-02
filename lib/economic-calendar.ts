import type { EconomicEvent } from '@/types';

/** Web `lib/economic-calendar.ts` ile aynı mantık */
export function upcomingEvents(
  events: EconomicEvent[],
  withinHours = 48,
  now = new Date()
): EconomicEvent[] {
  const limit = now.getTime() + withinHours * 3600_000;
  return events
    .filter((e) => {
      const t = Date.parse(e.at);
      if (!Number.isFinite(t)) return false;
      return t >= now.getTime() - 30 * 60_000 && t <= limit;
    })
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}

export function formatCountdown(targetIso: string, now = new Date()): string {
  const t = Date.parse(targetIso);
  if (!Number.isFinite(t)) return '—';
  const diff = t - now.getTime();
  if (diff <= 0) return 'şimdi';
  const h = Math.floor(diff / 3600_000);
  const m = Math.floor((diff % 3600_000) / 60_000);
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `${d}g ${h % 24}s`;
  }
  if (h > 0) return `${h}s ${m}dk`;
  return `${m}dk`;
}
