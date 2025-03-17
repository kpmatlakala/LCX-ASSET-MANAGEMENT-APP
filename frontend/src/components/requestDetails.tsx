import {
  Avatar,
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { TickCircle, Timer } from "iconsax-react";
import { ReactElement } from "react";

export default function RequestDetailsModal({ data, isOpen, onClose }: any): ReactElement {

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      backdrop="blur"
      size="xl"
      classNames={{
        body: "px-0 ",
        header: "py-0 bg-gray-50 py-4 font-medium",
        footer: "py-4 px-1 border-t ",
      }}
    >
      <ModalContent className="">
        {(onClose) => (
          <>
            <ModalHeader>
              <p>Request Details</p>
            </ModalHeader>
            <ModalBody>
              <div className="">
                <div className="flex justify-between px-5 py-2">
                  <div className="flex gap-1">
                    <Avatar />
                    <div>
                      <p className="text-sm">{data.employee.full_name}</p>
                      <p className="text-tiny text-gray-400">
                        {data.employee.email}
                      </p>
                    </div>
                  </div>
                  <div className="py-2">
                    <Chip
                      size="sm"
                      color="warning"
                      className="px-2"
                      variant="shadow"
                      startContent={<Timer size={15} color="black" />}
                    >
                      Pending
                    </Chip>
                  </div>
                </div>
                <div className="border-t my-2"></div>
                <div className="px-5 flex gap-[10rem]">
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-gray-400 text-tiny t">Item</p>
                      <p className="text-gray-400 text-small">
                       {data.asset.asset_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-tiny">Category</p>
                      <p className="text-gray-400 text-small"> {data.asset.asset_category}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-gray-400 text-tiny">Asset code</p>
                      <p className="text-gray-400 text-small">
                      {data.asset.asset_code}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-tiny">Request Date</p>
                      <p className="text-gray-400 text-small">
                       {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', hour12: false }).format(new Date(data.created_at))}
                      </p>
                    </div>
                  </div>
                 
                </div>
              </div>
              <div className="px-5">
                    <p className="text-gray-400 text-tiny">Description</p>
                    <p className="text-gray-400 text-small">
                      {data.asset.description}
                    </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex justify-end gap-4 px-5">
                <Button className="px-10 bg-white text-danger-500">
                  Close
                </Button>
                <Dropdown >
                  <DropdownTrigger>
                    <Button className="bg-black text-white px-14">
                      Action
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      key={"f"}
                      startContent={
                        <TickCircle size={20} color="green" variant="Bulk" />
                      }
                      className="text-sm"
                    >
                      Approve
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
