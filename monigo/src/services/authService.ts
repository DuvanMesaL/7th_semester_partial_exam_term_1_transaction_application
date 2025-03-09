import { userApi } from "./api"
import type { User } from "@/types/user"

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await userApi.post("/auth/login", { email, password })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed")
  }
}

export const registerUser = async (userData: any) => {
  try {
    const response = await userApi.post("/user", userData)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed")
  }
}

export const getUserProfile = async (): Promise<User> => {
  try {
    // Get user ID from JWT token
    // We need to decode the token to get the user ID
    const token = localStorage.getItem("accessToken")
    if (!token) throw new Error("No authentication token found")

    // Decode the token to get the user ID
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )

    const { id } = JSON.parse(jsonPayload)

    // Get user profile using the ID
    const response = await userApi.get(`/user/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get user profile")
  }
}

export const updateUserProfile = async (userId: string, userData: Partial<User>) => {
  try {
    const response = await userApi.put(`/user/${userId}`, userData)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update profile")
  }
}

export const logoutUser = async () => {
  try {
    // Get user ID from JWT token
    const token = localStorage.getItem("accessToken")
    if (!token) return

    // Decode the token to get the user ID
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )

    const { id } = JSON.parse(jsonPayload)

    await userApi.post("/auth/logout", { userId: id })
  } catch (error) {
    console.error("Logout error:", error)
  }
}

