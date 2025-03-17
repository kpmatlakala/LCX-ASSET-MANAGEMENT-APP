import { Text, View, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { router, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

const signin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setForm(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const submit = () => {
    setIsSubmitting(true);
    // Add your authentication logic here
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/home");
    }, 1500);
  };

  return (
    <SafeAreaView className="bg-[#f5f8dc] flex-1">
      <ScrollView>
        <View className="flex-1 px-6 py-8 bg-white rounded-3xl mx-4 my-4 relative min-h-[85vh]">
          <View className="items-center">
            <Image
              source={images.Logo}
              resizeMode="contain"
              className="w-[170px] h-[100px] mb-8"
            />
          </View>
          
          <Text className="text-2xl font-semibold text-headings mb-1">Welcome Back</Text>
          <Text className="text-base font-semibold text-texts mb-8">Sign in to continue</Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm(...form, { email: e })}
            otherStyles="mb-5"
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(text) => handleInputChange("password", text)}
            otherStyles="mb-2"
            placeholder="Enter your password"
            isPassword={true}
          />
          
          <Text 
            className="text-right text-primary font-semibold mb-6"
            onPress={() => router.push("/forgot-password")}
          >
            Forgot Password
          </Text>

          <CustomButton
            title="Continue"
            handlePress={() => {
              router.push("/RequestAsset");
            }}
            containerStyles="mb-6"
            isLoading={isSubmitting}
          />

          <View className="flex-row justify-center mb-10">
            <Text className="text-texts font-semibold">Don't have an account? </Text>
            <Link href="/signup" asChild>
              <Text className="font-semibold text-primary">Sign Up</Text>
            </Link>
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signin;