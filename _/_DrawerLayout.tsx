import React from "react";

import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import {
  Notification,
  User,
  Home2,
  ClipboardText,
  Note,
  LogoutCurve,
  NotificationStatus,
} from "iconsax-react-native";
import { Tab } from "expo-router";
import { router } from "expo-router";
import { images } from "@/constants";
import { supabase } from "@/lib/supabase";

export default function TabLayout() {
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
      <View style={{ flex: 1 }}>
        {/* Tab Navigation */}
        <Tab>
          <Tab.Screen
            name="Dashboard"
            options={{
              tabBarIcon: () => <Home2 size="24" color="#000" />,
              title: "Dashboard",
            }}
          >
            {/* Replace with actual screen content */}
            <View style={styles.screenContent}>
              <Text>Dashboard Screen</Text>
            </View>
          </Tab.Screen>

          <Tab.Screen
            name="AssetsInventory"
            options={{
              tabBarIcon: () => <ClipboardText size="24" color="#000" />,
              title: "Assets / Inventory",
            }}
          >
            {/* Replace with actual screen content */}
            <View style={styles.screenContent}>
              <Text>Assets Inventory Screen</Text>
            </View>
          </Tab.Screen>

          <Tab.Screen
            name="PendingApprovals"
            options={{
              tabBarIcon: () => <NotificationStatus size="24" color="#000" />,
              title: "Pending Approvals",
            }}
          >
            {/* Replace with actual screen content */}
            <View style={styles.screenContent}>
              <Text>Pending Approvals Screen</Text>
            </View>
          </Tab.Screen>

          <Tab.Screen
            name="RequestAsset"
            options={{
              tabBarIcon: () => <Note size="24" color="#000" />,
              title: "Request Asset",
            }}
          >
            {/* Replace with actual screen content */}
            <View style={styles.screenContent}>
              <Text>Request Asset Screen</Text>
            </View>
          </Tab.Screen>

          <Tab.Screen
            name="Profile"
            options={{
              tabBarIcon: () => <User size="24" color="#000" />,
              title: "Profile",
            }}
          >
            {/* Replace with actual screen content */}
            <View style={styles.screenContent}>
              <Text>Profile Screen</Text>
            </View>
          </Tab.Screen>

          <Tab.Screen
            name="Notifications"
            options={{
              tabBarIcon: () => <Notification size="24" color="#000" />,
              title: "Notifications",
            }}
          >
            {/* Replace with actual screen content */}
            <View style={styles.screenContent}>
              <Text>Notifications Screen</Text>
            </View>
          </Tab.Screen>
        </Tab>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <LogoutCurve size="24" color="white" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
});
