import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useNotifications } from "./NotificationContext";

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
  adminId: string;
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

  // Fetch assets from Supabase with new asset notifications
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

    // Detect and notify about new assets
    const newAssets = data?.filter(
      asset => !previousAssets.some(prevAsset => prevAsset.asset_id === asset.asset_id)
    ) || [];

    if (newAssets.length > 0) {
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

  const getAssetById = (assetId: number): Asset | undefined => {
    return assets.find((asset) => asset.asset_id === assetId);
  };

  // Fetch asset requests with status change notifications
  const fetchAssetRequests = async () => {

    if (!session?.user?.email) return;
    setIsLoading(true);

    // First, get the adminId for the current user
    const { data: employeeData, error: employeeError } = await supabase
      .from("admins")
      .select("adminId")
      .eq("email", session.user.email)
      .single();

      console.log('Session user email:', session.user.email);
      console.log('Employee Data:', employeeData);
      console.log('Employee Error:', employeeError);

    if (employeeError || !employeeData) 
    {
      console.error("Error or no employee found for email:", session.user.email);
      console.error("Detailed error:", employeeError);

      // Fetch all admin emails to debug
      const { data: allAdmins, error: allAdminsError } = await supabase
        .from("admins")
        .select("email");
      
      console.log('All admin emails:', allAdmins);

      addNotification({
        title: "Authentication Error",
        message: "Could not find your employee profile. Please contact support.",
        type: "error"
      });
      
      setIsLoading(false);
      throw new Error("Employee not found");
    }

    const adminId = employeeData.adminId;

    // Fetch the asset requests for this employee
    const { data, error } = await supabase
      .from("asset_requests")
      .select(`
        *,
        assets:asset_id (
          asset_name,
          asset_code
        )
      `)
      .eq("adminId", adminId)
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

    // Detect and notify about request status changes
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
      let notificationType: "success" | "error" | "info" = "info";

      switch (changedRequest.status) {
        case "Approved":
          notificationMessage = `Your request for ${changedRequest.assets?.asset_name} has been approved and is ready for dispatch.`;
          notificationType = "success";
          break;
        case "Rejected":
          notificationMessage = `Your request for ${changedRequest.assets?.asset_name} has been rejected.`;
          notificationType = "error";
          break;
        case "In Progress":
          notificationMessage = `Your request for ${changedRequest.assets?.asset_name} is now being processed.`;
          break;
        case "Returned":
          notificationMessage = `The asset ${changedRequest.assets?.asset_name} has been marked as returned.`;
          break;
        case "Cancelled":
          notificationMessage = `Your request for ${changedRequest.assets?.asset_name} has been cancelled.`;
          break;
      }

      if (notificationMessage) {
        addNotification({
          title: "Asset Request Update",
          message: notificationMessage,
          type: notificationType
        });
      }
    });

    setMyAssetRequests(data || []);
    setPreviousAssetRequests(data || []);
    setIsLoading(false);
  };

  // Real-time subscriptions
  useEffect(() => {
    if (!session) return;

    const assetRequestsChannel = supabase.channel('asset_requests')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'asset_requests' 
        },
        (payload) => {
          console.log('Asset Request Change:', payload);
          fetchAssetRequests();
        }
      )
      .subscribe();

    // Assets Subscription
    const assetsChannel = supabase.channel('assets')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'assets' 
        },
        (payload) => {
          console.log('Asset Change:', payload);
          fetchAssets();
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(assetRequestsChannel);
      supabase.removeChannel(assetsChannel);
    };
  }, [session, supabase]);

  // Request an asset
  const requestAsset = async (
    asset_id: number,
    purpose: string,
    expected_return_date: string
  ) => {
    if (!session?.user?.email) {
      throw new Error("User not authenticated");
    }

    setIsLoading(true);

    // Get the adminId for the current user
    const { data: employeeData, error: employeeError } = await supabase
      .from("admins")
      .select("adminId")
      .eq("email", session.user.email)
      .single();

      if (employeeError || !employeeData) {
        console.error("Error or no employee found for email:", session.user.email);
        console.error("Detailed error:", employeeError);
        
        // Optional: Fetch all admin emails to debug
        const { data: allAdmins, error: allAdminsError } = await supabase
          .from("admins")
          .select("email");
        
        console.log('All admin emails:', allAdmins);
      
        addNotification({
          title: "Authentication Error",
          message: "Could not find your employee profile. Please contact support.",
          type: "error"
        });
        
        setIsLoading(false);
        throw new Error("Employee not found");
      }
    const adminId = employeeData.adminId;

    // Get asset name for notification
    const asset = assets.find(a => a.asset_id === asset_id);
    const assetName = asset ? asset.asset_name : `Asset #${asset_id}`;

    // Insert the asset request
    const { error } = await supabase.from("asset_requests").insert([{
      adminId,
      asset_id,
      purpose,
      destination: "Office", // Default destination
      expected_return_date,
      status: "Pending",
      request_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);

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
    const request = myAssetRequests.find(req => req.request_id === request_id);
    const assetName = request?.assets?.asset_name || `Asset #${request?.asset_id}`;

    const { error } = await supabase
      .from("asset_requests")
      .update({ 
        status: "Cancelled", 
        updated_at: new Date().toISOString() 
      })
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

  // Fetch assets and requests when session is available
  useEffect(() => {
    if (session) {
      fetchAssets();
      fetchAssetRequests();
    }
  }, [session]);

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