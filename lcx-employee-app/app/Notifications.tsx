import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cn } from "nativewind";
import { images } from '@/constants';
import { useAssets } from '@/context/AssetContext';
import { useNotifications, Notification } from '@/context/NotificationContext';

const NotificationItem: React.FC<{ item: Notification }> = ({ item }) => {
  const { markAsRead } = useNotifications();

  return (
    <TouchableOpacity 
      onPress={() => markAsRead(item.id || '')}
      className={cn(
        "flex-row items-center p-4 border-b border-gray-200",
        !item.is_read && "bg-blue-50"
      )}
    >
      {/* Unread Indicator */}
      {!item.is_read && (
        <View className="w-3 h-3 rounded-full bg-blue-500 mr-3" />
      )}
      
      <View className="flex-1">
        <Text 
          className={cn(
            "text-base font-semibold",
            item.is_read ? "text-gray-600" : "text-black"
          )}
        >
          {item.title}
        </Text>
        <Text 
          className={cn(
            "text-sm",
            item.is_read ? "text-gray-500" : "text-gray-700"
          )}
        >
          {item.subtext}
        </Text>
        <Text className="text-xs text-gray-400 mt-1">
          {new Date(item.created_at || '').toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const NotificationsScreen: React.FC = () => {
  const { 
    notifications, 
    markAllAsRead, 
    clearAll 
  } = useNotifications();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between p-4 border-b border-gray-200">
        <Text className="text-lg font-bold">Notifications</Text>
        <View className="flex-row">
          <TouchableOpacity 
            onPress={markAllAsRead} 
            className="mr-4"
          >
            <Text className="text-blue-600">Mark All Read</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAll}>
            <Text className="text-red-600">Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {notifications.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id || ''}
          renderItem={({ item }) => <NotificationItem item={item} />}
          contentContainerStyle={notifications.length === 0 ? { flex: 1, justifyContent: 'center', alignItems: 'center' } : {}}
        />
      )}
    </View>
  );
};