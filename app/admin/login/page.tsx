"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { setAuthToken } from "@/lib/auth"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        throw new Error("Invalid response from server. Please try again.")
      }

      if (!response.ok) {
        const errorMessage = data.error || "Login failed"
        const errorDetails = data.details ? ` (${data.details})` : ""
        throw new Error(errorMessage + errorDetails)
      }

      // Check if user data exists
      if (!data.user) {
        throw new Error("Invalid response from server. User data not found.")
      }

      // Check if user is admin
      if (data.user.role !== "admin") {
        throw new Error("Access denied. Admin credentials required.")
      }

      // Store auth token (in production, use proper session management)
      setAuthToken(JSON.stringify(data.user))
      toast.success("Admin login successful!")
      router.push("/admin/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Login failed. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@alsafragrance.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Need to create an admin user?</strong> Run: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">npm run db:create-admin</code>
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Default credentials: admin@alsafragrance.com / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

