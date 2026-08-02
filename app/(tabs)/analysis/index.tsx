import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { hapticSelection } from '@/lib/haptics';

const LINKS = [
  {
    href: '/analysis/compare' as const,
    title: '1v1 Kıyasla',
    subtitle: 'Yan yana temel metrik karşılaştırması',
    icon: 'git-compare-outline' as const,
    color: '#6ee7b7',
  },
  {
    href: '/analysis/signals' as const,
    title: 'AI Sinyalleri',
    subtitle: 'Güçlü Al / Sat teknik sinyal akışı',
    icon: 'flash-outline' as const,
    color: '#34d399',
  },
  {
    href: '/analysis/targets' as const,
    title: 'Hedef Fiyatlar',
    subtitle: 'Analist konsensüs hedef fiyatları',
    icon: 'locate-outline' as const,
    color: '#fcd34d',
  },
  {
    href: '/analysis/dividends' as const,
    title: 'Temettü Karnesi',
    subtitle: 'Takvim ve getiri hesaplayıcı',
    icon: 'cash-outline' as const,
    color: '#fb7185',
  },
];

export default function AnalysisHub() {
  return (
    <ScrollView className="flex-1 bg-zinc-950">
      <Text className="px-4 pb-2 pt-3 text-xs text-zinc-500">
        Analiz motoru — web panosuyla aynı özellikler
      </Text>
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} asChild>
          <Pressable
            onPress={() => void hapticSelection()}
            className="mx-4 mb-3 flex-row items-center rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 active:opacity-80"
          >
            <View
              className="mr-3 h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${link.color}22` }}
            >
              <Ionicons name={link.icon} size={20} color={link.color} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-zinc-100">
                {link.title}
              </Text>
              <Text className="mt-0.5 text-xs text-zinc-500">{link.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#52525b" />
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}
