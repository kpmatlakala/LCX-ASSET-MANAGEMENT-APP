

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
  Alert
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import * as Print from 'expo-print';
import { useAssets } from '@/context/AssetContext';
import { useLocalSearchParams } from 'expo-router';

const AssetManagementScreen = () => {
    const params = useLocalSearchParams();
    const assetIdFromParams = params.assetId;
    console.log("selected asset:", assetIdFromParams);

    const { assets } = useAssets();
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    
    // Find the selected asset when component mounts or assets/params change
    useEffect(() => {
      if (assetIdFromParams && assets.length > 0) {
        for (let i = 0; i < assets.length; i++)
        {
          if (assets[i].asset_id == assetIdFromParams) 
          {
            setSelectedAsset(assets[i]);
            break;
          }
        }
      }
    }, [assets, assetIdFromParams]);

    // Export functions
    const exportToCsv = async () => {
      try {
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
          if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(fileUri);
          } else {
              Alert.alert('Sharing is not available');
          }
      } catch (error) {
          console.error('CSV Export Error:', error);
          Alert.alert('Export Failed', 'Unable to export CSV file');
      }
  };
    const handleCancelRequest = () => {
      try {
          // Implement asset request cancellation logic
          // This might involve:
          // - Updating asset status in the context/database
          // - Clearing the selected asset
          // - Showing a confirmation toast/alert
          
          // Example placeholder implementation:
          Alert.alert('Request Cancelled', 'Your asset request has been cancelled.');
          setModalVisible(false);
          setSelectedAsset(null);
      } catch (error) {
          console.error('Cancel Request Error:', error);
          Alert.alert('Error', 'Unable to cancel the request. Please try again.');
      }
  };
  
  const renderAssetItem = ({ item }) => {
      return (
          <View style={styles.tableRow}>
              <Text 
                  style={[
                      styles.tableCell, 
                      styles.descriptionCell
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
              >
                  {item.asset_name}
              </Text>
              
              <Text 
                  style={[
                      styles.tableCell, 
                      styles.conditionCell
                  ]}
              >
                  Good
              </Text>
              
              <Text 
                  style={[
                      styles.tableCell, 
                      styles.statusCell
                  ]}
              >
                  {item.purchase_date}
              </Text>
              
              <View style={[styles.tableCell, styles.statusCell]}>
                  <View 
                      style={[
                          styles.badge, 
                          { 
                              backgroundColor: 
                                  item.status === 'Active' ? '#E8F5E9' : 
                                  item.status === 'Inactive' ? '#FFEBEE' : 
                                  '#FFF3E0'
                          }
                      ]}
                  >
                      <Text 
                          style={[
                              styles.badgeText, 
                              { 
                                  color: 
                                      item.status === 'Active' ? '#2E7D32' : 
                                      item.status === 'Inactive' ? '#D32F2F' : 
                                      '#F57C00'
                              }
                          ]}
                      >
                          {item.status}
                      </Text>
                  </View>
              </View>
          </View>
      );
  };

  const exportToExcel = async () => {
    try {
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
        } else {
            Alert.alert('Sharing is not available');
        }
    } catch (error) {
        console.error('Excel Export Error:', error);
        Alert.alert('Export Failed', 'Unable to export Excel file');
    }
};
const exportToPdf = async () => {
    try {
        // Create HTML content for PDF
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h2>Asset Management Report</h2>
            <table>
                <thead>
                    <tr>
                        <th>Asset Name</th>
                        <th>Serial Number</th>
                        <th>Category</th>
                        <th>Cost</th>
                        <th>Purchase Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${assets.map(asset => `
                        <tr>
                            <td>${asset.asset_name}</td>
                            <td>${asset.asset_sn}</td>
                            <td>${asset.asset_category}</td>
                            <td>${asset.purchase_price}</td>
                            <td>${asset.purchase_date}</td>
                            <td>${asset.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
        `;

        // Create PDF
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false
        });

        // Share the file
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, { 
                mimeType: 'application/pdf', 
                dialogTitle: 'Export Assets PDF' 
            });
        } else {
            Alert.alert('Sharing is not available');
        }
    } catch (error) {
        console.error('PDF Export Error:', error);
        Alert.alert('Export Failed', 'Unable to export PDF file');
    }
};

    const renderExportOptions = () => {
        return (
            <View style={styles.exportContainer}>
                <TouchableOpacity 
                    style={styles.exportButton} 
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
                    <Text style={styles.exportButtonText}>Export</Text>
                </TouchableOpacity>
            </View>
        );
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
              {renderExportOptions()}
          </View>

          {/* Asset Information Card */}
          <View style={styles.assetInfoCard}>
              <View style={styles.assetInfoHeader}>
                  <Text style={styles.assetInfoTitle}>Asset Information</Text>
                  <View style={styles.assetInfoActions}>
                      <TouchableOpacity>
                          <MaterialIcons name="more-vert" size={20} color="#666" />
                      </TouchableOpacity>
                  </View>
              </View>

              <View style={styles.assetInfoContent}>
                  <View style={styles.infoColumn}>
                      <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Asset Name:</Text>
                          <Text style={styles.infoValue}>{selectedAsset?.asset_name}</Text>
                      </View>
                      <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Serial Number:</Text>
                          <Text style={styles.infoValue}>{selectedAsset?.asset_sn}</Text>
                      </View>
                      <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Category:</Text>
                          <Text style={styles.infoValue}>{selectedAsset?.asset_category}</Text>
                      </View>
                      <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Warranty:</Text>
                          <Text style={styles.infoValue}>2 years</Text>
                      </View>
                      <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Purchase Date:</Text>
                          <Text style={styles.infoValue}>{selectedAsset?.purchase_date}</Text>
                      </View>
                  </View>
                  <View style={styles.infoColumn}>
                      <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Cost:</Text>
                          <Text style={styles.infoValue}>{selectedAsset?.purchase_price}</Text>
                      </View>

                      <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Assigned To:</Text>
                          <Text style={styles.infoValue}>Nathan</Text>
                      </View>
                      <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Location Office:</Text>
                          <Text style={styles.infoValue}>Third-floor Room</Text>
                      </View>
                      
                      <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Return Date:</Text>
                          <Text style={styles.infoValue}>2 years</Text>
                      </View>
                  </View>
              </View>
              
              {/* Cancel Request Button - now at the bottom of the asset info card */}
              <View style={styles.cardButtonContainer}>
                  <TouchableOpacity 
                      style={styles.cancelRequestButton} 
                      onPress={() => setModalVisible(true)}
                  >
                      <MaterialIcons name="cancel" size={16} color="white" style={styles.buttonIcon} />
                      <Text style={styles.cancelRequestButtonText}>Cancel request</Text>
                  </TouchableOpacity>
              </View>
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

// Styles remain exactly the same as in the original code
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
  },
  buttonIcon: {
    marginRight: 6,
  },
  cancelRequestButtonText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular'
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