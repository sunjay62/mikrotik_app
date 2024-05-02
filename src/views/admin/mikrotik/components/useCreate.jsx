import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Select, Modal } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { useData } from "./useData";

const { Option } = Select;

const useCreate = ({ handleOpen, open }) => {
  const [name, setName] = useState("");
  const [apiPort, setApiPort] = useState(8728);
  const [ipAddress, setIpAddress] = useState("");
  const [password, setPassword] = useState("");
  const [siteId, setSiteId] = useState("");
  const [username, setUsername] = useState("");
  const { refetch } = useData();
  const [siteOptions, setSiteOptions] = useState([]);
  const [ipError, setIpError] = useState("");

  const resetForm = () => {
    setName("");
    setIpAddress("");
    setPassword("");
    setSiteId("");
    setUsername("");
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        name: name,
        username: username,
        site_id: siteId,
        password: password,
        ipaddress: ipAddress,
        apiport: apiPort,
      };

      const response = await toast.promise(
        axios.post(`${BASE_URL}/mikrotik`, formData, config),
        {
          pending: "Creating ...",
          success: "Created Successfully!",
        }
      );

      if (response.status === 201) {
        resetForm();
        handleOpen();
        refetch();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const responseData = await axios.get(`${BASE_URL}/sites`, config);

        if (responseData && responseData.data) {
          setSiteOptions(
            responseData.data.map((site) => ({
              value: `${site.id}`,
              label: `${site.name} (${site.code})`,
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // Function to validate IPv4 address
  const validateIPv4 = (ip) => {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
  };

  // Function to handle IP Address input change
  const handleIpAddressChange = (value) => {
    setIpAddress(value);
    if (!validateIPv4(value)) {
      setIpError("Invalid IPv4 address");
    } else {
      setIpError("");
    }
  };

  // Disable confirm button if IP address is invalid
  const isConfirmDisabled = !validateIPv4(ipAddress);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Modal
      title="Create New Device"
      open={open}
      onCancel={handleOpen}
      footer={[
        <Button
          key="confirm"
          className="bg-blue-500 text-white"
          onClick={handleCreate}
          disabled={isConfirmDisabled}
        >
          Confirm
        </Button>,
      ]}
    >
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Device Name
      </Typography>
      <Input
        placeholder="Device Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        IP Address
      </Typography>
      <Input
        placeholder="IP Address"
        value={ipAddress}
        onChange={(e) => handleIpAddressChange(e.target.value)}
      />
      {ipError && <Typography type="danger">{ipError}</Typography>}
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Username
      </Typography>
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Password
      </Typography>
      <div style={{ position: "relative" }}>
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Site ID
      </Typography>
      <Select
        placeholder="Site ID"
        className="w-full"
        onChange={(value) => setSiteId(value)}
      >
        {siteOptions.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        API Port
      </Typography>
      <Input
        type="number"
        placeholder="API Port"
        value={apiPort}
        onChange={(e) => setApiPort(e.target.value)}
      />
    </Modal>
  );
};

export default useCreate;
