import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { loginUser, registerUser, getUserProfile, logoutUser } from "@/services/authService"
import type { User } from "@/types/user"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  updateUserData: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")
      if (token) {
        try {
          const userData = await getUserProfile()
          setUser(userData)
        } catch (error) {
          console.error("Error fetching user profile:", error)
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { accessToken, refreshToken } = await loginUser(email, password)
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)

      const userData = await getUserProfile()
      setUser(userData)

      toast({
        title: "Login successful",
        description: "Welcome back!",
      })
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      })
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      await registerUser(userData)
      toast({
        title: "Registration successful",
        description: "You can now login with your credentials",
      })
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information",
        variant: "destructive",
      })
      throw error
    }
  }

  const logout = () => {
    logoutUser().catch(console.error)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  const updateUserData = (userData: User) => {
    setUser(userData)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

