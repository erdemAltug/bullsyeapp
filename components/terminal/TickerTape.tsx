import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { formatPct, formatPrice } from '@/lib/format';
import type { ScannerItem } from '@/types/scanner';
import type { CommodityQuote } from '@/types';

type TickerItem = {
  key: string;
  label: string;
  price: number;
  changePercent: number;
  currency: string;
};

function buildTickers(
  items: ScannerItem[],
  commodities: CommodityQuote[]
): TickerItem[] {
  const want = [
    { match: (i: ScannerItem) => i.displaySymbol === 'XU100' || i.symbol.includes('XU100'), label: 'BİST 100' },
    { match: (i: ScannerItem) => i.displaySymbol === 'BTC' || i.symbol.startsWith('BTC'), label: 'BTC' },
  ];

  const out: TickerItem[] = [];

  for (const w of want) {
    const hit = items.find(w.match);
    if (hit) {
      out.push({
        key: hit.symbol,
        label: w.label,
        price: hit.price,
        changePercent: hit.changePercent,
        currency: hit.currency,
      });
    }
  }

  const usdtry = commodities.find((c) => c.symbol === 'USDTRY');
  const gold = commodities.find((c) => c.symbol === 'ALTIN');
  if (usdtry) {
    out.push({
      key: 'USDTRY',
      label: 'USD/TRY',
      price: usdtry.price,
      changePercent: usdtry.changePercent,
      currency: 'TRY',
    });
  }
  if (gold) {
    out.push({
      key: 'ALTIN',
      label: 'Gram Altın',
      price: gold.price,
      changePercent: gold.changePercent,
      currency: gold.currency,
    });
  }

  return out;
}

export function TickerTape({
  items,
  commodities,
}: {
  items: ScannerItem[];
  commodities: CommodityQuote[];
}) {
  const tickers = buildTickers(items, commodities);
  const scroll = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scroll.setValue(0);
    const anim = Animated.loop(
      Animated.timing(scroll, {
        toValue: 1,
        duration: 28000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [scroll, tickers.length]);

  if (!tickers.length) return null;

  const row = (
    <View className="flex-row items-center gap-6 pr-8">
      {tickers.map((t) => {
        const up = t.changePercent >= 0;
        return (
          <View key={t.key} className="flex-row items-center gap-2">
            <Text className="text-xs font-medium text-zinc-400">{t.label}</Text>
            <Text className="font-mono text-xs text-zinc-100">
              {formatPrice(t.price, t.currency, t.label === 'BTC' ? 0 : 2)}
            </Text>
            <Text
              className={`font-mono text-xs ${up ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {formatPct(t.changePercent)}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const translateX = scroll.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -360],
  });

  return (
    <View className="overflow-hidden border-b border-zinc-800 bg-zinc-950 py-2.5">
      <Animated.View
        style={{ flexDirection: 'row', transform: [{ translateX }] }}
      >
        {row}
        {row}
        {row}
      </Animated.View>
    </View>
  );
}
