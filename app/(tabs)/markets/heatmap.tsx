import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { HeatmapGrid } from '@/components/market/HeatmapGrid';
import { useHeatmap, useMarket, usePullToRefresh } from '@/hooks/useMarket';
import { useAssetSheetStore } from '@/stores/assetSheetStore';

export default function HeatmapScreen() {
  const heatmap = useHeatmap();
  const market = useMarket();
  const open = useAssetSheetStore((s) => s.open);
  const { refreshing, onRefresh } = usePullToRefresh([['heatmap'], ['market']]);

  const quotes = heatmap.data ?? [];

  return (
    <ScrollView
      className="flex-1 bg-zinc-950"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#34d399"
        />
      }
    >
      <Text className="px-4 pb-3 pt-2 text-xs text-zinc-500">
        BİST30 ısı haritası — yeşil yükseliş, kırmızı düşüş
      </Text>
      {heatmap.isLoading && !quotes.length ? (
        <ActivityIndicator color="#34d399" className="mt-10" />
      ) : (
        <HeatmapGrid
          quotes={quotes}
          onPressSymbol={(symbol) => {
            const hit = market.data?.items.find(
              (i) => i.symbol === symbol || i.displaySymbol === symbol.replace('.IS', '')
            );
            if (hit) open(hit);
          }}
        />
      )}
      <View className="h-10" />
    </ScrollView>
  );
}
