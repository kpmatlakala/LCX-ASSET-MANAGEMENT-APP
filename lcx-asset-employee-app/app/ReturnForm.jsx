import { Text, View, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";

const ReturnForm = () => {
  const [assetCondition, setAssetCondition] = useState("Fair");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const conditions = ["Excellent", "Fair", "Good", "Damaged"];

  const submitReturn = () => {
    setIsSubmitting(true);
    //Kabelo Please add submit logic here
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("");
    }, 1500);
  };

  return (
    <SafeAreaView className="bg-[#f5f8dc] flex-1">
      <ScrollView>
        <View className="flex-1 px-6 py-8 bg-white rounded-3xl mx-4 my-4">
          {/* Header with Logo */}
          <View className="items-center mb-8">
            <Image
              source={images.Logo}
              resizeMode="contain"
              className="w-[170px] h-[100px]"
            />
          </View>

          {/* Assets assigned section */}
          <Text className="text-xl font-bold mb-4">Assets assigned</Text>
          
          {/* Asset info */}
          <View className="border border-gray-300 rounded-lg p-4 mb-6">
            <Text className="text-base font-semibold">Dell XPS 15 Laptop</Text>
            <Text className="text-sm text-texts">MBP2023-001</Text>
          </View>

          {/* Return details section */}
          <Text className="text-xl font-bold mb-2">Return details</Text>
          <Text className="text-base text-headings mb-4">Assets condition</Text>
          
          {/* Condition checkboxes */}
          <View className="mb-6">
            {conditions.map((condition) => (
              <TouchableOpacity 
                key={condition}
                className="flex-row items-center py-2"
                onPress={() => setAssetCondition(condition)}
              >
                <View className={`w-5 h-5 border rounded mr-3 items-center justify-center ${assetCondition === condition ? 'border-black' : 'border-texts'}`}>
                  {assetCondition === condition && (
                    <View className="w-3 h-3 bg-black rounded-sm" />
                  )}
                </View>
                <Text className="text-base">{condition}</Text>
                {condition === "Damaged"}
              </TouchableOpacity>
            ))}
          </View>

          {/* Notes field */}
          <View className="mb-8">
            <Text className="text-base text-gray-600 mb-2">Notes</Text>
            <View className="border border-gray-300 rounded-lg px-4 py-3">
              <TextInput
                className="min-h-20 text-base"
                placeholder="additional notes"
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
          </View>

          {/* Submit Button */}
          <CustomButton
            title="Submit"
            handlePress={submitReturn}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReturnForm;