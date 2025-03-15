import { Text, View, Image, TextInput, Keyboard } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";

const Verify = () => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inputRefs = useRef([]);
  

  useEffect(() => {
    inputRefs.current = Array(6).fill().map((_, i) => inputRefs.current[i] || React.createRef());
  }, []);

  // Handle input change and auto-focus to next field
  const handleInputChange = (text, index) => {
    // Only allow one character per input and only digits
    if (text.length > 1 || !/^\d*$/.test(text)) return;

    // Update the verification code
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = text;
    setVerificationCode(newVerificationCode);

    // Auto focus to next input if the current one has a value
    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key to navigate to previous input
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const submitVerification = () => {
    const code = verificationCode.join("");
    if (code.length !== 6) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("");
    }, 1500);
  };

  return (
    <SafeAreaView className="bg-[#f5f8dc] flex-1">
      <View className="flex-1 px-6 py-8 bg-white rounded-3xl mx-4 my-4 items-center justify-center">
        <Image
          source={images.Logo}
          resizeMode="contain"
          className="w-[170px] h-[100px] mb-12"
        />
        
        <Text className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Verify Your Identity
        </Text>
        
        <Text className="text-base text-gray-500 mb-8 text-center">
          Enter the 6-digit code sent to your{"\n"}
          email or phone to complete sign-in.
        </Text>
        
        <View className="flex-row justify-between w-full px-4 mb-10">
          {verificationCode.map((digit, index) => (
            <View 
              key={index} 
              className="w-12 h-12 border border-gray-300 rounded-lg items-center justify-center"
            >
              <TextInput
                ref={ref => inputRefs.current[index] = ref}
                className="w-full h-full text-center text-xl font-bold"
                value={digit}
                onChangeText={(text) => handleInputChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
              />
            </View>
          ))}
        </View>
        
        {/* Sign In Button */}
        <View className="w-full">
          <CustomButton
            title="Sign In"
            handlePress={() => {
                router.push("/PendingAssets");
            }}
            isLoading={isSubmitting}
            containerStyles="bg-black"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Verify;