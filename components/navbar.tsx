"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { chatService } from "@/lib/chat"
import { ThemeToggle } from "@/components/theme-toggle"
import { UniMateLogo } from "@/components/unimate-logo"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Users, MessageSquare, Settings, LogOut, User, Shield, Heart, Calculator, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

export function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      // Initial count
      const count = chatService.getTotalUnreadCount(user.id)
      setUnreadCount(count)

      // Poll for updates
      const interval = setInterval(() => {
        const newCount = chatService.getTotalUnreadCount(user.id)
        setUnreadCount(newCount)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <UniMateLogo className="h-8 w-8 transition-transform group-hover:scale-110" />
              <span className="font-bold text-xl text-blue-600">UniMate</span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/roommates">
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Find Roommates
                </Button>
              </Link>
              <Link href="/listings">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Listings
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="relative">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/favorites">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </Button>
              </Link>
              <Link href="/tools">
                <Button variant="ghost" size="sm">
                  <Calculator className="h-4 w-4 mr-2" />
                  Tools
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile/setup")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/favorites")}>
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/tools")}>
                    <Calculator className="mr-2 h-4 w-4" />
                    Tools
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push("/auth/login")}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => router.push("/auth/signup")}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
