import React, { useState, useEffect, useContext } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  UserPlusIcon,
  TrashIcon,
  PencilSquareIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import AddDevice from "./useCreate";
import EditDevice from "./useUpdate";
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useData } from "./useData";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "../../../../utils/DataContext";

const TABLE_HEAD = [
  "No",
  "Name",
  "Password",
  "Profile",
  "Status",
  "Service",
  "Configuration",
  "",
];

export function TablePpp() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const { data, refetch } = useData();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showPasswordId, setShowPasswordId] = useState(null);
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filterConfiguration,
    setFilterConfiguration,
    filterStatus,
    setFilterStatus,
    filterSearch,
    setFilterSearch,
  } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpen = () => setOpen(!open);

  const handleOpenEdit = (clientId) => {
    setSelectedClientId(clientId);
    setOpenEdit(!openEdit);
  };

  const handleDelete = async (clientId) => {
    Swal.fire({
      title: "Delete Secret",
      text: "Are you sure to delete this Secret?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("access_token");

        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const data = { client_id: clientId };

          const response = await toast.promise(
            axios.delete(`${BASE_URL}/clientppp`, {
              ...config,
              data,
            }),
            {
              pending: "Deleting ...",
              success: "Deleted Successfully!",
            }
          );

          // console.log(response);

          if (response.status === 200) {
            refetch();
            // console.log(response);
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleShowPassword = (clientId) => {
    setShowPasswordId(showPasswordId === clientId ? null : clientId);
  };

  const handleViewProfile = (client_id) => {
    navigate(`/admin/ppp-client/view-detail/${client_id}`);
  };

  useEffect(() => {
    setFilterSearch("");
    setFilterConfiguration("");
    setFilterStatus("");
  }, [location]);

  //filter konfigurasi dan status
  useEffect(() => {
    if (!dataLoaded) return;

    let filteredData = [...(data?.data || [])];

    if (filterConfiguration !== "") {
      filteredData = filteredData.filter(
        (user) =>
          user.configuration &&
          user.configuration.toLowerCase() === filterConfiguration.toLowerCase()
      );
    }

    if (filterStatus !== "") {
      filteredData = filteredData.filter(
        (user) =>
          user.status &&
          user.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    setFilteredUsers(filteredData);
  }, [filterConfiguration, filterStatus, data, dataLoaded]);

  useEffect(() => {
    if (data) {
      setFilteredUsers(data?.data || []);
      console.log(data.data);

      setDataLoaded(true);
    }
  }, [data]);

  useEffect(() => {
    if (!dataLoaded) return;
    setFilteredUsers(data?.data || []);
  }, [dataLoaded]);

  const handleChangeItemsPerPage = (event) => {
    setItemsPerPage(Number(event.target.value));
  };

  return (
    <>
      <Card className="mt-8 h-full w-full rounded-3xl  dark:bg-navy-700 dark:text-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="ml-5 rounded-none dark:bg-navy-700 dark:text-white"
        >
          <div className="mb-8 flex items-center justify-between gap-8 ">
            <div>
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                PPP Client List
              </div>
              <p color="gray" className="mt-1 font-normal">
                See information about all PPP Client
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row ">
              <Button
                variant="outlined"
                size="sm"
                className=" flex items-center gap-2 bg-blue-600 text-white dark:bg-brandLinear dark:text-white"
                onClick={handleOpen}
              >
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Create PPP
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4  md:flex-row">
            <div className="flex w-full md:w-64 ">
              <Input
                variant="standard"
                className="dark:bg-navy-700 dark:text-white"
                label="Search"
                placeholder="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex w-full ">
                <select
                  className="rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-none focus:ring focus:ring-blue-200 dark:bg-navy-700 dark:text-white"
                  value={filterConfiguration}
                  onChange={(e) => setFilterConfiguration(e.target.value)}
                >
                  <option value="">Filter Configuration</option>
                  <option value="configured">Configured</option>
                  <option value="unconfigured">Unconfigured</option>
                </select>
              </div>
              <div className="flex w-full ">
                <select
                  className="rounded-md border border-gray-300 px-2 py-1  shadow-sm focus:outline-none focus:ring focus:ring-blue-200 dark:bg-navy-700 dark:text-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Filter Status</option>
                  <option value="enable">Enable</option>
                  <option value="disable">Disable</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto p-5 ">
          <table className="mt-4 w-full  min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50  cursor-pointer border-y bg-gray-50 p-4 transition-colors dark:bg-navy-800"
                  >
                    <p
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head} {index !== TABLE_HEAD.length - 1}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            {dataLoaded ? (
              <tbody>
                {filteredUsers.map(
                  (
                    {
                      client_id,
                      mikrotik_id,
                      name,
                      password,
                      profile,
                      service_type,
                      status,
                      configuration,
                    },
                    index
                  ) => {
                    const actualIndex = indexOfFirstItem + index + 1;
                    const classes =
                      index === filteredUsers.length - 1
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={actualIndex}>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {actualIndex}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-center font-normal"
                              >
                                {showPasswordId === client_id
                                  ? password
                                  : "********"}
                                <Tooltip
                                  content={
                                    showPasswordId === client_id
                                      ? "Hide Password"
                                      : "Show Password"
                                  }
                                  className="bg-gray-700 "
                                >
                                  <span
                                    variant="text"
                                    className="ml-3 cursor-pointer"
                                    onClick={() =>
                                      handleShowPassword(client_id)
                                    }
                                  >
                                    {showPasswordId === client_id ? (
                                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                      <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                  </span>
                                </Tooltip>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {profile}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className={`font-normal ${
                                  status === "disable"
                                    ? "bg-red-400"
                                    : "bg-green-400"
                                } rounded pb-1 pl-2 pr-2 pt-1 text-white`}
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {service_type}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className={`font-normal ${
                                  configuration === "unconfigured"
                                    ? "bg-red-400"
                                    : "bg-green-400"
                                } rounded pb-1 pl-2 pr-2 pt-1 text-white`}
                              >
                                {configuration.charAt(0).toUpperCase() +
                                  configuration.slice(1)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={`${classes} flex justify-end`}>
                          <Tooltip content="Edit" className="bg-gray-700 ">
                            <IconButton
                              variant="text"
                              className="ml-2 border bg-blue-50 hover:bg-blue-100 dark:bg-blue-800 dark:hover:bg-blue-200"
                              onClick={() => handleOpenEdit(client_id)}
                            >
                              <PencilSquareIcon className="h-5 w-5  text-blue-400" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="View" className="bg-gray-700">
                            <IconButton
                              variant="text"
                              className="mb-2 ml-2 border bg-green-50 hover:bg-green-100"
                              onClick={() => handleViewProfile(client_id)}
                            >
                              <AdjustmentsHorizontalIcon className="h-5 w-5 text-green-400" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Delete" className="bg-gray-700 ">
                            <IconButton
                              variant="text"
                              className="ml-2 border bg-red-50 hover:bg-red-100"
                              onClick={() => handleDelete(client_id)}
                            >
                              <TrashIcon className="h-5 w-5  text-red-400" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            ) : (
              <div className="ml-72 mt-10 flex h-full w-full items-center justify-center">
                <BeatLoader color="#3B82F6" size={15} />
              </div>
            )}
          </table>
        </CardBody>
        <CardFooter className="border-blue-gray-50 flex items-center justify-between border-t p-4">
          <div className="flex items-center">
            <p variant="small" color="blue-gray" className="font-normal">
              Page {data?.current_page} of {data?.pages} - Total {data?.total}{" "}
              Items
            </p>
            <select
              className="border-blue-gray-50 ml-4 rounded border p-1 dark:bg-navy-700"
              value={itemsPerPage}
              onChange={handleChangeItemsPerPage}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              className="dark:border-white dark:text-white"
              variant="outlined"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              className="dark:border-white dark:text-white"
              variant="outlined"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === data?.pages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AddDevice handleOpen={handleOpen} open={open} />
      <EditDevice
        handleOpenEdit={handleOpenEdit}
        openEdit={openEdit}
        selectedClientId={selectedClientId}
      />
    </>
  );
}
