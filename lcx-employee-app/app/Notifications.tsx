import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  StyleSheet
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNotifications } from '@/context/NotificationContext';

export default function NotificationsScreen() {
  const {
    notifications,
    markAsRead,
    deleteNotification
  } = useNotifications();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const toggleDropdown = (notificationId) => {
    setActiveDropdown((prev) => (prev === notificationId ? null : notificationId));
  };

  const handleMarkAsRead = (notification) => {
    markAsRead(notification.notification_id);
    setActiveDropdown(null);
  };

  const handleDelete = (notification) => {
    deleteNotification(notification.notification_id);
    setActiveDropdown(null);
  };

  const handleNotificationPress = (notification) => {
    markAsRead(notification.notification_id);
    setSelectedNotification(notification);
    setDetailsModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor="#e8eac6" barStyle="dark-content" />

      {/* Header section */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 20, marginBottom: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
          {/* Notifications */}
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Recent first</Text>
          <Feather name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={{ marginHorizontal: 20, flex: 1 }}>
        {notifications.map((notification) => (
          <View
            key={notification.notification_id}
            style={{ backgroundColor: 'white', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ddd', minHeight: 86 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleNotificationPress(notification)}
              >
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: 'bold', 
                  marginBottom: 4,  
                  color: notification.is_read ? '#999' : 'black', // Gray for read, black for unread
                  opacity: notification.is_read ? 0.7 : 1
                }}
                  numberOfLines={1}>{notification.title}
                </Text>

                <Text style={{ fontSize: 14, color: '#666' }} 
                  numberOfLines={1}>{notification.message}
                </Text>
              </TouchableOpacity>

              {/* Dropdown Trigger */}
              <TouchableOpacity
                style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => toggleDropdown(notification.notification_id)}
              >
                <Text style={{ fontSize: 24, color: '#666' }}>⁝</Text>
              </TouchableOpacity>
            </View>

            {activeDropdown === notification.notification_id && (
              <View style={{ marginTop: 10, backgroundColor: '#f9f9f9', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#ddd' }}>
                <TouchableOpacity
                  style={{ padding: 8 }}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <Text style={{ fontSize: 16, color: '#007bff' }}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ padding: 8 }}
                  onPress={() => handleMarkAsRead(notification)}
                >
                  <Text style={{ fontSize: 16, color: '#28a745' }}>Mark as Read</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ padding: 8 }}
                  onPress={() => handleDelete(notification)}
                >
                  <Text style={{ fontSize: 16, color: '#FF6347' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={{ fontSize: 12, color: '#999', position: 'absolute', bottom: 8, right: 16 }}>
              {notification.created_at}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Notification Details Modal */}
      <Modal
        visible={detailsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 10, maxHeight: '80%' }}>
            {selectedNotification && (
              <ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold', flex: 1, marginRight: 10 }}>{selectedNotification.title}</Text>
                  <MaterialIcons
                    name={selectedNotification.is_read ? "mark-email-read" : "mark-email-unread"}
                    size={24}
                    color={selectedNotification.is_read ? "#888" : "#007bff"}
                  />
                </View>

                <View style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 16, color: '#333', marginBottom: 5 }}>{selectedNotification.message}</Text>
                  {selectedNotification.subtext && (
                    <Text style={{ fontSize: 14, color: '#666' }}>{selectedNotification.subtext}</Text>
                  )}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                  <Text style={{ fontSize: 12, color: '#999' }}>Type: {selectedNotification.type}</Text>
                  <Text style={{ fontSize: 12, color: '#999' }}>
                    {new Date(selectedNotification.created_at).toLocaleString()}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    onPress={() => {
                      handleMarkAsRead(selectedNotification.notification_id);
                      setDetailsModalVisible(false);
                    }}
                    style={{
                      backgroundColor: selectedNotification.is_read ? '#f0f0f0' : '#007bff',
                      padding: 10,
                      borderRadius: 5,
                      flex: 0.45
                    }}
                  >
                    <Text style={{
                      color: selectedNotification.is_read ? '#999' : 'white',
                      textAlign: 'center'
                    }}>
                      {selectedNotification.is_read ? 'Already Read' : 'Mark as Read'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      handleDelete(selectedNotification);
                      setDetailsModalVisible(false);
                    }}
                    style={{
                      backgroundColor: '#FF6347',
                      padding: 10,
                      borderRadius: 5,
                      flex: 0.45
                    }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
            <TouchableOpacity
              onPress={() => setDetailsModalVisible(false)}
              style={{ marginTop: 15, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 16, color: '#007bff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8
  },
});