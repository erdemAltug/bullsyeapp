import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChangeBadge } from '@/components/ui/ChangeBadge';
import { PriceText } from '@/components/ui/PriceText';
import { hapticSelection, hapticSuccess } from '@/lib/haptics';
import { generateRealTimeSignals, aiOpportunityScore } from '@/lib/signals';
import { useAlertsStore } from '@/stores/alertsStore';
import { useAssetSheetStore } from '@/stores/assetSheetStore';
import type { ScannerItem } from '@/types/scanner';

const HABIT_KEY = 'bullsye:habit-cue-day';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function wasRitualDismissedToday(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(HABIT_KEY)) === todayKey();
  } catch {
    return false;
  }
}

export async function dismissRitualForToday(): Promise<void> {
  try {
    await AsyncStorage.setItem(HABIT_KEY, todayKey());
  } catch {
    /* ignore */
  }
}

type Step = 0 | 1 | 2 | 3;

const STEPS = [
  { title: 'Piyasa Genişliği', hint: 'Yükselen / toplam oran' },
  { title: 'Fırsat Masası', hint: 'En yüksek AI skorlu 3 varlık' },
  { title: 'Öncelikli Sinyaller', hint: 'Bugünün 3 kartı' },
  { title: 'Alarm Kur', hint: 'Bir fırsat seç, eşiği kaydet' },
] as const;

type Props = {
  visible: boolean;
  onClose: () => void;
  items: ScannerItem[];
  bullishPct: number;
};

export function DailyRitualFlow({
  visible,
  onClose,
  items,
  bullishPct,
}: Props) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>(0);
  const openAsset = useAssetSheetStore((s) => s.open);
  const addAlert = useAlertsStore((s) => s.add);

  useEffect(() => {
    if (visible) setStep(0);
  }, [visible]);

  const topOpps = useMemo(
    () =>
      [...items]
        .filter((i) => i.category === 'BIST' || i.category === 'US')
        .map((item) => ({ item, score: aiOpportunityScore(item) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    [items]
  );

  const topSignals = useMemo(
    () => generateRealTimeSignals(items).slice(0, 3),
    [items]
  );

  const pick = topOpps[0]?.item ?? null;

  function next() {
    void hapticSelection();
    if (step < 3) setStep((s) => (s + 1) as Step);
  }

  function back() {
    void hapticSelection();
    if (step > 0) setStep((s) => (s - 1) as Step);
  }

  async function finish(setAlarm: boolean) {
    if (setAlarm && pick) {
      addAlert({
        symbol: pick.symbol,
        displaySymbol: pick.displaySymbol,
        kind: 'price_above',
        threshold: pick.price * 1.02,
      });
      void hapticSuccess();
    } else {
      void hapticSelection();
    }
    await dismissRitualForToday();
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end bg-black/60">
        <Pressable className="flex-1" onPress={onClose} />
        <View
          className="max-h-[88%] rounded-t-3xl border border-zinc-800 bg-zinc-950"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="items-center pt-3">
            <View className="h-1 w-10 rounded-full bg-zinc-600" />
          </View>

          <View className="border-b border-zinc-800 px-5 py-4">
            <Text className="text-[11px] font-medium uppercase tracking-wider text-emerald-400/80">
              Günlük Ritüel · Adım {step + 1}/4
            </Text>
            <Text className="mt-1 text-lg font-semibold text-zinc-50">
              {STEPS[step].title}
            </Text>
            <Text className="mt-0.5 text-xs text-zinc-500">{STEPS[step].hint}</Text>
            <View className="mt-3 flex-row gap-1.5">
              {STEPS.map((_, i) => (
                <View
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i <= step ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                />
              ))}
            </View>
          </View>

          <ScrollView
            className="px-5"
            contentContainerStyle={{ paddingVertical: 16, gap: 10 }}
          >
            {step === 0 ? (
              <View className="items-center rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-8">
                <Text className="font-mono text-4xl font-bold text-emerald-400">
                  %{bullishPct.toFixed(0)}
                </Text>
                <Text className="mt-2 text-sm text-zinc-300">Yükseliş oranı</Text>
                <Text className="mt-3 text-center text-xs leading-5 text-zinc-500">
                  BİST taramasında yükselen oranı. Daralan genişlikte riski küçült;
                  genişleyen piyasada fırsat kartlarına odaklan.
                </Text>
              </View>
            ) : null}

            {step === 1
              ? topOpps.map((row) => (
                  <Pressable
                    key={row.item.symbol}
                    onPress={() => {
                      void hapticSelection();
                      openAsset(row.item);
                    }}
                    className="flex-row items-center rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-3"
                  >
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Text className="font-mono text-sm font-bold text-emerald-400">
                        {row.score}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-zinc-100">
                        {row.item.displaySymbol}
                      </Text>
                      <Text className="text-xs text-zinc-500" numberOfLines={1}>
                        {row.item.name}
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
                ))
              : null}

            {step === 1 && !topOpps.length ? (
              <Text className="text-center text-sm text-zinc-500">
                Şu an fırsat kartı yok — birazdan yenile.
              </Text>
            ) : null}

            {step === 2
              ? topSignals.map((s) => (
                  <View
                    key={s.id}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-3"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-bold text-zinc-50">
                        {s.displaySymbol}
                      </Text>
                      <Text className="text-xs font-bold text-emerald-400">
                        {s.signalType === 'STRONG_BUY'
                          ? 'Güçlü Al'
                          : s.signalType === 'BUY'
                            ? 'Al'
                            : 'Sat'}
                      </Text>
                    </View>
                    <Text className="mt-1 text-xs text-zinc-400">
                      {s.strategyName}
                    </Text>
                    <Text className="mt-2 font-mono text-xs text-zinc-300">
                      Giriş {s.entryPrice.toFixed(2)} · SL {s.stopLoss.toFixed(2)} ·
                      TP {s.targetPrice.toFixed(2)}
                    </Text>
                  </View>
                ))
              : null}

            {step === 2 && !topSignals.length ? (
              <Text className="text-center text-sm text-zinc-500">
                Aktif sinyal yok — fırsat skorlarına bakmaya devam et.
              </Text>
            ) : null}

            {step === 3 ? (
              <View className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                {pick ? (
                  <>
                    <Text className="text-sm text-zinc-400">Öneri</Text>
                    <Text className="mt-1 text-xl font-bold text-zinc-50">
                      {pick.displaySymbol}
                    </Text>
                    <Text className="mt-1 text-xs text-zinc-500">{pick.name}</Text>
                    <Text className="mt-3 font-mono text-sm text-emerald-400">
                      Alarm eşiği: %{(2).toFixed(0)} üstü (
                      {(pick.price * 1.02).toFixed(2)})
                    </Text>
                    <Text className="mt-3 text-xs leading-5 text-zinc-500">
                      Yarın aynı alışkanlık seni geri getirir: Genişlik → Fırsat
                      Masası → 3 kart → alarm.
                    </Text>
                  </>
                ) : (
                  <Text className="text-sm text-zinc-500">
                    Alarm için uygun varlık bulunamadı.
                  </Text>
                )}
              </View>
            ) : null}
          </ScrollView>

          <View className="flex-row gap-2 border-t border-zinc-800 px-5 pt-3">
            {step > 0 ? (
              <Pressable
                onPress={back}
                className="items-center rounded-xl border border-zinc-700 px-4 py-3"
              >
                <Text className="text-sm font-medium text-zinc-300">Geri</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => void finish(false)}
                className="items-center rounded-xl border border-zinc-700 px-4 py-3"
              >
                <Text className="text-sm font-medium text-zinc-500">Gizle</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                if (step < 3) next();
                else void finish(Boolean(pick));
              }}
              className="flex-1 items-center rounded-xl bg-emerald-500 py-3"
            >
              <Text className="text-sm font-bold text-zinc-950">
                {step < 3
                  ? 'Devam'
                  : pick
                    ? 'Alarmı Kur & Bitir'
                    : 'Bitir'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
