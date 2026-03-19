import axios from "axios";

// Using localhost as the default. If the user uses 127.0.0.1, the cookie mismatch may occur.
// We recommend always using http://localhost:3000 to access the site.
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
