import { login as loginApi } from "./api/authApi";

export const login = async (username, password) => {
    try {
        const data = await loginApi(username, password);
        return data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};