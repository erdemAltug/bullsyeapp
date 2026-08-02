import { Pressable, Text, View } from 'react-native';
import { ChangeBadge } from '@/components/ui/ChangeBadge';
import { PriceText } from '@/components/ui/PriceText';
import { hapticLight } from '@/lib/haptics';
import { aiOpportunityScore } from '@/lib/signals';
import { useAssetSheetStore } from '@/stores/assetSheetStore';
import type { ScannerItem } from '@/types/scanner';

type Props = {
  item: ScannerItem;
  showAiScore?: boolean;
};

export function AssetRow({ item, showAiScore = false }: Props) {
  const open = useAssetSheetStore((s) => s.open);
  const score = showAiScore ? aiOpportunityScore(item) : null;

  return (
    <Pressable
      onPress={() => {
        void hapticLight();
        open(item);
      }}
      className="flex-row items-center border-b border-zinc-800/80 px-4 py-3 active:bg-zinc-900"
    >
      <View className="flex-1 pr-3">
        <Text className="text-sm font-semibold text-zinc-100">
          {item.displaySymbol}
        </Text>
        <Text className="mt-0.5 text-xs text-zinc-500" numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      {score != null ? (
        <View className="mr-3 rounded-md bg-emerald-500/10 px-2 py-1">
          <Text className="font-mono text-xs font-semibold text-emerald-400">
            {score}/100
          </Text>
        </View>
      ) : null}
      <View className="items-end">
        <PriceText value={item.price} currency={item.currency} className="text-sm text-zinc-100" />
        <View className="mt-1">
          <ChangeBadge value={item.changePercent} />
        </View>
      </View>
    </Pressable>
  );
}
