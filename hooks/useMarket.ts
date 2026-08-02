import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import {
  fetchCalendar,
  fetchCompare,
  fetchDividends,
  fetchFx,
  fetchHeatmapQuotes,
  fetchMarketAggregate,
  fetchSignals,
  fetchTargets,
} from '@/lib/api';
import { MARKET_POLL_MS, MARKET_STALE_MS } from '@/lib/config';

export function useMarket() {
  return useQuery({
    queryKey: ['market'],
    queryFn: fetchMarketAggregate,
    staleTime: MARKET_STALE_MS,
    refetchInterval: MARKET_POLL_MS,
  });
}

export function useMarketSignals() {
  return useQuery({
    queryKey: ['signals'],
    queryFn: () => fetchSignals(),
    staleTime: MARKET_STALE_MS,
    refetchInterval: MARKET_POLL_MS,
  });
}

export function useTargets() {
  return useQuery({
    queryKey: ['targets'],
    queryFn: fetchTargets,
    staleTime: 60_000,
  });
}

export function useDividends() {
  return useQuery({
    queryKey: ['dividends'],
    queryFn: fetchDividends,
    staleTime: 60_000,
  });
}

export function useCompare(symbols: string, enabled = true) {
  return useQuery({
    queryKey: ['compare', symbols],
    queryFn: () => fetchCompare(symbols),
    enabled: enabled && symbols.split(',').filter(Boolean).length >= 2,
    staleTime: 30_000,
  });
}

export function useCalendar() {
  return useQuery({
    queryKey: ['calendar'],
    queryFn: fetchCalendar,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useFxRates() {
  return useQuery({
    queryKey: ['fx'],
    queryFn: () => fetchFx(),
    staleTime: MARKET_STALE_MS,
    refetchInterval: MARKET_POLL_MS,
  });
}

export function useHeatmap() {
  return useQuery({
    queryKey: ['heatmap'],
    queryFn: fetchHeatmapQuotes,
    staleTime: MARKET_STALE_MS,
    refetchInterval: MARKET_POLL_MS,
  });
}

export function usePullToRefresh(queryKeys: string[][] = [['market']]) {
  const client = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(
        queryKeys.map((key) => client.invalidateQueries({ queryKey: key }))
      );
    } finally {
      setRefreshing(false);
    }
  }, [client, queryKeys]);

  return { refreshing, onRefresh };
}
