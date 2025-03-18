import useUsers from "@/hooks/useUsers";
import {
    Avatar,
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Input,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import { FilterIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Add } from "iconsax-react";
import { ReactElement, useState } from "react"; // Import useState

export default function UserManagement(): ReactElement {
    const { getAllusers } = useUsers();
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [roleFilter, setRoleFilter] = useState(""); // State for role filter

    const queryUsers = useQuery({
        queryKey: ["users"],
        queryFn: getAllusers,
    });

    if (queryUsers.isPending) {
        return <div className="flex justify-center items-center h-[80dvh]">
        <div>
          <Image
            src="https://lcx.co.za/wp-content/uploads/2024/12/thumbnail.png"
            className="h-[8rem]"
          />
          <div className="loader my-2 bg-gray-100">
            <div className="inner_loader"></div>
          </div>
        </div>
      </div>
    }

    // Function to format the date using Intl.DateTimeFormat
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // Use 24-hour format
        }).format(date);
    };

    // Filter users based on the search query and role filter
    const filteredUsers = queryUsers.data.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const email = user.email.toLowerCase();
        const query = searchQuery.toLowerCase();
        const role = roleFilter.toLowerCase();

        return (
            (fullName.includes(query) || email.includes(query)) &&
            (role === "" || user.role.toLowerCase() === role)
        );
    });

    return (
        <section>
            <div>
                <div>
                    <h1 className="text-3xl font-medium">User management</h1>
                    <p className="text-default-400">
                        Manage your team members and their accounts here.
                    </p>
                </div>
                <div className="flex justify-between mt-5">
                    <div className="flex py-4 gap-2">
                        <p className="text-xl">All users</p>
                        <Chip classNames={{ base: "bg-black text-white px-2" }}>
                            {filteredUsers.length}{" "}
                            {/* Display the number of filtered users */}
                        </Chip>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <div>
                            <Input
                                placeholder="Search..."
                                className="w-[20rem]"
                                variant="bordered"
                                startContent={<HugeiconsIcon icon={Search01Icon} />}
                                value={searchQuery} // Bind the input value to the search query
                                onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
                            />
                        </div>
                        <div className="flex gap-2">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        variant="bordered"
                                        startContent={<HugeiconsIcon icon={FilterIcon} />}
                                    >
                                        Filter
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem key={"all"} onClick={() => setRoleFilter("")}>
                                        All
                                    </DropdownItem>
                                    <DropdownItem key={"admin"} onClick={() => setRoleFilter("admin")}>
                                        Admin
                                    </DropdownItem>
                                    <DropdownItem key={"user"} onClick={() => setRoleFilter("user")}>
                                        User
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            <Button
                                className="bg-black text-white"
                                startContent={<Add size={24} />}
                            >
                                Add user
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <Table
                        shadow="sm"
                        classNames={{
                            table: "px-0 text-gray-500",
                        }}
                        selectionBehavior="toggle"
                        selectionMode="multiple"
                        
                    >
                        <TableHeader>
                            <TableColumn>User</TableColumn>
                            <TableColumn>Role</TableColumn>
                            <TableColumn>Phone</TableColumn>
                            <TableColumn>Last active</TableColumn>
                            <TableColumn>Date Added</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody isLoading={true}>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Avatar />
                                            <div className="">
                                                <p className="text-sm">
                                                    <span>{user.first_name}</span>{" "}
                                                    <span>{user.last_name}</span>
                                                </p>
                                                <p className="text-tiny">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.role === "super_admin" ? "Admin" : user.role}
                                    </TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>2333</TableCell>
                                    <TableCell>{formatDate(user.created_at)}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    );
}
