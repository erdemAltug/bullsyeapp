import { Text, View } from 'react-native';

export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="mb-3 px-4">
      <Text className="text-base font-semibold text-zinc-100">{title}</Text>
      {subtitle ? (
        <Text className="mt-0.5 text-xs text-zinc-500">{subtitle}</Text>
      ) : null}
    </View>
  );
}
