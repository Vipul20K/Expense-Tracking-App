// import axios from "axios";

// // Create an Axios instance
// const axiosInstance = axios.create({
//     baseURL: "http://localhost:8080", // Change this to your backend URL
// });

// // Attach the token to every request automatically
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// export default axiosInstance;
