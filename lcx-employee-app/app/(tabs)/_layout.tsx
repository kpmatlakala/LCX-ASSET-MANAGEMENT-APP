import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import {
  Notification,
  User,
  Home2,
  ClipboardText,
  AddCircle,
  ClipboardTick,
} from "iconsax-react-native";
import { Tabs } from "expo-router";
import { router } from "expo-router";
import { images } from "@/constants";
import { supabase } from "@/lib/supabase";

export default function TabLayout() {
  const [notificationCount, setNotificationCount] = React.useState(3);
  const [activeTab, setActiveTab] = React.useState("Dashboard");
  
  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
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
    ]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#b8ca41", 
          tabBarInactiveTintColor: "#8E8E93",
          tabBarStyle: {
            height: 90,
            paddingTop: 10,
            paddingBottom: 10,
            borderTopWidth: 1,
            borderColor: "#f3f4f6",
            backgroundColor: '#FFFFFF',
            elevation: 0, // Android shadow
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
          },
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.push("/Notifications")}
              >
                <View style={styles.notificationContainer}>
                  <Notification size={24} color="#4d4d4d" variant="Bold"/>
                  {notificationCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {notificationCount > 99 ? "99+" : notificationCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.push("/Profile")}
              >
                <User size={24} color="#4d4d4d" variant="Bold"/>
              </TouchableOpacity>
            </View>
          ),
          tabBarItemStyle: {
            paddingVertical: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerShadowVisible: false,
        })}
      >
        <Tabs.Screen
          name="Dashboard"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconContainer, focused && styles.activeTabIconContainer]}>
                <Home2 size={26} color={color} variant={focused ? "Bold" : "Linear"} />
              </View>
            ),
            title: "",
            tabBarLabel: "Home",
          }}
          listeners={{
            tabPress: () => setActiveTab("Dashboard"),
          }}
        />
        <Tabs.Screen
          name="Inventory"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconContainer, focused && styles.activeTabIconContainer]}>
                <ClipboardText size={26} color={color} variant={focused ? "Bold" : "Linear"} />
              </View>
            ),
            title: "",
            tabBarLabel: "Inventory",
          }}
          listeners={{
            tabPress: () => setActiveTab("Inventory"),
          }}
        />
        <Tabs.Screen
          name="RequestAsset"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View className="pb-12" style={[styles.addButtonContainer, focused && styles.activeAddButtonContainer]}>
                <AddCircle 
                  size={90} 
                  color="#b8ca41" 
                  variant="Bold" 
                />
              </View>
            ),
            title: "",
            tabBarLabel: () => <Text style={styles.tabLabel}>Request</Text>,
          }}
          listeners={{
            tabPress: () => setActiveTab("RequestAsset"),
          }}
        />
        <Tabs.Screen
          name="MyAssets"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconContainer, focused && styles.activeTabIconContainer]}>
                <ClipboardTick size={26} color={color} variant={focused ? "Bold" : "Linear"} />
              </View>
            ),
            title: "",
            tabBarLabel: "My Assets",
          }}
          listeners={{
            tabPress: () => setActiveTab("MyAssets"),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconContainer, focused && styles.activeTabIconContainer]}>
                <User size={26} color={color} variant={focused ? "Bold" : "Linear"} />
              </View>
            ),
            title: "",
            tabBarLabel: "Profile",
          }}
          listeners={{
            tabPress: () => setActiveTab("Profile"),
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
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  tabIconContainer: {
    padding: 8,
    borderRadius: 10,
  },
  // activeTabIconContainer: {
  //   backgroundColor: 'rgb(236, 242, 193)',
  // },
  addButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
  },
  activeAddButtonContainer: {
    backgroundColor: 'transparent', // Remove the background color
  },
  tabLabel: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: '500',
  },
});