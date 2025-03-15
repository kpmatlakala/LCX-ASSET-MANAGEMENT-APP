import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, SafeAreaView, ActivityIndicator, 
  Alert, RefreshControl, TouchableOpacity, Image 
} from 'react-native';
import CustomButton from '../components/CustomButton';
import { images } from '../constants';
import { Notification, User } from 'iconsax-react-native';

const Pending = ({ navigation }) => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPendingAssets();
  }, []);

  const fetchPendingAssets = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        const mockPendingData = [
          {
            id: 1,
            itemName: 'MacBook Pro',
            requester: 'Thabo Mokoena',
            department: 'Marketing (Floor 3)',
            status: 'pending',
            submittedTime: 'yesterday'
          },
          {
            id: 2,
            itemName: 'iPhone 6',
            requester: 'Thabo Mokoena',
            department: 'Marketing (Floor 3)',
            status: 'pending',
            submittedTime: 'today'
          }
        ];
        setPendingApprovals(mockPendingData);
        setLoading(false);
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching pending assets:', error);
      Alert.alert('Error', 'Failed to load pending requests. Please try again.');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApprove = async (id) => {
    Alert.alert(
      'Confirm Approval',
      'Are you sure you want to approve this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: () => {
            const updatedPending = pendingApprovals.filter(item => item.id !== id);
            setPendingApprovals(updatedPending);
            setTimeout(() => {
              Alert.alert('Success', 'Request approved successfully');
            }, 500);
          }
        }
      ]
    );
  };

  const handleReject = async (id) => {
    Alert.alert(
      'Confirm Rejection',
      'Are you sure you want to reject this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          onPress: () => {
            const updatedPending = pendingApprovals.filter(item => item.id !== id);
            setPendingApprovals(updatedPending);
            setTimeout(() => {
              Alert.alert('Success', 'Request rejected successfully');
            }, 500);
          }
        }
      ]
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPendingAssets();
  };

  const PendingCard = ({ item }) => (
    <View className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <Text className="font-medium">{item.itemName}</Text>
      <Text className="text-gray-500 text-sm">From: {item.requester}</Text>
      <Text className="text-gray-500 text-sm">To: {item.department}</Text>
      <View className="items-end mt-1">
        <Text className="text-xs text-gray-500">submitted {item.submittedTime}</Text>
      </View>
      <View className="flex-row justify-between mt-4">
        <CustomButton 
          label="Approve" 
          containerStyles="bg-lime-500 px-4 py-2 rounded-lg w-36" 
          textStyles="text-white text-sm text-center"
          handlePress={() => handleApprove(item.id)}
        />
        <CustomButton 
          label="Reject" 
          containerStyles="bg-black px-4 py-2 rounded-lg w-36" 
          textStyles="text-white text-sm text-center"
          handlePress={() => handleReject(item.id)}
        />
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#9ACD32" />
        <Text className="mt-4 text-gray-600">Loading pending requests...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#9ACD32"]}
          />
        }
      >
        <View className="max-w-md mx-auto">
          <View className="bg-lime-100 p-6 pb-16 relative">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
                <Text style={{ color: '#4d4d4d', fontWeight: '500' }}>← Back</Text>
              </TouchableOpacity>
              <View className="flex-row justify-between items-center pt-4 pb-6">
                <Image
                  source={images.Logo}
                  resizeMode="contain"
                  style={{ width: 170, height: 100 }}
                />
                <View className="flex-row">
                  <TouchableOpacity className="mr-4 relative">
                    <Notification size="24" color="#4d4d4d" />
                    <View className="w-4 h-4 bg-red-500 rounded-full absolute -top-1 -right-1 flex items-center justify-center">
                      <Text className="text-white text-xs font-bold">1</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <User size="24" color="#4d4d4d" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View className="bg-white h-16 rounded-t-full -mt-12 relative"></View>

          <View className="px-6 -mt-8 relative z-10 pb-8">
            <Text className="text-gray-600 text-xl font-medium mb-2">Pending Approvals</Text>
            <Text className="text-gray-500 mb-4">
              {pendingApprovals.length} request{pendingApprovals.length !== 1 ? 's' : ''} waiting
            </Text>

            {pendingApprovals.length > 0 ? (
              pendingApprovals.map(item => (
                <PendingCard key={item.id} item={item} />
              ))
            ) : (
              <View className="bg-white border border-gray-200 rounded-lg p-6 mb-4 shadow-sm items-center">
                <Text className="text-gray-500">No pending requests</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Pending;
