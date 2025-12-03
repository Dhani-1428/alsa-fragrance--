"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Menu, Search, ShoppingCart, X, Globe } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/contexts/language-provider"
import { useAuth } from "@/contexts/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import { searchProducts } from "@/lib/products-main"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const { toggleCart, getTotalItems } = useCart()
  const { language, setLanguage, t } = useLanguage()
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchProducts(searchQuery)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  const mainNavItems = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.shop, href: "/shop" },
    { name: t.nav.contact, href: "/contact" },
  ]

  const categoryNavItems = [
    { name: t.nav.forHer, href: "/women" },
    { name: t.nav.forHim, href: "/men" },
    { name: t.nav.attars, href: "/attars" },
    { name: t.nav.testers, href: "/testers" },
    { name: t.nav.newArrivals, href: "/new-arrivals" },
    { name: t.nav.limitedEdition, href: "/limited-edition" },
  ]

  const languageNames: Record<string, string> = {
    en: "English",
    pt: "Português",
    hi: "हिंदी",
    ar: "العربية",
    ur: "اردو",
  }

  const allNavItems = [...mainNavItems, ...categoryNavItems]

  return (
    <motion.header
      className={`w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/98 backdrop-blur-md border-b border-gold/20 shadow-lg shadow-black/10"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          {/* Top row with logo and icons */}
          <div className="flex h-32 items-center py-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div 
                className="relative" 
                whileHover={{ scale: 1.05 }} 
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/alsa-logo.png"
                  alt="Alsa Fragrance"
                  width={400}
                  height={160}
                  className="h-32 w-auto object-contain"
                  priority
                />
              </motion.div>
            </Link>

            {/* Search Bar - Centered */}
            <div className="flex-1 flex items-center justify-center px-8">
              <div className="hidden sm:flex items-center w-full max-w-lg">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search fragrances..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-12 w-full h-12 text-lg bg-background/50 border-gold/20 focus:border-gold focus:ring-gold/20 rounded-full"
                    />
                    {searchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side Icons (no auth icons) */}
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" className="hover:bg-gold/10 hover:text-gold transition-colors">
                      <Globe className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage("en")}>
                    <span className={language === "en" ? "font-bold" : ""}>English</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("pt")}>
                    <span className={language === "pt" ? "font-bold" : ""}>Português</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("hi")}>
                    <span className={language === "hi" ? "font-bold" : ""}>हिंदी</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("ar")}>
                    <span className={language === "ar" ? "font-bold" : ""}>العربية</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("ur")}>
                    <span className={language === "ur" ? "font-bold" : ""}>اردو</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Auth Button */}
              {mounted && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="ghost" size="icon" className="hover:bg-gold/10 hover:text-gold transition-colors">
                        <User className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name || user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {user.role === "admin" && (
                      <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => { logout(); router.push("/") }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : mounted ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/auth/login")}
                    className="hover:bg-gold/10 hover:text-gold hover:border-gold"
                  >
                    Login
                  </Button>
                </motion.div>
              ) : (
                <div className="w-[73px] h-[36px]"></div>
              )}

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gold/10 hover:text-gold transition-colors"
                  onClick={toggleCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <AnimatePresence>
                    {getTotalItems() > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge className="h-5 w-5 rounded-full p-0 text-xs bg-gold text-black font-bold">
                          {getTotalItems()}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" className="hover:bg-gold/10 hover:text-gold transition-colors">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-l border-gold/20">
                  <nav className="flex flex-col space-y-4 mt-8">
                    <div className="mb-4">
                      <form onSubmit={handleSearchSubmit}>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </form>
                    </div>

                    {allNavItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={`text-lg transition-colors duration-200 block py-2 px-4 rounded-lg hover:bg-gold/10 tracking-wide ${
                            categoryNavItems.some((cat) => cat.name === item.name)
                              ? `font-script font-normal ${pathname === item.href ? "text-amber-500 bg-amber-500/5" : "text-amber-500 hover:text-amber-400"}`
                              : `font-semibold ${pathname === item.href ? "text-gold bg-gold/5" : "text-foreground hover:text-gold"}`
                          }`}
                          style={
                            !categoryNavItems.some((cat) => cat.name === item.name)
                              ? { fontFamily: "var(--font-playfair)" }
                              : {}
                          }
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="hidden lg:block pb-3">
            {/* Tagline */}
            <motion.div 
              className="text-center mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div 
                className="text-lg font-normal"
                style={{
                  fontFamily: "'Brush Script MT', 'Lucida Handwriting', 'Comic Sans MS', cursive",
                  fontStyle: "italic",
                  background: "linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "0.05em"
                }}
              >
                "Crafted Scents of Royal Sophistication"
              </div>
            </motion.div>
            {/* Main navigation items */}
            <motion.nav
              className="flex items-center justify-center space-x-8 xl:space-x-12 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {mainNavItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`text-xl font-semibold transition-all duration-300 relative group py-2 px-4 xl:px-6 rounded-lg ${
                      pathname === item.href ? "text-gold bg-gold/5" : "text-foreground hover:text-gold hover:bg-gold/5"
                    }`}
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            {/* Category navigation items */}
            <motion.nav
              className="flex items-center justify-center space-x-6 xl:space-x-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {categoryNavItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`text-lg font-normal transition-all duration-300 relative group py-2 px-3 xl:px-4 rounded-lg ${
                      pathname === item.href
                        ? "text-amber-500 bg-amber-500/5"
                        : "text-amber-500 hover:text-amber-400 hover:bg-amber-500/5"
                    }`}
                    style={{ fontFamily: "var(--font-great-vibes)" }}
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
