import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions
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
import { supabase } from "@/lib/supabase";
import { useNotifications } from '@/context/NotificationContext';

export default function TabLayout() {
  const {
    notifications,
    markAsRead,
    deleteNotification
  } = useNotifications();

  // console.log(notifications);
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] = useState(false);
  
  useEffect(() => {
    const unreadNotifications = notifications.filter((notification) => !notification.is_read);
    setNotificationCount(unreadNotifications.length);
  }
  , [notifications]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/Auth");
  };

  const ProfileDropdownMenu = () => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          style={styles.dropdownItem}
          onPress={() => {
            router.push("/Profile");
            setIsProfileDropdownVisible(false);
          }}
        >
          <Text style={styles.dropdownItemText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.dropdownItem}
          onPress={() => {
            router.push("/Settings");
            setIsProfileDropdownVisible(false);
          }}
        >
          <Text style={styles.dropdownItemText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.dropdownItem}
          onPress={() => {
            setIsProfileDropdownVisible(false);
            handleSignOut();
          }}
        >
          <Text style={styles.dropdownItemText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#b8ca41", 
          tabBarInactiveTintColor: "#8E8E93",
          tabBarStyle: {
            height: 90,
            paddingTop: 4,
            paddingBottom: 4,
            borderTopWidth: 1,
            borderColor: "#f3f4f6",
            backgroundColor: '#FFFFFF',
            elevation: 0,
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
                onPress={() => setIsProfileDropdownVisible(!isProfileDropdownVisible)}
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
              <View style={styles.tabIconContainer}>
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
              <View style={styles.tabIconContainer}>
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
              <View style={[styles.addButtonContainer, focused && styles.activeAddButtonContainer]}>
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
              <View style={styles.tabIconContainer}>
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
              <View style={styles.tabIconContainer}>
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

      {isProfileDropdownVisible && (
        <Modal
          transparent={true}
          visible={isProfileDropdownVisible}
          onRequestClose={() => setIsProfileDropdownVisible(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setIsProfileDropdownVisible(false)}
          >
            <View style={styles.dropdownMenuContainer}>
              <ProfileDropdownMenu />
            </View>
          </Pressable>
        </Modal>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  headerButton: {
    marginLeft: 16,
    padding: 5,
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
  },
  tabIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  addButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
  },
  activeAddButtonContainer: {
    backgroundColor: 'transparent', 
  },
  tabLabel: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdownMenuContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight: 16,
    marginTop: 60,
    width: 200,
  },
  dropdownContainer: {
    width: '100%',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
});