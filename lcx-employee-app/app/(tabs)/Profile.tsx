"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native"
import { Button, Input, Avatar, Icon } from "@rneui/themed"
import { useRouter } from "expo-router"
import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"
import * as ImagePicker from "expo-image-manipulator"
import { manipulateAsync, SaveFormat } from "expo-image-manipulator"
import { Briefcase, Calendar, Call, Global, Hashtag, Home2, Location, Sms, User } from "iconsax-react-native"

const Profile = () => {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isFirstLogin, setIsFirstLogin] = useState(false)

  // Profile picture state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // User info state
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [emergencyContactName, setEmergencyContactName] = useState("")
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("")
  const [preferredLanguage, setPreferredLanguage] = useState("")

  // Read-only fields
  const [employeeId, setEmployeeId] = useState("")
  const [department, setDepartment] = useState("")
  const [position, setPosition] = useState("")
  const [officeLocation, setOfficeLocation] = useState("")
  const [dateJoined, setDateJoined] = useState("")
  const [employmentStatus, setEmploymentStatus] = useState("")

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      if (session) getProfile(session)
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        getProfile(session)
      } else {
        router.replace("/(auth)/Auth") // Redirect if signed out
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    requestMediaLibraryPermissions()
  }, [])

  const requestMediaLibraryPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") 
      {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your media library to upload a profile picture.",
        )
      }
    }
  }

  async function getProfile(session: Session) {
    try {
      setLoading(true)
      const { user } = session
      if (!user) throw new Error("No user found!")

      const { data, error } = await supabase
        .from("employees")
        .select(
          `
          full_name, employee_id, department, position, 
          office_location, date_joined, employment_status,
          phone_number, address, emergency_contact_name, 
          emergency_contact_phone, preferred_language,
          is_first_login, avatar_url
        `,
        )
        .eq("id", user.id)
        .single()

      if (error) throw error
      if (data) 
      {
        setFullName(data.full_name || "")
        setPhoneNumber(data.phone_number || "")
        setAddress(data.address || "")
        setEmergencyContactName(data.emergency_contact_name || "")
        setEmergencyContactPhone(data.emergency_contact_phone || "")
        setPreferredLanguage(data.preferred_language || "English")
        setAvatarUrl(data.avatar_url)

        // Read-only fields
        setEmployeeId(data.employee_id)
        setDepartment(data.department)
        setPosition(data.position)
        setOfficeLocation(data.office_location)
        setDateJoined(data.date_joined)
        setEmploymentStatus(data.employment_status)

        // Check if this is user's first login
        setIsFirstLogin(data.is_first_login)

        // If first login, show welcome message
        if (data.is_first_login) {
          Alert.alert("Welcome!", "Please complete your profile information.")
        }
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
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
      })

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedAsset = result.assets[0]
        await uploadProfilePicture(selectedAsset.uri, selectedAsset.base64)
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message)
    }
  }

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please grant camera permission to take a photo")
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      })

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedAsset = result.assets[0]
        await uploadProfilePicture(selectedAsset.uri, selectedAsset.base64)
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message)
    }
  }

  const uploadProfilePicture = async (uri: string, base64String?: string | null) => {
    try {
      setUploadingImage(true)

      if (!session?.user) throw new Error("No user found")

      // Optimize image size before uploading
      const manipResult = await manipulateAsync(uri, [{ resize: { width: 400, height: 400 } }], {
        format: SaveFormat.JPEG,
        compress: 0.7,
      })

      const fileExt = "jpg"
      const fileName = `${session.user.id}_${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Convert the image to Blob
      const response = await fetch(manipResult.uri)
      const blob = await response.blob()

      // Upload image to storage
      const { data: uploadData, error: uploadError } = await supabase.storage.from("profiles").upload(filePath, blob, {
        contentType: "image/jpeg",
        upsert: true,
      })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = await supabase.storage.from("profiles").getPublicUrl(filePath)

      if (!urlData.publicUrl) throw new Error("Failed to get public URL")

      // Update user profile with avatar URL
      const { error: updateError } = await supabase
        .from("employees")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", session.user.id)

      if (updateError) throw updateError

      // Update state
      setAvatarUrl(urlData.publicUrl)
      Alert.alert("Success", "Profile picture updated successfully!")
    } catch (error) {
      if (error instanceof Error) Alert.alert("Upload failed", error.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const updateProfile = async () => {
    try {
      setUpdating(true)
      const { user } = session!
      if (!user) throw new Error("No user found!")

      // Basic validation
      if (!fullName.trim()) {
        Alert.alert("Error", "Please enter your full name")
        return
      }

      if (!phoneNumber.trim()) {
        Alert.alert("Error", "Please enter your phone number")
        return
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
        .eq("id", user.id)

      if (error) throw error
      Alert.alert("Success", "Profile updated successfully!")
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message)
    } finally {
      setUpdating(false)
    }
  }

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
    ])
  }

  const handleContactSupport = () => {
    Alert.alert("Contact Support", "Our HR team is available Monday-Friday 9am-5pm", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Email HR",
        onPress: () => {
          Alert.alert("Email sent to HR team")
        },
      },
    ])
  }

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              
              if (error) {
                throw error;
              }
              
              // The onAuthStateChange listener in useEffect will handle navigation
            } catch (error) {
              if (error instanceof Error) {
                Alert.alert("Sign Out Error", error.message);
              }
            }
          },
        },
      ]
    );
  };


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#b8ca41" />
      </View>
    )
  }

  // Get initials for the avatar
  const getInitials = () => {
    if (!fullName) return "?"
    const names = fullName.split(" ")
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
    }
    return fullName.charAt(0).toUpperCase()
  }

  // Replace the return statement with this more beautiful design
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {/* <TouchableOpacity >
            <Icon name="" type="feather" size={24} color="#fff" />
          </TouchableOpacity> */}
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.searchButton}
            onPress={handleSignOut}
          >
            <Icon name="log-out" type="feather" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity
                onPress={handleProfilePictureOptions}
                disabled={uploadingImage}
                style={styles.avatarWrapper}
              >
                {uploadingImage ? (
                  <View style={styles.avatarLoading}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <View style={styles.avatar}>
                    {avatarUrl ? (
                      <Avatar size={110} rounded source={{ uri: avatarUrl }} containerStyle={styles.avatar} />
                    ) : (
                      <Text style={styles.avatarInitials}>{getInitials()}</Text>
                    )}
                  </View>
                )}
                <View style={styles.cameraButton}>
                  <Icon name="camera" type="feather" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{fullName || "Your Name"}</Text>
            <Text style={styles.userPosition}>{position || "Position"}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{department || "-"}</Text>
                <Text style={styles.statLabel}>Department</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{employeeId || "-"}</Text>
                <Text style={styles.statLabel}>Employee ID</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dateJoined ? new Date(dateJoined).getFullYear() : "-"}</Text>
                <Text style={styles.statLabel}>Joined</Text>
              </View>
            </View>
          </View>

          <View style={styles.contentContainer}>
            {/* Personal Information - Editable */}
            <View style={styles.formContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.sectionDivider} />
              </View>

              <Input
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                leftIcon={<User size="20" color="#b8ca41" variant="Bold" />}
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
                  const cleaned = text.replace(/[^0-9]/g, "")
                  let formatted = cleaned

                  if (cleaned.length > 0) {
                    if (cleaned.length <= 3) {
                      formatted = cleaned
                    } else if (cleaned.length <= 6) {
                      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
                    } else {
                      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
                    }
                  }

                  setPhoneNumber(formatted)
                }}
                leftIcon={<Call size="20" color="#b8ca41" variant="Bold" />}
                keyboardType="phone-pad"
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                placeholder="000-000-0000"
                maxLength={12}
              />

              <Input
                label="Email"
                value={session?.user?.email || ""}
                disabled
                leftIcon={<Sms size="20" color="#b8ca41" variant="Bold" />}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                disabledInputStyle={styles.disabledInput}
              />

              <Input
                label="Address"
                value={address}
                onChangeText={setAddress}
                leftIcon={<Home2 size="20" color="#b8ca41" variant="Bold" />}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                placeholder="Enter your address"
                multiline
              />
            </View>

            {/* Company Information */}
            <View style={styles.formContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Company Information</Text>
                <View style={styles.sectionDivider} />
              </View>

              <Input
                label="Employee ID"
                value={employeeId}
                disabled
                leftIcon={<Hashtag size="20" color="#b8ca41" variant="Bold" />}
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
                  leftIcon={<Briefcase size="20" color="#b8ca41" variant="Bold" />}
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
                leftIcon={<Location size="20" color="#b8ca41" variant="Bold" />}
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
                  leftIcon={<Calendar size="20" color="#b8ca41" variant="Bold" />}
                  labelStyle={styles.inputLabel}
                  containerStyle={[styles.inputContainer, styles.halfInput]}
                  inputContainerStyle={styles.input}
                  disabledInputStyle={styles.disabledInput}
                />

                <Input
                  label="Status"
                  value={employmentStatus}
                  disabled
                  labelStyle={styles.inputLabel}
                  containerStyle={[styles.inputContainer, styles.halfInput]}
                  inputContainerStyle={styles.input}
                  disabledInputStyle={styles.disabledInput}
                />
              </View>
            </View>

            {/* Emergency Contact */}
            <View style={styles.formContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Emergency Contact</Text>
                <View style={styles.sectionDivider} />
              </View>

              <Input
                label="Contact Name"
                value={emergencyContactName}
                onChangeText={setEmergencyContactName}
                leftIcon={<User size="20" color="#b8ca41" variant="Bold" />}
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
                  const cleaned = text.replace(/[^0-9]/g, "")
                  let formatted = cleaned

                  if (cleaned.length > 0) {
                    if (cleaned.length <= 3) {
                      formatted = cleaned
                    } else if (cleaned.length <= 6) {
                      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
                    } else {
                      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
                    }
                  }

                  setEmergencyContactPhone(formatted)
                }}
                leftIcon={<Call size="20" color="#b8ca41" variant="Bold" />}
                keyboardType="phone-pad"
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                placeholder="000-000-0000"
                maxLength={12}
              />
            </View>

            {/* Preferences */}
            <View style={styles.formContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.sectionDivider} />
              </View>

              <Input
                label="Preferred Language"
                value={preferredLanguage}
                onChangeText={setPreferredLanguage}
                leftIcon={<Global size="20" color="#b8ca41" variant="Bold" />}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                placeholder="Enter preferred language"
              />
            </View>

            <Button
              title={isFirstLogin ? "Complete Profile Setup" : "Update Profile"}
              onPress={updateProfile}
              loading={updating}
              disabled={updating}
              buttonStyle={styles.updateButton}
              titleStyle={styles.buttonTitle}
              containerStyle={styles.buttonContainer}
              loadingProps={{ color: "white" }}
              icon={{
                name: "check",
                type: "feather",
                size: 20,
                color: "white",
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10 }}
            />

            {/* Help Card */}
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <View style={styles.cardIconContainer}>
                  <Icon name="help-circle" type="feather" size={24} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>Need Help?</Text>
                <Text style={styles.cardText}>Contact HR if you need assistance with your profile information</Text>
                <Button
                  title="Contact HR"
                  type="outline"
                  buttonStyle={styles.cardButton}
                  titleStyle={{ color: "#b8ca41", fontSize: 14, fontWeight: "600" }}
                  onPress={handleContactSupport}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

// Replace the styles with these improved styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b8ca41",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  profileHeader: {
    backgroundColor: "#b8ca41",
    paddingBottom: 30,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: "#f8f9fa",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b8ca41",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarInitials: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#b8ca41",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#b8ca41",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarLoading: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#f5f7e8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  userPosition: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "90%",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  sectionDivider: {
    height: 3,
    width: 40,
    backgroundColor: "#b8ca41",
    borderRadius: 2,
  },
  inputLabel: {
    color: "#555",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  inputContainer: {
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#f9f9f9",
    height: 50,
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
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
    marginVertical: 20,
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  updateButton: {
    backgroundColor: "#b8ca41",
    borderRadius: 15,
    paddingVertical: 15,
    height: 55,
  },
  buttonTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
  },
  cardContainer: {
    marginBottom: 30,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#b8ca41",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  cardText: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
    lineHeight: 20,
  },
  cardButton: {
    borderColor: "#b8ca41",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
  },
})

export default Profile
