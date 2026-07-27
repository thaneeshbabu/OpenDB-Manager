import axios from "axios";

const api = axios.create({
  baseURL: "https://opendb-manager-backend.onrender.com/api",
});

export default api;