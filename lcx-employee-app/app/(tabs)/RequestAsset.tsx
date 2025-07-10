import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Input, Button } from "@rneui/themed";
import { ArrowDown2, SearchNormal1, Briefcase, Calendar, Add } from "iconsax-react-native";
import { useAssets } from '@/context/AssetContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from "@expo/vector-icons";
import ReturnForm from "@/components/ReturnForm";

const RequestAssets = () => {
  const params = useLocalSearchParams();
  const assetIdFromParams = params.assetId; 
  const { assets, requestAsset } = useAssets();

  const [search, setSearch] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [returnDate, setReturnDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setFilteredAssets(assets);
    
    if (assetIdFromParams && assets.length > 0) {
      for (let i = 0; i < assets.length; i++) {
        if (assets[i].asset_id == assetIdFromParams) {
          setSelectedAsset(assets[i]);
          setPurpose(assets[i].purpose || '');
          setDuration(assets[i].duration || '');
          setDropdownVisible(false);
          break;
        }
      }
    }
  }, [assets, assetIdFromParams]);

  const handleInputChange = (field, value) => {
    switch (field) {
      case "search":
        setSearch(value);
        filterAssets(value);
        break;
      case "purpose":
        setPurpose(value);
        break;
      default:
        break;
    }
  };

  const filterAssets = (searchText) => {
    const filtered = assets.filter((asset) =>
      asset.asset_name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredAssets(filtered);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setReturnDate(selectedDate);
      setDuration(selectedDate.toISOString().split('T')[0]);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleCloseModal = (): void => {
    setModalVisible(false);
    setSelectedAsset(null);
  }; 

  const validateForm = () => {
    if (!selectedAsset) {
      Alert.alert("Error", "Please select an asset");
      return false;
    }
    if (!purpose.trim()) {
      Alert.alert("Error", "Please enter a purpose");
      return false;
    }
    if (!duration.trim()) {
      Alert.alert("Error", "Please select a return date");
      return false;
    }
    return true;
  };

  const submitRequest = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await requestAsset(selectedAsset.asset_id, purpose, duration);
      Alert.alert(
        "Success",
        "Your asset request has been submitted successfully",
        [{ text: "OK", onPress: () => router.push("/(tabs)/MyAssets") }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Example card section for request asset form or items */}
        <View style={styles.card}>
          <View style={styles.iconBox}>
            <Add size={24} color="#b8ca41" variant="Bold" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Request New Asset</Text>
            <Text style={styles.cardSubtitle}>Fill out the form below to request an asset.</Text>
          </View>
        </View>
        {/* Asset Selection */}
        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Asset</Text>
            <View style={styles.sectionDivider} />
          </View>

          <TouchableOpacity 
            onPress={() => setDropdownVisible(!dropdownVisible)} 
            style={styles.dropdownContainer}
          >
            <Text style={styles.dropdownText}>
              {selectedAsset ? selectedAsset.asset_name : "Select an asset"}
            </Text>
            <ArrowDown2 size="20" color="#333" />
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdownList}>
              <View style={styles.searchContainer}>
                {/* <SearchNormal1 size="18" color="#666" /> */}
                <Input
                  value={search}
                  onChangeText={(text) => handleInputChange("search", text)}
                  placeholder="Search assets"
                  containerStyle={styles.searchInputContainer}
                  inputContainerStyle={styles.searchInput}
                  inputStyle={styles.searchInputText}
                />
              </View>
              
              <ScrollView style={styles.assetScrollView}>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <TouchableOpacity
                      key={asset.asset_id}
                      style={styles.assetItem}
                      onPress={() => {
                        setSelectedAsset(asset);
                        setDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.assetName}>{asset.asset_name}</Text>
                      <Text style={styles.assetCode}>{asset.asset_code}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noAssetsText}>No assets found</Text>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Purpose */}
        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Purpose</Text>
            <View style={styles.sectionDivider} />
          </View>

          <Input
            value={purpose}
            onChangeText={(text) => handleInputChange("purpose", text)}
            placeholder="Why do you need this asset?"
            leftIcon={<Briefcase size="20" color="#b8ca41" variant="Bold" />}
            labelStyle={styles.inputLabel}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
          />
        </View>

        {/* Return Date */}
        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expected Return Date</Text>
            <View style={styles.sectionDivider} />
          </View>

          <TouchableOpacity 
            onPress={showDatePickerModal}
            style={styles.datePickerContainer}
          >
            <View style={styles.datePickerContent}>
              <Calendar size="20" color="#b8ca41" variant="Bold" />
              <Text style={styles.datePickerText}>
                {duration || "Select a return date"}
              </Text>
            </View>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={returnDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Submit Button */}
        <Button
          title="Submit Request"
          onPress={submitRequest}
          loading={isSubmitting}
          disabled={isSubmitting}
          buttonStyle={styles.submitButton}
          titleStyle={styles.buttonTitle}
          containerStyle={styles.buttonContainer}
          loadingProps={{ color: "white" }}
        />
      </ScrollView>

      {/* Modal with ReturnForm */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Return Asset</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedAsset && (
              <View style={styles.modalBody}>
                <ReturnForm
                  assetName={selectedAsset.asset_name}
                  assetId={selectedAsset.asset_sn}
                  onClose={handleCloseModal}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f8f9fa',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    paddingVertical: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
    marginTop: 30,
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
    color: "#666",
    marginBottom: 8,
  },
  sectionDivider: {
    height: 3,
    width: 40,
    backgroundColor: "#b8ca41",
    borderRadius: 2,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    maxHeight: 300,
  },
  searchContainer: {
    flexDirection: "row",
    // alignItems:"flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f5f5f5",
    gap: 2
  },
  searchInputContainer: {
    flex: 1,
    paddingHorizontal: 0,
    margin: 0,
  },
  searchInput: {
    borderBottomWidth: 1,
    
  },
  searchInputText: {
    fontSize: 16,
    color: "#333",
  },
  assetScrollView: {
    maxHeight: 200,
  },
  assetItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  assetName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  assetCode: {
    fontSize: 14,
    color: "#666",
  },
  noAssetsText: {
    textAlign: "center",
    paddingVertical: 20,
    color: "#888",
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
  datePickerContainer: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#f9f9f9",
  },
  datePickerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  datePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
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
  submitButton: {
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    backgroundColor: '#f5f7e8',
    borderRadius: 12,
    padding: 8,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d1a31',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    flex: 1,
    marginTop: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
  },
});

export default RequestAssets;