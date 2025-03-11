import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSession } from '@/context/SessionContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { session } = useSession();  // Get the session from context
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    // Avoid navigating before session state is available
    if (session === undefined) return;

    if (session) {
      router.replace('/(app)/Dashboard'); // Redirect to Dashboard if user is logged in
    } else {
      router.replace('/(auth)/Auth'); // Redirect to Auth if no session
    }

    setLoading(false); // Hide loading state after checking session
  }, [session, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return null; // This screen should not render anything directly
}
