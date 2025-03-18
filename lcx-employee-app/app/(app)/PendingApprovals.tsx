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

  const getStatusStyles = (status: string): { backgroundColor: string; borderColor: string } => {
    switch (status) {
      case "Pending Approval":
        return { backgroundColor: "#fdd0df", borderColor: "#f5426c" }; // Light pink background, dark pink border
      case "Processing":
        return { backgroundColor: "#fdedd3", borderColor: "#f5a524" }; // Light orange background, dark orange border
      case "Pending Collection":
        return { backgroundColor: "#d1f4e0", borderColor: "#17c964" }; // Light green background, dark green border
      default:
        return { backgroundColor: "#f0f0f0", borderColor: "#cccccc" }; // Default light gray background, dark gray border
    }
  };

  const filteredAssets = pendingAssets.filter((asset) => {
    if (selectedTab === "All Requests") return true;
    if (selectedTab === "Pending") return asset.status === "Pending Approval";
    if (selectedTab === "Approved")
      return asset.status === "Pending Collection";
    return false;
  });

  const renderAssetItem = ({ item }: { item: Asset }) => {
    const { backgroundColor, borderColor } = getStatusStyles(item.status);

    return (
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
          <View
            style={{
              backgroundColor,
              borderColor,
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: borderColor,
                fontWeight: "500",
              }}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView>
        <View className="flex-1 px-4 pb-8 bg-white rounded-3xl mx-4 my-4 relative">
          {/* Page Title */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-3xl font-bold mb-4">Pending Approvals</Text>
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