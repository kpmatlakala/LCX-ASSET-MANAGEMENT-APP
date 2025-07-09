import RequestOverTimeChart from "@/lib/chartjs";
import { Button } from "@heroui/button";
import DropdownIcon from "@/assets/images/dropdown.svg";
import {
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  Image,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Tooltip,
  useDisclosure,
  Avatar,
} from "@heroui/react";
import {
  CheckmarkCircle02Icon,
  DeliveryBox02Icon,
  DeliveryReturn02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add, Calendar, Timer } from "iconsax-react";
import { ReactElement, useContext, useState } from "react";
import { Authcontext } from "@/context/AuthContext";
import { FileUploader } from "react-drag-drop-files";
import useSupabaseDB from "@/hooks/useSupabaseDB";
import { SupabaseAssetSchema } from "@/interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import {
  categories,
  conditions,
  fileTypes,
} from "@/constants/constants";
import { getTodayFullDate, greetUser } from "@/utils/dateUtils";
import DashboardPending from "@/components/dashboardLoading";
import emptyStateIllustration from "@/assets/images/nothing.svg";
import RequestDetailsModal from "@/components/requestDetails";

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

const categoryToAssetTypes = {
  Electronics: ["Laptop", "Monitor", "Projector", "Printer"],
  Furniture: ["Office Chair", "Desk", "Cabinet"],
  Vehicle: ["Company Car", "Forklift"],
  Software: ["Antivirus License", "Cloud Storage Subscription"],
  Equipment: ["Air Conditioner", "Generator"],
};

export default function Overview(): ReactElement {
  const { currentUser } = useContext(Authcontext);
  const {
    uploadAsset,
    isLoading,
    getAllAssets,
    getRequests,
  } = useSupabaseDB();


  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requestModalIsOpen, setRequestModalOpen] = useState<boolean>(false);
  const [requestModalData, setModalData] = useState<any>("");

  const [formData, setFormData] = useState<AssetFormData>({
    assetName: "",
    assetCode: "",
    serialNumber: "",
    assetType: "",
    condition: "",
    categories: "",
    description: "",
    assetImage: null,
  });

  const handleFileChange = (file: File) => {
    setFormData((prevStates) => ({
      ...prevStates,
      assetImage: file,
    }));
  };

  const queryAssets = useQuery({
    queryKey: ["assets"],
    queryFn: getAllAssets,
    refetchInterval: 10000,
  });

  const queryRequests = useQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
    refetchInterval: 10000,
  });

  const handleSubmit = async () => {
    const res = await uploadAsset(formData);
    if (res === "success") {
      queryAssets.refetch();
      onClose();
    }
  };

  if (queryAssets.isPending || queryRequests.isPending) {
    return <DashboardPending />;
  }

  const availableAssets = queryAssets.data.filter(
    (asset: SupabaseAssetSchema) => asset.status === "Available"
  );

  
    const pendingRequests = queryRequests.data.filter((asset: any) => {
      return asset.status === "Pending";
    });
    
  

  const groupAssetsByName = () => {
    const groupedAssets: { [key: string]: SupabaseAssetSchema[] } = {};

    queryAssets.data.forEach((asset: SupabaseAssetSchema) => {
      const assetName = asset.asset_name.toLowerCase();
      if (!groupedAssets[assetName]) {
        groupedAssets[assetName] = [];
      }
      groupedAssets[assetName].push(asset);
    });

    return groupedAssets;
  };

  const groupedAssets = groupAssetsByName();

  const calculateAverageAvailability = (assets: SupabaseAssetSchema[]) => {
    const availableCount = assets.filter(
      (asset) => asset.status === "Available"
    ).length;
    return (availableCount / assets.length) * 100;
  };

  const filteredAssetTypes = categoryToAssetTypes[formData.categories as keyof typeof categoryToAssetTypes] || [];

  return (
    <section className="pb-5">
      <div>
        <div>
          <p className="text-gray-400">{getTodayFullDate()}</p>
          <div className="flex justify-between">
            <p className="text-3xl">
              {greetUser()}, {currentUser?.first_name}
            </p>
            <div>
              <Button
                className="bg-black text-white px-4"
                radius="sm"
                onPress={onOpen}
                startContent={<Add size={24} color="white"/>}
                variant="shadow"
              >
                New Asset
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 py-4 gap-3">
          <Card className="col-span-3 p-3" shadow="sm">
            <div>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  <div>
                    <HugeiconsIcon
                      icon={DeliveryBox02Icon}
                      size={24}
                      color="#3a86ff"
                      strokeWidth={2}
                    />
                  </div>
                  <p className=" text-gray-400">Total Assets</p>
                </div>
                <HugeiconsIcon icon={InformationCircleIcon} />
              </div>
              <div>
                <p className="text-4xl py-2">
                  {(queryAssets.data?.length ?? 0) < 10
                    ? `0${queryAssets.data?.length ?? 0}`
                    : (queryAssets.data?.length ?? 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="col-span-3 p-3" shadow="sm">
            <div>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  <div>
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={24}
                      color="#9ef01a"
                    />
                  </div>
                  <p className=" text-gray-400">Available Assets</p>
                </div>
                <HugeiconsIcon icon={InformationCircleIcon} />
              </div>
              <div>
                <p className="text-4xl py-2">
                  {(availableAssets?.length ?? 0) < 10
                    ? `0${availableAssets?.length ?? 0}`
                    : (availableAssets?.length ?? 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="col-span-3 p-3" shadow="sm">
            <div>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  <div>
                    <Timer size="24" color="#ffea00" />
                  </div>
                  <p className=" text-gray-400">Pending Requests</p>
                </div>
                <HugeiconsIcon icon={InformationCircleIcon} />
              </div>
              <div>
                <p className="text-4xl py-2">
                {(pendingRequests?.length ?? 0) < 10
                    ? `0${pendingRequests?.length ?? 0}`
                    : (pendingRequests?.length ?? 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="col-span-3 p-3" shadow="sm">
            <div>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  <div>
                    <HugeiconsIcon
                      icon={DeliveryReturn02Icon}
                      size={24}
                      color="#9d4edd"
                    />
                  </div>
                  <p className=" text-gray-400">Returned Assets</p>
                </div>
                <HugeiconsIcon icon={InformationCircleIcon} />
              </div>
              <div>
                <p className="text-4xl py-2">235</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="py-4">
          <div className="grid grid-cols-12 gap-5">
            <Card className="col-span-7 p-3" shadow="sm" radius="sm">
              <div className="flex justify-between">
                <p className="px-5 ">Request Over Time</p>
                <Dropdown shadow="sm">
                  <DropdownTrigger>
                    <Button
                      size="md"
                      className="px-5 "
                      variant="bordered"
                      startContent={<Calendar size="20" color="#FF8A65" />}
                    >
                      2023
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="2023">2023</DropdownItem>
                    <DropdownItem key="2022">2022</DropdownItem>
                    <DropdownItem key="2021">2021</DropdownItem>
                    <DropdownItem key="2020">2020</DropdownItem>
                    <DropdownItem key="2019">2019</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="py-5">
                <RequestOverTimeChart />
              </div>
            </Card>
            <Card className="col-span-5 h-full" shadow="sm" radius="sm">
              <p className="px-5 pt-3">Recent Asset Requests</p>
              {queryRequests.isPending && <p>Loading...</p>}
              {!queryRequests.isPending && (
                <Table title="ref" shadow="none" selectionMode="single" color="primary" selectionBehavior="toggle">
                  <TableHeader>
                    <TableColumn>User</TableColumn>
                    <TableColumn>Asset</TableColumn>
                    <TableColumn>Status</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {queryRequests.data.map((reqs: any, i: any) => (
                      <TableRow
                        key={i}
                        title={reqs.asset.full_name}
                        onClick={() => {
                          setModalData({
                            ...reqs,
                            employee: reqs.employee,
                            asset: reqs.asset
                          })
                          setRequestModalOpen(true);
                        }}
                        className="pb-10"
                      >
                        <TableCell className="text-gray-400 py-3">
                          <div className="flex gap-1">
                            <Avatar />
                            <div>
                              <p className="text-sm w-[6rem] truncate">{reqs.employee.full_name}</p>
                              <p className="text-tiny w-[6rem] truncate">{reqs.employee.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400 py-4">
                          {reqs.asset.asset_name}
                        </TableCell>
                        <TableCell className="text-tiny text-gray-400">
                          <p
                            className={`text-center rounded-full border ${
                              reqs.status === "Approved"
                                ? "text-success-500 bg-success-100 border-success-500"
                                : reqs.status === "Pending"
                                  ? "text-warning-500 bg-warning-100 border-warning-500"
                                  : reqs.status === "Rejected"
                                    ? "text-danger-500 bg-danger-100 border-danger-500"
                                    : "text-gray-500 bg-gray-100 border-gray-500"
                            }`}
                          >
                            {reqs.status}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </div>
        </div>
        <Card className="w-full py-4" shadow="sm" radius="sm">
          <div className="flex px-4 gap-1">
            <HugeiconsIcon
              icon={DeliveryBox02Icon}
              size={28}
              color="#9ca3af"
              strokeWidth={2}
            />
            <p className="text-xl text-default-400">
              Inventory of Registered Assets
            </p>
          </div>
          <Table className="" radius="sm" shadow="none">
            <TableHeader>
              <TableColumn>Asset Name</TableColumn>
              <TableColumn>Asset Type</TableColumn>
              <TableColumn>Quantity</TableColumn>
              <TableColumn>Average Availability (%)</TableColumn>
            </TableHeader>
            <TableBody>
              {Object.keys(groupedAssets).map((assetName) => {
                const assets = groupedAssets[assetName];
                const averageAvailability =
                  calculateAverageAvailability(assets);
                return (
                  <TableRow key={assetName}>
                    <TableCell>{assets[0].asset_name}</TableCell>
                    <TableCell>{assets[0].asset_type}</TableCell>
                    <TableCell>{assets.length}</TableCell>
                    <TableCell>{averageAvailability.toFixed(2)}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
        <Modal size="5xl" backdrop="blur" isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {() => (
              <>
                <ModalBody>
                  <div>
                    <div className="pb-5">
                      <h1 className="text-2xl">Add new Asset</h1>
                      <p className="text-sm text-default-400">
                        Fill out the details below to add a new asset to the
                        system.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4">
                      <Input
                        placeholder="Enter asset name"
                        label={"Asset name"}
                        className="w-[30rem]"
                        value={formData.assetName}
                        onChange={(e) => {
                          setFormData((prevStates) => ({
                            ...prevStates,
                            assetName: e.target.value,
                          }));
                        }}
                      />
                      <Input
                        placeholder="Enter asset code"
                        label={"Asset Code"}
                        className="w-[30rem]"
                        value={formData.assetCode}
                        onChange={(e) => {
                          setFormData((prevStates) => ({
                            ...prevStates,
                            assetCode: e.target.value,
                          }));
                        }}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Input
                        placeholder="Enter serial number"
                        label={"Serial number"}
                        className="w-[30rem]"
                        value={formData.serialNumber}
                        onChange={(e) => {
                          setFormData((prevStates) => ({
                            ...prevStates,
                            serialNumber: e.target.value,
                          }));
                        }}
                      />
                      <Select
                        className="w-[30rem]"
                        label={"Category"}
                        placeholder="Select category"
                        onChange={(e) => {
                          setFormData((prevStates) => ({
                            ...prevStates,
                            categories: e.target.value,
                          }));
                        }}
                      >
                        {categories.map((category) => (
                          <SelectItem key={category} textValue={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="flex gap-4">
                      <Select
                        className="w-[30rem]"
                        label={"Condition"}
                        placeholder="Select condition"
                        selectedKeys={
                          formData.condition ? [formData.condition] : []
                        }
                        onChange={(e) => {
                          setFormData((prevStates) => ({
                            ...prevStates,
                            condition: e.target.value,
                          }));
                        }}
                      >
                        {conditions.map((condition) => (
                          <SelectItem key={condition} textValue={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        className="w-[30rem]"
                        label={"Asset type"}
                        placeholder="Select asset type"
                        onChange={(e) => {
                          setFormData((prevStates) => ({
                            ...prevStates,
                            assetType: e.target.value,
                          }));
                        }}
                      >
                        {filteredAssetTypes.map((assetType: string) => (
                          <SelectItem key={assetType} textValue={assetType}>
                            {assetType}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <FileUploader
                        handleChange={handleFileChange}
                        name="file"
                        types={fileTypes}
                        className="w-full"
                      />
                      {formData.assetImage && (
                        <p className="mt-2 text-sm text-gray-500">
                          Selected file: {formData.assetImage.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Textarea
                        label={"Description"}
                        placeholder="Start typing..."
                        value={formData.description}
                        onChange={(e) => {
                          setFormData((prevStates) => ({
                            ...prevStates,
                            description: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="px-15 text-danger-400"
                    variant="light"
                    size="lg"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-black text-white px-[3rem]"
                    size="lg"
                    isLoading={isLoading}
                    isDisabled={isLoading}
                    onPress={handleSubmit}
                  >
                    {isLoading ? "Uploading..." : "Submit"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <RequestDetailsModal isOpen={requestModalIsOpen} data={requestModalData} onClose={setRequestModalOpen}/>
      </div>
    </section>
  );
}
