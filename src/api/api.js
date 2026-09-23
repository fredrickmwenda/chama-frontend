

// src/api/api.js
import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 1. Request Interceptor: Attach JWT token to every request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 2. Response Interceptor: Handle Expired Tokens (Refresh Logic)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    response => response, // Pass through successful responses
    async error => {
        const originalRequest = error.config;

        // Check if error is 401 (Unauthorized) and not a login/refresh attempt
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/')) {
            
            if (isRefreshing) {
                // If token is already refreshing, queue this request until it's done
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) throw new Error("No refresh token");

                // Call the backend refresh endpoint
                const res = await axios.post(`${baseURL}/auth/refresh/`, { refresh: refreshToken });
                
                const newAccessToken = res.data.access;
                localStorage.setItem('access_token', newAccessToken);

                // Process any requests that were queued while we were refreshing
                processQueue(null, newAccessToken);

                // Retry the original request with the new token
                originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                return api(originalRequest);

            } catch (refreshError) {
                // If refresh fails (refresh token expired), log the user out
                processQueue(refreshError, null);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login'; // Force redirect to login
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;