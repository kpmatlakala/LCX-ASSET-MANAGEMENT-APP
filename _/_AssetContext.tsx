import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useNotifications } from "./NotificationContext";
import { AppState } from "react-native"; // Import AppState to listen to app state changes

interface Asset {
  duration: string;
  purpose: string;
  asset_type: any;
  location: string;
  condition: string;
  updated_at: any;
  asset_category: any;
  asset_sn: any;
  asset_id: number;
  asset_code: string;
  asset_name: string;
  description: string;
  status: string;
}

interface AssetRequest {
  request_id: number;
  employee_id: string;
  asset_id: number;
  request_date: string;
  purpose: string;
  destination: string;
  expected_return_date: string;
  status: string;
  approver_id?: string | null;
  approval_date?: string | null;
  rejection_reason?: string | null;
  return_date?: string | null;
  return_condition?: string | null;
  assets?: {
    asset_name: string;
    asset_code: string;
  };
}

interface AssetContextType {
  assets: Asset[];
  getAssetById: (assetId: number) => Asset | undefined;
  myAssetRequests: AssetRequest[];
  fetchAssets: () => Promise<void>;
  fetchAssetRequests: () => Promise<void>;
  requestAsset: (asset_id: number, purpose: string, expected_return_date: string) => Promise<void>;
  cancelRequest: (request_id: number) => Promise<void>;
  isLoading: boolean;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [previousAssets, setPreviousAssets] = useState<Asset[]>([]);
  const [myAssetRequests, setMyAssetRequests] = useState<AssetRequest[]>([]);
  const [previousAssetRequests, setPreviousAssetRequests] = useState<AssetRequest[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();
  const [appState, setAppState] = useState(AppState.currentState);

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

  // AppState change listener (to detect when app is in foreground or background)
  useEffect(() => {
    const appStateListener = (nextAppState: string) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        console.log("App has come to the foreground!");
        fetchAssets();  // Refetch assets when app comes to the foreground
        fetchAssetRequests();  // Refetch asset requests when app comes to the foreground
      }
      setAppState(nextAppState);
    };
  
    // Modern method to add event listener
    const subscription = AppState.addEventListener("change", appStateListener);
  
    // Cleanup function using the new remove() method
    return () => {
      subscription.remove();
    };
  }, [appState]);

  // Fetch assets from Supabase
  const fetchAssets = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("status", "Available");

    if (error) {
      console.error("Error fetching assets:", error);
      addNotification({
        title: "Error",
        message: "Failed to fetch available assets. Please try again.",
        type: "error"
      });
      setIsLoading(false);
      return;
    }

    // Compare current assets with previous assets to detect new additions
    const newAssets = data?.filter(
      asset => !previousAssets.some(prevAsset => prevAsset.asset_id === asset.asset_id)) || [];

    if (newAssets.length > 0) 
    {
      newAssets.forEach(newAsset => {
        addNotification({
          title: "New Asset Available",
          message: `A new ${newAsset.asset_name} (${newAsset.asset_code}) is now available in the inventory!`,
          type: "info"
        });
      });
    }

    setAssets(data || []);
    setPreviousAssets(data || []);
    setIsLoading(false);
  };

  // Fetch asset requests from Supabase for the current user
  const fetchAssetRequests = async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);

    // First, get the employee_id for the current user
    const { data: employeeData, error: employeeError } = await supabase
      .from("employees")
      .select("employee_id")
      .eq("id", session.user.id)
      .single();

    if (employeeError) {
      console.error("Error fetching employee data:", employeeError);
      addNotification({
        title: "Error",
        message: "Failed to fetch your employee data. Please try again.",
        type: "error"
      });
      setIsLoading(false);
      return;
    }

    const employee_id = employeeData.employee_id;

    // Now fetch the asset requests for this employee
    const { data, error } = await supabase
      .from("asset_requests")
      .select(`*, assets:asset_id (asset_name, asset_code)`)
      .eq("employee_id", employee_id) // Filter by employee_id
      .order("request_date", { ascending: false });

    if (error) {
      console.error("Error fetching asset requests:", error);
      addNotification({
        title: "Error",
        message: "Failed to fetch your asset requests. Please try again.",
        type: "error"
      });
      setIsLoading(false);
      return;
    }

    // Compare current requests with previous requests to detect status changes
    const requestStatusChanges = data?.filter(
      request => {
        const prevRequest = previousAssetRequests.find(
          prev => prev.request_id === request.request_id
        );
        return prevRequest && prevRequest.status !== request.status;
      }
    ) || [];

    // Send notifications for status changes
    requestStatusChanges.forEach(changedRequest => {
      let notificationMessage = "";
      switch (changedRequest.status) {
        case "Approved":
          notificationMessage = `Your request for ${changedRequest.assets?.asset_name} has been approved and is ready for dispatch.`;
          break;
        case "Rejected":
          notificationMessage = `Your request for ${changedRequest.assets?.asset_name} has been rejected.`;
          break;
        case "In Progress":
          notificationMessage = `Your request for ${changedRequest.assets?.asset_name} is now being processed.`;
          break;
        case "Returned":
          notificationMessage = `The asset ${changedRequest.assets?.asset_name} has been marked as returned.`;
          break;
      }

      if (notificationMessage) {
        addNotification({
          title: "Asset Request Update",
          message: notificationMessage,
          type: changedRequest.status === "Rejected" ? "error" : "success"
        });
      }
    });

    setMyAssetRequests(data || []);
    setPreviousAssetRequests(data || []);
    setIsLoading(false);
  };

  // Subscribe to real-time changes in asset_requests table (for status updates)
  useEffect(() => {
    const assetRequestSubscription = supabase
      .from("asset_requests")
      .on("UPDATE", payload => {
        console.log("Asset request updated: ", payload);
        fetchAssetRequests(); // Refetch asset requests when status or any field changes
      })
      .on("INSERT", payload => {
        console.log("New asset request: ", payload);
        fetchAssetRequests(); // Refetch when a new asset request is created
      })
      .on("DELETE", payload => {
        console.log("Asset request deleted: ", payload);
        fetchAssetRequests(); // Refetch when an asset request is deleted
      })
      .subscribe();

    const assetSubscription = supabase
      .from("assets")
      .on("UPDATE", payload => {
        console.log("Asset updated: ", payload);
        fetchAssets(); // Refetch assets when an asset's status or data changes
      })
      .subscribe();

    // Clean up subscriptions on unmount
    return () => {
      assetRequestSubscription.unsubscribe();
      assetSubscription.unsubscribe();
    };
  }, []);

  return (
    <AssetContext.Provider value={{
      assets,
      getAssetById,
      myAssetRequests,
      fetchAssets,
      fetchAssetRequests,
      requestAsset,
      cancelRequest,
      isLoading
    }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error("useAssets must be used within an AssetProvider");
  }
  return context;
};
