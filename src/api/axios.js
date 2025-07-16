import axios from 'axios';
import { BASE_URL } from './constat';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can modify the request config here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ERR_NETWORK') {
            console.error('Network Error Details:', {
                message: error.message,
                url: error.config?.url,
                method: error.config?.method,
                errorCode: error.code,
                errorName: error.name,
            });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 