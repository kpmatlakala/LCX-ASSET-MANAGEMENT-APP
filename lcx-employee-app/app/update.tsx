// import React, { useState, useEffect } from 'react';
// import { 
//   StyleSheet, 
//   Text, 
//   View, 
//   TextInput, 
//   TouchableOpacity, 
//   SafeAreaView, 
//   StatusBar,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Picker } from '@react-native-picker/picker';


//modal for udating the informatiom

// import { images } from "@/constants";

// export default function UpdateAssetScreen() {
//   const router = useRouter();
//   const { assetId } = useLocalSearchParams();
  
//   // Form state
//   const [asset, setAsset] = useState({
//     id: '',
//     name: '',
//     status: 'Available',
//     category: '',
//     serialNumber: '',
//     location: '',
//     condition: 'New',
//     acquisitionDate: '',
//   });
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState('');

//   // Status options
//   const statusOptions = ['Available', 'Assigned', 'Maintenance', 'Reserved'];
  
//   // Condition options
//   const conditionOptions = ['New', 'Good', 'Fair', 'Poor', 'Under Repair'];

//   // Fetch asset data on component mount
//   useEffect(() => {
//     // In a real app, you would fetch the asset data from your API or database
//     // For now, we'll mock the data fetch with sample data
//     fetchAssetData(assetId);
//   }, [assetId]);

//   const fetchAssetData = (id) => {
//     setIsLoading(true);
//     // Mock API call - replace with actual API call in production
//     setTimeout(() => {
//       // Sample asset data - in a real app, this would come from your API
//       const mockAsset = {
//         id: parseInt(id),
//         name: id === '1' ? 'Dell XPS 15 Laptop' : 
//               id === '2' ? 'Dell XPS 19 Laptop' : 
//               id === '3' ? 'HP Laser Printer' :
//               id === '4' ? 'Samsung S22 Ultra' :
//               id === '5' ? 'Logitech MX Master Mouse' : 'Unknown Asset',
//         status: id === '1' ? 'Available' : 
//                 id === '2' ? 'Assigned' : 
//                 id === '3' ? 'Available' :
//                 id === '4' ? 'Maintenance' : 'Available',
//         category: id === '1' ? 'Computer/Laptop' : 
//                   id === '2' ? 'Computer/Laptop' : 
//                   id === '3' ? 'Printer/Scanner' :
//                   id === '4' ? 'Mobile Device' : 'Accessories',
//         serialNumber: id === '1' ? 'DX15-7890-A' : 
//                       id === '2' ? 'DX19-5432-B' : 
//                       id === '3' ? 'HPL-2345-C' :
//                       id === '4' ? 'SS22-1234-D' : 'LMX-8765-E',
//         location: id === '1' ? 'IT Department' : 
//                   id === '2' ? 'Finance Department' : 
//                   id === '3' ? 'Admin Office' :
//                   id === '4' ? 'IT Support' : 'IT Store',
//         condition: id === '1' ? 'New' : 
//                    id === '2' ? 'Good' : 
//                    id === '3' ? 'Good' :
//                    id === '4' ? 'Under Repair' : 'New',
//         acquisitionDate: id === '1' ? '15/01/2025' : 
//                         id === '2' ? '20/12/2024' : 
//                         id === '3' ? '05/11/2024' :
//                         id === '4' ? '10/10/2024' : '25/02/2025',
//       };
      
//       setAsset(mockAsset);
//       setIsLoading(false);
//     }, 500); // Simulate network delay
//   };

//   const handleInputChange = (field, value) => {
//     setAsset(prevAsset => ({
//       ...prevAsset,
//       [field]: value,
//     }));
//   };

//   const validateForm = () => {
//     if (!asset.name.trim()) {
//       setErrorMessage('Asset name is required');
//       return false;
//     }
//     if (!asset.serialNumber.trim()) {
//       setErrorMessage('Serial number is required');
//       return false;
//     }
//     if (!asset.category.trim()) {
//       setErrorMessage('Category is required');
//       return false;
//     }
//     setErrorMessage('');
//     return true;
//   };

//   const handleUpdate = () => {
//     if (!validateForm()) return;
    
//     setIsLoading(true);
    
//     // In a real app, you would make an API call to update the asset
//     // For now, we'll simulate the API call with a timeout
//     setTimeout(() => {
//       setIsLoading(false);
      
//       // Show success message
//       Alert.alert(
//         "Update Successful",
//         `Asset ${asset.name} has been updated successfully.`,
//         [
//           { 
//             text: "OK", 
//             onPress: () => router.back() 
//           }
//         ]
//       );
//     }, 1000);
//   };

//   const handleCancel = () => {
//     router.back();
//   };

//   if (isLoading && !asset.id) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <StatusBar backgroundColor="#e8eac6" barStyle="dark-content" />
//         <View style={styles.loadingContainer}>
//           <Text>Loading asset data...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#e8eac6" barStyle="dark-content" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleCancel}>
//           <Feather name="arrow-left" size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Update Asset</Text>
//         <View style={{ width: 24 }} />
//       </View>
      
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <ScrollView style={styles.formContainer}>
//           {errorMessage ? (
//             <View style={styles.errorContainer}>
//               <Text style={styles.errorText}>{errorMessage}</Text>
//             </View>
//           ) : null}
          
//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Asset Name*</Text>
//             <TextInput
//               style={styles.input}
//               value={asset.name}
//               onChangeText={(text) => handleInputChange('name', text)}
//               placeholder="Enter asset name"
//             />
//           </View>
          
//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Category*</Text>
//             <TextInput
//               style={styles.input}
//               value={asset.category}
//               onChangeText={(text) => handleInputChange('category', text)}
//               placeholder="Enter category"
//             />
//           </View>
          
//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Serial Number*</Text>
//             <TextInput
//               style={styles.input}
//               value={asset.serialNumber}
//               onChangeText={(text) => handleInputChange('serialNumber', text)}
//               placeholder="Enter serial number"
//             />
//           </View>
          
//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Status</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={asset.status}
//                 onValueChange={(itemValue) => handleInputChange('status', itemValue)}
//                 style={styles.picker}
//               >
//                 {statusOptions.map((status) => (
//                   <Picker.Item key={status} label={status} value={status} />
//                 ))}
//               </Picker>
//             </View>
//           </View>
          
//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Condition</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={asset.condition}
//                 onValueChange={(itemValue) => handleInputChange('condition', itemValue)}
//                 style={styles.picker}
//               >
//                 {conditionOptions.map((condition) => (
//                   <Picker.Item key={condition} label={condition} value={condition} />
//                 ))}
//               </Picker>
//             </View>
//           </View>
          
//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Location</Text>
//             <TextInput
//               style={styles.input}
//               value={asset.location}
//               onChangeText={(text) => handleInputChange('location', text)}
//               placeholder="Enter location"
//             />
//           </View>
          
//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Acquisition Date</Text>
//             <TextInput
//               style={styles.input}
//               value={asset.acquisitionDate}
//               onChangeText={(text) => handleInputChange('acquisitionDate', text)}
//               placeholder="DD/MM/YYYY"
//             />
//           </View>
          
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity 
//               style={[styles.button, styles.cancelButton]} 
//               onPress={handleCancel}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.button, styles.updateButton]}
//               onPress={handleUpdate}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <Text style={styles.updateButtonText}>Updating...</Text>
//               ) : (
//                 <Text style={styles.updateButtonText}>Update Asset</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f7e8',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#e8eac6',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   formContainer: {
//     padding: 20,
//   },
//   errorContainer: {
//     backgroundColor: '#ffe6e6',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   errorText: {
//     color: '#d13838',
//   },
//   formGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     fontWeight: '500',
//     color: '#333',
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     fontSize: 16,
//   },
//   pickerContainer: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     marginBottom: 40,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginRight: 10,
//   },
//   cancelButtonText: {
//     color: '#666',
//     fontWeight: '500',
//     fontSize: 16,
//   },
//   updateButton: {
//     backgroundColor: '#4a6fa5',
//     marginLeft: 10,
//   },
//   updateButtonText: {
//     color: '#fff',
//     fontWeight: '500',
//     fontSize: 16,
//   },
// });