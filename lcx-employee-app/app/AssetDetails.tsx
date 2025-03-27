import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  FlatList,
  Modal,
  Image,
  Alert
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import * as Print from 'expo-print';
import { useAssets } from '@/context/AssetContext';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

const AssetManagementScreen = () => {
  const params = useLocalSearchParams();
  const assetIdFromParams = params.assetId;
  console.log("selected asset|param:", assetIdFromParams);

  const { assets } = useAssets();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // console.log("selected asset:", selectedAsset);
  
  // Find the selected asset when component mounts or assets/params change
  useEffect(() => {
    console.log("if:", assetIdFromParams);
    if (assetIdFromParams && assets.length > 0) 
    {
      console.log("& assets.count", assets.length );
      for (let i = 0; i < assets.length; i++)
      {
        console.log("assets[i].asset_id", assets[i].asset_id);
        
        if (assets[i].asset_id == assetIdFromParams) 
        {
          console.log("selected asset:", assets[i]);
          
          setSelectedAsset(assets[i]);
          break;
        }

        console.log("assets[i].asset_id", assets[i].asset_id);
      }
    }
  }, [assets, assetIdFromParams]);

  // Using useFocusEffect to handle screen focus (whenever the screen is focused)
  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('Screen focused, refreshing asset selection...');
      
  //     if (assetIdFromParams && assets.length > 0) 
  //     {
  //       for (let i = 0; i < assets.length; i++) 
  //       {
  //         if (assets[i].asset_id == assetIdFromParams) {
  //           console.log("selected asset (focused):", assets[i]);
  //           setSelectedAsset(assets[i]);
  //           break;
  //         }
  //       }
  //     }

  //     // Optionally return a cleanup function when the screen is unfocused
  //     return () => {
  //       console.log('Screen unfocused');
  //     };
  //   }, [assets, assetIdFromParams])  // Dependencies, similar to useEffect
  // );

  const getStatusStyles = (
    status: string
  ): { backgroundColor: string; borderColor: string } => {
    switch (status) {
      case "Available":
        return { backgroundColor: "#d1f4e0", borderColor: "#17c964" }; // Light green background, dark green border
      case "In_Transit":
        return { backgroundColor: "#fdedd3", borderColor: "#f5a524" }; // Light orange background, dark orange border
      case "Maintanace":
        return { backgroundColor: "#fdd0df", borderColor: "#f5426c" }; // Light pink background, dark pink border
      case "Assigned":
        return { backgroundColor: "#f3f1260", borderColor: "#f3f1260" }; // Light yellow background, yellow border
      default:
        return { backgroundColor: "#f0f0f0", borderColor: "#cccccc" }; // Default light gray background, dark gray border
    }
  };

  // Export functions
  const exportToCsv = async () => {
    try 
    {
      // Prepare CSV content
      const csvHeader = 'Asset Name,Serial Number,Category,Cost,Purchase Date,Status\n';
      const csvRows = assets.map(asset => 
          `"${asset.asset_name}","${asset.asset_sn}","${asset.asset_category}","${asset.purchase_price}","${asset.purchase_date}","${asset.status}"`
      ).join('\n');
      const csvContent = csvHeader + csvRows;

      // Write to file
      const fileUri = `${FileSystem.documentDirectory}assets_export.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });

      // Share the file
      if (await Sharing.isAvailableAsync()) 
      {
        await Sharing.shareAsync(fileUri);
      } 
      else { Alert.alert('Sharing is not available'); }
    } 
    catch (error) 
    {
        console.error('CSV Export Error:', error);
        Alert.alert('Export Failed', 'Unable to export CSV file');
    }
  };

  const exportToExcel = async () => {
    try 
    {
        // Prepare workbook and worksheet
        const wb = XLSX.utils.book_new();
        const wsData = [
            ['Asset Name', 'Serial Number', 'Category', 'Cost', 'Purchase Date', 'Status'],
            ...assets.map(asset => [
                asset.asset_name, 
                asset.asset_sn, 
                asset.asset_category, 
                asset.purchase_price, 
                asset.purchase_date, 
                asset.status
            ])
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Assets');

        // Write to file
        const fileUri = `${FileSystem.documentDirectory}assets_export.xlsx`;
        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
        
        await FileSystem.writeAsStringAsync(fileUri, wbout, { encoding: FileSystem.EncodingType.Base64 });

        // Share the file
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, { 
              mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
              dialogTitle: 'Export Assets' 
            });
        } 
        else { Alert.alert('Sharing is not available'); }
    } 
    catch (error) 
    {
      console.error('Excel Export Error:', error);
      Alert.alert('Export Failed', 'Unable to export Excel file');
    }
  };

  const exportToPdf = async () => {
  };

  const renderExportOptions = () => {
  };

  const renderStatusBadge = (status) => {
  let backgroundColor;
  switch(status) {
      case 'Approved':
      backgroundColor = '#D4EDDA';
      break;
      case 'Failed':
      backgroundColor = '#F8D7DA';
      break;
      default:
      backgroundColor = '#D4EDDA';
  }

  return (
      <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.badgeText}>{status}</Text>
      </View>
  );
  };

  const renderAssetItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.descriptionCell]}>{item.description}</Text>
      <Text style={[styles.tableCell, styles.conditionCell]}>{item.condition}</Text>
      <Text style={[styles.tableCell, styles.employeeCell]}>{item.date}</Text>
      <View style={[styles.tableCell, styles.statusCell]}>
        {renderStatusBadge(item.status)}
      </View>
    </View>
  );

  // Function to handle cancel request
  const handleCancelRequest = () => {
    // Add your logic to cancel the request here
    console.log("Request cancelled");
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cancel Request Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cancel Request</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalText}>
              Are you sure you want to cancel your request for this asset?
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCancelRequest}
              >
                <Text style={styles.confirmButtonText}>Yes, Cancel Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView>
        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>Asset Details</Text>
        </View>

        {/* Filters and Actions */}
        <View style={styles.actionsContainer}>
          <View style={styles.filtersContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <MaterialIcons name="filter-list" size={16} color="#666" />
              <Text style={styles.filterButtonText}>Filter</Text>
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <Feather name="search" size={16} color="#666" />
              <TextInput style={styles.searchInput} placeholder="Search..." />
            </View>
          </View>
          
          <View style={styles.exportContainer}>
            <TouchableOpacity style={styles.exportButton}
              onPress={() => {
                Alert.alert(
                    'Export Options',
                    'Choose Export Format',
                    [
                        { 
                            text: 'CSV', 
                            onPress: exportToCsv 
                        },
                        { 
                            text: 'Excel', 
                            onPress: exportToExcel 
                        },
                        { 
                            text: 'PDF', 
                            onPress: exportToPdf 
                        },
                        { 
                            text: 'Cancel', 
                            style: 'cancel' 
                        }
                    ]
                );
              }}
            >
              <MaterialIcons name="file-download" size={16} color="#666" />
              <Text style={styles.exportButtonText}>Export PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Asset Information Card */}
        <View style={styles.assetInfoCard}>
          <View style={styles.assetInfoHeader}>
            <Text style={styles.assetInfoTitle}>Asset Information</Text>
            {/* <View style={styles.assetInfoActions}>
              <TouchableOpacity>
                <MaterialIcons name="more-vert" size={20} color="#666" />
              </TouchableOpacity>
            </View> */}
            <View
              style={{
                backgroundColor: getStatusStyles(selectedAsset?.status).backgroundColor,
                borderColor: getStatusStyles(selectedAsset?.status).borderColor,
                borderWidth: 1,
              }}
              className="px-2.5 py-0.5 rounded-full mb-2"
            >
              <Text
                style={{
                  color: getStatusStyles(selectedAsset?.status).borderColor,
                }}
                className="font-bold text-xs"
              >
                { selectedAsset?.status }
              </Text>
            </View>
          </View>

          <View style={styles.assetInfoContent}>
            {
              selectedAsset?.asset_image_url && (
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: selectedAsset.asset_image_url }}
                    style={styles.assetImage}
                    resizeMode="cover"
                    // defaultSource={require('@/assets/placeholder-image.png')}
                  />
                </View>
            )}           

            <View style={styles.infoColumn}>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Asset Name:</Text>
                <Text style={styles.infoValue}>{selectedAsset?.asset_name}</Text>
              </View> 
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Category:</Text>
                <Text style={styles.infoValue}>{selectedAsset?.asset_category}</Text>
              </View>             
            </View>
          </View>

          {
             selectedAsset?.status === 'Available' ? (
              <TouchableOpacity
                style={styles.returnRequestButton}
                onPress={() => {
                  console.log("request action triggered");
                  router.push({  
                    pathname:`/RequestAsset`,
                    params: { assetId: selectedAsset?.asset_id }
                  })
                }}
              >
                <MaterialIcons name="assignment" size={16} color="white" style={styles.buttonIcon} />
                <Text style={styles.returnRequestButtonText}>Request Asset</Text>
              </TouchableOpacity>
            ) :
            selectedAsset?.status === 'Dispatched' ? (
              <TouchableOpacity
                style={styles.returnRequestButton}
                onPress={() => {
                  console.log("Return action triggered")
                  router.push({
                    pathname:`/ReturnAsset`,
                    params: { assetId: selectedAsset?.asset_id }
                  })
                }}
              >
                <MaterialIcons name="replay" size={16} color="white" style={styles.buttonIcon} />
                <Text style={styles.returnRequestButtonText}>Return asset</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.cardButtonContainer}>
                <TouchableOpacity 
                  style={styles.cancelRequestButton} 
                  onPress={() => setModalVisible(true)}
                >
                  <MaterialIcons name="cancel" size={16} color="white" style={styles.buttonIcon} />
                  <Text style={styles.cancelRequestButtonText}>Cancel request</Text>
                </TouchableOpacity>
              </View>
            )
          }
          
          {/* Cancel Request Button - now at the bottom of the asset info card */}
          
        </View>

        {/* Asset Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, styles.descriptionCell]}>Description</Text>            
            <Text style={[styles.tableHeaderCell, styles.conditionCell]}>Asset Condition</Text>    
            <Text style={[styles.tableHeaderCell, styles.statusCell]}>Date</Text>      
            <Text style={[styles.tableHeaderCell, styles.statusCell]}>Status</Text>
          </View>
          
          {/* Table Content */}
          <FlatList
            data={assets}
            renderItem={renderAssetItem}
            keyExtractor={item => item.asset_id.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    fontFamily: 'Poppins-Regular'
  },
  breadcrumb: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  breadcrumbText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins-Regular'
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontFamily: 'Poppins-Regular'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  searchInput: {
    marginLeft: 4,
    width: 100,
    fontSize: 12,
    fontFamily: 'Poppins-Regular'
  },
  exportContainer: {
    flexDirection: 'row',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  exportButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontFamily: 'Poppins-Regular'
  },
  assetInfoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  assetInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  assetInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Regular'
  },
  assetInfoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetInfoContent: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  imageContainer: {
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assetImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  infoColumn: {
    flex: 1,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    fontFamily: 'Poppins-Regular'
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular'
  },
  cardButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 15,
  },
  cancelRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
  },returnRequestButton: {
    backgroundColor: '#4CAF50', // Color for return button
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 5,
  },
  cancelRequestButtonText: {
    color: 'white',
    fontSize: 14,
  },
  returnRequestButtonText: {
    color: 'white',
    fontSize: 14,
  },    
  tableContainer: {
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 10,
  },
  tableHeader: {
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderCell: {
    fontWeight: '600',
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 2,
    fontFamily: 'Poppins-Regular'
  },
  tableCell: {
    fontSize: 11,
    paddingHorizontal: 2,
    fontFamily: 'Poppins-Regular'
  },
  descriptionCell: {
    flex: 1.5,
  },
  conditionCell: {
    flex: 1,
  },
  employeeCell: {
    flex: 1,
  },
  statusCell: {
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'Poppins-Regular'
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    fontFamily: 'Poppins-Regular'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-Regular'
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#F44336',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'Poppins-Regular'
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Regular'
  }
});

export default AssetManagementScreen;