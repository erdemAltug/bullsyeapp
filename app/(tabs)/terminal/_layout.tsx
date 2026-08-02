import { Stack } from 'expo-router';

export default function TerminalLayout() {
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
      <Stack.Screen name="index" options={{ title: 'BULLSYE' }} />
    </Stack>
  );
}
