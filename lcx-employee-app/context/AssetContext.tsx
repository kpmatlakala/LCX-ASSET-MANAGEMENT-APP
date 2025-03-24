import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useNotifications } from "./NotificationContext";

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
  fetchAssets: () => Promise<void>;
  fetchAssetRequests: () => Promise<void>;
  requestAsset: (asset_id: number, purpose: string, expected_return_date: string) => Promise<void>;
  cancelRequest: (request_id: number) => Promise<void>;
  isLoading: boolean;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

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

    setAssets(data || []);
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
      addNotification({
        title: "Error",
        message: "Failed to fetch your asset requests. Please try again.",
        type: "error"
      });
      setIsLoading(false);
      return;
    }

    setAssetRequests(data || []);
    setIsLoading(false);
  };

  // Request an asset
  const requestAsset = async (
    asset_id: number,
    purpose: string,
    expected_return_date: string
  ) => {
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    setIsLoading(true);

    // Get the employee_id for the current user
    const { data: employeeData, error: employeeError } = await supabase
      .from("employees")
      .select("employee_id")
      .eq("id", session.user.id)
      .single();

    if (employeeError) {
      console.error("Error fetching employee data:", employeeError);
      addNotification({
        title: "Error",
        message: "Could not fetch your employee data. Please try again.",
        type: "error"
      });
      setIsLoading(false);
      throw new Error("Could not fetch employee data");
    }

    const employee_id = employeeData.employee_id;

    // Get asset name for notification
    const asset = assets.find(a => a.asset_id === asset_id);
    const assetName = asset ? asset.asset_name : `Asset #${asset_id}`;

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

    if (error) {
      console.error("Error requesting asset:", error);
      addNotification({
        title: "Request Failed",
        message: `Failed to request ${assetName}. Please try again.`,
        type: "error"
      });
      setIsLoading(false);
      throw new Error("Failed to request asset");
    }

    // Add a notification for successful request
    addNotification({
      title: "Request Submitted",
      message: `Your request for ${assetName} has been submitted and is pending approval.`,
      type: "success"
    });

    // Refresh asset requests after a new one is added
    await fetchAssetRequests();
    setIsLoading(false);
  };

  // Cancel an asset request
  const cancelRequest = async (request_id: number) => {
    setIsLoading(true);
    
    // Find the request to get asset info
    const request = assetRequests.find(req => req.request_id === request_id);
    const assetName = request?.assets?.asset_name || `Asset #${request?.asset_id}`;
    
    const { error } = await supabase
      .from("asset_requests")
      .update({ status: "Cancelled", updated_at: new Date().toISOString() })
      .eq("request_id", request_id);

    if (error) {
      console.error("Error cancelling request:", error);
      addNotification({
        title: "Cancellation Failed",
        message: `Failed to cancel your request for ${assetName}. Please try again.`,
        type: "error"
      });
      setIsLoading(false);
      throw new Error("Failed to cancel request");
    }

    // Add a notification for successful cancellation
    addNotification({
      title: "Request Cancelled",
      message: `Your request for ${assetName} has been cancelled.`,
      type: "info"
    });

    // Refresh asset requests after cancellation
    await fetchAssetRequests();
    setIsLoading(false);
  };

  // Set up real-time subscriptions for asset and request updates
  useEffect(() => {
    if (session) {
      // Set up Supabase Realtime subscription for assets
      const assetsChannel = supabase
        .channel('assets-changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'assets' },
          (payload) => {
            const updatedAsset = payload.new as Asset;
            const oldAsset = payload.old as Asset;
            
            // Update local state
            setAssets((prevAssets) =>
              prevAssets.map((asset) =>
                asset.asset_id === updatedAsset.asset_id ? updatedAsset : asset
              )
            );
            
            // If status has changed
            if (updatedAsset.status !== oldAsset.status) {
              // Notify about asset status changes
              if (updatedAsset.status === "Available") {
                addNotification({
                  title: "Asset Available",
                  message: `${updatedAsset.asset_name} is now available for request.`,
                  type: "info"
                });
              } else if (updatedAsset.status === "Maintenance") {
                addNotification({
                  title: "Asset Under Maintenance",
                  message: `${updatedAsset.asset_name} is currently under maintenance.`,
                  type: "info"
                });
              }
            }
            
            // If the condition has changed
            if (updatedAsset.condition !== oldAsset.condition) {
              addNotification({
                title: "Asset Condition Updated",
                message: `${updatedAsset.asset_name}'s condition has been updated to ${updatedAsset.condition}.`,
                type: "info"
              });
            }
            
            // If the location has changed
            if (updatedAsset.location !== oldAsset.location) {
              addNotification({
                title: "Asset Location Updated",
                message: `${updatedAsset.asset_name} has been moved to ${updatedAsset.location}.`,
                type: "info"
              });
            }
          }
        )
        .subscribe();

      // Set up Supabase Realtime subscription for asset requests
      const requestsChannel = supabase
        .channel('requests-changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'asset_requests' },
          async (payload) => {
            const updatedRequest = payload.new as AssetRequest;
            const oldRequest = payload.old as AssetRequest;
            
            // If this user is involved in the request (additional check)
            if (!session?.user?.id) return;
            
            const { data: employeeData } = await supabase
              .from("employees")
              .select("employee_id")
              .eq("id", session.user.id)
              .single();
            
            if (!employeeData || employeeData.employee_id !== updatedRequest.employee_id) return;
            
            // Get asset details
            const { data: assetData } = await supabase
              .from("assets")
              .select("asset_name")
              .eq("asset_id", updatedRequest.asset_id)
              .single();
            
            const assetName = assetData?.asset_name || `Asset #${updatedRequest.asset_id}`;
            
            // Update local state
            setAssetRequests((prevRequests) =>
              prevRequests.map((request) => {
                if (request.request_id === updatedRequest.request_id) {
                  return { ...updatedRequest, assets: request.assets };
                }
                return request;
              })
            );
            
            // If status has changed, notify based on new status
            if (updatedRequest.status !== oldRequest.status) {
              switch(updatedRequest.status) {
                case "Approved":
                  addNotification({
                    title: "Request Approved",
                    message: `Your request for ${assetName} has been approved!`,
                    type: "success"
                  });
                  break;
                  
                case "Rejected":
                  addNotification({
                    title: "Request Rejected",
                    message: `Your request for ${assetName} has been rejected.${updatedRequest.rejection_reason ? ` Reason: ${updatedRequest.rejection_reason}` : ''}`,
                    type: "warning"
                  });
                  break;
                  
                case "Returned":
                  addNotification({
                    title: "Asset Returned",
                    message: `Return of ${assetName} has been processed successfully.`,
                    type: "info"
                  });
                  break;
                  
                case "Overdue":
                  addNotification({
                    title: "Asset Overdue",
                    message: `Your borrowed ${assetName} is now overdue. Please return it as soon as possible.`,
                    type: "error"
                  });
                  break;
                  
                case "Ready for Pickup":
                  addNotification({
                    title: "Asset Ready",
                    message: `${assetName} is ready for pickup!`,
                    type: "success"
                  });
                  break;
              }
            }
            
            // If the return date was updated
            if (updatedRequest.return_date !== oldRequest.return_date && updatedRequest.return_date) {
              addNotification({
                title: "Return Date Updated",
                message: `Return date for ${assetName} has been updated to ${new Date(updatedRequest.return_date).toLocaleDateString()}.`,
                type: "info"
              });
            }
            
            // If approaching due date (1 day before)
            const today = new Date();
            const expectedReturnDate = new Date(updatedRequest.expected_return_date);
            const timeDiff = expectedReturnDate.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            if (daysDiff === 1 && updatedRequest.status === "Approved") {
              addNotification({
                title: "Return Reminder",
                message: `${assetName} is due for return tomorrow.`,
                type: "warning"
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(assetsChannel);
        supabase.removeChannel(requestsChannel);
      };
    }
  }, [session, addNotification]);

  // Initial data fetch when session is available
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