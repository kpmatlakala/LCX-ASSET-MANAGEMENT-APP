import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// import { createClient } from "@supabase/supabase-js";
// Initialize Supabase client
// const supabaseUrl = "YOUR_SUPABASE_URL";
// const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Asset {
  asset_id: number;
  name: string;
  description: string;
  status: string;
  // Add other fields as per your schema
}

interface AssetContextType {
  assets: Asset[];
  fetchAssets: () => Promise<void>;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);

  // Fetch assets from Supabase
  const fetchAssets = async () => {
    const { data, error } = await supabase.from("assets").select("*");

    if (error) {
      console.error("Error fetching assets:", error);
      return;
    }

    setAssets(data || []);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <AssetContext.Provider value={{ assets, fetchAssets }}>
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
