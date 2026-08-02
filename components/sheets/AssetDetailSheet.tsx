import { useEffect } from 'react';
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
import { formatPrice } from '@/lib/format';
import { hapticLight, hapticSuccess } from '@/lib/haptics';
import { aiOpportunityScore } from '@/lib/signals';
import { useAlertsStore } from '@/stores/alertsStore';
import { useAssetSheetStore } from '@/stores/assetSheetStore';
import { useWatchlistStore } from '@/stores/watchlistStore';

export function AssetDetailSheet() {
  const asset = useAssetSheetStore((s) => s.asset);
  const close = useAssetSheetStore((s) => s.close);
  const addWatch = useWatchlistStore((s) => s.add);
  const hasWatch = useWatchlistStore((s) => s.has);
  const addAlert = useAlertsStore((s) => s.add);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (asset) void hapticLight();
  }, [asset]);

  const score = asset ? aiOpportunityScore(asset) : 0;
  const watched = asset ? hasWatch(asset.symbol) : false;

  return (
    <Modal
      visible={!!asset}
      transparent
      animationType="slide"
      onRequestClose={close}
      statusBarTranslucent
    >
      <Pressable className="flex-1 justify-end bg-black/55" onPress={close}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="max-h-[85%] rounded-t-3xl border border-zinc-800 bg-zinc-900"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="items-center py-3">
            <View className="h-1 w-10 rounded-full bg-zinc-600" />
          </View>
          {asset ? (
            <ScrollView
              className="px-4"
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xl font-bold text-zinc-50">
                    {asset.displaySymbol}
                  </Text>
                  <Text className="mt-1 text-sm text-zinc-500">{asset.name}</Text>
                </View>
                <View className="items-end">
                  <PriceText
                    value={asset.price}
                    currency={asset.currency}
                    className="text-xl text-zinc-50"
                  />
                  <View className="mt-1">
                    <ChangeBadge value={asset.changePercent} />
                  </View>
                </View>
              </View>

              <View className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <Text className="text-xs font-medium text-emerald-400">
                  AI Mikro İnceleme
                </Text>
                <Text className="mt-1 text-sm leading-5 text-zinc-200">
                  Skor {score}/100 · {asset.category} · Hacim {asset.volume}.{' '}
                  {asset.changePercent >= 0
                    ? 'Kısa vadeli momentum pozitif; seviye ve hacim teyidi önerilir.'
                    : 'Baskı altında; destek ve risk yönetimi öncelikli.'}
                </Text>
              </View>

              <View className="mt-4 flex-row flex-wrap gap-2">
                <Stat
                  label="Gün Yüksek"
                  value={
                    asset.dayHigh != null
                      ? formatPrice(asset.dayHigh, asset.currency)
                      : '—'
                  }
                />
                <Stat
                  label="Gün Düşük"
                  value={
                    asset.dayLow != null
                      ? formatPrice(asset.dayLow, asset.currency)
                      : '—'
                  }
                />
                <Stat
                  label="F/K"
                  value={
                    asset.trailingPE != null
                      ? asset.trailingPE.toFixed(1)
                      : '—'
                  }
                />
                <Stat label="Piyasa" value={asset.market} />
              </View>

              <View className="mb-2 mt-5 flex-row gap-3">
                <Pressable
                  onPress={() => {
                    addAlert({
                      symbol: asset.symbol,
                      displaySymbol: asset.displaySymbol,
                      kind: 'price_above',
                      threshold: asset.price * 1.02,
                    });
                    void hapticSuccess();
                  }}
                  className="flex-1 items-center rounded-xl border border-zinc-700 bg-zinc-950 py-3 active:opacity-80"
                >
                  <Text className="text-sm font-semibold text-zinc-100">
                    🔔 Alarm Kur
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (!watched) {
                      addWatch(asset);
                      void hapticSuccess();
                    }
                  }}
                  className="flex-1 items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3 active:opacity-80"
                >
                  <Text className="text-sm font-semibold text-emerald-400">
                    {watched ? '⭐️ Listede' : '⭐️ İzleme Listesine Ekle'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-w-[46%] flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5">
      <Text className="text-[10px] uppercase tracking-wide text-zinc-500">
        {label}
      </Text>
      <Text className="mt-1 font-mono text-sm text-zinc-100">{value}</Text>
    </View>
  );
}
