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
      icon: <DocumentText size={22} color="white" />,
      onPress: () => router.push("/(tabs)/Inventory"),
    },
    {
      id: 2,
      name: "Request Asset",
      icon: <Add size={22} color="white" />,
      onPress: () => router.push("/(tabs)/RequestAsset"),
    },
    {
      id: 3,
      name: "View Assets History",
      icon: <ArchiveBook size={22} color="white" />,
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

  const p = `
  <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      {/* Greeting and Profile */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 8, marginHorizontal: 24 }}>
        <View style={{ marginRight: 16 }}>
          <Avatar
            rounded
            size={48}
            title={initials}
            containerStyle={{ backgroundColor: '#b8ca41' }}
          />
        </View>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0d1a31' }}>{greetUser()},</Text>
          <Text style={{ fontSize: 18, color: '#8E8E93', fontWeight: '600' }}>{userName}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Stats Cards */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 8 }}>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}><Box size={28} color="#b8ca41" variant="Bold" /></View>
            <Text style={styles.statValue}>{borrowedCount}</Text>
            <Text style={styles.statLabel}>Borrowed</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}><Clock size={28} color="#4a90e2" variant="Bold" /></View>
            <Text style={styles.statValue}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}><Danger size={28} color="#FF6B6B" variant="Bold" /></View>
            <Text style={styles.statValue}>{overdueCount}</Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
        </View>
        `

  return (
    <SafeAreaView className="flex-1 bg-[#f8f9fa]">
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      {/* Colored header block */}
      <View className="bg-[#b8ca41] pb-5 rounded-b-3xl">
        {/* Dashboard Title */}
        <Text className="text-3xl font-bold mx-5 pt-6 mb-2 text-white drop-shadow-lg">
          {greetUser()}, {displayName}
        </Text>

        {/* Main Stats Cards */}
        <View className="mt-2">
          {/* Borrowed Assets Card */}
          <View className="bg-[#ffffff69] rounded-xl p-4 mb-3 flex-row-reverse items-center justify-between border border-[#e6e6e6] mx-5 shadow-md">
            <View className="bg-[#e3f0fa] rounded-lg p-3 mr-3">
              <Box size={25} color="#b8ca41" variant="Bold" />
            </View>
            <View className="flex-1 items-start">
              <Text className="text-3xl font-bold text-gray-800">{borrowedCount}</Text>
              <Text className="text-base text-gray-600">Borrowed Assets</Text>
            </View>
          </View>
          {/* Pending Card */}
          <View className="bg-[#ffffff69] rounded-xl p-4 mb-3 flex-row-reverse items-center justify-between border border-[#e6e6e6] mx-5 shadow-md">
            <View className="bg-[#e3f0fa] rounded-lg p-3 mr-3">
              <Clock size={25} color="#4a90e2" variant="Bold" />
            </View>
            <View className="flex-1 items-start">
              <Text className="text-3xl font-bold text-gray-800">{pendingCount}</Text>
              <Text className="text-base text-gray-600">Pending</Text>
            </View>
          </View>
          {/* Overdue Card */}
          <View className="bg-[#ffffff69] rounded-xl p-4 mb-3 flex-row-reverse items-center justify-between border border-[#e6e6e6] mx-5 shadow-md">
            <View className="bg-[#ffeaea] rounded-lg p-3 mr-3">
              <Danger size={25} color="#FF6B6B" variant="Bold" />
            </View>
            <View className="flex-1 items-start">
              <Text className="text-3xl font-bold text-gray-800">{overdueCount}</Text>
              <Text className="text-base text-gray-600">Overdue</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Rest of the dashboard (Quick Actions, etc.) */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Quick Actions with colored backgrounds */}
        <View className="mt-4">
          <Text className="text-xl font-bold mx-5 mb-3 text-[#b8ca41]">Quick Actions</Text>
          <View className="mx-5">
            {quickActions.map((action, idx) => (
              <TouchableOpacity
                key={action.id}
                className={`rounded-xl p-4 mb-3 flex-row items-center justify-between border border-gray-200 bg-[#f8f9fa]`}
                onPress={action.onPress}
              >
                <View className="flex-row items-center">
                  <View className="bg-[#b8ca41] rounded-lg p-2 mr-3">
                    {action.icon}
                  </View>
                  <Text className="text-base font-medium text-gray-800">
                    {action.name}
                  </Text>
                </View>
                <ArrowRight2 size={20} color="#b8ca41" />
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
    </SafeAreaView>
  );
}