import { useState, useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Onboarding from './(onboarding)/onboarding'
import { supabase } from '@/lib/supabase'
import Auth from '@/components/Auth'
import Account from '@/components/Account'





export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true); // For managing splash screen loading state
  const [onboardingComplete, setOnboardingComplete] = useState(false); // Track if onboarding is complete

  useEffect(() => {
    // Fetch session and check onboarding status when app starts
    const fetchSessionAndOnboardingStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      const hasCompletedOnboarding = await AsyncStorage.getItem('onboardingComplete');
      if (hasCompletedOnboarding === 'true') {
        setOnboardingComplete(true);
      } else {
        setOnboardingComplete(false);
      }

      setLoading(false); // Hide loading once the checks are complete
    };

    fetchSessionAndOnboardingStatus();

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  // Determine which screen to show based on onboarding and authentication status
  if (!onboardingComplete) {
    return <Onboarding />; // Show onboarding if not completed
  }

  return (
    <View style={{ flex: 1 }}>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
  );
}