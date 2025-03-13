import { Text, View, Image, ScrollView, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { router, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Feather } from '@expo/vector-icons';

const signup = () => {
  const [form, setForm] = useState({
    fullNames: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleInputChange = (field, value) => {
    setForm(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const submit = () => {
    if (!termsAccepted) {
      // Show terms error
      return;
    }
    
    setIsSubmitting(true);
    // Add your registration logic here
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/signin");
    }, 1500);
  };

  return (
    <SafeAreaView className="bg-[#f5f8dc] flex-1">
      <ScrollView>
        <View className="flex-1 px-6 py-8 bg-white rounded-3xl mx-4 my-4">
          <View className="items-center">
            <Image
              source={images.Logo}
              resizeMode="contain"
              className="w-[170px] h-[100px] mb-6"
            />
          </View>
          
          <Text className="text-2xl font-semibold text-headings mb-6">Sign up</Text>

          <FormField
            title="Full Names"
            value={form.fullNames}
            handleChangeText={(text) => handleInputChange("fullNames", text)}
            otherStyles="mb-4"
            placeholder="Enter your full names"
          />
          
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(text) => handleInputChange("email", text)}
            otherStyles="mb-4"
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          
          {/* Phone Number Field */}
          <View className="mb-4">
            <Text className="text-base font-medium text-texts mb-2">Phone number</Text>
            <View className="flex-row border border-gray-200 rounded-lg h-12 items-center">
              <View className="flex-row items-center px-3 border-r border-gray-200 h-full">
                <Text className="text-base text-gray-800 mr-1">+27</Text>
                <Feather name="chevron-down" size={16} color="#666666" />
              </View>
              <TextInput
                className="flex-1 h-full px-4 text-base text-gray-800"
                value={form.phoneNumber}
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                placeholder="00 000 0000"
                placeholderTextColor="#AAAAAA"
                keyboardType="phone-pad"
              />
            </View>
          </View>
          
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(text) => handleInputChange("password", text)}
            otherStyles="mb-4"
            placeholder="Enter your password"
            isPassword={true}
          />
          
          <FormField
            title="Confirm Password"
            value={form.confirmPassword}
            handleChangeText={(text) => handleInputChange("confirmPassword", text)}
            otherStyles="mb-6"
            placeholder="Repeat your password"
            isPassword={true}
          />
          
          <View className="flex-row items-center mb-6">
            <TouchableOpacity 
              className="mr-2" 
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View className={`w-5 h-5 border rounded ${termsAccepted ? 'bg-[#A9BE28] border-[#A9BE28]' : 'border-gray-300'} justify-center items-center`}>
                {termsAccepted && <Feather name="check" size={14} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
            <Text className="text-sm font-semibold text-headings">
              I understand the terms and condition
            </Text>
          </View>

          <CustomButton
            title="Register"
            handlePress={submit}
            containerStyles="mb-6"
            isLoading={isSubmitting}
          />

          <View className="flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/signin" asChild>
              <Text className="font-semibold text-[#A9BE28]">Sign in</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signup;