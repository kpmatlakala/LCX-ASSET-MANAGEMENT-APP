import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

import { images } from "@/constants";
import ReturnForm from "@/components/ReturnForm";
import { router } from "expo-router";
import { useAssets } from "@/context/AssetContext";
import { useAuth } from "@/context/AuthContext";

interface Asset {
  id: number;
  name: string;
  status: string;
  category: string;
  serialNumber: string;
  location: string;
  condition: string;
  acquisitionDate: string;
  lastUpdated: string;
}

type TabType = "inventory" | "myAssets";

export default function AssetInventoryScreen() {
  const { session, employeeId, loading, isFirstLogin, updateSession } = useAuth();
  const { assets, myAssetRequests } = useAssets();
  const [currentTab, setCurrentTab] = useState<TabType>("inventory");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 4;
  const [selectedFilter, setSelectedFilter] = useState<string>("All...");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedAssetId, setExpandedAssetId] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Filter options
  const filterOptions: string[] = [
    "All...",
    "Available",
    "Assigned",
    "Maintenance",
    "Reserved",
  ];

  // For pagination functionality
  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const goToPreviousPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = (): void => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusStyles = (
    status: string
  ): { backgroundColor: string; borderColor: string } => {
    switch (status) {
      case "Available":
        return { backgroundColor: "#d1f4e0", borderColor: "#17c964" }; // Light green background, dark green border
      case "Assigned":
        return { backgroundColor: "#fdedd3", borderColor: "#f5a524" }; // Light orange background, dark orange border
      case "Maintenance":
        return { backgroundColor: "#fdd0df", borderColor: "#f5426c" }; // Light pink background, dark pink border
      case "Reserved":
        return { backgroundColor: "#f3f1260", borderColor: "#f3f1260" }; // Light yellow background, yellow border
      default:
        return { backgroundColor: "#f0f0f0", borderColor: "#cccccc" }; // Default light gray background, dark gray border
    }
  };

  // Toggle expanded asset details
  const toggleAssetDetails = (assetId: number): void => {
    if (expandedAssetId === assetId) {
      setExpandedAssetId(null);
    } else {
      setExpandedAssetId(assetId);
    }
  };

  // Handle asset request - now opens the modal
  const handleAssetRequest = (assetId: number): void => {
    const asset = assets.find((a) => a.asset_id === assetId);
    if (asset) {
      setSelectedAsset(asset);
      setModalVisible(true);
      router.push({
        pathname: "/RequestAsset",
        params: { assetId: asset.asset_id.toString() },
      });
    }
  };

  // Navigate to request asset screen
  const handleRequestNewAsset = (): void => {
    router.push("/RequestAsset");
  };

  // Handle modal close
  const handleCloseModal = (): void => {
    setModalVisible(false);
    setSelectedAsset(null);
  };

  // Handle asset review
  const handleAssetReview = (assetId: number): void => {
    // Implementation would go here
    console.log(`Reviewing asset ${assetId}`);
    router.push("/AssetDetails");
  };

  // Handle check availability
  const handleCheckAvailability = (assetId: number): void => {
    // Implementation would go here
    console.log(`Checking availability for asset ${assetId}`);
  };

  // Filter logic for "Inventory" tab (assets list)
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.asset_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.asset_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.asset_sn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "All..." || asset.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // Filter logic for "My Assets" tab (myAssetRequests)
  const filteredAssetRequests = myAssetRequests.filter((request) => {
    const matchesSearch =
      request.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.destination && request.destination.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      selectedFilter === "All..." ||
      (request.status && request.status === selectedFilter);

    return matchesSearch && matchesFilter && request.employee_id === employeeId;
  });

  // Handle asset return
  const handleAssetReturn = (requestId: number): void => {
    console.log(`Returning asset request ${requestId}`);
    // Implementation would go here
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

    

      {/* Assets Inventory section title with Request Asset button */}
      <View style={styles.inventoryHeader}>
        <Text style={styles.sectionTitle}>
           Inventory
        </Text>
        {/* <TouchableOpacity
          style={styles.requestNewButton}
          onPress={handleRequestNewAsset}
        >
          <Feather name="plus" size={18} color="#fff" />
          <Text style={styles.requestNewButtonText}>Request Asset</Text>
        </TouchableOpacity> */}
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchBar}>
          <Feather
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={
              currentTab === "inventory"
                ? "Search assets..."
                : "Search my requests..."
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterDropdown(!showFilterDropdown)}
        >
          <Text style={styles.filterButtonText}>{selectedFilter}</Text>
          <Feather name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Filter dropdown menu */}
      {showFilterDropdown && (
        <View style={styles.filterDropdownMenu}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.filterOption}
              onPress={() => {
                setSelectedFilter(option);
                setShowFilterDropdown(false);
              }}
            >
              <Text style={styles.filterOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Assets List - Conditional rendering based on current tab */}
      <ScrollView style={styles.assetsContainer}>
        {currentTab === "inventory" ? (
          // Inventory Tab Content
          filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <View key={asset.asset_id} style={styles.assetCard}>
                {/* Asset Card Header */}
                <View style={styles.assetCardHeader}>
                  <View
                    style={[
                      styles.assetNameContainer,
                      {
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <Text style={styles.assetName}>{asset.asset_name}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusStyles(asset.status)
                            .backgroundColor,
                          borderColor: getStatusStyles(asset.status).borderColor,
                          borderWidth: 1,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: getStatusStyles(asset.status).borderColor,
                          fontWeight: "bold",
                          fontSize: 12,
                        }}
                      >
                        {asset.status}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Summary Info Always Visible */}
                <View style={styles.assetSummary}>
                  <View style={styles.assetInfoRow}>
                    <View style={styles.assetInfoItem}>
                      <Text style={styles.assetInfoLabel}>Category:</Text>
                      <Text style={styles.assetInfoValue}>
                        {asset.asset_category}
                      </Text>
                    </View>

                    <View style={styles.assetInfoItem}>
                      <Text style={styles.assetInfoLabel}>Serial No:</Text>
                      <Text style={styles.assetInfoValue}>{asset.asset_sn}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.assetLastUpdated}>
                      Last updated: {asset.updated_at}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleAssetDetails(asset.asset_id)}
                    >
                      <Feather
                        name={
                          expandedAssetId === asset.asset_id
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={24}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Expanded Details and Actions */}
                {expandedAssetId === asset.asset_id && (
                  <View style={styles.expandedContent}>
                    <View style={styles.divider} />

                    {/* Additional Details */}
                    <View style={styles.expandedDetails}>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Description:</Text>
                          <Text style={styles.detailValue}>
                            {asset.description}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Condition:</Text>
                          <Text style={styles.detailValue}>
                            {asset.condition}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleAssetReview(asset.asset_id)}
                      >
                        <Feather name="eye" size={16} color="#333" />
                        <Text style={styles.actionButtonText}>Review</Text>
                      </TouchableOpacity>

                      {asset.status === "Available" && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.requestButton]}
                          onPress={() => handleAssetRequest(asset.asset_id)}
                        >
                          <Feather
                            name="shopping-cart"
                            size={16}
                            color="#fff"
                          />
                          <Text
                            style={[
                              styles.actionButtonText,
                              styles.requestButtonText,
                            ]}
                          >
                            Request Asset
                          </Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleCheckAvailability(asset.asset_id)}
                      >
                        <Feather name="calendar" size={16} color="#333" />
                        <Text style={styles.actionButtonText}>
                          Check Availability
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather name="box" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>
                No assets match your search criteria
              </Text>
            </View>
          )
        ) : (
          // My Assets Tab Content
          filteredAssetRequests.length > 0 ? (
            filteredAssetRequests.map((request) => (
              <View key={request.request_id} style={styles.assetCard}>
                {/* Request Card Header */}
                <View style={styles.assetCardHeader}>
                  <View
                    style={[
                      styles.assetNameContainer,
                      {
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <Text style={styles.assetName}>
                      Request #{request.request_id}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusStyles(request.status || "")
                            .backgroundColor,
                          borderColor: getStatusStyles(request.status || "")
                            .borderColor,
                          borderWidth: 1,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: getStatusStyles(request.status || "")
                            .borderColor,
                          fontWeight: "bold",
                          fontSize: 12,
                        }}
                      >
                        {request.status || "Processing"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Summary Info Always Visible */}
                <View style={styles.assetSummary}>
                  <View style={styles.assetInfoRow}>
                    <View style={styles.assetInfoItem}>
                      <Text style={styles.assetInfoLabel}>Asset:</Text>
                      <Text style={styles.assetInfoValue}>
                        {request.asset_name || "Unknown Asset"}
                      </Text>
                    </View>

                    <View style={styles.assetInfoItem}>
                      <Text style={styles.assetInfoLabel}>Requested:</Text>
                      <Text style={styles.assetInfoValue}>
                        {request.created_at || "Unknown date"}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.assetLastUpdated}>
                      Last updated: {request.updated_at || "Not updated"}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleAssetDetails(request.request_id)}
                    >
                      <Feather
                        name={
                          expandedAssetId === request.request_id
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={24}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Expanded Details and Actions */}
                {expandedAssetId === request.request_id && (
                  <View style={styles.expandedContent}>
                    <View style={styles.divider} />

                    {/* Additional Details */}
                    <View style={styles.expandedDetails}>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Purpose:</Text>
                          <Text style={styles.detailValue}>
                            {request.purpose || "Not specified"}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Destination:</Text>
                          <Text style={styles.detailValue}>
                            {request.destination || "Not specified"}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleAssetReview(request.request_id)}
                      >
                        <Feather name="eye" size={16} color="#333" />
                        <Text style={styles.actionButtonText}>
                          View Details
                        </Text>
                      </TouchableOpacity>

                      {request.status === "Assigned" && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.returnButton]}
                          onPress={() => handleAssetReturn(request.request_id)}
                        >
                          <Feather
                            name="corner-up-left"
                            size={16}
                            color="#fff"
                          />
                          <Text
                            style={[
                              styles.actionButtonText,
                              styles.returnButtonText,
                            ]}
                          >
                            Return Asset
                          </Text>
                        </TouchableOpacity>
                      )}

                      {request.status === "Pending" && (
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#f44336" },
                          ]}
                          onPress={() => console.log("Cancel request")}
                        >
                          <Feather name="x-circle" size={16} color="#fff" />
                          <Text
                            style={[
                              styles.actionButtonText,
                              { color: "#fff" },
                            ]}
                          >
                            Cancel Request
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather name="box" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>
                You have no asset requests
              </Text>
            </View>
          )
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#e6e9f0",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#0d1a31",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    flex: 1,
    alignItems: "center",
  },
  logoImage: {
    width: 180,
    height: 60,
    resizeMode: "contain",
  },
  notificationIcon: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#d13838",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  inventoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  requestNewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d1a31",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  requestNewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  searchFilterContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
  },
  filterDropdownMenu: {
    position: "absolute",
    top: 185,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#333",
  },
  assetsContainer: {
    marginHorizontal: 20,
    flex: 1,
  },
  assetCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#888",
    marginTop: 16,
    textAlign: "center",
  },
  assetCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assetNameContainer: {
    flex: 1,
  },
  assetName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusAvailable: {
    backgroundColor: "#e6f7e6",
  },
  statusAssigned: {
    backgroundColor: "#e6e6ff",
  },
  statusMaintenance: {
    backgroundColor: "#fff0e6",
  },
  statusReserved: {
    backgroundColor: "#f7f7e6",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  assetSummary: {
    marginTop: 5,
  },
  assetInfoRow: {
    flexDirection: "column",
    marginBottom: 5,
  },
  assetInfoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  assetInfoLabel: {
    fontSize: 14,
    color: "#888",
    marginRight: 5,
  },
  assetInfoValue: {
    fontSize: 14,
    color: "#333",
  },
  assetLastUpdated: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  expandedContent: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  expandedDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 13,
    color: "#333",
    marginLeft: 5,
  },
  requestButton: {
    backgroundColor: "#0d1a31",
  },
  requestButtonText: {
    color: "#fff",
  },
  returnButton: {
    backgroundColor: "#f5a524",
  },
  returnButtonText: {
    color: "#fff",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  paginationArrow: {
    padding: 10,
  },
  paginationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  paginationButtonActive: {
    backgroundColor: "#0d1a31",
  },
  paginationButtonText: {
    fontSize: 16,
    color: "#666",
  },
  paginationButtonTextActive: {
    color: "#fff",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    flex: 1,
    marginTop: 60,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
  },
});