import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-zinc-950 px-5">
        <Text className="text-lg font-semibold text-zinc-100">
          Bu ekran yok.
        </Text>
        <Link href="/terminal" className="mt-4">
          <Text className="text-sm text-emerald-400">Terminale dön</Text>
        </Link>
      </View>
    </>
  );
}
