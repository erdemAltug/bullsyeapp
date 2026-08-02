import { Text, View } from 'react-native';
import { formatPct } from '@/lib/format';

export function ChangeBadge({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <View
      className={`rounded-md px-2 py-1 ${up ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}
    >
      <Text
        className={`font-mono text-xs font-semibold ${up ? 'text-emerald-400' : 'text-rose-400'}`}
      >
        {formatPct(value)}
      </Text>
    </View>
  );
}
