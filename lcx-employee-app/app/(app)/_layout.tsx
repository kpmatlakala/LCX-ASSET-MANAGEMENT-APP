// app.js (or App.tsx)
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Notification, User } from "iconsax-react-native";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="Dashboard"
          options={{
            title: "",
            drawerLabel: "📰 Dashboard",
            // headerStyle: { backgroundColor: '#e8eac6', },
            headerStyle: { backgroundColor: "#4CAF50" },
            headerTintColor: "#FFFFFF",
            headerShadowVisible: false,
            headerRight: () => (
              <View style={styles.header}>
                {/* Header with Logo */}
                {/* <View style={styles.header}>
                  <View style={styles.logo}>
                    <Image 
                      source={require('@/assets/images/lcx-logo.png')} 
                      style={styles.logoImage}
                      // Fallback if you don't have the actual logo
                      defaultSource={require('@/assets/images/placeholder.png')}
                    />
                  </View>        
                </View> */}

                <View style={styles.notificationIcon}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                  <Pressable
                    style={{ marginRight: 10 }}
                    onPress={() => {
                      alert("pressed notification icon");
                    }}
                  >
                    {/* <Ionicons name="notifications" size={24} color="white" /> */}
                    <Notification size="24" color="#333" />
                  </Pressable>
                </View>

                <View style={styles.notificationIcon}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>

                  <Pressable
                    style={{ marginRight: 10 }}
                    onPress={() => { alert("pressed profile icon"); }}
                  >
                    {/* <Ionicons name="person-circle-outline" size={32} color="#333" /> */}
                    <User size="24" color="#333" />
                  </Pressable>
                </View>

              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="AssetsInventory"
          options={{
            title: "",
            drawerLabel: "📦 Assets / Inventory",
            // headerStyle: { backgroundColor: '#e8eac6', },
            headerStyle: { backgroundColor: "#4CAF50" },
            headerTintColor: "#FFFFFF",
            headerShadowVisible: false,
            headerRight: () => (
              <View style={styles.header}>
                {/* Header with Logo */}
                {/* <View style={styles.header}>
                  <View style={styles.logo}>
                    <Image 
                      source={require('@/assets/images/lcx-logo.png')} 
                      style={styles.logoImage}
                      // Fallback if you don't have the actual logo
                      defaultSource={require('@/assets/images/placeholder.png')}
                    />
                  </View>        
                </View> */}

                <View style={styles.notificationIcon}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                  <Pressable
                    style={{ marginRight: 10 }}
                    onPress={() => {
                      alert("pressed notification icon");
                    }}
                  >
                    {/* <Ionicons name="notifications" size={24} color="white" /> */}
                    <Notification size="24" color="#333" />
                  </Pressable>
                </View>

                <View style={styles.notificationIcon}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                  <Pressable
                    style={{ marginRight: 10 }}
                    onPress={() => {
                      alert("pressed profile icon");
                    }}
                  >
                    {/* <Ionicons name="person-circle-outline" size={32} color="#333" /> */}
                    <User size="24" color="#333" />
                  </Pressable>
                </View>

              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="RequestAsset"
          options={{
            title: "",
            drawerLabel: "📦 Request Asset",
            // headerStyle: { backgroundColor: '#e8eac6', },
            headerStyle: { backgroundColor: "#4CAF50" },
            headerTintColor: "#FFFFFF",
            headerShadowVisible: false,
            headerRight: () => (
              <View style={styles.header}>
                {/* Header with Logo */}
                {/* <View style={styles.header}>
                  <View style={styles.logo}>
                    <Image 
                      source={require('@/assets/images/lcx-logo.png')} 
                      style={styles.logoImage}
                      // Fallback if you don't have the actual logo
                      defaultSource={require('@/assets/images/placeholder.png')}
                    />
                  </View>        
                </View> */}

                <View style={styles.notificationIcon}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                  <Pressable style={{ marginRight: 10 }}
                    onPress={()=> {alert("pressed notification icon")}}
                  >
                    {/* <Ionicons name="notifications" size={24} color="white" /> */}                    
                   <Notification size="24" color="#333" />
                  </Pressable>                  
                </View>                

                <View style={styles.notificationIcon}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                  <Pressable style={{ marginRight: 10 }}
                    onPress={()=> {alert("pressed profile icon")}}
                  >
                    {/* <Ionicons name="person-circle-outline" size={32} color="#333" /> */}
                    <User size="24" color="#333" />
                  </Pressable>                  
                </View>     

              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="PendingApprovals"
          options={{
            title: "",
            drawerLabel: "📦 Pending Approvals",
            // headerStyle: { backgroundColor: '#e8eac6', },
            headerStyle: { backgroundColor: "#4CAF50" },
            headerTintColor: "#FFFFFF",
            headerShadowVisible: false,
            headerRight: () => (
              <View style={styles.header}>
                {/* Header with Logo */}
                {/* <View style={styles.header}>
                  <View style={styles.logo}>
                    <Image 
                      source={require('@/assets/images/lcx-logo.png')} 
                      style={styles.logoImage}
                      // Fallback if you don't have the actual logo
                      defaultSource={require('@/assets/images/placeholder.png')}
                    />
                  </View>        
                </View> */}

                <View style={styles.notificationIcon}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                  <Pressable style={{ marginRight: 10 }}
                    onPress={()=> {alert("pressed notification icon")}}
                  >
                    {/* <Ionicons name="notifications" size={24} color="white" /> */}                    
                   <Notification size="24" color="#333" />
                  </Pressable>                  
                </View>                

                <View style={styles.notificationIcon}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                  <Pressable style={{ marginRight: 10 }}
                    onPress={()=> {alert("pressed profile icon")}}
                  >
                    {/* <Ionicons name="person-circle-outline" size={32} color="#333" /> */}
                    <User size="24" color="#333" />
                  </Pressable>                  
                </View>
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="Profile"
          options={{
            title: "👤 Profile",
            headerStyle: {
              backgroundColor: "#4CAF50",
            },
            headerTintColor: "#FFFFFF",
          }}
        />

        <Drawer.Screen
          name="Notifications"
          options={{
            title: "🔔 Notifications",
            headerStyle: {
              backgroundColor: "#4CAF50",
            },
            headerTintColor: "#FFFFFF",
          }}
        />
        {/* <Drawer.Screen
          name="Settings"
          options={{ title: "⚙️ Settings" }}
        /> */}
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  logo: {
    marginRight: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  notificationIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    padding: 2,
    minWidth: 20,
    minHeight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
