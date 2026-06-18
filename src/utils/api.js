import axios from "axios";

const rawBase = import.meta.env.VITE_API_BASE_URL;


 export const api = axios.create({
    baseURL: rawBase,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
  });
        // adding authorization header if token exists
api.interceptors.request.use( (config) => {
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
    // handle errors
    api.interceptors.response.use(
        (res) => res,
        (error) => {
            const message = error?.response?.data?.message || error?.message || "Request failed";
            return Promise.reject(new Error(message));
        }
    );

