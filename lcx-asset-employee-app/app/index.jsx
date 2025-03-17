import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import Svg, { Path } from "react-native-svg";

const index = () => {
  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          style={{ width: "100%", height: 100 }}
        >
          <Path
            fill="#b8ca41"
            fillOpacity="1"
            d="M0,224L48,218.7C96,213,192,203,288,213.3C384,224,480,256,576,224C672,192,768,96,864,90.7C960,85,1056,171,1152,186.7C1248,203,1344,149,1392,122.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </Svg>

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
      <StatusBar backgroundColor="#b8ca41" barStyle="dark-content" />
    </SafeAreaView>
  );
};

export default index;
