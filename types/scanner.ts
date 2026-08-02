export type ScannerCategory = 'BIST' | 'CRYPTO' | 'US' | 'FON' | 'ETF';

export interface ScannerItem {
  symbol: string;
  displaySymbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume: string;
  volumeRaw: number;
  category: ScannerCategory;
  market: string;
  currency: 'TRY' | 'USD';
  sparkline: number[];
  chartSymbol: string;
  chartSource: 'yahoo' | 'binance' | 'tefas';
  dayHigh?: number | null;
  dayLow?: number | null;
  trailingPE?: number | null;
  fundStyle?: string | null;
  portfolioSize?: number | null;
  investorCount?: number | null;
}
