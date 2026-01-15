import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://sarisari-9k9h.vercel.app/api",
});

export default api;

