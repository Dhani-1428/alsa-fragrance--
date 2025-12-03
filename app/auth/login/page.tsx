"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-provider"
import { setAuthToken } from "@/lib/auth"
import { toast } from "sonner"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function AuthPage() {
  const router = useRouter()
  const { login, signup } = useAuth()
  const [userType, setUserType] = useState<"client" | "admin">("client")
  const [activeTab, setActiveTab] = useState("login")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Get redirect URL from query params
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const redirect = searchParams?.get('redirect') || '/'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (userType === "admin") {
        // Admin login - check credentials
        if (loginEmail !== "admin@alsafragrance.com" || loginPassword !== "admin123") {
          throw new Error("Invalid admin credentials")
        }
        
        // Login as admin
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Login failed")
        }

        if (data.user.role !== "admin") {
          throw new Error("Access denied. Admin credentials required.")
        }

        // Store auth token
        setAuthToken(JSON.stringify(data.user))
        toast.success("Admin login successful!")
        router.push("/admin/dashboard")
      } else {
        // Client login
        await login(loginEmail, loginPassword)
        toast.success("Login successful!")
        router.push(redirect)
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (userType === "admin") {
        toast.error("Admin accounts cannot be created. Please use admin login.")
        return
      }
      
      // Client signup
      await signup(signupEmail, signupPassword, signupName)
      toast.success("Account created successfully!")
      router.push(redirect)
    } catch (error: any) {
      toast.error(error.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Login or create an account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* User Type Selection */}
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">I am a:</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={userType === "client" ? "default" : "outline"}
                  onClick={() => {
                    setUserType("client")
                  }}
                  className="w-full"
                >
                  Client
                </Button>
                <Button
                  type="button"
                  variant={userType === "admin" ? "default" : "outline"}
                  onClick={() => {
                    setUserType("admin")
                    setActiveTab("login") // Switch to login tab when admin is selected
                  }}
                  className="w-full"
                >
                  Admin
                </Button>
              </div>
              {userType === "admin" && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Use: admin@alsafragrance.com / admin123
                </p>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup" disabled={userType === "admin"}>Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder={userType === "admin" ? "admin@alsafragrance.com" : "your@email.com"}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder={userType === "admin" ? "admin123" : ""}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  {userType === "admin" && (
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
                      <p className="font-medium text-blue-900 dark:text-blue-100">Admin Credentials:</p>
                      <p className="text-blue-700 dark:text-blue-300 mt-1">
                        Email: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">admin@alsafragrance.com</code>
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        Password: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">admin123</code>
                      </p>
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : userType === "admin" ? "Login as Admin" : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-4">
                {userType === "admin" ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Admin accounts cannot be created through signup.
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please use the Login tab with admin credentials.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("login")}
                    >
                      Go to Login
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating account..." : "Sign Up as Client"}
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  )
}

