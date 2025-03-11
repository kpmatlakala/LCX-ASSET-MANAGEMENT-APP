import { Image, ScrollView, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";

const index = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 w-full justify-center items-center px-4">
          <Image
            source={images.Logo}
            className="w-[230px] h-[165px]"
            resizeMode="contain"
          />
        </View>

        <View className="px-4 mb-20">
          <CustomButton
            title="Let's Get Started"
            handlePress={() => {
              router.push("/signin");
            }}
            containerStyle="w-full mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
