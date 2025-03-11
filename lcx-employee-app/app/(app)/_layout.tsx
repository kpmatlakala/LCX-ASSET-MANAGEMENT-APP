// app.js (or App.tsx)
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{ title: "🎙️ Home" }}
        />
        <Drawer.Screen
          name="settings"
          options={{ title: "⚙️ Settings" }}
        />
        <Drawer.Screen
          name="profile"
          options={{ title: "👤 Profile" }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
