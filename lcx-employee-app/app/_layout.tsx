import "../global.css";
import React, { useEffect } from "react";
import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";

import { SessionProvider } from '@/context/SessionContext';
import { AssetProvider } from "@/context/AssetContext";
import { NotificationProvider } from "@/context/NotificationContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    // "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded && !error) return null;

  return (
    // <SessionProvider>
    <NotificationProvider>
      <AssetProvider>
      
        <Stack screenOptions={{headerShown:false}}>
          <Stack.Screen name="index" options={{ headerShown: false }} /> {/* Entry point */}
          <Stack.Screen name="/AssetDetails" options={{ headerShown: false }} /> {/* Entry point */}
          <Stack.Screen name="(auth)/Auth" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)/onboarding" options={{ headerShown: false }} />   
          <Stack.Screen name="(tabs)/Dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/Notifications" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/AssetsInventory" options={{ headerShown: false }} />    
          <Stack.Screen name="(tabs)/MyAssets" options={{ headerShown: false }} />     
        </Stack>     
      </AssetProvider> 
    </NotificationProvider>
    // </SessionProvider>
  );
}
