// utils/api.js
import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "${process.env.REACT_APP_API_URL}", // your backend URL
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export default api;
