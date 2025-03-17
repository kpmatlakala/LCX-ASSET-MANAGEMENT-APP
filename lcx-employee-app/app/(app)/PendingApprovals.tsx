import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Notification, User, DirectInbox } from "iconsax-react-native";

interface Asset {
  id: string;
  name: string;
  code: string;
  requestDate: string;
  status: string;
}

const PendingApprovalsScreen: React.FC = () => {
  const [pendingAssets, setPendingAssets] = useState<Asset[]>([
    {
      id: "1",
      name: "MacBook Pro",
      code: "MBP2023-001",
      requestDate: "12 Mar 2025",
      status: "Pending Approval",
    },
    {
      id: "2",
      name: "Dell XPS 15 Laptop",
      code: "DXP2023-003",
      requestDate: "10 Mar 2025",
      status: "Processing",
    },
    {
      id: "3",
      name: 'iPad Pro 12.9"',
      code: "IPP2023-007",
      requestDate: "09 Mar 2025",
      status: "Pending Collection",
    },
  ]);

  const [selectedTab, setSelectedTab] = useState<string>("All Requests");

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending Approval":
        return "text-yellow-600";
      case "Processing":
        return "text-blue-600";
      case "Pending Collection":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredAssets = pendingAssets.filter((asset) => {
    if (selectedTab === "All Requests") return true;
    if (selectedTab === "Pending") return asset.status === "Pending Approval";
    if (selectedTab === "Approved")
      return asset.status === "Pending Collection";
    return false;
  });

  const renderAssetItem = ({ item }: { item: Asset }) => (
    <TouchableOpacity
      className="border border-texts rounded-lg p-4 mb-4"
      onPress={() => router.push(`/asset-details/${item.id}`)}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-base font-semibold">{item.name}</Text>
          <Text className="text-sm text-gray-500">{item.code}</Text>
          <Text className="text-sm text-texts mt-2">
            Requested: {item.requestDate}
          </Text>
        </View>
        <View className="items-end">
          <Text className={`${getStatusColor(item.status)} font-medium`}>
            {item.status}
          </Text>
          <Feather
            name="chevron-right"
            size={20}
            color="#666"
            className="mt-2"
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView>
        <View className="flex-1 px-4 pb-8 bg-white rounded-3xl mx-4 my-4 relative">
          <View className="flex-row justify-between items-center pt-4 pb-6">
            <View className="flex-row">
              <TouchableOpacity className="mr-4 relative">
                <Notification size="24" color="#4d4d4d" />
                <View className="w-4 h-4 bg-red-500 rounded-full absolute -top-1 -right-1 items-center justify-center">
                  <Text className="text-white text-xs font-bold">1</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <User size="24" color="#4d4d4d" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Page Title */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold">Pending Approvals</Text>
          </View>

          {/* Filter Tabs */}
          <View className="flex-row mb-6">
            <TouchableOpacity
              className={`mr-4 pb-2 ${
                selectedTab === "All Requests" ? "border-b-2 border-black" : ""
              }`}
              onPress={() => setSelectedTab("All Requests")}
            >
              <Text
                className={`text-base font-medium ${
                  selectedTab === "All Requests" ? "text-black" : "text-texts"
                }`}
              >
                All Requests
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`mr-4 pb-2 ${
                selectedTab === "Pending" ? "border-b-2 border-black" : ""
              }`}
              onPress={() => setSelectedTab("Pending")}
            >
              <Text
                className={`text-base font-medium ${
                  selectedTab === "Pending" ? "text-black" : "text-texts"
                }`}
              >
                Pending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`pb-2 ${
                selectedTab === "Approved" ? "border-b-2 border-black" : ""
              }`}
              onPress={() => setSelectedTab("Approved")}
            >
              <Text
                className={`text-base font-medium ${
                  selectedTab === "Approved" ? "text-black" : "text-texts"
                }`}
              >
                Approved
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pending Assets List */}
          {filteredAssets.length > 0 ? (
            <FlatList
              data={filteredAssets}
              renderItem={renderAssetItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View className="items-center justify-center py-12">
              <Feather name="inbox" size={56} color="#CCCCCC" />
              <DirectInbox size="32" color="#CCCCCC" />
              <Text className="text-lg text-texts mt-4">No assets found</Text>
            </View>
          )}

          {/* Request Assets Button */}
          {/* <View className="mt-4">
            <CustomButton
              title="View All Assets"
              handlePress={() => router.push("/all-assets")}
              containerStyles="bg-gray-200"
              textStyles="text-black"
            />
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PendingApprovalsScreen;