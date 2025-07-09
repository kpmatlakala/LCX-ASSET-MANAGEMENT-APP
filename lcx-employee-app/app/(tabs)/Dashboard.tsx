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
import { useAuth } from "@/context/AuthContext";

export default function AssetManagementDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { assets, myAssetRequests, loading } = useAssets();
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [expandedActionId, setExpandedActionId] = useState(null);
  const { session, firstName, lastName } = useAuth();
  const userName = session?.user?.user_metadata?.full_name || session?.user?.email || "User";
  const displayName = (firstName && lastName) ? `${firstName}` : userName;

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

  const quickActions = [
    {
      id: 1,
      name: "Inventory",
      icon: <DocumentText size={22} color="#666" />,
      onPress: () => router.push("/(tabs)/Inventory"),
    },
    {
      id: 2,
      name: "Request Asset",
      icon: <Add size={22} color="#666" />,
      onPress: () => router.push("/(tabs)/RequestAsset"),
    },
    {
      id: 3,
      name: "View Assets History",
      icon: <ArchiveBook size={22} color="#666" />,
      onPress: () => router.push("/(tabs)/MyAssets"),
    },
  ];

  useEffect(() => {
    if (assets && assets.length > 0) 
    {
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
  myAssetRequests.filter((asset) => (asset.status === "Pending") || ((asset.status === "Approved")) ).length || 0;
  
  const overdueCount =
  myAssetRequests.filter((asset) => asset.status === "Overdue").length || 0;
  
  const borrowedCount =
  myAssetRequests.filter((asset) => asset.status === "Dispatched").length ||
  myAssetRequests.length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />

      {/* Dashboard Title */}
      <Text className="text-3xl font-medium mx-5 mb-2 text-gray-6+00">
        {greetUser()}, {displayName}
      </Text>

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
                <Text className="text-xl font-bold">Available Assets ({assets?.length})</Text>
                <TouchableOpacity onPress={() => router.push("/Inventory")}>
                  <Text className="text-sm font-medium">View All</Text>
                </TouchableOpacity>
              </View>

              <View className="mx-5">
                {filteredAssets.slice(0, 3).map((asset) => (
                  <TouchableOpacity
                    key={asset.asset_id}
                    className="bg-white rounded-xl p-4 mb-3 shadow-[#edf2f4] border border-gray-200"
                    onPress={() => router.push({
                      pathname:`/RequestAsset`,
                      params: { assetId: asset.asset_id}
                      
                    }
                  )}
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-base font-bold text-gray-800">
                          {asset.asset_name}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          {asset.asset_type}
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
 
    </SafeAreaView>
  );
}