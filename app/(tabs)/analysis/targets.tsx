import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { usePullToRefresh, useTargets } from '@/hooks/useMarket';
import { formatPct, formatPrice } from '@/lib/format';

export default function TargetsScreen() {
  const targets = useTargets();
  const { refreshing, onRefresh } = usePullToRefresh([['targets']]);

  return (
    <FlatList
      className="flex-1 bg-zinc-950"
      data={targets.data ?? []}
      keyExtractor={(t, i) => `${t.symbol}-${i}`}
      contentContainerStyle={{ paddingVertical: 8 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#34d399" />
      }
      ListEmptyComponent={
        targets.isLoading ? (
          <ActivityIndicator color="#34d399" className="mt-10" />
        ) : (
          <Text className="mt-10 text-center text-sm text-zinc-500">
            Hedef fiyat verisi yok
          </Text>
        )
      }
      renderItem={({ item }) => (
        <View className="mx-4 mb-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-3">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-semibold text-zinc-100">
                {item.displaySymbol || item.symbol}
              </Text>
              <Text className="text-xs text-zinc-500">{item.name}</Text>
            </View>
            <View className="items-end">
              <Text className="font-mono text-sm text-zinc-100">
                {formatPrice(item.price)}
              </Text>
              {item.upsidePct != null ? (
                <Text
                  className={`mt-1 font-mono text-xs ${
                    item.upsidePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatPct(item.upsidePct)} potansiyel
                </Text>
              ) : null}
            </View>
          </View>
          <View className="mt-3 flex-row justify-between">
            <Text className="text-xs text-zinc-500">
              Hedef:{' '}
              <Text className="font-mono text-zinc-200">
                {item.targetMean != null ? formatPrice(item.targetMean) : '—'}
              </Text>
            </Text>
            <Text className="text-xs capitalize text-emerald-400/90">
              {item.recommendationKey ?? '—'}
            </Text>
          </View>
        </View>
      )}
    />
  );
}
