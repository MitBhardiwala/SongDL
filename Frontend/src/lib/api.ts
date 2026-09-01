import axios from "axios";

export const api = axios.create({
    baseURL: "/api", // relative, goes through the proxy
    withCredentials: true,
});