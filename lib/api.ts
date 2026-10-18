import { API_BASE_URL } from '@/lib/config';
import type {
  ApiResponse,
  CommodityQuote,
  CompareMetrics,
  DividendEvent,
  EconomicEvent,
  FxRate,
  MarketAggregate,
  NewsItem,
  TargetItem,
  TradeSignal,
} from '@/types';
import type { ScannerItem } from '@/types/scanner';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

function withSparkline(items: ScannerItem[]): ScannerItem[] {
  return items.map((item) => ({
    ...item,
    sparkline: item.sparkline ?? [],
  }));
}

/** Hot tape: one array, no news. Terminal and non-BİST tabs use this. */
export async function fetchMarketAggregate(): Promise<MarketAggregate> {
  const json = await request<{
    success: boolean;
    error?: string;
    data?: { items: ScannerItem[] };
    markets?: ScannerItem[];
    marketItems?: ScannerItem[];
    commodities?: CommodityQuote[];
    sentiment?: { value: number; status: string } | null;
    news?: NewsItem[];
    updatedAt?: string;
    cached?: boolean;
  }>('/api/market?view=lite&extras=0');

  if (!json.success) throw new Error(json.error || 'Market fetch failed');

  const items = withSparkline(
    json.marketItems ?? json.markets ?? json.data?.items ?? []
  );

  return {
    items,
    commodities: json.commodities ?? [],
    sentiment: json.sentiment ?? null,
    news: json.news ?? [],
    updatedAt: json.updatedAt ?? new Date().toISOString(),
    cached: json.cached,
  };
}

/** Full BİST board. Separate from the 10s tape so the payload stays one category. */
export async function fetchBistBoard(): Promise<ScannerItem[]> {
  const json = await request<{
    success: boolean;
    error?: string;
    marketItems?: ScannerItem[];
  }>('/api/market?view=lite&category=BIST&scope=all&extras=0');
  if (!json.success) throw new Error(json.error || 'BIST board failed');
  return withSparkline(json.marketItems ?? []);
}

export async function fetchSignals(symbols?: string): Promise<TradeSignal[]> {
  const qs = symbols ? `?symbols=${encodeURIComponent(symbols)}` : '';
  const json = await request<ApiResponse<{ signals: TradeSignal[] }>>(
    `/api/signals${qs}`
  );
  if (!json.success) throw new Error(json.error);
  return json.data.signals;
}

export async function fetchTargets(): Promise<TargetItem[]> {
  const json = await request<{
    success: boolean;
    error?: string;
    data?: { items: TargetItem[] };
    items?: TargetItem[];
  }>('/api/targets');
  if (json.success === false) throw new Error(json.error);
  return json.items ?? json.data?.items ?? [];
}

export async function fetchDividends(): Promise<DividendEvent[]> {
  const json = await request<{
    success: boolean;
    error?: string;
    data?: { items: DividendEvent[] } | DividendEvent[];
    items?: DividendEvent[];
  }>('/api/dividends');
  if (json.success === false) throw new Error(json.error);
  if (Array.isArray(json.data)) return json.data;
  return json.items ?? json.data?.items ?? [];
}

export async function fetchCompare(symbols: string): Promise<CompareMetrics[]> {
  const json = await request<ApiResponse<{ items: CompareMetrics[] }>>(
    `/api/compare?symbols=${encodeURIComponent(symbols)}`
  );
  if (!json.success) throw new Error(json.error);
  return json.data.items;
}

export async function fetchCalendar(): Promise<{
  events: EconomicEvent[];
}> {
  const json = await request<{
    success: boolean;
    error?: string;
    data?: { events: EconomicEvent[]; live?: boolean };
    events?: EconomicEvent[];
  }>('/api/calendar');
  if (json.success === false) throw new Error(json.error);
  // API `live` alanı boolean (feed canlı mı) — event değil
  return {
    events: json.data?.events ?? json.events ?? [],
  };
}

export async function fetchFx(codes?: string): Promise<FxRate[]> {
  const qs = codes ? `?codes=${encodeURIComponent(codes)}` : '';
  const json = await request<ApiResponse<{ rates: FxRate[]; updatedAt: string }>>(
    `/api/fx${qs}`
  );
  if (!json.success) throw new Error(json.error);
  return json.data.rates;
}

export async function fetchHeatmapQuotes(): Promise<
  { symbol: string; name: string; changePercent: number; price: number }[]
> {
  const json = await request<{
    success: boolean;
    error?: string;
    data?: { quotes: { symbol: string; name: string; changePercent: number; price: number }[] };
    quotes?: { symbol: string; name: string; changePercent: number; price: number }[];
  }>('/api/heatmap');
  if (json.success === false) throw new Error(json.error);
  return json.quotes ?? json.data?.quotes ?? [];
}
