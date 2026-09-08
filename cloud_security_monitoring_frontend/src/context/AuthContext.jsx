import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { login as loginApi } from "../api/authApi";

const AuthContext = createContext({
    accessToken: null,
    refreshToken: null,
    role: null,
    user: null,
    login: async () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }) => {

    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken")
    );

    const [refreshToken, setRefreshToken] = useState(
        localStorage.getItem("refreshToken")
    );

    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    const [user, setUser] = useState(() => {

        const token =
            localStorage.getItem("accessToken");

        if (!token) {
            return null;
        }

        try {
            return jwtDecode(token);
        } catch (error) {
            return null;
        }
    });

    const login = async (username, password) => {

        try {

            const data =
                await loginApi(
                    username,
                    password
                );

            const token =
                data.accessToken || data.token;

            const refresh =
                data.refreshToken || null;

            const userRole =
                data.role || null;

            if (!token) {
                throw new Error(
                    "Access token not received"
                );
            }

            localStorage.setItem(
                "accessToken",
                token
            );

            if (refresh) {

                localStorage.setItem(
                    "refreshToken",
                    refresh
                );
            }

            if (userRole) {

                localStorage.setItem(
                    "role",
                    userRole
                );
            }

            setAccessToken(token);
            setRefreshToken(refresh);
            setRole(userRole);

            const decodedUser =
                jwtDecode(token);

            setUser(decodedUser);

            return data;

        } catch (error) {

            console.error(
                "Login failed:",
                error
            );

            throw error;
        }
    };

    const logout = () => {

        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "refreshToken"
        );

        localStorage.removeItem(
            "role"
        );

        setAccessToken(null);
        setRefreshToken(null);
        setRole(null);
        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                role,
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