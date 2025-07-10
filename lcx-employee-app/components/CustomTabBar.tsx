import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Home2, ClipboardText, AddCircle, ClipboardTick, User } from "iconsax-react-native";

const tabs = [
  { name: "Dashboard", icon: Home2, label: "Home" },
  { name: "Inventory", icon: ClipboardText, label: "Inventory" },
  { name: "RequestAsset", icon: AddCircle, label: "Request" },
  { name: "MyAssets", icon: ClipboardTick, label: "My Assets" },
  { name: "Profile", icon: User, label: "Profile" },
];

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, idx) => {
        const focused = state.index === idx;
        const Icon = tab.icon;
        return (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tab,
              focused ? styles.activeTab : null
            ]}
            onPress={() => navigation.navigate(tab.name)}
          >
            <View style={focused ? styles.activeIconBox : styles.iconBox}>
              <Icon size={28} color={focused ? "white" : "#8E8E93"} variant={focused ? "Bold" : "Linear"} />
            </View>
            <Text style={[styles.label, focused && styles.labelFocused]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tab: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 6,
  },
  activeTab: {
    // Optionally add a little vertical offset or shadow for the active tab
  },
  iconBox: {
    padding: 8,
    borderRadius: 16,
  },
  activeIconBox: {
    backgroundColor: "#b8ca41",
    padding: 8,
    borderRadius: 16,
  },
  label: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  labelFocused: {
    color: "#b8ca41",
    fontWeight: "bold",
  },
});

export default CustomTabBar; 