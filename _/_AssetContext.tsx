import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

import { useNotifications  } from "./NotificationContext";

interface Asset {
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
  assetRequests: AssetRequest[];
  notifications: Notification[];
  fetchAssets: () => Promise<void>;
  fetchAssetRequests: () => Promise<void>;
  requestAsset: (asset_id: number, purpose: string, expected_return_date: string) => Promise<void>;
  cancelRequest: (request_id: number) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  hasUnreadNotifications: boolean;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);  
  const [session, setSession] = useState<Session | null>(null); 

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

  // Fetch asset requests from Supabase for the current user
  const fetchAssetRequests = async () => {
    if (!session?.user?.id) return;

    // First, get the employee_id for the current user
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

    // Now fetch the asset requests for this employee
    const { data, error } = await supabase
      .from("asset_requests")
      .select(`
        *,
        assets:asset_id (
          asset_name,
          asset_code
        )
      `)
      .eq("employee_id", employee_id)
      .order("request_date", { ascending: false });

    if (error) {
      console.error("Error fetching asset requests:", error);
      return;
    }

    setAssetRequests(data || []);
  };

  // Request an asset
  const requestAsset = async ( asset_id: number, purpose: string, expected_return_date: string ) => {
    if (!session?.user?.id) { throw new Error("User not authenticated"); }

    // Get the employee_id for the current user
    const { data: employeeData, error: employeeError } = await supabase
      .from("employees")
      .select("employee_id")
      .eq("id", session.user.id)
      .single();

    if (employeeError) 
    {
      console.error("Error fetching employee data:", employeeError);
      throw new Error("Could not fetch employee data");
    }

    const employee_id = employeeData.employee_id;

    // Insert the asset request
    const { error } = await supabase.from("asset_requests").insert([
      {
        employee_id,
        asset_id,
        purpose,
        destination: "Office", // Default destination
        expected_return_date,
        status: "Pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    ]);

    if (error) 
    {
      console.error("Error requesting asset:", error);
      throw new Error("Failed to request asset");
    }   

    // Refresh asset requests after a new one is added
    await fetchAssetRequests();
  };

  // Cancel an asset request
  const cancelRequest = async (request_id: number) => {
    const { error } = await supabase
      .from("asset_requests")
      .update({ status: "Cancelled", updated_at: new Date().toISOString() })
      .eq("request_id", request_id);

    if (error) {
      console.error("Error cancelling request:", error);
      throw new Error("Failed to cancel request");
    }    

    // Refresh asset requests after cancellation
    await fetchAssetRequests();
  };

  // Handle real-time updates on assets and asset requests (watching 'status' changes)
  useEffect(() => {
    if (session) {
      // Make sure realtime is properly enabled in your Supabase instance
      const assetsChannel = supabase
        .channel('assets-changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'assets' },
          (payload) => {
            const updatedAsset = payload.new as Asset;
            if (updatedAsset.status !== payload.old.status) {
              // If status has changed, update state
              setAssets((prevAssets) =>
                prevAssets.map((asset) =>
                  asset.asset_id === updatedAsset.asset_id ? updatedAsset : asset
                )
              );

              // Trigger a notification
              if (updatedAsset.status === "Available") {
                addNotification(`Asset ${updatedAsset.asset_name} is now Available!`, "info");
              }
            }
          }
        )
        .subscribe();

      const requestsChannel = supabase
        .channel('requests-changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'asset_requests' },
          (payload) => {
            const updatedRequest = payload.new as AssetRequest;
            if (updatedRequest.status !== payload.old.status) {
              // Find the asset name for the updated request
              const requestAsset = assets.find(asset => asset.asset_id === updatedRequest.asset_id);
              const assetName = requestAsset ? requestAsset.asset_name : `Asset #${updatedRequest.asset_id}`;

              // If status has changed, update state
              setAssetRequests((prevRequests) =>
                prevRequests.map((request) => {
                  if (request.request_id === updatedRequest.request_id) {
                    return { ...updatedRequest, assets: request.assets };
                  }
                  return request;
                })
              );

              // Trigger notifications based on the new status
              switch (updatedRequest.status) {
                case "Approved":
                  addNotification(`Your request for ${assetName} has been approved!`, "success");
                  break;
                case "Rejected":
                  addNotification(`Your request for ${assetName} has been rejected.${updatedRequest.rejection_reason ? ` Reason: ${updatedRequest.rejection_reason}` : ''}`, "warning");
                  break;
                case "Returned":
                  addNotification(`Return of ${assetName} has been processed.`, "info");
                  break;
                case "Overdue":
                  addNotification(`Your borrowed ${assetName} is now overdue. Please return it as soon as possible.`, "error");
                  break;
              }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(assetsChannel);
        supabase.removeChannel(requestsChannel);
      };
    }
  }, [session, assets]);

  useEffect(() => {
    if (session) {
      fetchAssets();
      fetchAssetRequests();
    }
  }, [session]);

  return (
    <AssetContext.Provider value={{
      assets,
      assetRequests,
      notifications,
      hasUnreadNotifications,
      fetchAssets,
      fetchAssetRequests,
      requestAsset,
      cancelRequest,
      markNotificationAsRead,
      clearAllNotifications
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