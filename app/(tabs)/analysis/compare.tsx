import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useCompare, usePullToRefresh } from '@/hooks/useMarket';
import { formatPct, formatPrice } from '@/lib/format';
import { hapticSelection } from '@/lib/haptics';

const PRESETS = [
  ['THYAO.IS', 'PGSUS.IS'],
  ['GARAN.IS', 'AKBNK.IS'],
  ['AAPL', 'MSFT'],
];

export default function CompareScreen() {
  const [a, setA] = useState('THYAO.IS');
  const [b, setB] = useState('PGSUS.IS');
  const symbols = `${a.trim()},${b.trim()}`;
  const compare = useCompare(symbols);
  const { refreshing, onRefresh } = usePullToRefresh([['compare', symbols]]);

  const rows = useMemo(() => {
    const items = compare.data ?? [];
    if (items.length < 2) return [];
    const [left, right] = items;
    return [
      { label: 'Fiyat', l: formatPrice(left.price, 'TRY'), r: formatPrice(right.price, 'TRY') },
      { label: 'F/K', l: fmt(left.trailingPE), r: fmt(right.trailingPE) },
      { label: 'PD/DD', l: fmt(left.priceToBook), r: fmt(right.priceToBook) },
      {
        label: 'Yıllık Getiri',
        l: left.yearReturn != null ? formatPct(left.yearReturn) : '—',
        r: right.yearReturn != null ? formatPct(right.yearReturn) : '—',
      },
      { label: 'Beta', l: fmt(left.beta), r: fmt(right.beta) },
      {
        label: 'Temettü',
        l: left.dividendYield != null ? formatPct(left.dividendYield * 100) : '—',
        r: right.dividendYield != null ? formatPct(right.dividendYield * 100) : '—',
      },
    ];
  }, [compare.data]);

  return (
    <ScrollView
      className="flex-1 bg-zinc-950"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#34d399" />
      }
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-row gap-3 px-4 pt-3">
        <TextInput
          value={a}
          onChangeText={setA}
          autoCapitalize="characters"
          placeholder="Sembol A"
          placeholderTextColor="#52525b"
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 font-mono text-sm text-zinc-100"
        />
        <TextInput
          value={b}
          onChangeText={setB}
          autoCapitalize="characters"
          placeholder="Sembol B"
          placeholderTextColor="#52525b"
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 font-mono text-sm text-zinc-100"
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 px-4">
        {PRESETS.map(([x, y]) => (
          <Pressable
            key={`${x}-${y}`}
            onPress={() => {
              void hapticSelection();
              setA(x);
              setB(y);
            }}
            className="mr-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5"
          >
            <Text className="font-mono text-xs text-zinc-300">
              {x.replace('.IS', '')} vs {y.replace('.IS', '')}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {compare.isLoading ? (
        <ActivityIndicator color="#34d399" className="mt-10" />
      ) : rows.length ? (
        <View className="mx-4 mt-4 overflow-hidden rounded-2xl border border-zinc-800">
          <View className="flex-row border-b border-zinc-800 bg-zinc-900 px-3 py-2.5">
            <Text className="w-28 text-xs text-zinc-500">Metrik</Text>
            <Text className="flex-1 text-center font-mono text-xs text-emerald-400">
              {(compare.data?.[0]?.symbol ?? a).replace('.IS', '')}
            </Text>
            <Text className="flex-1 text-center font-mono text-xs text-sky-400">
              {(compare.data?.[1]?.symbol ?? b).replace('.IS', '')}
            </Text>
          </View>
          {rows.map((row) => (
            <View
              key={row.label}
              className="flex-row border-b border-zinc-800/80 px-3 py-3"
            >
              <Text className="w-28 text-xs text-zinc-400">{row.label}</Text>
              <Text className="flex-1 text-center font-mono text-xs text-zinc-100">
                {row.l}
              </Text>
              <Text className="flex-1 text-center font-mono text-xs text-zinc-100">
                {row.r}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text className="mt-10 px-4 text-center text-sm text-zinc-500">
          Karşılaştırma verisi yok. Sembolleri kontrol edin.
        </Text>
      )}
      <View className="h-10" />
    </ScrollView>
  );
}

function fmt(v: number | null | undefined) {
  return v == null || !Number.isFinite(v) ? '—' : v.toFixed(2);
}
