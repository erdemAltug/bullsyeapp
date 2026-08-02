import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { hapticLight } from '@/lib/haptics';

type HeatCell = {
  symbol: string;
  name: string;
  changePercent: number;
  price: number;
};

function cellColor(chg: number): string {
  if (chg >= 3) return '#059669';
  if (chg >= 1) return '#10b981';
  if (chg >= 0) return '#065f46';
  if (chg > -1) return '#7f1d1d';
  if (chg > -3) return '#e11d48';
  return '#be123c';
}

export function HeatmapGrid({
  quotes,
  onPressSymbol,
}: {
  quotes: HeatCell[];
  onPressSymbol?: (symbol: string) => void;
}) {
  const { width } = useWindowDimensions();
  const pad = 32;
  const gap = 4;
  const cols = 4;
  const cellW = (width - pad - gap * (cols - 1)) / cols;

  return (
    <View className="flex-row flex-wrap px-4" style={{ gap }}>
      {quotes.map((q) => (
        <Pressable
          key={q.symbol}
          onPress={() => {
            void hapticLight();
            onPressSymbol?.(q.symbol);
          }}
          style={{
            width: cellW,
            height: cellW * 0.85,
            backgroundColor: cellColor(q.changePercent),
            borderRadius: 8,
            padding: 8,
            justifyContent: 'space-between',
          }}
        >
          <Text className="text-xs font-bold text-white" numberOfLines={1}>
            {q.symbol.replace('.IS', '')}
          </Text>
          <Text className="font-mono text-xs font-semibold text-white">
            {q.changePercent >= 0 ? '+' : ''}
            {q.changePercent.toFixed(2)}%
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
