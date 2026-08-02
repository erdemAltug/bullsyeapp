import { Stack } from 'expo-router';

export default function AnalysisLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#09090b' },
        headerTintColor: '#fafafa',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: '#09090b' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Analiz' }} />
      <Stack.Screen name="compare" options={{ title: '1v1 Kıyasla' }} />
      <Stack.Screen name="signals" options={{ title: 'AI Sinyalleri' }} />
      <Stack.Screen name="targets" options={{ title: 'Hedef Fiyatlar' }} />
      <Stack.Screen name="dividends" options={{ title: 'Temettü Karnesi' }} />
    </Stack>
  );
}
