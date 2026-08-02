import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthModal } from '@/components/auth/AuthModal';
import { AssetDetailSheet } from '@/components/sheets/AssetDetailSheet';
import { useAuthStore } from '@/stores/authStore';

function AuthBootstrap({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  return <>{children}</>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={client}>
        <AuthBootstrap>
          {children}
          <AuthModal />
          <AssetDetailSheet />
        </AuthBootstrap>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
