import api from "./api";

export interface RegisterData {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

export async function registerUser(data: RegisterData) {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (error: any) {
    console.error("Registration error:", error);
    throw error.response?.data?.message || "Registration failed. Please try again.";
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

