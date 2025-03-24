import React, { useState } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  Modal
} from 'react-native';
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
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Notifications</Text>          
      </View>        
      
      {/* Notifications List */}       
      <ScrollView style={{ marginHorizontal: 20, flex: 1 }}>         
        {notifications.map((notification) => (           
          <View 
            key={notification.notification_id} 
            style={{ backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#ddd', minHeight: 80 }}
          >             
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity 
                style={{ flex: 1 }} 
                onPress={() => handleNotificationPress(notification)}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }} numberOfLines={1}>{notification.title}</Text>                              
                <Text style={{ fontSize: 14, color: '#666' }} numberOfLines={1}>{notification.message}</Text>              
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
          <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            {selectedNotification && (
              <>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{selectedNotification.title}</Text>
                <Text style={{ fontSize: 16, marginBottom: 20 }}>{selectedNotification.message}</Text>
              </>
            )}
            <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
              <Text style={{ fontSize: 16, color: '#007bff', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>    
    </SafeAreaView>   
  ); 
}
