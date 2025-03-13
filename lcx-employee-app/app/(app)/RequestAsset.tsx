import {
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
  } from "react-native";
  import React, { useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { router } from "expo-router";
  import { images } from "@/constants";
  import FormField from "@/components/FormField";
  import CustomButton from "@/components/CustomButton";
  
  import {
    ArrowDown2,
    Notification,
    SearchNormal1,
    User,
  } from "iconsax-react-native";
  
  const RequestAssets = () => {
    // State variables for each input
    const [search, setSearch] = useState("");
    const [purpose, setPurpose] = useState("");
    const [duration, setDuration] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    // State for handling dropdown visibility and filtered options
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [filteredAssets, setFilteredAssets] = useState([]);
  
    // List of available assets (this would typically come from your API or static data)
    const assets = [
      { id: 1, name: "MacBook Pro", code: "MBP2023-001", status: "Available" },
      { id: 2, name: "MacBook Air", code: "MBA2023-002", status: "Unavailable" },
      { id: 3, name: "iPad Pro", code: "IP2023-003", status: "Available" },
      // Add more assets as needed
    ];
  
    // Handle input change
    const handleInputChange = (field, value) => {
      switch (field) {
        case "search":
          setSearch(value);
          filterAssets(value);
          break;
        case "purpose":
          setPurpose(value);
          break;
        case "duration":
          setDuration(value);
          break;
        case "password":
          setPassword(value);
          break;
        default:
          break;
      }
    };
  
    // Filter assets based on search query
    const filterAssets = (searchText) => {
      const filtered = assets.filter((asset) =>
        asset.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredAssets(filtered);
    };
  
    // Toggle dropdown visibility
    const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };
  
    const submitRequest = () => {
      setIsSubmitting(true);
      // Add your submission logic here
      setTimeout(() => {
        setIsSubmitting(false);
        // router.push("/success");
      }, 1500);
    };
  
    return (
      <SafeAreaView className="bg-[#f5f8dc] flex-1">
        <ScrollView>
          <View className="flex-1 px-4 pb-8 bg-white rounded-3xl mx-4 my-4 relative">
            {/* Header with Logo and Notification/Profile */}
            <View className="flex-row justify-center items-center pt-4 pb-6">
              <Image
                source={images.Logo}
                resizeMode="contain"
                className="w-[170px] h-[100px]"
              />
              {/* <View className="flex-row">
                <TouchableOpacity className="mr-4 relative">
                  <Notification size="24" color="#333" />
                  <View className="w-4 h-4 bg-red-500 rounded-full absolute -top-1 -right-1 items-center justify-center">
                    <Text className="text-white text-xs font-bold">1</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <User size="24" color="#333" />
                </TouchableOpacity>
              </View> */}
            </View>
  
            {/* Search bar */}
            <View className="mb-6 border border-texts rounded-lg flex-row items-center px-4">
              <TextInput
                className="flex-1 h-12 text-base"
                placeholder="search"
                value={search}
                onChangeText={(text) => handleInputChange("search", text)}
              />
              <TouchableOpacity className="ml-2" onPress={toggleDropdown}>
                <SearchNormal1 size="24" color="#6666" />
              </TouchableOpacity>
            </View>
  
            {/* Request details section */}
            <Text className="text-xl font-bold mb-4">Request details</Text>
  
            {/* Asset dropdown */}
            <View className="mb-6">
              <TouchableOpacity onPress={toggleDropdown}>
                <View className="border border-gray-300 rounded-lg flex-row justify-between items-center px-4 py-2">
                  <View>
                    <Text className="text-base font-semibold">Select Asset</Text>
                    <Text className="text-sm text-texts">
                      {search || "Search for an asset"}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-sm text-primary mr-2">Available</Text>
                    <ArrowDown2 size="25" color="#333" />
                  </View>
                </View>
              </TouchableOpacity>
  
              {dropdownVisible && (
                <View className="mt-2 border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <TouchableOpacity
                        key={asset.id}
                        className="px-4 py-2"
                        onPress={() => {
                          setSearch(asset.name);
                          setDropdownVisible(false);
                        }}
                      >
                        <Text>{asset.name}</Text>
                        <Text className="text-sm text-gray-500">{asset.code}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text className="text-center text-gray-500">No results</Text>
                  )}
                </View>
              )}
            </View>
  
            {/* Purpose field */}
            <View className="mb-6">
              <FormField
                title="Purpose"
                value={purpose}
                handleChangeText={(text) => handleInputChange("purpose", text)}
                placeholder="Assignment"
              />
            </View>
  
            {/* Duration field */}
            <View className="mb-6">
              <FormField
                title="Duration"
                value={duration}
                handleChangeText={(text) => handleInputChange("duration", text)}
                placeholder="enter the date"
              />
            </View>
  
            {/* Password field */}
            <View className="mb-8">
              <FormField
                title="Password"
                value={password}
                handleChangeText={(text) => handleInputChange("password", text)}
                placeholder="Enter your password"
                isPassword={true}
              />
            </View>
  
            {/* Submit Button */}
            <CustomButton
              title="Submit Request"
              handlePress={submitRequest}
              containerStyles="bg-gray-300"
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default RequestAssets;
  