import api from "./api";

export interface RegisterData {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

export async function registerUser(data: RegisterData) {
  console.log("data : ", data);
  try {
    const res = await api.post("/auth/register", data);
    console.log("data : ", res.data);
    return res.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function loginUser(data: { username: string; password: string }) {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error.response?.data?.message || "Login failed";
  }
}

