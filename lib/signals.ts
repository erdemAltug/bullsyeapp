import type { ScannerItem } from '@/types/scanner';

export interface SignalCardData {
  symbol: string;
  displaySymbol: string;
  name: string;
  category: 'BIST' | 'CRYPTO' | 'US' | 'FON' | 'ETF';
  signalType: 'BUY' | 'SELL' | 'STRONG_BUY';
  strategyName: string;
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  confidenceScore: number;
  timeAgo: string;
  riskRewardRatio: string;
  changePercent: number;
  id: string;
}

export function generateRealTimeSignals(
  marketItems: ScannerItem[]
): SignalCardData[] {
  if (!marketItems?.length) return [];

  const eligible = marketItems.filter(
    (item) =>
      (item.category === 'BIST' ||
        item.category === 'CRYPTO' ||
        item.category === 'US' ||
        item.category === 'ETF') &&
      item.price > 0
  );

  const cards: SignalCardData[] = [];

  for (const item of eligible) {
    const price = item.price;
    if (!item.dayHigh || !item.dayLow || item.dayHigh <= item.dayLow) {
      continue;
    }
    const high = item.dayHigh;
    const low = item.dayLow;
    const span = Math.max(high - low, price * 0.005);
    const rangePos = Math.min(1, Math.max(0, (price - low) / span));
    const chg = item.changePercent;

    let signalType: SignalCardData['signalType'] | null = null;
    let strategyName = '';

    if (rangePos <= 0.22 && chg > -8) {
      signalType = rangePos <= 0.12 ? 'STRONG_BUY' : 'BUY';
      strategyName = 'Gün içi dip bandı — canlı high/low desteği';
    } else if (rangePos >= 0.82 && chg < 8) {
      signalType = 'SELL';
      strategyName = 'Gün içi zirve bandı — direnç reddi';
    } else if (chg >= 3 && rangePos < 0.7) {
      signalType = chg >= 5 ? 'STRONG_BUY' : 'BUY';
      strategyName = `Momentum +%${chg.toFixed(1)} — canlı günlük değişim`;
    } else if (chg <= -3 && rangePos > 0.3) {
      signalType = 'SELL';
      strategyName = `Negatif ivme %${chg.toFixed(1)} — destek kırılım riski`;
    } else if (price >= high * 0.995 && chg > 0) {
      signalType = 'BUY';
      strategyName = 'Gün içi zirveye yakın kırılım denemesi';
    } else {
      continue;
    }

    const isBuy = signalType === 'BUY' || signalType === 'STRONG_BUY';
    const slPct = 0.028;
    const tpPct = 0.055;
    const stopLoss = isBuy
      ? Math.min(price * (1 - slPct), low)
      : Math.max(price * (1 + slPct), high);
    const targetPrice = isBuy
      ? price * (1 + tpPct)
      : price * (1 - tpPct);
    const risk = Math.abs(price - stopLoss);
    const reward = Math.abs(targetPrice - price);
    const rr = risk > 0 ? (reward / risk).toFixed(1) : '—';

    cards.push({
      id: `${item.symbol}-${signalType}`,
      symbol: item.symbol,
      displaySymbol: item.displaySymbol,
      name: item.name,
      category: item.category,
      signalType,
      strategyName,
      entryPrice: price,
      stopLoss,
      targetPrice,
      confidenceScore: Math.round(
        Math.min(95, Math.max(55, 70 + Math.abs(chg) * 3 + (isBuy ? 5 : 0)))
      ),
      timeAgo: 'canlı',
      riskRewardRatio: rr,
      changePercent: chg,
    });
  }

  return cards
    .sort((a, b) => b.confidenceScore - a.confidenceScore)
    .slice(0, 24);
}

/** Heuristic AI opportunity score 0–100 from live scanner fields */
export function aiOpportunityScore(item: ScannerItem): number {
  const chg = item.changePercent;
  let score = 50;
  if (item.dayHigh && item.dayLow && item.dayHigh > item.dayLow) {
    const pos =
      (item.price - item.dayLow) / (item.dayHigh - item.dayLow);
    if (pos < 0.3) score += 18;
    else if (pos > 0.75) score -= 8;
  }
  if (chg > 0) score += Math.min(20, chg * 3);
  if (chg < 0) score += Math.max(-15, chg * 2);
  if (item.trailingPE && item.trailingPE > 0 && item.trailingPE < 12) score += 10;
  if (item.volumeRaw > 0) score += 5;
  return Math.round(Math.min(98, Math.max(12, score)));
}
