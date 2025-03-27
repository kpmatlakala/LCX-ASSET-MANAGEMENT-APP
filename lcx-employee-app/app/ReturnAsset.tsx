import { Text, View, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Notification, TickCircle, User } from "iconsax-react-native";

type AssetCondition = "Excellent" | "Fair" | "Good" | "Damaged";

interface ReturnFormProps {
  assetName?: string;
  assetId?: string;
  onClose?: () => void;
}

const ReturnForm: React.FC<ReturnFormProps> = ({ assetName = "Dell XPS 15 Laptop", assetId = "MBP2023-001", onClose }) => {
  const [assetCondition, setAssetCondition] = useState<AssetCondition>("Fair");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const conditions: AssetCondition[] = ["Excellent", "Fair", "Good", "Damaged"];

  const submitReturn = (): void => {
    setIsSubmitting(true);
    //Submission logic here
    setTimeout(() => {
      setIsSubmitting(false);
      if (onClose) {
        onClose(); // Close the modal if function is provided
      } else {
        router.push("/Verify"); // Otherwise use router
      }
    }, 1500);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View className="flex-1 px-6 py-8 bg-white rounded-3xl mx-4 my-4">

        {/* Assets assigned section */}
        <Text className="text-xl font-bold mb-4">Asset Request</Text>
        
        {/* Asset info */}
        <View className="border border-gray-300 rounded-lg p-4 mb-6">
          <Text className="text-base font-semibold">{assetName}</Text>
          <Text className="text-sm text-texts">{assetId}</Text>
        </View>

        {/* Return details section */}
        <Text className="text-xl font-bold mb-2">Request details</Text>
        <Text className="text-base text-headings mb-4">Asset condition</Text>
        
        {/* Condition checkboxes */}
        <View className="mb-6">
          {conditions.map((condition) => (
            <TouchableOpacity 
              key={condition}
              className="flex-row items-center py-2"
              onPress={() => setAssetCondition(condition)}
            >
              <View className={`w-5 h-5 border rounded-full mr-3 items-center justify-center ${assetCondition === condition ? 'border-[#c6d567] bg-[#c6d567]' : 'border-texts'}`}>
                {assetCondition === condition && (
                  <TickCircle size="16" color="#fff" variant="Bold"/>
                )}
              </View>
              <Text className="text-base">{condition}</Text>
              {condition === "Damaged"}
            </TouchableOpacity>
          ))}
        </View>

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

        <CustomButton
          title="Submit Request"
          handlePress={submitReturn}
          isLoading={isSubmitting}
        />
      </View>
    </ScrollView>
  );
};

export default ReturnForm;