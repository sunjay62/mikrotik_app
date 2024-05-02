import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import useAuthStore from "./useAuthStore";
import { toast } from "react-toastify";

const ProtectedRoute = ({ element }) => {
  const { token, rToken, setToken } = useAuthStore();

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/token/@verify?type=access`,
          {
            token: token,
          }
        );

        if (response.data.status === "expired") {
          // Jika token expired, refresh token
          const refreshResponse = await axios.post(
            `${BASE_URL}/userlogin/@refresh_token`,
            {
              refresh_token: rToken,
            }
          );

          if (refreshResponse.data && refreshResponse.data.access_token) {
            localStorage.setItem(
              "access_token",
              refreshResponse.data.access_token
            );
            setToken(refreshResponse.data.access_token);
          } else {
            localStorage.removeItem("access_token");
            setToken(null);
            toast.error("Your session is expired, please login again.");
          }
        }
      } catch (error) {
        localStorage.removeItem("access_token");
        setToken(null);
        if (error.response && error.response.status === 400) {
          // Jika status respons adalah 400, navigasikan ke halaman login
          return <Navigate to="/login" />;
        }
      }
    };

    if (token) {
      checkTokenValidity();
    }
  }, [token, rToken, setToken]);

  return token ? (
    element
  ) : (
    <Navigate
      to="/login"
      state={{ error: "Not Authorization, Please Login!" }}
    />
  );
};

export default ProtectedRoute;
