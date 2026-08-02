import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import {
  computePortfolioHealth,
  usePortfolioStore,
} from '@/stores/portfolioStore';
import { hapticSuccess } from '@/lib/haptics';
import type { AssetClass } from '@/types';

const COLORS = ['#34d399', '#22d3ee', '#fbbf24', '#fb7185', '#a78bfa'];

export default function AuditScreen() {
  const positions = usePortfolioStore((s) => s.positions);
  const add = usePortfolioStore((s) => s.add);
  const [symbol, setSymbol] = useState('THYAO');
  const [qty, setQty] = useState('10');
  const [buy, setBuy] = useState('280');

  const health = useMemo(() => computePortfolioHealth(positions), [positions]);

  const slices = useMemo(() => {
    const totals = new Map<AssetClass, number>();
    for (const p of positions) {
      const v = p.buyPrice * p.quantity;
      totals.set(p.assetClass, (totals.get(p.assetClass) ?? 0) + v);
    }
    const sum = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
    return [...totals.entries()].map(([cls, v], i) => ({
      cls,
      pct: v / sum,
      color: COLORS[i % COLORS.length],
    }));
  }, [positions]);

  return (
    <ScrollView className="flex-1 bg-zinc-950" contentContainerStyle={{ padding: 16 }}>
      <View className="items-center rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <Text className="self-start text-sm font-semibold text-zinc-100">
          Portföy Sağlığı
        </Text>
        <View className="mt-4">
          <PieChart slices={slices} score={health.score} />
        </View>
        <Text className="mt-2 text-sm font-medium text-emerald-400">{health.label}</Text>
        {health.findings.map((f) => (
          <Text key={f} className="mt-2 self-start text-xs leading-5 text-zinc-400">
            • {f}
          </Text>
        ))}
      </View>

      <View className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <Text className="text-sm font-semibold text-zinc-100">Hızlı Pozisyon Ekle</Text>
        <TextInput
          value={symbol}
          onChangeText={setSymbol}
          autoCapitalize="characters"
          placeholder="Sembol"
          placeholderTextColor="#52525b"
          className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100"
        />
        <View className="mt-2 flex-row gap-2">
          <TextInput
            value={qty}
            onChangeText={setQty}
            keyboardType="decimal-pad"
            placeholder="Adet"
            placeholderTextColor="#52525b"
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100"
          />
          <TextInput
            value={buy}
            onChangeText={setBuy}
            keyboardType="decimal-pad"
            placeholder="Alış"
            placeholderTextColor="#52525b"
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100"
          />
        </View>
        <Pressable
          onPress={() => {
            add({
              symbol: symbol.trim().toUpperCase(),
              name: symbol.trim().toUpperCase(),
              assetClass: 'bist',
              buyPrice: Number(buy) || 0,
              quantity: Number(qty) || 0,
              date: new Date().toISOString().slice(0, 10),
              currency: 'TRY',
            });
            void hapticSuccess();
          }}
          className="mt-3 items-center rounded-xl bg-emerald-500 py-2.5"
        >
          <Text className="text-sm font-semibold text-zinc-950">Ekle</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function PieChart({
  slices,
  score,
}: {
  slices: { cls: string; pct: number; color: string }[];
  score: number;
}) {
  const size = 160;
  const r = 58;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const data =
    slices.length > 0
      ? slices
      : [{ cls: 'empty', pct: 1, color: '#27272a' }];

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          {data.map((s) => {
            const len = s.pct * c;
            const el = (
              <Circle
                key={s.cls}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={s.color}
                strokeWidth={18}
                fill="transparent"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </G>
      </Svg>
      <View className="absolute items-center">
        <Text className="font-mono text-2xl font-bold text-zinc-50">{score}</Text>
        <Text className="text-[10px] text-zinc-500">/100</Text>
      </View>
    </View>
  );
}
