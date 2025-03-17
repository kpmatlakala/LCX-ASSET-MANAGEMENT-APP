import { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import { Button, Input, Avatar, Icon } from "@rneui/themed";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-js";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
  Briefcase,
  Calendar,
  Call,
  Global,
  Hashtag,
  Home2,
  Location,
  Sms,
  User,
} from "iconsax-react-native";

const Profile = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Profile picture state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // User info state
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");

  // Read-only fields
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) getProfile(session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          getProfile(session);
        } else {
          router.replace("/(auth)/Auth"); // Redirect if signed out
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    requestMediaLibraryPermissions();
  }, []);

  const requestMediaLibraryPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your media library to upload a profile picture."
        );
      }
    }
  };

  async function getProfile(session: Session) {
    try {
      setLoading(true);
      const { user } = session;
      if (!user) throw new Error("No user found!");

      const { data, error } = await supabase
        .from("employees")
        .select(
          `
          full_name, employee_id, department, position, 
          office_location, date_joined, employment_status,
          phone_number, address, emergency_contact_name, 
          emergency_contact_phone, preferred_language,
          is_first_login, avatar_url
        `
        )
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setFullName(data.full_name || "");
        setPhoneNumber(data.phone_number || "");
        setAddress(data.address || "");
        setEmergencyContactName(data.emergency_contact_name || "");
        setEmergencyContactPhone(data.emergency_contact_phone || "");
        setPreferredLanguage(data.preferred_language || "English");
        setAvatarUrl(data.avatar_url);

        // Read-only fields
        setEmployeeId(data.employee_id);
        setDepartment(data.department);
        setPosition(data.position);
        setOfficeLocation(data.office_location);
        setDateJoined(data.date_joined);
        setEmploymentStatus(data.employment_status);

        // Check if this is user's first login
        setIsFirstLogin(data.is_first_login);

        // If first login, show welcome message
        if (data.is_first_login) {
          Alert.alert("Welcome!", "Please complete your profile information.");
        }
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedAsset = result.assets[0];
        await uploadProfilePicture(selectedAsset.uri, selectedAsset.base64);
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message);
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera permission to take a photo"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedAsset = result.assets[0];
        await uploadProfilePicture(selectedAsset.uri, selectedAsset.base64);
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message);
    }
  };

  const uploadProfilePicture = async (
    uri: string,
    base64String?: string | null
  ) => {
    try {
      setUploadingImage(true);

      if (!session?.user) throw new Error("No user found");

      // Optimize image size before uploading
      const manipResult = await manipulateAsync(
        uri,
        [{ resize: { width: 400, height: 400 } }],
        { format: SaveFormat.JPEG, compress: 0.7 }
      );

      const fileExt = "jpg";
      const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Convert the image to Blob
      const response = await fetch(manipResult.uri);
      const blob = await response.blob();

      // Upload image to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = await supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) throw new Error("Failed to get public URL");

      // Update user profile with avatar URL
      const { error: updateError } = await supabase
        .from("employees")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      // Update state
      setAvatarUrl(urlData.publicUrl);
      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      if (error instanceof Error) Alert.alert("Upload failed", error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const updateProfile = async () => {
    try {
      setUpdating(true);
      const { user } = session!;
      if (!user) throw new Error("No user found!");

      // Basic validation
      if (!fullName.trim()) {
        Alert.alert("Error", "Please enter your full name");
        return;
      }

      if (!phoneNumber.trim()) {
        Alert.alert("Error", "Please enter your phone number");
        return;
      }

      const { error } = await supabase
        .from("employees")
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          address: address,
          emergency_contact_name: emergencyContactName,
          emergency_contact_phone: emergencyContactPhone,
          preferred_language: preferredLanguage,
          is_first_login: false, 
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleProfilePictureOptions = () => {
    Alert.alert("Update Profile Picture", "Choose an option", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Take Photo",
        onPress: takePhoto,
      },
      {
        text: "Choose from Library",
        onPress: pickImage,
      },
    ]);
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Our HR team is available Monday-Friday 9am-5pm",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Email HR",
          onPress: () => {
            Alert.alert("Email sent to HR team");
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2089dc" />
      </View>
    );
  }

  // Get initials for the avatar
  const getInitials = () => {
    if (!fullName) return "?";
    const names = fullName.split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return fullName.charAt(0).toUpperCase();
  };

  return (
    <ImageBackground
      source={{ uri: "https://via.placeholder.com/1000x2000/e6f2ff/e6f2ff" }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Employee Profile</Text>
          </View>

          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity
                onPress={handleProfilePictureOptions}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <View style={styles.avatarLoading}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <View style={styles.avatar}>
                    {avatarUrl ? (
                      <Avatar
                        size={100}
                        rounded
                        source={{ uri: avatarUrl }}
                        containerStyle={styles.avatar}
                      />
                    ) : (
                      <Icon
                        name="camera"
                        type="feather"
                        size={36}
                        color="white"
                        style={styles.cameraIcon}
                      />
                    )}
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.userName}>{fullName}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{position}</Text>
              </View>
            </View>

            {/* Company Information - Read-only */}
            <View style={styles.formContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Company Information</Text>
              </View>

              <Input
                label="Email"
                value={session?.user?.email || ""}
                disabled
                leftIcon={<Sms size="23" color="#888" />}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                disabledInputStyle={styles.disabledInput}
              />

              <Input
                label="Employee ID"
                value={employeeId}
                disabled
                leftIcon={<Hashtag size="23" color="#888" />}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                disabledInputStyle={styles.disabledInput}
              />

              <View style={styles.rowContainer}>
                <Input
                  label="Department"
                  value={department}
                  disabled
                  leftIcon={<Briefcase size="23" color="#888" />}
                  labelStyle={styles.inputLabel}
                  containerStyle={[styles.inputContainer, styles.halfInput]}
                  inputContainerStyle={styles.input}
                  disabledInputStyle={styles.disabledInput}
                />

                <Input
                  label="Position"
                  value={position}
                  disabled
                  labelStyle={styles.inputLabel}
                  containerStyle={[styles.inputContainer, styles.halfInput]}
                  inputContainerStyle={styles.input}
                  disabledInputStyle={styles.disabledInput}
                />
              </View>

              <Input
                label="Office Location"
                value={officeLocation}
                disabled
                leftIcon={<Location size="23" color="#888" />}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                disabledInputStyle={styles.disabledInput}
              />

              <View style={styles.rowContainer}>
                <Input
                  label="Date Joined"
                  value={dateJoined}
                  disabled
                  leftIcon={<Calendar size="23" color="#888" />}
                  labelStyle={styles.inputLabel}
                  containerStyle={[styles.inputContainer, styles.halfInput]}
                  inputContainerStyle={styles.input}
                  disabledInputStyle={styles.disabledInput}
                />

                <Input
                  label="Employment Status"
                  value={employmentStatus}
                  disabled
                  labelStyle={styles.inputLabel}
                  containerStyle={[styles.inputContainer, styles.halfInput]}
                  inputContainerStyle={styles.input}
                  disabledInputStyle={styles.disabledInput}
                />
              </View>
            </View>

            {/* Personal Information - Editable */}
            <View style={styles.formContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>

              <Input
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                leftIcon={<User size="23" color="#888" />}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                placeholder="Enter your full name"
                autoCapitalize="words"
              />

              <Input
                label="Phone Number"
                value={phoneNumber}
                onChangeText={(text) => {
                  // Basic phone formatting
                  const cleaned = text.replace(/[^0-9]/g, ""); 
                  let formatted = cleaned;

                  if (cleaned.length > 0) {
                    if (cleaned.length <= 3) {
                      formatted = cleaned;
                    } else if (cleaned.length <= 6) {
                      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
                    } else {
                      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
                        3,
                        6
                      )}-${cleaned.slice(6, 10)}`;
                    }
                  }

                  setPhoneNumber(formatted);
                }}
                leftIcon={<Call size="23" color="#888" />}
                keyboardType="phone-pad"
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                placeholder="000-000-0000"
                maxLength={12}
              />

              <Input
                label="Address"
                value={address}
                onChangeText={setAddress}
                leftIcon={<Home2 size="23" color="#888" />}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                placeholder="Enter your address"
                multiline
              />
            </View>

            {/* Emergency Contact */}
            <View style={styles.formContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Emergency Contact</Text>
              </View>

              <Input
                label="Contact Name"
                value={emergencyContactName}
                onChangeText={setEmergencyContactName}
                leftIcon={<User size="23" color="#888" />}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                placeholder="Enter emergency contact name"
              />

              <Input
                label="Contact Phone"
                value={emergencyContactPhone}
                onChangeText={(text) => {
                  // Basic phone formatting
                  const cleaned = text.replace(/[^0-9]/g, "");
                  let formatted = cleaned;

                  if (cleaned.length > 0) {
                    if (cleaned.length <= 3) {
                      formatted = cleaned;
                    } else if (cleaned.length <= 6) {
                      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
                    } else {
                      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
                        3,
                        6
                      )}-${cleaned.slice(6, 10)}`;
                    }
                  }

                  setEmergencyContactPhone(formatted);
                }}
                leftIcon={<Call size="23" color="#888" />}
                keyboardType="phone-pad"
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                placeholder="000-000-0000"
                maxLength={12} // 10 digits + 2 hyphens
              />
            </View>

            {/* Preferences */}
            <View style={styles.formContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Preferences</Text>
              </View>

              <Input
                label="Preferred Language"
                value={preferredLanguage}
                onChangeText={setPreferredLanguage}
                leftIcon={<Global size="23" color="#888" />}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                placeholder="Enter preferred language"
              />

              <Button
                title={
                  isFirstLogin ? "Complete Profile Setup" : "Update Profile"
                }
                onPress={updateProfile}
                loading={updating}
                disabled={updating}
                buttonStyle={styles.updateButton}
                titleStyle={styles.buttonTitle}
                containerStyle={styles.buttonContainer}
                loadingProps={{ color: "white" }}
              />
            </View>

            {/* Help Card */}
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Icon name="info" type="feather" size={24} color="#b8ca41" />
                <Text style={styles.cardTitle}>Need Help?</Text>
                <Text style={styles.cardText}>
                  Contact HR if you need assistance with your profile
                  information
                </Text>
                <Button
                  title="Contact HR"
                  type="outline"
                  buttonStyle={styles.cardButton}
                  titleStyle={{ color: "#b8ca41", fontSize: 14 }}
                  onPress={handleContactSupport}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f5f7e8", 
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7e8", 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  signOutButton: {
    padding: 8,
  },
  profileContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50, // Makes the avatar round
    backgroundColor: "#b8ca41", // Updated background color
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEdit: {
    backgroundColor: "white",
  },
  avatarLoading: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#b8ca41", // Match avatar background
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    alignSelf: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 12,
    color: "#333",
    textAlign: "center",
  },
  roleBadge: {
    backgroundColor: "#f5f7e8", // Updated badge background
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#f5f7e8", // Match badge border
    alignSelf: "center",
  },
  roleText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
    textTransform: "capitalize",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  inputLabel: {
    color: "#555",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  inputContainer: {
    paddingHorizontal: 0,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  disabledInput: {
    backgroundColor: "#eee",
    color: "#888",
    opacity: 0.8,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  buttonContainer: {
    marginTop: 10,
    width: "100%",
  },
  updateButton: {
    backgroundColor: "#b8ca41",
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonTitle: {
    fontWeight: "600",
    color: "#fff",
  },
  cardContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  cardText: {
    textAlign: "center",
    marginBottom: 15,
    color: "#666",
  },
  cardButton: {
    borderColor: "#f5f7e8",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cardButtonTitle: {
    color: "#f5f7e8",
    fontSize: 14,
  },
});

export default Profile;
