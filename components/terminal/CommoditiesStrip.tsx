import { Pressable, ScrollView, Text, View } from 'react-native';
import { ChangeBadge } from '@/components/ui/ChangeBadge';
import { PriceText } from '@/components/ui/PriceText';
import { hapticLight } from '@/lib/haptics';
import type { CommodityQuote } from '@/types';

const FOCUS = ['ALTIN', 'GUMUS', 'GUMUS_GR', 'BRENT'];

export function CommoditiesStrip({ items }: { items: CommodityQuote[] }) {
  const data = items.filter((c) => FOCUS.includes(c.symbol)).slice(0, 6);
  if (!data.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
    >
      {data.map((item) => (
        <Pressable
          key={item.symbol}
          onPress={() => void hapticLight()}
          className="w-40 rounded-2xl border border-zinc-800 bg-zinc-900 p-3"
        >
          <Text className="text-xs text-zinc-400">{item.name}</Text>
          <PriceText
            value={item.price}
            currency={item.currency}
            className="mt-2 text-base text-zinc-50"
          />
          {item.unit ? (
            <Text className="mt-0.5 text-[10px] text-zinc-600">{item.unit}</Text>
          ) : null}
          <View className="mt-2 self-start">
            <ChangeBadge value={item.changePercent} />
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}
