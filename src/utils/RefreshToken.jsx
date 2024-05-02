// import { useEffect } from "react";
// import { BASE_URL } from "libs/auth-api";
// import axios from "axios";
// import { toast } from "react-toastify";
// import useAuthStore from "./useAuthStore";

// const RefreshToken = () => {
//   const { rToken, setToken } = useAuthStore();

//   useEffect(() => {
//     const refreshToken = async () => {
//       try {
//         const response = await axios.post(
//           `${BASE_URL}/userlogin/@refresh_token`,
//           {
//             refresh_token: rToken,
//           }
//         );

//         console.log(response);

//         const { access_token } = response.data;
//         localStorage.setItem("access_token", access_token);
//         setToken(access_token);

//         return access_token;
//       } catch (error) {
//         console.error("Terjadi kesalahan saat memeriksa token:", error);
//         if (error.response && error.response.status === 422) {
//           toast.error("No Authorization, Please Login!");
//           localStorage.removeItem("refresh_token");
//         } else if (error.response && error.response.status === 400) {
//           localStorage.removeItem("refresh_token");
//           toast.error("No Authorization, Please Login!");
//         }
//         throw error; // Rethrow error untuk ditangani di komponen lain jika perlu
//       }
//     };

//     refreshToken(); // Call refreshToken immediately when component mounts
//   }, []);

//   return null;
// };

// export default RefreshToken;
