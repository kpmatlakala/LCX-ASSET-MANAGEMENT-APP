import React from 'react'
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'

import { useNotifications } from '@/context/NotificationContext';

const NotificationsModal = () => {
    const { isModalVisible, notifications, closeModal } = useNotifications();

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal} // Close modal on back button press
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Recent Notifications</Text>
                    <ScrollView style={styles.notificationsContainer}>
                        {notifications.map((notification) => (
                            <View key={notification.id} style={styles.notificationCard}>
                                <Text style={styles.notificationTitle}>
                                    {notification.title}
                                </Text>
                                <Text style={styles.notificationMessage}>
                                    {notification.message}
                                </Text>
                                <Text style={styles.notificationSubtext}>
                                    {notification.subtext}
                                </Text>
                                <Text style={styles.notificationTime}>
                                    {notification.created_at}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closeModal}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default NotificationsModal;


const styles = StyleSheet.create({
    notificationsContainer: {
        maxHeight: 300,
    },
    notificationCard: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    notificationMessage: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    notificationSubtext: {
        fontSize: 12,
        color: "#999",
        marginTop: 2,
    },
    notificationTime: {
        fontSize: 12,
        color: "#999",
        marginTop: 8,
        alignSelf: "flex-end",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: "#d13838",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
})
