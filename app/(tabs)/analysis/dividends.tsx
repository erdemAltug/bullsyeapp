import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useDividends, usePullToRefresh } from '@/hooks/useMarket';
import { formatPct, formatPrice } from '@/lib/format';

export default function DividendsScreen() {
  const dividends = useDividends();
  const { refreshing, onRefresh } = usePullToRefresh([['dividends']]);
  const [shares, setShares] = useState('100');
  const [yieldPct, setYieldPct] = useState('4.5');
  const [price, setPrice] = useState('100');

  const calc = useMemo(() => {
    const s = Number(shares) || 0;
    const y = Number(yieldPct) || 0;
    const p = Number(price) || 0;
    const annual = s * p * (y / 100);
    return { annual, monthly: annual / 12 };
  }, [shares, yieldPct, price]);

  return (
    <FlatList
      className="flex-1 bg-zinc-950"
      data={dividends.data ?? []}
      keyExtractor={(d, i) => `${d.symbol}-${d.exDate}-${i}`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#34d399" />
      }
      ListHeaderComponent={
        <View className="mx-4 mb-4 mt-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <Text className="text-sm font-semibold text-zinc-100">
            Getiri Hesaplayıcı
          </Text>
          <View className="mt-3 gap-2">
            <Field label="Adet" value={shares} onChange={setShares} />
            <Field label="Fiyat" value={price} onChange={setPrice} />
            <Field label="Getiri %" value={yieldPct} onChange={setYieldPct} />
          </View>
          <View className="mt-3 flex-row justify-between">
            <Text className="text-xs text-zinc-500">Yıllık</Text>
            <Text className="font-mono text-sm text-emerald-400">
              {formatPrice(calc.annual)}
            </Text>
          </View>
          <View className="mt-1 flex-row justify-between">
            <Text className="text-xs text-zinc-500">Aylık</Text>
            <Text className="font-mono text-sm text-zinc-200">
              {formatPrice(calc.monthly)}
            </Text>
          </View>
          <Text className="mb-1 mt-5 text-xs font-medium text-zinc-400">
            Temettü Takvimi
          </Text>
        </View>
      }
      ListEmptyComponent={
        dividends.isLoading ? (
          <ActivityIndicator color="#34d399" className="mt-6" />
        ) : (
          <Text className="mt-6 text-center text-sm text-zinc-500">
            Temettü etkinliği yok
          </Text>
        )
      }
      renderItem={({ item }) => (
        <View className="mx-4 mb-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-3">
          <View className="flex-row justify-between">
            <Text className="text-sm font-semibold text-zinc-100">
              {item.symbol} · {item.name}
            </Text>
            <Text className="font-mono text-xs text-emerald-400">
              {formatPct(item.yieldPct)}
            </Text>
          </View>
          <Text className="mt-1 text-xs text-zinc-500">
            Ex: {item.exDate} · Ödeme: {item.payDate}
          </Text>
          <Text className="mt-1 font-mono text-xs text-zinc-300">
            Net {formatPrice(item.netPerShare)} / hisse
          </Text>
        </View>
      )}
    />
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-xs text-zinc-500">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        className="w-28 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-right font-mono text-sm text-zinc-100"
      />
    </View>
  );
}
