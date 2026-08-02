import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { getArticle } from '@/lib/learn';

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const article = getArticle(slug);

  if (!article) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-950">
        <Text className="text-sm text-zinc-500">Makale bulunamadı</Text>
      </View>
    );
  }

  const blocks = article.content.split('\n').filter(Boolean);

  return (
    <>
      <Stack.Screen options={{ title: article.title }} />
      <ScrollView className="flex-1 bg-zinc-950" contentContainerStyle={{ padding: 16 }}>
        <Text className="text-[10px] font-medium uppercase tracking-wide text-emerald-400">
          {article.category}
        </Text>
        <Text className="mt-2 text-2xl font-bold text-zinc-50">{article.title}</Text>
        <Text className="mt-2 text-xs text-zinc-500">
          {article.readMinutes} dk · {article.publishedAt}
        </Text>
        <View className="mt-6 gap-3">
          {blocks.map((line, idx) => {
            if (line.startsWith('# ')) {
              return (
                <Text key={idx} className="text-xl font-bold text-zinc-50">
                  {line.replace(/^#\s/, '')}
                </Text>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <Text key={idx} className="mt-2 text-base font-semibold text-zinc-100">
                  {line.replace(/^##\s/, '')}
                </Text>
              );
            }
            if (line.startsWith('- ')) {
              return (
                <Text key={idx} className="text-sm leading-6 text-zinc-300">
                  • {line.replace(/^-\s/, '').replace(/\*\*/g, '')}
                </Text>
              );
            }
            if (/^\d+\.\s/.test(line)) {
              return (
                <Text key={idx} className="text-sm leading-6 text-zinc-300">
                  {line.replace(/\*\*/g, '')}
                </Text>
              );
            }
            return (
              <Text key={idx} className="text-sm leading-6 text-zinc-300">
                {line.replace(/\*\*/g, '')}
              </Text>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}
