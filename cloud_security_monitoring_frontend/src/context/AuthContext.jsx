import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { login as loginApi } from "../api/authApi";

const AuthContext = createContext({
    accessToken: null,
    refreshToken: null,
    user: null,
    login: async () => {},
    logout: () => {},
});
export const AuthProvider = ({ children }) => {

    // Access token
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken")
    );

    // Refresh / reference token
    const [refreshToken, setRefreshToken] = useState(
        localStorage.getItem("refreshToken")
    );

    // Decode existing JWT token
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            return null;
        }

        try {
            return jwtDecode(token);
        } catch (error) {
            return null;
        }
    });

    // LOGIN
    const login = async (username, password) => {
        try {
            // Call login API
            const data = await loginApi(username, password);

            // Backend currently returns "token"
            const token = data.accessToken || data.token;

            const refresh = data.refreshToken || null;

            if (!token) {
                throw new Error("Access token not received");
            }

            // Store access token
            localStorage.setItem("accessToken", token);

            // Store refresh token if available
            if (refresh) {
                localStorage.setItem("refreshToken", refresh);
            }

            // Update state
            setAccessToken(token);
            setRefreshToken(refresh);

            // Decode JWT
            const decodedUser = jwtDecode(token);

            // Store decoded user
            setUser(decodedUser);

            return data;

        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    // LOGOUT
    const logout = () => {

        // Remove tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Clear states
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};