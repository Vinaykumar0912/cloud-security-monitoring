import axios from "axios";
import { API_URL } from "./constants";

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            username,
            password
        });

        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};