import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { AppState } from 'react-native';

// Notification interface
export interface Notification { 
  id?: string;
  title: string;
  subtext: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  is_read?: boolean;
  created_at?: string;
  employee_id?: string;
  request_id?: number;
  asset_id?: number;
}

// Updated context type
interface NotificationContextType {
    isModalVisible: boolean;
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    clearAll: () => Promise<void>;
    showModal: (notificationsData: Notification[]) => void;
    closeModal: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [isModalVisible, setModalVisible] = useState(false);

  const showModal = (notificationsData) => {
    setNotifications(notificationsData);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Get current session
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load notifications on mount and when app comes to foreground
  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
    }
    
    // Set up app state listener to reload notifications when app comes to foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active' && session?.user?.id) {
        fetchNotifications();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [session]);

  // Fetch notifications from Supabase
  const fetchNotifications = async () => {
    try {
      if (!session?.user?.id) return;

      // Get the employee_id for the current user
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("employee_id")
        .eq("id", session.user.id)
        .single();

      if (employeeError) {
        console.error("Error fetching employee data:", employeeError);
        return;
      }

      const employee_id = employeeData.employee_id;
      
      // Get notifications for the current user
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('employee_id', employee_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Add a new notification
  const addNotification = async (notification: Notification) => {
    try {
      if (!session?.user?.id) return;

      // Get the employee_id for the current user
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("employee_id")
        .eq("id", session.user.id)
        .single();

      if (employeeError) {
        console.error("Error fetching employee data:", employeeError);
        return;
      }

      const employee_id = employeeData.employee_id;
      
      // Add timestamp and read status
      const newNotification = {
        ...notification,
        employee_id,
        is_read: false,
        created_at: new Date().toISOString()
      };
      
      // Insert into database
      const { data, error } = await supabase
        .from('notifications')
        .insert([newNotification])
        .select();

      if (error) {
        console.error('Error adding notification:', error);
        return;
      }

      // Update local state with the new notification
      if (data && data.length > 0) {
        setNotifications(prev => [data[0], ...prev]);
      }
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      if (!session?.user?.id) return;

      // Get the employee_id for the current user
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("employee_id")
        .eq("id", session.user.id)
        .single();

      if (employeeError) {
        console.error("Error fetching employee data:", employeeError);
        return;
      }

      const employee_id = employeeData.employee_id;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('employee_id', employee_id)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Delete a notification
  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting notification:', error);
        return;
      }

      // Update local state
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Clear all notifications for the current user
  const clearAll = async () => {
    try {
      if (!session?.user?.id) return;

      // Get the employee_id for the current user
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("employee_id")
        .eq("id", session.user.id)
        .single();

      if (employeeError) {
        console.error("Error fetching employee data:", employeeError);
        return;
      }

      const employee_id = employeeData.employee_id;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('employee_id', employee_id);

      if (error) {
        console.error('Error clearing all notifications:', error);
        return;
      }

      // Update local state
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  };

  // Set up real-time listener for new notifications
  useEffect(() => {
    if (session?.user?.id) {
      const notificationsChannel = supabase
        .channel('notifications-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications' },
          (payload) => {
            // Reload notifications when there's a change
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(notificationsChannel);
      };
    }
  }, [session]);

  return (
    <NotificationContext.Provider
      value={{
        isModalVisible,
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        showModal,
        closeModal,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};