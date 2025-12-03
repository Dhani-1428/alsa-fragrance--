"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getAuthToken, setAuthToken, removeAuthToken } from "@/lib/auth"

interface User {
  id: string
  email: string
  name?: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isClient: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const token = getAuthToken()
    if (token) {
      try {
        const userData = JSON.parse(token)
        setUser(userData)
      } catch (error) {
        removeAuthToken()
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Login failed")
    }

    // Only allow client login through this function
    // Admin should use /admin/login
    if (data.user.role === "admin") {
      throw new Error("Please use admin login page for admin access")
    }

    setAuthToken(JSON.stringify(data.user))
    setUser(data.user)
  }

  const signup = async (email: string, password: string, name: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role: "client" }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Registration failed")
    }

    setAuthToken(JSON.stringify(data.user))
    setUser(data.user)
  }

  const logout = () => {
    removeAuthToken()
    setUser(null)
  }

  const isAdmin = user?.role === "admin"
  const isClient = user?.role === "client" || !user

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAdmin,
        isClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

