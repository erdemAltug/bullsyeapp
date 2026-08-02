import { Stack } from 'expo-router';

export default function AccountLayout() {
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
      <Stack.Screen name="index" options={{ title: 'Hesabım' }} />
      <Stack.Screen name="audit" options={{ title: 'Portföy Analizi' }} />
      <Stack.Screen name="portfolio" options={{ title: 'Portföyüm & İzleme' }} />
      <Stack.Screen name="alerts" options={{ title: 'Alarmlar' }} />
    </Stack>
  );
}
