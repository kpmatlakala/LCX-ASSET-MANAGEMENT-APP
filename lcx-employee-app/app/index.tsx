import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) 
      {
        router.push("/(app)/Profile"); // Redirect if logged in
      } else {
        router.push("/(auth)/Auth"); // Redirect to login page
      }
      setLoading(false);
    };

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/(app)/Profile"); // Redirect after login
      } else {
        router.push("/(auth)/Auth"); // Redirect after logout
      }
    });

    return () => {
      authListener.subscription.unsubscribe(); // Cleanup listener
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null; // No UI needed, only navigation logic
}
