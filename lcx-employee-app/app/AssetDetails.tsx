import React, { useState } from 'react';
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
  Platform,
  Alert
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useAssets } from '@/context/AssetContext';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { printToFileAsync } from 'expo-print';

const AssetManagementScreen = () => {
    const params = useLocalSearchParams();
    const assetIdFromParams = params.assetId;
    console.log("selected asset:", assetIdFromParams);

    const { assets } = useAssets();
    const [modalVisible, setModalVisible] = useState(false); 

    // PDF Export Function
    const exportToPDF = async () => {
        try {
            // Create HTML template for PDF
            const html = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    h1 { color: #333; }
                </style>
            </head>
            <body>
                <h1>Asset Management Report</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Condition</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${assets.map(item => `
                            <tr>
                                <td>${item.description}</td>
                                <td>${item.condition}</td>
                                <td>${item.date}</td>
                                <td>${item.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
            `;

            // Generate PDF
            const { uri } = await printToFileAsync({
                html: html,
                base64: false
            });

            // Share the PDF
            await Sharing.shareAsync(uri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Export Asset Management Report'
            });
        } catch (error) {
            console.error('PDF Export Error:', error);
            Alert.alert('Export Failed', 'Unable to export PDF');
        }
    };

    // Excel Export Function
    const exportToExcel = async () => {
        try {
            // Prepare data for Excel
            const wsData = [
                ['Description', 'Condition', 'Date', 'Status'], // Header
                ...assets.map(item => [
                    item.description, 
                    item.condition, 
                    item.date, 
                    item.status
                ])
            ];

            // Create worksheet
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Asset Log');

            // Generate Excel file
            const excelFile = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

            // Save and share the file
            const fileName = `AssetManagement_${new Date().toISOString().split('T')[0]}.xlsx`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;

            await FileSystem.writeAsStringAsync(fileUri, excelFile, {
                encoding: FileSystem.EncodingType.Base64
            });

            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                dialogTitle: 'Export Asset Management Log'
            });
        } catch (error) {
            console.error('Excel Export Error:', error);
            Alert.alert('Export Failed', 'Unable to export Excel file');
        }
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
                <TouchableOpacity 
                    style={styles.exportButton} 
                    onPress={exportToPDF}
                >
                    <MaterialIcons name="picture-as-pdf" size={16} color="#666" />
                    <Text style={styles.exportButtonText}>Export PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.exportButton} 
                    onPress={exportToExcel}
                >
                    <MaterialIcons name="file-download" size={16} color="#666" />
                    <Text style={styles.exportButtonText}>Export Excel</Text>
                </TouchableOpacity>
            </View>
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
                    <Text style={styles.infoValue}>DELL XPS LAPTOP</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Serial Number:</Text>
                    <Text style={styles.infoValue}>QZF0196567</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Category:</Text>
                    <Text style={styles.infoValue}>Electronic</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Warranty:</Text>
                    <Text style={styles.infoValue}>2 years</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Purchase Date:</Text>
                    <Text style={styles.infoValue}>4 years ago</Text>
                </View>
                </View>
                <View style={styles.infoColumn}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Cost:</Text>
                    <Text style={styles.infoValue}>$1,200.00</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Location Office:</Text>
                    <Text style={styles.infoValue}>Third-floor Room</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Assigned To:</Text>
                    <Text style={styles.infoValue}>Nathan</Text>
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