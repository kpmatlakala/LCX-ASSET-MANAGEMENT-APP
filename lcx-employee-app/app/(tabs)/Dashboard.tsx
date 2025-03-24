import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Box,
  Clock,
  Danger,
  ArrowRight2,
  DocumentText,
  Add,
  ArchiveBook,
  Notification,
} from "iconsax-react-native";
import { useAssets } from "@/context/AssetContext";
import { router } from "expo-router";
import { images } from "@/constants";

export default function AssetManagementDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { assets, loading } = useAssets();
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const [expandedActionId, setExpandedActionId] = useState(null);

  const notifications = [
    {
      id: 1,
      title: "Request Approved",
      message: "Dell XPS 15 Laptop request approved",
      subtext: "Please wait patiently for dispatch",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Request Pending",
      message: "MacBook Pro request is pending approval",
      subtext: "Please check back later",
      time: "1 hour ago",
      read: true,
    },
  ];

  const categories = ["All", "Laptops", "Phones", "Other"];

  const quickActions = [
    {
      id: 1,
      name: "Inventory",
      icon: <DocumentText size={20} color="#666" />,
      onPress: () => router.push("/inventory"),
    },
    {
      id: 2,
      name: "Request Asset",
      icon: <Add size={20} color="#666" />,
      onPress: () => router.push("/request-asset"),
    },
    {
      id: 3,
      name: "View Assets History",
      icon: <ArchiveBook size={20} color="#666" />,
      onPress: () => router.push("/asset-history"),
    },
  ];

  useEffect(() => {
    if (assets && assets.length > 0) {
      filterAssets(selectedCategory);
    }
  }, [assets, selectedCategory]);

  const filterAssets = (category) => {
    let filtered;
    if (category === "All") {
      filtered = assets.filter((asset) => asset.status === "Available");
    } else {
      filtered = assets.filter(
        (asset) => asset.status === "Available" && asset.category === category
      );
    }
    setFilteredAssets(filtered);
  };

  // Toggle action details expanded/collapsed
  const toggleActionDetails = (actionId) => {
    if (expandedActionId === actionId) {
      setExpandedActionId(null);
    } else {
      setExpandedActionId(actionId);
    }
  };

  // Calculate stats
  const pendingCount =
    assets.filter((asset) => asset.status === "Pending").length || 1;
  const overdueCount =
    assets.filter((asset) => asset.status === "Overdue").length || 1;
  const borrowedCount =
    assets.filter((asset) => asset.status === "Borrowed").length ||
    assets.length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />

      {/* Dashboard Title */}
      <Text className="text-3xl font-bold mx-5 mt-4 mb-2">Dashboard</Text>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#b8ca41" />
          <Text className="mt-3 text-base text-gray-600">
            Loading assets...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="mt-2">
            <Text className="text-xl font-bold mx-5 mb-3">Stats</Text>

            {/* Main Stats Card - Fixed styling for Borrowed Assets */}
            <View className="mx-5 mb-4">
              <View className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <LinearGradient
                  colors={["#FFF", "#F8F8F8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: 100 }}
                >
                  <View className="flex-row justify-between items-center h-full p-4">
                    <View className="bg-gray-200 rounded-xl p-3">
                      <Box size={24} color="#333" variant="Bold" />
                    </View>
                    <View className="flex-1 items-end">
                      <Text className="text-3xl font-bold text-gray-800">
                        {borrowedCount}
                      </Text>
                      <Text className="text-base text-gray-600">
                        Borrowed Assets
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/* Horizontal Stats Cards - Completely redesigned */}
            <View className="flex-row px-5 mb-4">
              {/* Pending Card */}
              <View className="flex-1 mr-2 rounded-xl overflow-hidden shadow-sm">
                <LinearGradient
                  colors={["#4a90e2", "#357dcb"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ height: 120, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                >
                  <View className="p-3">
                    <View className="bg-white/20 rounded-full p-2 w-10 h-10 flex items-center justify-center">
                      <Clock size={20} color="white" variant="Bold" />
                    </View>
                  </View>
                  
                  <View className="p-3 items-end">
                    <Text className="text-3xl font-bold text-white">{pendingCount}</Text>
                    <Text className="text-base text-white">Pending</Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Overdue Card */}
              <View className="flex-1 ml-2 rounded-xl overflow-hidden shadow-sm">
                <LinearGradient
                  colors={["#FF6B6B", "#ee5a5a"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ height: 120, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                >
                  <View className="p-3 text-end">
                    <View className="bg-white/20 rounded-full p-2 w-10 h-10 flex items-center justify-center">
                      <Danger size={20} color="white" variant="Bold" />
                    </View>
                  </View>
                  <View className="p-3 items-end">
                    <Text className="text-3xl font-bold text-white">{overdueCount}</Text>
                    <Text className="text-base text-white">Overdue</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mt-2">
            <Text className="text-xl font-bold mx-5 mb-3">Quick Actions</Text>
            <View className="mx-5">
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  className="bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between border border-gray-200"
                  onPress={action.onPress}
                >
                  <View className="flex-row items-center">
                    <View className="bg-gray-100 rounded-lg p-2 mr-3">
                      {action.icon}
                    </View>
                    <Text className="text-base font-medium text-gray-800">
                      {action.name}
                    </Text>
                  </View>
                  <ArrowRight2 size={20} color="#666" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Available Assets */}
          {filteredAssets.length > 0 && (
            <View className="mt-4 mb-2">
              <View className="flex-row justify-between items-center mb-3 mx-5">
                <Text className="text-xl font-bold">Available Assets</Text>
                <TouchableOpacity onPress={() => router.push("/all-assets")}>
                  <Text className="text-sm text-blue-500 font-medium">
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mx-5">
                {filteredAssets.slice(0, 3).map((asset) => (
                  <TouchableOpacity
                    key={asset.id}
                    className="bg-white rounded-xl p-4 mb-3 shadow-[#edf2f4] border border-gray-200"
                    onPress={() => router.push(`/asset-details/${asset.id}`)}
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-base font-bold text-gray-800">
                          {asset.name}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          ID: {asset.id}
                        </Text>
                      </View>
                      <Text
                        className={`text-sm font-semibold ${
                          asset.status === "Available"
                            ? "text-green-500"
                            : "text-blue-500"
                        }`}
                      >
                        {asset.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* Notifications Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={notificationModalVisible}
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl pb-6 max-h-[80%]">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
              <Text className="text-lg font-bold">Notifications</Text>
              <TouchableOpacity
                onPress={() => setNotificationModalVisible(false)}
              >
                <Text className="text-base text-blue-500 font-medium">
                  Close
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-[400px]">
              {notifications.map((notification) => (
                <View
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <View>
                    <Text className="text-base font-bold mb-1">
                      {notification.title}
                    </Text>
                    <Text className="text-sm text-gray-800 mb-0.5">
                      {notification.message}
                    </Text>
                    <Text className="text-xs text-gray-600 mb-1">
                      {notification.subtext}
                    </Text>
                    <Text className="text-xs text-gray-400 mt-1.5">
                      {notification.time}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}