import { Pressable, ScrollView, Text, View } from 'react-native';
import { ChangeBadge } from '@/components/ui/ChangeBadge';
import { PriceText } from '@/components/ui/PriceText';
import { formatPrice } from '@/lib/format';
import { hapticLight } from '@/lib/haptics';
import { useAssetSheetStore } from '@/stores/assetSheetStore';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useWatchlistStore } from '@/stores/watchlistStore';

export default function PortfolioScreen() {
  const positions = usePortfolioStore((s) => s.positions);
  const removePos = usePortfolioStore((s) => s.remove);
  const watch = useWatchlistStore((s) => s.items);
  const removeWatch = useWatchlistStore((s) => s.remove);
  const open = useAssetSheetStore((s) => s.open);

  return (
    <ScrollView className="flex-1 bg-zinc-950" contentContainerStyle={{ paddingBottom: 24 }}>
      <Text className="px-4 pb-2 pt-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Portföyüm
      </Text>
      {positions.length === 0 ? (
        <Text className="px-4 text-sm text-zinc-600">Henüz pozisyon yok</Text>
      ) : (
        positions.map((item) => (
          <View
            key={item.id}
            className="mx-4 mb-2 flex-row items-center rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3"
          >
            <View className="flex-1">
              <Text className="text-sm font-semibold text-zinc-100">{item.symbol}</Text>
              <Text className="text-xs text-zinc-500">
                {item.quantity} adet · alış {formatPrice(item.buyPrice)}
              </Text>
            </View>
            <Pressable onPress={() => removePos(item.id)}>
              <Text className="text-xs text-rose-400">Sil</Text>
            </Pressable>
          </View>
        ))
      )}

      <Text className="px-4 pb-2 pt-6 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        İzleme Listesi
      </Text>
      {watch.length === 0 ? (
        <Text className="px-4 text-sm text-zinc-600">İzleme listesi boş</Text>
      ) : (
        watch.map((item) => (
          <Pressable
            key={item.symbol}
            onPress={() => {
              void hapticLight();
              open(item);
            }}
            className="mx-4 mb-2 flex-row items-center rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3"
          >
            <View className="flex-1">
              <Text className="text-sm font-semibold text-zinc-100">
                {item.displaySymbol}
              </Text>
              <Text className="text-xs text-zinc-500" numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            <View className="mr-3 items-end">
              <PriceText
                value={item.price}
                currency={item.currency}
                className="text-sm text-zinc-100"
              />
              <View className="mt-1">
                <ChangeBadge value={item.changePercent} />
              </View>
            </View>
            <Pressable onPress={() => removeWatch(item.symbol)} hitSlop={8}>
              <Text className="text-xs text-rose-400">Çıkar</Text>
            </Pressable>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}
