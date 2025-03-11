import { Stack } from 'expo-router';
import { SessionProvider } from '@/context/SessionContext';

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} /> {/* Entry point */}
        <Stack.Screen name="(auth)/Auth" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)/onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(app)/_layout" options={{ headerShown: false }} />
      </Stack>
    </SessionProvider>
  );
}
