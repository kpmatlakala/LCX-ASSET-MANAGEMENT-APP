import { SupabaseAssetSchema } from "@/interfaces/interfaces";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface AssetFormData {
  assetName: string;
  assetCode: string;
  serialNumber: string;
  assetType: string;
  condition: string;
  categories: string;
  description: string;
  assetImage: File | null;
}

export default function useSupabaseDB() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assets, setAssets] = useState<AssetFormData[] | null>(null);
  const [isFetchingAssets, setIsFetchingAssets] = useState<boolean>(false);

  const uploadAsset = async (Asset: AssetFormData) => {
    setIsLoading(true);
    try {
      const fullPath = `assets_photos/${Asset.assetCode}`;

      if (Asset.assetImage) {
        const { error } = await supabase.storage
          .from("assetImages")
          .upload(fullPath, Asset.assetImage, {
            contentType: "application/json",
            upsert: true,
          });
        if (error) {
          console.log(error);
          return;
        }

        const { data: url } = supabase.storage
          .from("assetImages")
          .getPublicUrl(fullPath);

        const { data: assetResults, error: assetErrors } = await supabase
          .from("assets")
          .upsert(<SupabaseAssetSchema>{
            asset_name: Asset.assetName,
            asset_code: Asset.assetCode,
            asset_sn: Asset.serialNumber,
            asset_type: Asset.assetType,
            asset_category: Asset.categories,
            asset_image_url: url.publicUrl,
            assigned_to: "",
            status: "Available",
            condition: Asset.condition,
            description: Asset.description,
          })
          .select("*");

        if (assetErrors) {
          console.log(assetErrors.message);
          return null;
        }
        if (!assetResults) {
          console.log("No asset results returned");
          return null;
        }

        return "success";
      } else {
        throw new Error("Asset image is null");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllAssets = async (): Promise<void | any> => {
    const { data, error } = await supabase.from("assets").select("*");

    if (error) {
      console.log(error);
      return null;
    }
    return data;
  };

  const getRequests = async (): Promise<void | any> => {
    const { data: assetRequests, error: assetRequestsError } = await supabase
      .from("asset_requests")
      .select("*");

    if (assetRequestsError) {
      console.log(assetRequestsError);
      return null;
    }

    const employeeIds = assetRequests.map(
      (request: any) => request.employee_id
    );
    const { data: employees, error: employeesError } = await supabase
      .from("employees")
      .select("*")
      .in("employee_id", employeeIds);

    if (employeesError) {
      console.log(employeesError);
      return null;
    }

    const assetIds = assetRequests.map((request: any) => request.asset_id);
    const { data: assets, error: assetsError } = await supabase
      .from("assets")
      .select("*")
      .in("asset_id", assetIds);

    if (assetsError) {
      console.log(assetsError);
      return null;
    }

    const requestsByEmployee = assetRequests.map((request: any) => {
      const employee = employees.find((emp: any) => emp.employee_id === request.employee_id);
      const asset = assets?.find((ast: any) => ast.asset_id === request.asset_id);
      return {
        ...request,
        employee,
        asset
      };
    });

    return requestsByEmployee;
  };

  return {
    uploadAsset,
    isLoading,
    getAllAssets,
    assets,
    isFetchingAssets,
    getRequests,
  };
}