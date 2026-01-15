import axios from "axios";

const api = axios.create({
  baseURL: "https://sarisari-9k9h.vercel.app/api",
});

export default api;

