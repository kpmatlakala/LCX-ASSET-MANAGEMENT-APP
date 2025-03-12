import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AssetRequestScreen = () => {
  const [purpose, setPurpose] = useState('');
  const [duration, setDuration] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState({
    name: 'MacBoo-k Pro',
    id: 'MBP2023-001',
    status: 'Available'
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#e9efc0" barStyle="dark-content" />
      
      {/* Header with Logo and Icons */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {/* <Image
            source={require('./assets/limpopo-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          /> */}
          <Text style={styles.logoTextMain}>LIMPOPO</Text>
          <Text style={styles.logoTextSub}>CONNEXION</Text>
          <Text style={styles.tagline}>building a future knowledge society</Text>
        </View>
        
        <View style={styles.headerIcons}>
          <View style={styles.notificationContainer}>
            <Ionicons name="notifications-outline" size={24} color="#555" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </View>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={24} color="#555" />
          </View>
        </View>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="search"
          placeholderTextColor="#999"
        />
        <Ionicons name="search" size={24} color="#999" style={styles.searchIcon} />
      </View>
      
      {/* Main Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Request details</Text>
        
        {/* Filter Dropdown */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter-outline" size={20} color="#555" />
            <Text style={styles.filterText}>All...</Text>
          </TouchableOpacity>
        </View>
        
        {/* Asset Selection Dropdown */}
        <View style={styles.assetDropdownContainer}>
          <TouchableOpacity 
            style={styles.assetDropdown}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <View style={styles.assetInfo}>
              <Text style={styles.assetName}>{selectedAsset.name}</Text>
              <Text style={styles.assetId}>{selectedAsset.id}</Text>
            </View>
            
            <View style={styles.assetStatus}>
              <Text style={styles.statusText}>{selectedAsset.status}</Text>
              <Ionicons 
                name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
                size={24} 
                color="#555" 
              />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.expandButton}>
            <Ionicons name="expand-outline" size={24} color="#555" />
          </TouchableOpacity>
        </View>
        
        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Purpose</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Assignment"
              value={purpose}
              onChangeText={setPurpose}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>duration</Text>
            <TextInput
              style={styles.formInput}
              placeholder="enter the date"
              value={duration}
              onChangeText={setDuration}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Ionicons 
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  size={24} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9efc0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  logoContainer: {
    position: 'relative',
    width: 180,
    height: 80,
  },
  logo: {
    width: 60,
    height: 60,
  },
  logoTextMain: {
    position: 'absolute',
    left: 70,
    top: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  logoTextSub: {
    position: 'absolute',
    left: 70,
    top: 35,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a3bb2e',
  },
  tagline: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    fontSize: 10,
    color: '#555',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContainer: {
    position: 'relative',
    marginRight: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#a83232',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    position: 'absolute',
    right: 16,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 10,
    color: '#333',
  },
  filterContainer: {
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    marginLeft: 5,
    color: '#555',
  },
  assetDropdownContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  assetDropdown: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  assetId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  assetStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginRight: 8,
    color: '#666',
  },
  expandButton: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  formContainer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#ccc',
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AssetRequestScreen;