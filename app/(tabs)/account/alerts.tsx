import { FlatList, Pressable, Text, View } from 'react-native';
import { useAlertsStore } from '@/stores/alertsStore';
import { formatPrice } from '@/lib/format';

const KIND_LABEL: Record<string, string> = {
  price_above: 'Fiyat üstü',
  price_below: 'Fiyat altı',
  change_above: '% üstü',
  change_below: '% altı',
  rsi_above: 'RSI üstü',
  rsi_below: 'RSI altı',
};

export default function AlertsScreen() {
  const alerts = useAlertsStore((s) => s.alerts);
  const remove = useAlertsStore((s) => s.remove);

  return (
    <FlatList
      className="flex-1 bg-zinc-950"
      data={alerts}
      keyExtractor={(a) => a.id}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      ListHeaderComponent={
        <Text className="mb-2 text-xs text-zinc-500">
          Varlık detay sheet üzerinden 🔔 Alarm Kur ile ekleyin. Push için
          cihaz izni App Store / Play dağıtımında etkinleşir.
        </Text>
      }
      ListEmptyComponent={
        <Text className="mt-10 text-center text-sm text-zinc-500">
          Aktif alarm yok
        </Text>
      }
      renderItem={({ item }) => (
        <View className="rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-zinc-100">
              {item.displaySymbol}
            </Text>
            <Text
              className={`text-[10px] font-semibold ${
                item.triggered ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {item.triggered ? 'Tetiklendi' : 'Aktif'}
            </Text>
          </View>
          <Text className="mt-1 text-xs text-zinc-500">
            {KIND_LABEL[item.kind] ?? item.kind} · eşik{' '}
            <Text className="font-mono text-zinc-300">
              {formatPrice(item.threshold)}
            </Text>
          </Text>
          <Pressable onPress={() => remove(item.id)} className="mt-2 self-end">
            <Text className="text-xs text-rose-400">Kaldır</Text>
          </Pressable>
        </View>
      )}
    />
  );
}
