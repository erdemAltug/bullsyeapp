import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { AssetRow } from '@/components/market/AssetRow';
import {
  MarketTopTabs,
  type MarketTabKey,
} from '@/components/market/MarketTopTabs';
import { SortModal, type SortKey } from '@/components/market/SortModal';
import { SearchBar } from '@/components/ui/SearchBar';
import { useBistBoard, useFxRates, useMarket, usePullToRefresh } from '@/hooks/useMarket';
import { hapticSelection } from '@/lib/haptics';
import type { ScannerItem } from '@/types/scanner';
import type { FxRate } from '@/types';
import { formatPrice, formatPct } from '@/lib/format';

function filterByTab(items: ScannerItem[], tab: MarketTabKey): ScannerItem[] {
  switch (tab) {
    case 'BIST':
      return items.filter((i) => i.category === 'BIST');
    case 'US':
      return items.filter((i) => i.category === 'US');
    case 'FON_ETF':
      return items.filter((i) => i.category === 'FON' || i.category === 'ETF');
    case 'CRYPTO':
      return items.filter((i) => i.category === 'CRYPTO');
    default:
      return [];
  }
}

function sortItems(items: ScannerItem[], key: SortKey): ScannerItem[] {
  const copy = [...items];
  if (key === 'price') return copy.sort((a, b) => b.price - a.price);
  if (key === 'volume') return copy.sort((a, b) => b.volumeRaw - a.volumeRaw);
  return copy.sort((a, b) => b.changePercent - a.changePercent);
}

export default function MarketsScreen() {
  const [tab, setTab] = useState<MarketTabKey>('BIST');
  const market = useMarket();
  const fx = useFxRates();
  const board = useBistBoard(tab === 'BIST');
  const { refreshing, onRefresh } = usePullToRefresh([
    ['market'],
    ['fx'],
    ['market-board', 'BIST'],
  ]);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('change');
  const [sortOpen, setSortOpen] = useState(false);

  const scannerItems = market.data?.items ?? [];
  const items =
    tab === 'BIST' && board.data && board.data.length > 0
      ? board.data
      : scannerItems;

  const filtered = useMemo(() => {
    if (tab === 'FX') return [];
    let list = filterByTab(items, tab);
    const q = query.trim().toUpperCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.displaySymbol.toUpperCase().includes(q) ||
          i.name.toUpperCase().includes(q) ||
          i.symbol.toUpperCase().includes(q)
      );
    }
    return sortItems(list, sortKey);
  }, [items, tab, query, sortKey]);

  const fxRates = useMemo(() => {
    const rates = fx.data ?? [];
    const q = query.trim().toUpperCase();
    if (!q) return rates;
    return rates.filter(
      (r) =>
        r.code.toUpperCase().includes(q) ||
        r.name.toUpperCase().includes(q)
    );
  }, [fx.data, query]);

  return (
    <View className="flex-1 bg-zinc-950">
      <MarketTopTabs value={tab} onChange={setTab} />
      <View className="mt-3 flex-row items-center">
        <View className="flex-1">
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
        <Pressable
          onPress={() => {
            void hapticSelection();
            setSortOpen(true);
          }}
          className="mb-3 mr-4 rounded-xl border border-zinc-800 bg-zinc-900 p-2.5"
        >
          <Ionicons name="swap-vertical" size={18} color="#a1a1aa" />
        </Pressable>
      </View>

      <Link href="/markets/heatmap" asChild>
        <Pressable className="mx-4 mb-3 flex-row items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2.5">
          <Text className="text-xs font-semibold text-amber-300">
            Isı Haritası · BİST sektör performansı
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#fcd34d" />
        </Pressable>
      </Link>

      {market.isLoading && !market.data ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#34d399" />
        </View>
      ) : tab === 'FX' ? (
        <FlatList
          data={fxRates}
          keyExtractor={(r) => r.code}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#34d399"
            />
          }
          ListEmptyComponent={
            <Text className="mt-10 text-center text-sm text-zinc-500">
              Döviz kuru bulunamadı
            </Text>
          }
          renderItem={({ item }) => <FxRow rate={item} />}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.symbol}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#34d399"
            />
          }
          ListEmptyComponent={
            <Text className="mt-10 text-center text-sm text-zinc-500">
              Sonuç yok
            </Text>
          }
          renderItem={({ item }) => <AssetRow item={item} />}
        />
      )}

      <SortModal
        visible={sortOpen}
        sortKey={sortKey}
        onClose={() => setSortOpen(false)}
        onSelect={setSortKey}
      />
    </View>
  );
}

function FxRow({ rate }: { rate: FxRate }) {
  return (
    <View className="flex-row items-center border-b border-zinc-800/80 px-4 py-3">
      <View className="flex-1">
        <Text className="text-sm font-semibold text-zinc-100">{rate.code}</Text>
        <Text className="text-xs text-zinc-500">{rate.name}</Text>
      </View>
      <View className="items-end">
        <Text className="font-mono text-sm text-zinc-100">
          {formatPrice(rate.forexSelling, 'TRY', 4)}
        </Text>
        {rate.changePercent != null ? (
          <Text
            className={`mt-1 font-mono text-xs ${
              rate.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatPct(rate.changePercent)}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
