import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
import { Tabs } from "expo-router";
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
      <Tabs
        screenOptions={{
          headerShown: true,
          headerTitle: "",
          headerRight: () => (
            <TouchableOpacity onPress={handleSignOut}>
              <LogoutCurve size="24" color="#000" />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="Dashboard"
          options={{
            tabBarIcon: () => <Home2 size="24" color="#000" />,
            title: "Home",
          }}
        />        

        <Tabs.Screen
          name="AssetsInventory"
          options={{
            tabBarIcon: () => <ClipboardText size="24" color="#000" />,
            title: "Inventory",
          }}
        />

        <Tabs.Screen
          name="Profile"
          options={{
            tabBarIcon: () => <User size="24" color="#000" />,
            title: "Profile",
          }}
        /> 
        
      </Tabs>      
  );
}

// {/* Logout Button */}
//<TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
//<LogoutCurve size="24" color="white" />
//<Text style={styles.logoutButtonText}>Logout</Text>
//</TouchableOpacity>
//</View> 


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
