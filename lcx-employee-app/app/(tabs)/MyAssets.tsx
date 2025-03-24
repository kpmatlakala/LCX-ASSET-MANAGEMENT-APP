import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAssets } from "@/context/AssetContext";
import { useAuth } from "@/context/AuthContext";
import ReturnForm from "@/components/ReturnForm";

interface Asset {
  id: number;
  name: string;
  status: string;
  category: string;
  serialNumber: string;
  location: string;
  condition: string;
  acquisitionDate: string;
  lastUpdated: string;
}

export default function MyAssetsScreen() {
  const { employeeId } = useAuth();
  const { myAssetRequests, getAssetById } = useAssets();
  const [selectedFilter, setSelectedFilter] = useState<string>("All...");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedAssetId, setExpandedAssetId] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Filter options
  const filterOptions: string[] = [
    "All...",
    "Available",
    "Assigned",
    "Maintenance",
    "Reserved",
  ];

  const getStatusStyles = (
    status: string
  ): { backgroundColor: string; borderColor: string } => {
    switch (status) {
      case "Available":
        return { backgroundColor: "#d1f4e0", borderColor: "#17c964" }; // Light green background, dark green border
      case "Assigned":
        return { backgroundColor: "#fdedd3", borderColor: "#f5a524" }; // Light orange background, dark orange border
      case "Maintenance":
        return { backgroundColor: "#fdd0df", borderColor: "#f5426c" }; // Light pink background, dark pink border
      case "Reserved":
        return { backgroundColor: "#f3f1260", borderColor: "#f3f1260" }; // Light yellow background, yellow border
      default:
        return { backgroundColor: "#f0f0f0", borderColor: "#cccccc" }; // Default light gray background, dark gray border
    }
  };

  // Toggle expanded asset details
  const toggleAssetDetails = (assetId: number): void => {
    if (expandedAssetId === assetId) {
      setExpandedAssetId(null);
    } else {
      setExpandedAssetId(assetId);
    }
  };

  // Navigate to request asset screen
  const handleRequestNewAsset = (): void => {
    router.push("/RequestAsset");
  };

  // Handle modal close
  const handleCloseModal = (): void => {
    setModalVisible(false);
    setSelectedAsset(null);
  };

  // Handle asset review
  const handleAssetReview = (assetId: number): void => {
    console.log(`Reviewing asset ${assetId}`);
    router.push("/AssetDetails");
  };

  // Handle asset return
  const handleAssetReturn = (requestId: number): void => {
    console.log(`Returning asset request ${requestId}`);
    setModalVisible(true);
  };

  // Filter logic for asset requests
  const filteredAssetRequests = myAssetRequests.filter((request) => {
    const matchesSearch =
      request.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.destination && request.destination.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      selectedFilter === "All..." ||
      (request.status && request.status === selectedFilter);

    return matchesSearch && matchesFilter && request.employee_id === employeeId;
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Assets Inventory section title with Request Asset button */}
      <View className="flex-row justify-between items-center mx-5 mt-4 mb-4">
        <Text className="text-2xl font-bold">My Assets</Text>
        {/* <TouchableOpacity
          className="flex-row items-center bg-[#0d1a31] px-4 py-2.5 rounded-full"
          onPress={handleRequestNewAsset}
        >
          <Feather name="plus" size={18} color="#fff" />
          <Text className="text-white font-bold ml-1.5">Request Asset</Text>
        </TouchableOpacity> */}
      </View>

      {/* Search and Filter Bar */}
      <View className="flex-row mx-5 mb-4">
        <View className="flex-1 flex-row items-center bg-white rounded-full px-4 py-1 mr-2.5 border border-gray-200">
          <Feather name="search" size={20} color="#666" className="mr-2" />
          <TextInput
            className="flex-1 text-sm text-gray-800"
            placeholder="Search my requests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          className="flex-row items-center bg-white px-4 py-2.5 rounded-full border border-gray-200"
          onPress={() => setShowFilterDropdown(!showFilterDropdown)}
        >
          <Text className="text-sm text-gray-500 mr-1">{selectedFilter}</Text>
          <Feather name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Filter dropdown menu */}
      {showFilterDropdown && (
        <View className="absolute top-[185px] right-5 bg-white rounded-lg border border-gray-200 z-10 shadow-sm">
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option}
              className="py-2.5 px-5 border-b border-gray-100"
              onPress={() => {
                setSelectedFilter(option);
                setShowFilterDropdown(false);
              }}
            >
              <Text className="text-sm text-gray-800">{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* My Assets List */}
      <ScrollView className="mx-5 flex-1">
        {filteredAssetRequests.length > 0 ? (
          filteredAssetRequests.map((request) => (
            <View key={request.request_id} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              {/* Request Card Header */}
              <View className="flex-row">
                <View className="flex-1 flex-row items-center justify-between">
                  <Text className="text-lg font-bold mb-1">
                    Request #{request.request_id}                      
                  </Text>
                  
                  <View
                    style={{
                      backgroundColor: getStatusStyles(request.status || "").backgroundColor,
                      borderColor: getStatusStyles(request.status || "").borderColor,
                      borderWidth: 1,
                    }}
                    className="px-2.5 py-0.5 rounded-full mb-2"
                  >
                    <Text
                      style={{
                        color: getStatusStyles(request.status || "").borderColor,
                      }}
                      className="font-bold text-xs"
                    >
                      {request.status || "Processing"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Summary Info Always Visible */}
              <View className="mt-1">
                <View className="flex-col">
                  <View className="flex-row items-center">
                    <Text className="text-sm text-gray-500 mr-1">Asset:</Text>
                    <Text className="text-sm text-gray-800">
                      {getAssetById(request.asset_id)?.asset_name || "Unknown Asset"} | {(request.asset_id) || "Unknown Serial Number"}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <Text className="text-sm text-gray-500 mr-1">Requested:</Text>
                    <Text className="text-sm text-gray-800">
                      {request.created_at || "Unknown date"}
                    </Text>
                  </View>
                </View>
                <View className="flex-1 flex-row items-center justify-between">
                  <Text className="text-xs text-gray-400 mt-1">
                    Last updated: {request.updated_at || "Not updated"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => toggleAssetDetails(request.request_id)}
                  >
                    <Feather
                      name={
                        expandedAssetId === request.request_id
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={24}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Expanded Details and Actions */}
              {expandedAssetId === request.request_id && (
                <View className="mt-2.5">
                  <View className="h-px bg-gray-100 my-2.5" />

                  {/* Additional Details */}
                  <View className="mb-2.5">
                    <View className="flex-row">
                      <View className="flex-1">
                        <Text className="text-sm text-gray-500 mb-0.5">Purpose:</Text>
                        <Text className="text-sm text-gray-800">
                          {request.purpose || "Not specified"}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm text-gray-500 mb-0.5">Destination:</Text>
                        <Text className="text-sm text-gray-800">
                          {request.destination || "Not specified"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="h-px bg-gray-100 my-2.5" />

                  {/* Action Buttons */}
                  <View className="flex-row flex-wrap justify-between">
                    <TouchableOpacity
                      className="flex-row items-center bg-gray-100 px-3 py-2 rounded-full mr-2 mb-2"
                      onPress={() => handleAssetReview(request.request_id)}
                    >
                      <Feather name="eye" size={16} color="#333" />
                      <Text className="text-sm text-gray-800 ml-1">
                        View Details
                      </Text>
                    </TouchableOpacity>

                    {request.status === "Assigned" && (
                      <TouchableOpacity
                        className="flex-row items-center bg-[#f5a524] px-3 py-2 rounded-full mr-2 mb-2"
                        onPress={() => handleAssetReturn(request.request_id)}
                      >
                        <Feather
                          name="corner-up-left"
                          size={16}
                          color="#fff"
                        />
                        <Text className="text-sm text-white ml-1">
                          Return Asset
                        </Text>
                      </TouchableOpacity>
                    )}

                    {request.status === "Pending" && (
                      <TouchableOpacity
                        className="flex-row items-center bg-[#f44336] px-3 py-2 rounded-full mr-2 mb-2"
                        onPress={() => console.log("Cancel request")}
                      >
                        <Feather name="x-circle" size={16} color="#fff" />
                        <Text className="text-sm text-white ml-1">
                          Cancel Request
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View className="items-center justify-center py-10">
            <Feather name="box" size={48} color="#ccc" />
            <Text className="text-base text-gray-500 mt-4 text-center">
              You have no asset requests
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal with ReturnForm */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center bg-black/50">
          <View className="bg-white flex-1 mt-16 rounded-t-3xl overflow-hidden">
            <View className="flex-row justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <Text className="text-xl font-bold">Return Asset</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Pass the selected asset to ReturnForm if needed */}
            {selectedAsset && (
              <View className="flex-1">
                <ReturnForm
                  assetName={selectedAsset.name}
                  assetId={selectedAsset.serialNumber}
                  onClose={handleCloseModal}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}