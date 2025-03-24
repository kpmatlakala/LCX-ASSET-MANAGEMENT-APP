import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import {
  Notification,
  User,
  Home2,
  ClipboardText,
} from "iconsax-react-native";
import { Tabs } from "expo-router";
import { router } from "expo-router";
import { images } from "@/constants";
import { supabase } from "@/lib/supabase";

export default function TabLayout() {

  const [notificationCount, setNotificationCount] = React.useState(3);
  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace("/(auth)/Auth");
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#b8ca41",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarStyle: {
            height: 80,
            paddingTop: 6,
          },
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push("/Notifications")}
              >
                <View style={styles.notificationContainer}>
                  <Notification size={24} color="#000" />
                  {notificationCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push("/Profile")}
              >
                <User size={24} color="#000" />
              </TouchableOpacity>
            </View>
          ),
          headerShadowVisible: false, // Remove header shadow
        }}
      >
        <Tabs.Screen
          name="Dashboard"
          options={{
            tabBarIcon: ({ color }) => <Home2 size={24} color={color} variant="Bold"/>,
            title: "",
            tabBarLabel: "Home",
          }}
        />
        <Tabs.Screen
          name="Inventory"
          options={{
            tabBarIcon: ({ color }) => <ClipboardText size={24} color={color} variant="Bold"/>,
            title: "",
            tabBarLabel: "Inventory",
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ color }) => <User size={24} color={color} variant="Bold"/>,
            title: "",
            tabBarLabel: "Profile",
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f00",
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: "row",
    marginRight: 16,
  },
  headerButton: {
    marginLeft: 16,
  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  }
});