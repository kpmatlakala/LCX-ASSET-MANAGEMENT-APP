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
import { images } from "../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Feather } from "@expo/vector-icons";
import {
  ArrowDown2,
  Maximize3,
  Notification,
  SearchNormal1,
  User,
} from "iconsax-react-native";

const RequestAssets = () => {
  const [form, setForm] = useState({
    search: "",
    purpose: "",
    duration: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const submitRequest = () => {
    setIsSubmitting(true);
    // Add your submission logic here
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/success");
    }, 1500);
  };

  return (
    <SafeAreaView className="bg-[#f5f8dc] flex-1">
      <ScrollView>
        <View className="flex-1 px-4 pb-8 bg-white rounded-3xl mx-4 my-4 relative">
          {/* Header with Logo and Notification/Profile */}
          <View className="flex-row justify-between items-center pt-4 pb-6">
            <Image
              source={images.Logo}
              resizeMode="contain"
              className="w-[170px] h-[100px]"
            />
            <View className="flex-row">
              <TouchableOpacity className="mr-4 relative">
                <Notification size="24" color="#333" />
                <View className="w-4 h-4 bg-red-500 rounded-full absolute -top-1 -right-1 items-center justify-center">
                  <Text className="text-white text-xs font-bold">1</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <User size="24" color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search bar */}
          <View className="mb-6 border border-texts rounded-lg flex-row items-center px-4">
            <TextInput
              className="flex-1 h-12 text-base"
              placeholder="search"
              value={form.search}
              onChangeText={(text) => handleInputChange("search", text)}
            />
            <TouchableOpacity className="ml-2">
              <SearchNormal1 size="24" color="#6666" />
            </TouchableOpacity>
          </View>

          {/* Request details section */}
          <Text className="text-xl font-bold mb-4">Request details</Text>

          {/* Asset dropdown */}
          <View className="mb-6">
            <View className="border border-gray-300 rounded-lg flex-row justify-between items-center px-4 py-2">
              <View>
                <Text className="text-base font-semibold">MacBook Pro</Text>
                <Text className="text-sm text-texts">MBP2023-001</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-sm text-primary mr-2">Available</Text>
                <ArrowDown2 size="25" color="#333" />
              </View>
            </View>
            {/* <TouchableOpacity className="absolute right-2 top-1/2 -translate-y-1/2">
            <Maximize3 size="25" color="#333"/>
            </TouchableOpacity> */}
          </View>

          {/* Purpose field */}
          <View className="mb-6">
            <FormField
              title="Purpose"
              value={form.purpose}
              handleChangeText={(text) => handleInputChange("purpose", text)}
              placeholder="Assignment"
            />
          </View>

          {/* Duration field */}
          <View className="mb-6">
            <FormField
              title="Duration"
              value={form.duration}
              handleChangeText={(text) => handleInputChange("duration", text)}
              placeholder="enter the date"
            />
          </View>

          {/* Password field */}
          <View className="mb-8">
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(text) => handleInputChange("password", text)}
              placeholder="Enter your password"
              isPassword={true}
            />
          </View>

          {/* Submit Button */}
          <CustomButton
            title="Submit Request"
            handlePress={() => {
              router.push("/ReturnForm");
            }}
            containerStyles="bg-gray-300"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestAssets;
