import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView, Modal, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

const Settings = () => {
  // State for modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  // State for profile data
  const [profileData, setProfileData] = useState({
    name: 'mapula',
    email: 'mapule.6862@gmail.com',
    image: 'https://i.pravatar.cc/150?img=23'
  });
  // State for form data
  const [formData, setFormData] = useState({
    name: profileData.name,
    email: profileData.email
  });
  
  // Menu items data
  const menuItems = [
    { 
      icon: 'location-outline', 
      title: 'My addresses', 
      iconType: 'Ionicons',
      info: null 
    },
    { 
      icon: 'notifications-outline', 
      title: 'Notifications', 
      iconType: 'Ionicons',
      info: null 
    },
    { 
      icon: 'scan-outline', 
      title: 'Scan settings', 
      iconType: 'Ionicons',
      info: null 
    },
    { 
      icon: 'file-text-outline', 
      title: 'Terms of Service', 
      iconType: 'Ionicons',
      info: null 
    },
    { 
      icon: 'globe-outline', 
      title: 'Language', 
      iconType: 'Ionicons',
      info: 'English' 
    },
    { 
      icon: 'log-out-outline', 
      title: 'Log out', 
      iconType: 'Ionicons',
      info: null,
      color: '#b8ca41' 
    },
  ];

  // Function to handle form input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Function to handle save
  const handleSave = () => {
    setProfileData({
      ...profileData,
      name: formData.name,
      email: formData.email
    });
    setModalVisible(false);
  };

  // Function to dismiss keyboard when clicking outside input fields
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Render menu item
  const renderMenuItem = (item, index) => {
    return (
      <TouchableOpacity 
        key={index} 
        style={styles.menuItem}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.iconContainer, item.color && {backgroundColor: `${item.color}20`}]}>
            <Ionicons name={item.icon} size={22} color={item.color || '#b8ca41'} />
          </View>
          <Text style={[styles.menuItemText, item.color && {color: item.color}]}>{item.title}</Text>
        </View>
        <View style={styles.menuItemRight}>
          {item.info && <Text style={styles.menuItemInfo}>{item.info}</Text>}
          <Ionicons name="chevron-forward" size={18} color="#A0A0A0" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: profileData.image }} 
              style={styles.profileImage} 
            />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{profileData.name}</Text>
              <Text style={styles.profileEmail}>{profileData.email}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Help Section */}
        <TouchableOpacity style={styles.helpContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="white" />
          <Text style={styles.helpText}>How can we help you?</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileImageContainer}>
                <Image 
                  source={{ uri: profileData.image }} 
                  style={styles.modalProfileImage} 
                />
                <TouchableOpacity style={styles.editImageButton}>
                  <Ionicons name="camera" size={20} color="white" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleChange('name', text)}
                  placeholder="Enter your name"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
    fontFamily: 'Poppins-Regular',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-Regular'
  },
  moreButton: {
    padding: 4,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular'
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profileText: {
    flex: 1,
    fontFamily: 'Poppins-Regular'
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-Regular'
  },
  profileEmail: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Poppins-Regular'
  },
  editButton: {
    backgroundColor: '#b8ca41',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins-Regular'
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'Poppins-Regular'
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Regular'
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemInfo: {
    fontSize: 14,
    color: '#black',
    marginRight: 8,
  },
  helpContainer: {
    flexDirection: 'row',
    backgroundColor: '#b8ca41',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpText: {
    color: '#f5f7e8',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    fontFamily: 'Poppins-Regular'
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    right: 120,
    bottom: 0,
    backgroundColor: '#b8ca41',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#b8ca41',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});

export default Settings;