import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { AIOpportunityRadar } from '@/components/terminal/AIOpportunityRadar';
import { CommoditiesStrip } from '@/components/terminal/CommoditiesStrip';
import { DailyRitualBanner } from '@/components/terminal/DailyRitualBanner';
import { DailyRitualFlow } from '@/components/terminal/DailyRitualFlow';
import { EconomicAlertBanner } from '@/components/terminal/EconomicAlertBanner';
import {
  computeBreadth,
  MarketWidthMeter,
} from '@/components/terminal/MarketWidthMeter';
import { TickerTape } from '@/components/terminal/TickerTape';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useCalendar, useMarket, usePullToRefresh } from '@/hooks/useMarket';
import { upcomingEvents } from '@/lib/economic-calendar';

export default function TerminalScreen() {
  const market = useMarket();
  const calendar = useCalendar();
  const [ritualOpen, setRitualOpen] = useState(false);
  const { refreshing, onRefresh } = usePullToRefresh([
    ['market'],
    ['calendar'],
  ]);

  const items = market.data?.items ?? [];
  const commodities = market.data?.commodities ?? [];
  const breadth = useMemo(
    () => computeBreadth(items.filter((i) => i.category === 'BIST')),
    [items]
  );

  const nextAlert = useMemo(() => {
    const soon = upcomingEvents(calendar.data?.events ?? [], 48);
    return soon[0] ?? null;
  }, [calendar.data?.events]);

  if (market.isLoading && !market.data) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-950">
        <ActivityIndicator color="#34d399" />
        <Text className="mt-3 text-xs text-zinc-500">
          Canlı piyasa yükleniyor…
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-zinc-950"
        contentContainerStyle={{ paddingBottom: 32 }}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#34d399"
          />
        }
      >
        <TickerTape items={items} commodities={commodities} />
        <EconomicAlertBanner event={nextAlert} />
        <DailyRitualBanner onStart={() => setRitualOpen(true)} />

        <View className="mt-5">
          <SectionHeader
            title="Emtialar"
            subtitle="Canlı gram altın, gümüş, Brent"
          />
          <CommoditiesStrip items={commodities} />
        </View>

        <View className="mt-6">
          <SectionHeader
            title="Günün Radarı / Alım Fırsatları"
            subtitle="Skor, değerleme ve gün içi bant — anlık sıralama"
          />
          <AIOpportunityRadar items={items} />
        </View>

        <View className="mt-6">
          <MarketWidthMeter bullishPct={breadth} />
          {market.error ? (
            <Text className="mt-3 px-4 text-center text-xs text-rose-400">
              Piyasa verisi alınamadı. Aşağı çekerek yenileyin.
            </Text>
          ) : null}
        </View>
      </ScrollView>

      <DailyRitualFlow
        visible={ritualOpen}
        onClose={() => setRitualOpen(false)}
        items={items}
        bullishPct={breadth}
      />
    </>
  );
}
