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
  ArrowUp2,
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

      {/* Header with Logo and Notification */}
      {/* <View className="flex-row justify-between items-center px-5 py-3 bg-white border-b border-gray-100">
        <View>
          <Image source={images.Logo} resizeMode="contain" className="w-[120px] h-[40px]" />
        </View>
        <TouchableOpacity 
          className="relative p-2"
          onPress={() => setNotificationModalVisible(true)}
        >
          <Notification size={24} color="#333" />
          {notifications.some(n => !n.read) && (
            <View className="absolute right-[2px] top-[2px] bg-red-500 rounded-full w-4 h-4 flex items-center justify-center z-10">
              <Text className="text-white text-[10px] font-bold">
                {notifications.filter(n => !n.read).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View> */}

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

            {/* Main Stats Card */}
            <TouchableOpacity
              className="mx-5 mb-4 bg-white rounded-xl"
              activeOpacity={0.9}
              // onPress={() => router.push("/borrowed-assets")}
            >
              <LinearGradient
                colors={["#FFF", "#F8F8F8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-xl p-4 h-[100px] flex-row justify-between items-center shadow-xl border border-gray-50"
              >
                <View className="bg-black/20 rounded-xl p-2">
                  <Box size={24} color="grey" variant="Bold" />
                </View>
                <View className="flex-1 items-end">
                  <Text className="text-3xl font-bold text-grey">
                    {borrowedCount}
                  </Text>
                  <Text className="text-base text-grey opacity-90">
                    Borrowed Assets
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Horizontal Stats Cards */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="py-1"
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
            >
              <TouchableOpacity 
                className="mr-4"
                activeOpacity={0.9}
                // onPress={() => router.push("/pending-assets")}
              >
                <LinearGradient
                  colors={["#4a90e2", "#357dcb"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="rounded-xl p-4 w-[160px] h-[90px] flex-row justify-between items-center shadow-sm"
                >
                  <View className="bg-white/20 rounded-xl p-2">
                    <Clock size={24} color="white" variant="Bold" />
                  </View>
                  <View className="flex-1 items-end">
                    <Text className="text-3xl font-bold text-white">{pendingCount}</Text>
                    <Text className="text-base text-white opacity-90">Pending</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.9}
                // onPress={() => router.push("/overdue-assets")}
              >
                <LinearGradient
                  colors={["#FF6B6B", "#ee5a5a"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="rounded-xl p-4 w-[160px] h-[90px] flex-row justify-between items-center shadow-sm"
                >
                  <View className="bg-white/20 rounded-xl p-2">
                    <Danger size={24} color="white" variant="Bold" />
                  </View>
                  <View className="flex-1 items-end">
                    <Text className="text-3xl font-bold text-white">{overdueCount}</Text>
                    <Text className="text-base text-white opacity-90">Overdue</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Categories */}
          {/* <View className="mt-2">
            <Text className="text-xl font-bold mx-5 mb-3">Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-3"
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  className={`h-10 px-5 py-2 rounded-full mx-2 border ${
                    selectedCategory === category 
                      ? "bg-[#0d1a31] border-[#0d1a31]" 
                      : "bg-white border-gray-200"
                  } justify-center shadow-sm`}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedCategory === category ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View> */}

          {/* Quick Actions */}
          <View className="mt-4">
            <Text className="text-xl font-bold mx-5 mb-3">Quick Actions</Text>
            <View className="mx-5">
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  className="bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between shadow-sm border border-gray-50"
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
                    className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-50"
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
