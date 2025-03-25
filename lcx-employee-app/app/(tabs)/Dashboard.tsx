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

  const greetUser = (): string => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Good Morning";
    } else if (hours < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

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
      icon: <DocumentText size={22} color="#666" />,
      onPress: () => router.push("/inventory"),
    },
    {
      id: 2,
      name: "Request Asset",
      icon: <Add size={22} color="#666" />,
      onPress: () => router.push("/request-asset"),
    },
    {
      id: 3,
      name: "View Assets History",
      icon: <ArchiveBook size={22} color="#666" />,
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
      <Text className="text-3xl font-medium mx-5 mb-2 text-gray-6+00">{greetUser()}, Frankie</Text>

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

            {/* Main Stats Card - Borrowed Assets */}
            <View className="mx-5 mb-4">
              <View className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                <View className="flex-row justify-between items-center h-full p-4" style={{ height: 100 }}>
                  <View className="bg-[#f8f8f8] rounded-xl p-3">
                    <Box size={25} color="#b8ca41" variant="Bold" />
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
              </View>
            </View>

            {/* Horizontal Stats Cards - Updated with matching borders */}
            <View className="flex-row px-5 mb-4">
              {/* Pending Card */}
              <View className="flex-1 mr-2 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                <View className="flex-row justify-between items-center p-4" style={{ height: 100 }}>
                  <View className="bg-[#f8f8f8] rounded-full p-2 w-10 h-10 flex items-center justify-center">
                    <Clock size={25} color="#4a90e2" variant="Bold" />
                  </View>
                  <View className="items-end">
                    <Text className="text-3xl font-bold text-gray-800">
                      {pendingCount}
                    </Text>
                    <Text className="text-base text-gray-600">Pending</Text>
                  </View>
                </View>
              </View>

              {/* Overdue Card */}
              <View className="flex-1 ml-2 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                <View className="flex-row justify-between items-center p-4" style={{ height: 100 }}>
                  <View className="bg-[#f8f8f8] rounded-full p-2 w-10 h-10 flex items-center justify-center">
                    <Danger size={25} color="#FF6B6B" variant="Bold" />
                  </View>
                  <View className="items-end">
                    <Text className="text-3xl font-bold text-gray-800">
                      {overdueCount}
                    </Text>
                    <Text className="text-base text-gray-600">Overdue</Text>
                  </View>
                </View>
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
                <TouchableOpacity onPress={() => router.push("/Inventory")}>
                  <Text className="text-sm font-medium">View All</Text>
                </TouchableOpacity>
              </View>

              <View className="mx-5">
                {filteredAssets.slice(0, 3).map((asset) => (
                  <TouchableOpacity
                    key={asset.asset_id}
                    className="bg-white rounded-xl p-4 mb-3 shadow-[#edf2f4] border border-gray-200"
                    onPress={() => router.push(`/RequestAsset`)}
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-base font-bold text-gray-800">
                          {asset.asset_name}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          ID: {asset.asset_type}
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