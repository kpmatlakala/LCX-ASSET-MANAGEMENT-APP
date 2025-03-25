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

// Dropdown Menu Component
const DropdownMenu = ({ 
  visible, 
  onClose, 
  onMarkAsRead, 
  onDelete 
}) => {
  return (
    <Modal 
      transparent={true} 
      visible={visible} 
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.dropdownOverlay} 
        activeOpacity={1} 
        onPressOut={onClose}
      >
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdownItem}
            onPress={onMarkAsRead}
          >
            <MaterialIcons name="mark-email-read" size={20} color="#666" />
            <Text style={styles.dropdownItemText}>Mark as Read</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dropdownItem}
            onPress={onDelete}
          >
            <MaterialIcons name="delete" size={20} color="#FF6347" />
            <Text style={styles.dropdownItemTextDelete}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// Notification Details Modal
const NotificationDetailsModal = ({ 
  notification, 
  visible, 
  onClose 
}) => {
  return (
    <Modal 
      visible={visible} 
      transparent={true} 
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{notification.title}</Text>
          <Text style={styles.modalMessage}>{notification.message}</Text>
          
          {notification.subtext && (
            <Text style={styles.modalSubtext}>{notification.subtext}</Text>
          )}
          
          <Text style={styles.modalDate}>
            Received: {notification.created_at}
          </Text>
          
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={onClose}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function NotificationsScreen() {   
  const { 
    notifications, 
    markAsRead, 
    deleteNotification 
  } = useNotifications();   
  
  const [currentPage, setCurrentPage] = useState(1);   
  const [dropdownStates, setDropdownStates] = useState({});
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  
  const totalPages = Math.ceil(notifications.length / 10);    

  const toggleDropdown = (notificationId) => {
    setDropdownStates(prev => ({
      ...Object.fromEntries(
        Object.keys(prev).map(key => [key, false])
      ),
      [notificationId]: !prev[notificationId]
    }));
  };

  const handleMarkAsRead = (notification) => {
    markAsRead(notification.id);
    toggleDropdown(notification.id);
  };

  const handleDelete = (notification) => {
    deleteNotification(notification.id);
    toggleDropdown(notification.id);
  };

  const handleNotificationPress = (notification) => {
    // Mark as read and show details
    markAsRead(notification.id);
    setSelectedNotification(notification);
    setDetailsModalVisible(true);
  };

  return (     
    <SafeAreaView style={styles.container}>       
      <StatusBar backgroundColor="#e8eac6" barStyle="dark-content" />        

      {/* Header section with dropdown */}       
      <View style={styles.headerContainer}>         
        <Text style={styles.headerTitle}>Notifications</Text>          
        <TouchableOpacity style={styles.sortButton}>           
          <Text style={styles.sortButtonText}>Recent first</Text>           
          <Feather name="chevron-down" size={20} color="#666" />         
        </TouchableOpacity>       
      </View>        

      {/* Notifications List */}       
      <ScrollView style={styles.scrollContainer}>         
        {notifications.map((notification) => (           
          <View 
            key={notification.id} 
            style={[
              styles.notificationCard,
              notification.is_read ? styles.readNotification : styles.unreadNotification
            ]}
          >             
            <View style={styles.notificationContent}>
              <TouchableOpacity 
                style={styles.notificationTouchable} 
                onPress={() => handleNotificationPress(notification)}
              >
                <Text style={styles.notificationTitle}>{notification.title}</Text>                              
                <View style={styles.notificationMessageContainer}>                 
                  <Text 
                    style={[
                      styles.notificationMessage,
                      notification.is_read ? styles.readText : styles.unreadText
                    ]}
                  >
                    <View 
                      style={[
                        styles.notificationDot,
                        notification.is_read ? styles.readDot : styles.unreadDot
                      ]} 
                    /> 
                    { notification.message }                 
                  </Text>               
                </View>                              
                {notification.subtext && (                 
                  <View style={styles.notificationSubtextContainer}>                   
                    <Text style={styles.notificationSubtext}>
                      <View style={styles.subtextDot} /> -                     
                      { notification.subtext }                   
                    </Text>                 
                  </View>               
                )}             
              </TouchableOpacity>

              {/* Dropdown Trigger */}
              <TouchableOpacity 
                style={styles.dropdownTrigger}
                onPress={() => toggleDropdown(notification.id)}
              >
                <Text style={styles.dropdownTriggerText}>⁝</Text>
              </TouchableOpacity>

              <DropdownMenu 
                visible={dropdownStates[notification.id]} 
                onClose={() => toggleDropdown(notification.id)}
                onMarkAsRead={() => handleMarkAsRead(notification)}
                onDelete={() => handleDelete(notification)}
              />
            </View>
                          
            <Text style={styles.notificationDate}>
              {notification.created_at}
            </Text>           
          </View>         
        ))}       
      </ScrollView>     

      {/* Notification Details Modal */}
      {selectedNotification && (
        <NotificationDetailsModal 
          notification={selectedNotification}
          visible={detailsModalVisible}
          onClose={() => setDetailsModalVisible(false)}
        />
      )}
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
  scrollContainer: {
    marginHorizontal: 20,
    flex: 1
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowOpacity: 0.1,
    borderWidth: 1
  },
  readNotification: {
    borderColor: '#e0e0e0'
  },
  unreadNotification: {
    borderColor: '#3b82f6'
  },
  notificationContent: {
    flexDirection: 'row'
  },
  notificationTouchable: {
    flex: 1
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  notificationMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  notificationMessage: {
    fontSize: 14,
    flex: 1
  },
  readText: {
    color: '#666'
  },
  unreadText: {
    color: '#1a1a1a',
    fontWeight: '600'
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  readDot: {
    backgroundColor: '#999'
  },
  unreadDot: {
    backgroundColor: '#3b82f6'
  },
  notificationSubtextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  notificationSubtext: {
    fontSize: 14,
    color: '#666',
    flex: 1
  },
  subtextDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginRight: 8
  },
  dropdownTrigger: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropdownTriggerText: {
    fontSize: 24,
    color: '#666'
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
    alignSelf: 'flex-end'
  },
  dropdownOverlay: {
    flex: 1
  },
  dropdownContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowOpacity: 0.1,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  dropdownItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666'
  },
  dropdownItemTextDelete: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FF6347'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 24
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16
  },
  modalSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  modalDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16
  },
  modalCloseButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});