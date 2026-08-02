import { Stack } from 'expo-router';

export default function MarketsLayout() {
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
      <Stack.Screen name="index" options={{ title: 'Piyasalar' }} />
      <Stack.Screen name="heatmap" options={{ title: 'Isı Haritası' }} />
    </Stack>
  );
}
