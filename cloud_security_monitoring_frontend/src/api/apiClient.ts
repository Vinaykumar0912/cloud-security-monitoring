import axios from "axios";
import { API_URL } from "./constants";

const apiClient = axios.create({
    baseURL: API_URL,
});

// Add access token to every request
apiClient.interceptors.request.use(
    (config) => {

        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// Handle expired access token
apiClient.interceptors.response.use(

    (response) => {
        return response;
    },

    async (error) => {

        const originalRequest = error.config;

        // If access token expired
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const refreshToken =
                    localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw error;
                }

                // Get new access token
                const response = await axios.post(
                    `${API_URL}/api/auth/refresh`,
                    {
                        refreshToken: refreshToken
                    }
                );

                const newAccessToken =
                    response.data.accessToken;

                if (!newAccessToken) {
                    throw new Error(
                        "New access token was not received"
                    );
                }

                // Save new access token
                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                // Update original request
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                // Retry original request
                return apiClient(originalRequest);

            } catch (refreshError) {

                // Refresh failed
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                window.location.href = "/";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;