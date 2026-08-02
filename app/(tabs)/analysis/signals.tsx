import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useMarket, useMarketSignals, usePullToRefresh } from '@/hooks/useMarket';
import { formatPrice } from '@/lib/format';
import { hapticLight } from '@/lib/haptics';
import { generateRealTimeSignals, type SignalCardData } from '@/lib/signals';
import { useAssetSheetStore } from '@/stores/assetSheetStore';

function signalColor(type: SignalCardData['signalType']) {
  if (type === 'STRONG_BUY') return 'text-emerald-300';
  if (type === 'BUY') return 'text-emerald-400';
  return 'text-rose-400';
}

function signalLabel(type: SignalCardData['signalType']) {
  if (type === 'STRONG_BUY') return 'Güçlü Al';
  if (type === 'BUY') return 'Al';
  return 'Sat';
}

function signalBg(type: SignalCardData['signalType']) {
  if (type === 'SELL') return 'bg-rose-500/10 border-rose-500/20';
  return 'bg-emerald-500/10 border-emerald-500/20';
}

export default function SignalsScreen() {
  const market = useMarket();
  const tech = useMarketSignals();
  const open = useAssetSheetStore((s) => s.open);
  const { refreshing, onRefresh } = usePullToRefresh([['market'], ['signals']]);

  const cards = useMemo(
    () => generateRealTimeSignals(market.data?.items ?? []),
    [market.data?.items]
  );

  return (
    <FlatList
      className="flex-1 bg-zinc-950"
      data={cards}
      keyExtractor={(c) => c.id}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#34d399" />
      }
      ListHeaderComponent={
        <View className="mb-2">
          <Text className="text-xs text-zinc-500">
            Canlı bant sinyalleri + teknik feed
            {tech.data?.length ? ` · ${tech.data.length} teknik` : ''}
          </Text>
        </View>
      }
      ListEmptyComponent={
        market.isLoading ? (
          <ActivityIndicator color="#34d399" className="mt-10" />
        ) : (
          <Text className="mt-10 text-center text-sm text-zinc-500">
            Aktif sinyal yok
          </Text>
        )
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            void hapticLight();
            const hit = market.data?.items.find((i) => i.symbol === item.symbol);
            if (hit) open(hit);
          }}
          className={`rounded-2xl border p-3 ${signalBg(item.signalType)}`}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-zinc-50">
              {item.displaySymbol}
            </Text>
            <Text className={`text-xs font-bold ${signalColor(item.signalType)}`}>
              {signalLabel(item.signalType)}
            </Text>
          </View>
          <Text className="mt-1 text-xs text-zinc-400">{item.strategyName}</Text>
          <View className="mt-3 flex-row justify-between">
            <Meta label="Giriş" value={formatPrice(item.entryPrice)} />
            <Meta label="SL" value={formatPrice(item.stopLoss)} />
            <Meta label="TP" value={formatPrice(item.targetPrice)} />
            <Meta label="Güven" value={`${item.confidenceScore}`} />
          </View>
        </Pressable>
      )}
    />
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-[10px] text-zinc-500">{label}</Text>
      <Text className="mt-0.5 font-mono text-xs text-zinc-200">{value}</Text>
    </View>
  );
}
