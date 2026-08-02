import { Link } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { LEARN_ARTICLES } from '@/lib/learn';
import { hapticSelection } from '@/lib/haptics';

export default function LearnScreen() {
  return (
    <FlatList
      className="flex-1 bg-zinc-950"
      data={LEARN_ARTICLES}
      keyExtractor={(a) => a.id}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      ListHeaderComponent={
        <View className="mb-2">
          <Text className="text-base font-semibold text-zinc-100">
            Eğitim Hub & Blog
          </Text>
          <Text className="mt-1 text-xs text-zinc-500">
            Finansal okuryazarlık, teknik analiz ve piyasa notları
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Link href={`/learn/${item.slug}`} asChild>
          <Pressable
            onPress={() => void hapticSelection()}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 active:opacity-80"
          >
            <Text className="text-[10px] font-medium uppercase tracking-wide text-emerald-400">
              {item.category}
            </Text>
            <Text className="mt-1 text-sm font-semibold text-zinc-50">
              {item.title}
            </Text>
            <Text className="mt-1 text-xs leading-5 text-zinc-500">
              {item.excerpt}
            </Text>
            <Text className="mt-3 text-[11px] text-zinc-600">
              {item.readMinutes} dk okuma · {item.publishedAt}
            </Text>
          </Pressable>
        </Link>
      )}
    />
  );
}
