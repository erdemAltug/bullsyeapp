import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  dismissRitualForToday,
  wasRitualDismissedToday,
} from '@/components/terminal/DailyRitualFlow';
import { hapticSelection } from '@/lib/haptics';

type Props = {
  onStart: () => void;
};

/** Web HabitCue ile aynı kopya + aksiyon */
export function DailyRitualBanner({ onStart }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    void wasRitualDismissedToday().then((dismissed) => {
      setVisible(!dismissed);
    });
  }, []);

  if (!visible) return null;

  return (
    <View className="mx-4 mt-4 overflow-hidden rounded-2xl border border-emerald-500/25 bg-zinc-950">
      <View className="px-4 py-4">
        <Text className="text-sm font-semibold text-zinc-100">
          Bugünün 10 dakikalık ritüeli
        </Text>
        <Text className="mt-1 text-xs leading-5 text-zinc-500">
          Genişlik → Fırsat Masası → 3 kart → alarm. Yarın aynı alışkanlık seni
          geri getirir.
        </Text>
        <View className="mt-3 flex-row items-center gap-2">
          <Pressable
            onPress={() => {
              void hapticSelection();
              onStart();
            }}
            className="rounded-lg bg-emerald-500 px-3 py-2 active:opacity-80"
          >
            <Text className="text-xs font-bold text-zinc-950">Fırsatları aç</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              void hapticSelection();
              void dismissRitualForToday().then(() => setVisible(false));
            }}
            className="rounded-lg px-3 py-2"
          >
            <Text className="text-xs text-zinc-500">Gizle</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
