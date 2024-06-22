import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
});
export default api;