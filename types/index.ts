export interface HistoricalPricePoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  marketState?: string;
  previousClose?: number;
  marketCap?: number;
  volume?: number;
  trailingPE?: number;
  dayHigh?: number | null;
  dayLow?: number | null;
  fiftyTwoWeekHigh?: number | null;
  fiftyTwoWeekLow?: number | null;
}

export interface AnalystConsensus {
  targetMean: number | null;
  targetHigh: number | null;
  targetLow: number | null;
  recommendationKey: string | null;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
}

export interface StockFundamentals {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  trailingPE: number | null;
  priceToBook: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  returnOnEquity: number | null;
  marketCap: number | null;
  beta: number | null;
  dividendYield: number | null;
  earningsGrowth: number | null;
  yearReturn: number | null;
  analyst: AnalystConsensus | null;
}

export interface CompareMetrics {
  symbol: string;
  name: string;
  price: number;
  trailingPE: number | null;
  priceToBook: number | null;
  yearReturn: number | null;
  earningsGrowth: number | null;
  beta: number | null;
  dividendYield: number | null;
}

export type SmartRadarKind = 'dip' | 'breakout' | 'sma200_bounce';

export interface SmartRadarCard {
  symbol: string;
  displaySymbol: string;
  kind: SmartRadarKind;
  tag: string;
  reason: string;
  confidence: number;
  price: number;
  rsi: number | null;
}

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  publishedAt: string;
  category: 'bist' | 'crypto' | 'macro';
  source?: string;
  ticker?: string;
}

export type SignalKind =
  | 'rsi_oversold'
  | 'rsi_overbought'
  | 'sma_cross_up'
  | 'sma_cross_down';

export interface TradeSignal {
  symbol: string;
  displaySymbol: string;
  kind: SignalKind;
  label: string;
  rsi: number | null;
  sma50: number | null;
  price: number;
}

export interface EconomicEvent {
  id: string;
  title: string;
  region: 'TR' | 'US' | 'EU' | 'GLOBAL';
  impact: 'high' | 'medium';
  at: string;
  detail?: string;
}

export interface CryptoTicker {
  symbol: string;
  price: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  quoteVolume: number;
}

export interface OrderBookLevel {
  price: number;
  quantity: number;
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface FxRate {
  code: string;
  name: string;
  forexBuying: number;
  forexSelling: number;
  unit: number;
  changePercent?: number;
}

export type AlertKind =
  | 'price_above'
  | 'price_below'
  | 'change_above'
  | 'change_below'
  | 'rsi_above'
  | 'rsi_below';

export interface PriceAlert {
  id: string;
  symbol: string;
  displaySymbol: string;
  kind: AlertKind;
  threshold: number;
  triggered: boolean;
  createdAt: string;
}

export type AssetClass = 'bist' | 'crypto' | 'gold';

export interface PortfolioPosition {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  buyPrice: number;
  quantity: number;
  date: string;
  currency: 'TRY' | 'USD';
}

export type HealthSeverity = 'info' | 'warn' | 'critical';

export interface HealthFinding {
  id: string;
  severity: HealthSeverity;
  title: string;
  message: string;
}

export interface PortfolioHealthReport {
  score: number;
  label: string;
  findings: HealthFinding[];
}

export interface DividendEvent {
  symbol: string;
  name: string;
  exDate: string;
  payDate: string;
  netPerShare: number;
  yieldPct: number;
}

export interface FearGreedData {
  crypto: { value: number; classification: string };
  bist: { value: number; classification: string; note: string };
}

export interface CommodityQuote {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  currency: 'TRY' | 'USD';
  unit?: string;
  yahooSymbol?: string;
}

export type ApiSuccess<T> = { success: true; data: T; cached?: boolean };
export type ApiFailure = { success: false; error: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface MarketAggregate {
  items: import('./scanner').ScannerItem[];
  commodities: CommodityQuote[];
  sentiment: { value: number; status: string } | null;
  news: NewsItem[];
  updatedAt: string;
  cached?: boolean;
}

export interface TargetItem {
  symbol: string;
  displaySymbol: string;
  name: string;
  price: number;
  targetMean: number | null;
  upsidePct: number | null;
  recommendationKey: string | null;
}

export interface LearnArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  publishedAt: string;
  content: string;
}
