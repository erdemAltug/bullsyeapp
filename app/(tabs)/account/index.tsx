import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { hapticSelection, hapticSuccess } from '@/lib/haptics';
import { useAlertsStore } from '@/stores/alertsStore';
import { useAuthStore } from '@/stores/authStore';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useWatchlistStore } from '@/stores/watchlistStore';

export default function AccountHub() {
  const positions = usePortfolioStore((s) => s.positions);
  const watch = useWatchlistStore((s) => s.items);
  const alerts = useAlertsStore((s) => s.alerts);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const pending = useAuthStore((s) => s.pending);
  const openAuth = useAuthStore((s) => s.openAuth);
  const signOut = useAuthStore((s) => s.signOut);

  const cards = [
    {
      href: '/account/audit' as const,
      title: 'Portföy Analizi',
      subtitle: 'Sağlık skoru ve yoğunlaşma uyarısı',
      icon: 'pulse-outline' as const,
      meta: `${positions.length} pozisyon`,
      color: '#fb7185',
    },
    {
      href: '/account/portfolio' as const,
      title: 'Portföyüm & İzleme Listesi',
      subtitle: 'Kayıtlı varlıklar ve pozisyonlar',
      icon: 'briefcase-outline' as const,
      meta: `${watch.length} izleme`,
      color: '#22d3ee',
    },
    {
      href: '/account/alerts' as const,
      title: 'Alarmlar',
      subtitle: 'Aktif fiyat alarmları',
      icon: 'notifications-outline' as const,
      meta: `${alerts.length} alarm`,
      color: '#fb923c',
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-zinc-950"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View className="mx-4 mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <Text className="text-lg font-bold text-zinc-50">
          BULLS<Text className="text-emerald-400">YE</Text>
        </Text>
        {!hydrated ? (
          <ActivityIndicator color="#34d399" className="mt-3" />
        ) : user ? (
          <View className="mt-3">
            <Text className="text-sm font-semibold text-zinc-100">
              {user.name || 'Hesap'}
            </Text>
            <Text className="mt-0.5 text-xs text-zinc-400">{user.email}</Text>
            <Pressable
              onPress={() => {
                void hapticSelection();
                void signOut().then(() => hapticSuccess());
              }}
              disabled={pending}
              className="mt-3 self-start rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
            >
              <Text className="text-xs font-medium text-zinc-300">Çıkış Yap</Text>
            </Pressable>
          </View>
        ) : (
          <View className="mt-3">
            <Text className="text-xs text-zinc-400">
              İzleme listesi, alarm ve portföy için giriş yapın — web ile aynı hesap.
            </Text>
            <View className="mt-3 flex-row gap-2">
              <Pressable
                onPress={() => {
                  void hapticSelection();
                  openAuth('login');
                }}
                className="flex-1 items-center rounded-xl bg-emerald-500 py-2.5"
              >
                <Text className="text-sm font-bold text-zinc-950">Giriş Yap</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  void hapticSelection();
                  openAuth('register');
                }}
                className="flex-1 items-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5"
              >
                <Text className="text-sm font-semibold text-emerald-400">
                  Kayıt Ol
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {cards.map((c) => (
        <Link key={c.href} href={c.href} asChild>
          <Pressable
            onPress={() => void hapticSelection()}
            className="mx-4 mt-3 flex-row items-center rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4"
          >
            <View
              className="mr-3 h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${c.color}22` }}
            >
              <Ionicons name={c.icon} size={20} color={c.color} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-zinc-100">{c.title}</Text>
              <Text className="mt-0.5 text-xs text-zinc-500">{c.subtitle}</Text>
            </View>
            <Text className="mr-2 font-mono text-[10px] text-zinc-500">{c.meta}</Text>
            <Ionicons name="chevron-forward" size={16} color="#52525b" />
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}
