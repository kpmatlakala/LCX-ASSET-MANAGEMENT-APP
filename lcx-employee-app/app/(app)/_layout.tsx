// app.js (or App.tsx)
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer >        
        <Drawer.Screen
          name="Dashboard"
          options={{ title: "📰 Dashboard" }}
        />
        {/* <Drawer.Screen
          name="Account"
          options={{ title: "👤 Profile" }}
        /> */}
        <Drawer.Screen
          name="Settings"
          options={{ title: "⚙️ Settings" }}
        />
        
      </Drawer>
    </GestureHandlerRootView>
  );
}
