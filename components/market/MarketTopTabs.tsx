import { Pressable, ScrollView, Text, View } from 'react-native';
import { hapticSelection } from '@/lib/haptics';

export type MarketTabKey = 'BIST' | 'US' | 'FON_ETF' | 'CRYPTO' | 'FX';

const TABS: { key: MarketTabKey; label: string }[] = [
  { key: 'BIST', label: 'BİST' },
  { key: 'US', label: 'NASDAQ/ABD' },
  { key: 'FON_ETF', label: 'Fonlar & ETF' },
  { key: 'CRYPTO', label: 'Kripto' },
  { key: 'FX', label: 'Döviz' },
];

export function MarketTopTabs({
  value,
  onChange,
}: {
  value: MarketTabKey;
  onChange: (key: MarketTabKey) => void;
}) {
  return (
    <View className="border-b border-zinc-800">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 4 }}
      >
        {TABS.map((tab) => {
          const active = tab.key === value;
          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                void hapticSelection();
                onChange(tab.key);
              }}
              className={`mx-0.5 border-b-2 px-3 py-3 ${
                active ? 'border-emerald-400' : 'border-transparent'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  active ? 'text-emerald-400' : 'text-zinc-500'
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
