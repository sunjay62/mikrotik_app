import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Select, Modal } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { useData } from "./useData";
import { toast } from "react-toastify";

const { Option } = Select;

const useCreate = ({ handleOpen, open }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [mikrotikId, setMikrotikId] = useState("");
  const [profile, setProfile] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [comment, setComment] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { refetch } = useData();
  const [mikrotikOptions, setMikrotikOptions] = useState([]);
  const [profileOptions, setProfileOptions] = useState([]);

  const resetForm = () => {
    setName("");
    setPassword("");
    setProfile("");
    setService("");
    setStatus("");
    setComment("");
    setMikrotikId("");
    setConfiguration("");
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
        comment: comment,
        mikrotik_id: mikrotikId,
        name: name,
        password: password,
        profile: profile,
        service_type: service,
        status: status,
        configuration: configuration,
      };

      // console.log(formData);

      const response = await toast.promise(
        axios.post(`${BASE_URL}/clientppp`, formData, config),
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
      console.log(error);
      toast.error("Failed to create.");
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

        const responseData = await axios.get(`${BASE_URL}/mikrotik`, config);

        if (responseData && responseData.data) {
          setMikrotikOptions(
            responseData.data.map((site) => ({
              value: `${site.mikrotik_id}`,
              label: `${site.name}`,
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (mikrotikId) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("access_token");
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const responseData = await axios.get(
            `${BASE_URL}/mikrotik/${mikrotikId}/pppprofile`,
            config
          );

          if (responseData && responseData.data) {
            setProfileOptions(
              responseData.data.data.map((site) => ({
                value: `${site.name}`,
                label: `${site.name}`,
              }))
            );
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    } else {
      setProfileOptions([]);
    }
  }, [mikrotikId]);

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
  };

  // Render opsi yang difilter berdasarkan input pencarian
  const filteredMikrotikOptions = mikrotikOptions.filter((option) =>
    option.label.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <Modal
      open={open}
      onCancel={() => {
        handleOpen();
        resetForm();
      }}
      className="-mt-16"
      title="Create New Secret"
      footer={[
        <Button
          key="submit"
          className="bg-blue-500 text-white"
          onClick={handleCreate}
        >
          Create
        </Button>,
      ]}
    >
      <div>
        <Typography variant="paragraph" color="blue-gray">
          Name
        </Typography>
        <Input
          size="middle"
          color="blue"
          placeholder="Device Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          Password
        </Typography>
        <div className="relative">
          <Input.Password
            size="middle"
            color="blue"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
          />
        </div>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          MikroTik
        </Typography>
        <Select
          size="middle"
          className="w-full "
          color="blue"
          onChange={(value) => setMikrotikId(value)}
          value={mikrotikId}
          showSearch
          placeholder="Search MikroTik"
          optionFilterProp="children"
          onSearch={handleSearchInputChange}
        >
          {filteredMikrotikOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        {mikrotikId && (
          <>
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="mb-1 mt-1 text-sm"
            >
              Profile
            </Typography>
            <Select
              size="middle"
              className="w-full "
              color="blue"
              onChange={(value) => setProfile(value)}
              value={profile}
            >
              {profileOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </>
        )}
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          Service Type
        </Typography>
        <Select
          size="middle"
          className="w-full "
          color="blue"
          placeholder="Service Type"
          onChange={(value) => setService(value)}
          value={service}
        >
          <Option value="any">Any</Option>
          <Option value="async">Async</Option>
          <Option value="l2tp">L2TP</Option>
          <Option value="ovpn">OVPN</Option>
          <Option value="pppoe">PPPOE</Option>
          <Option value="pptp">PPTP</Option>
          <Option value="sstp">SSTP</Option>
        </Select>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          Status
        </Typography>
        <Select
          size="middle"
          className="w-full "
          color="blue"
          placeholder="Service Type"
          onChange={(value) => setStatus(value)}
          value={status}
        >
          <Option value="enable">Enable</Option>
          <Option value="disable">Disable</Option>
        </Select>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          Configuration
        </Typography>
        <Select
          size="middle"
          className="w-full "
          color="blue"
          placeholder="Service Type"
          onChange={(value) => setConfiguration(value)}
          value={configuration}
        >
          <Option value="configured">Configured</Option>
          <Option value="unconfigured">Unconfigured</Option>
        </Select>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        ></Typography>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          Comment
        </Typography>
        <Input
          size="middle"
          color="blue"
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default useCreate;
