import { Text, View } from 'react-native';
import { formatCountdown } from '@/lib/economic-calendar';
import type { EconomicEvent } from '@/types';

/** Web `CalendarTickerBanner` ile aynı: 48s içindeki sonraki high-impact olay */
export function EconomicAlertBanner({
  event,
}: {
  event: EconomicEvent | null | undefined;
}) {
  if (!event?.title || !event?.at) return null;
  const cd = formatCountdown(event.at);
  if (cd === '—') return null;

  return (
    <View className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5">
      <Text className="text-center text-xs text-amber-200">
        <Text className="font-semibold">⚠ Ekonomik uyarı</Text>
        <Text className="text-amber-500/60"> · </Text>
        {event.title}
        <Text className="text-amber-500/60"> · </Text>
        <Text className="font-medium tabular-nums">{cd}</Text>
      </Text>
    </View>
  );
}
