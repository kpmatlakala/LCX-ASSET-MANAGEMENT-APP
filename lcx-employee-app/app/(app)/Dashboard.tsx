import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Image } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function AssetManagementDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Demo data
  const assets = [
    { id: 'MBP2023-001', name: 'MacBook Pro', category: 'Laptops', status: 'Available' },
    { id: 'IP14-023', name: 'iPhone 14', category: 'Phones', status: 'Available' },
  ];

  const notifications = [
    { 
      id: 1, 
      title: 'Request Approved', 
      message: 'Dell XPS 15 Laptop request approved',
      subtext: 'Please wait Patiently for dispatch',
      time: '10 minutes ago' 
    }
  ];

  const filteredAssets = selectedCategory === 'All' 
    ? assets 
    : assets.filter(asset => asset.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#e8eac6" barStyle="dark-content" />
      
      {/* Header with Logo */}
      {/* <View style={styles.header}>
        <View style={styles.logo}>
          <Image 
            source={require('@/assets/images/lcx-logo.png')} 
            style={styles.logoImage}
            // Fallback if you don't have the actual logo
            defaultSource={require('@/assets/images/placeholder.png')}
          />
        </View>        
      </View> */}

      {/* Dashboard Title */}
      <Text style={styles.dashboardTitle}>Dashboard</Text>

      {/* Stats Cards - Now horizontally scrollable */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.statsScrollContainer}
        contentContainerStyle={styles.statsContentContainer}
      >
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <FontAwesome5 name="box" size={24} color="#b0c652" />
            <Text style={styles.statLabel}>Total Assets</Text>
          </View>
          <Text style={styles.statValue}>3</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="time-outline" size={24} color="#b0c652" />
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <Text style={styles.statValue}>1</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="time-outline" size={24} color="#b0c652" />
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
          <Text style={styles.statValue}>1</Text>
        </View>

      </ScrollView>

      {/* Asset Categories */}
      <Text style={styles.sectionTitle}>Asset Categories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
      >
        {['All', 'Laptops', 'Phones', 'Other'].map(category => (
          <TouchableOpacity 
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextActive
            ]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Asset List */}
      <ScrollView style={styles.assetListContainer}>
        {filteredAssets.map(asset => (
          <View key={asset.id} style={styles.assetCard}>
            <View>
              <Text style={styles.assetName}>{asset.name}</Text>
              <Text style={styles.assetId}>{asset.id}</Text>
            </View>
            <View>
              <Text style={styles.assetStatus}>{asset.status}</Text>
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.showMoreButton}>
          <Text style={styles.showMoreText}>Show More Assets</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Notifications */}
      <Text style={styles.sectionTitle}>Notifications</Text>
      <ScrollView style={styles.notificationsContainer}>
        {notifications.map(notification => (
          <View key={notification.id} style={styles.notificationCard}>
            <View>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationSubtext}>{notification.subtext}</Text>
            </View>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7e8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,    
  },
  logo: {
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 80,
    resizeMode: 'contain',
  },
  notificationIcon: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#d13838',
    borderRadius: 12,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  dashboardTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 8,
  },
  statsScrollContainer: {
    marginTop: 8,
    paddingVertical: 8
  },
  statsContentContainer: {
    paddingHorizontal: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    paddingBottom: 25,
    width: 150,
    height:86,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0d1a31',
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 15,    
  },
  categoryButton: {
    height:36,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 25,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#0d1a31',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  assetListContainer: {
    marginHorizontal: 20,
    marginTop: 4,
    height: 250,
    // backgroundColor:'#000',
  },
  assetCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  assetName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  assetId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  assetStatus: {
    color: '#5eb354',
  },
  showMoreButton: {    
    padding: 8,
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18
  },
  showMoreText: {
    fontSize: 16,
    color: '#333',
  },
  notificationsContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  notificationSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});