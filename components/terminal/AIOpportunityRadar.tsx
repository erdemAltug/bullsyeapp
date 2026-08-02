import { Pressable, Text, View } from 'react-native';
import { ChangeBadge } from '@/components/ui/ChangeBadge';
import { PriceText } from '@/components/ui/PriceText';
import { hapticLight } from '@/lib/haptics';
import { aiOpportunityScore } from '@/lib/signals';
import { useAssetSheetStore } from '@/stores/assetSheetStore';
import type { ScannerItem } from '@/types/scanner';

export function AIOpportunityRadar({ items }: { items: ScannerItem[] }) {
  const open = useAssetSheetStore((s) => s.open);

  const ranked = [...items]
    .filter((i) => i.category === 'BIST' || i.category === 'US')
    .map((item) => ({ item, score: aiOpportunityScore(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return (
    <View className="gap-2 px-4">
      {ranked.map((row) => (
        <Pressable
          key={row.item.symbol}
          onPress={() => {
            void hapticLight();
            open(row.item);
          }}
          className="flex-row items-center rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-3"
        >
          <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
            <Text className="font-mono text-sm font-bold text-emerald-400">
              {row.score}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-zinc-100">
              {row.item.displaySymbol}
            </Text>
            <Text className="text-xs text-zinc-500" numberOfLines={1}>
              {row.item.name} · AI Skor {row.score}/100
            </Text>
          </View>
          <View className="items-end">
            <PriceText
              value={row.item.price}
              currency={row.item.currency}
              className="text-sm text-zinc-100"
            />
            <View className="mt-1">
              <ChangeBadge value={row.item.changePercent} />
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
