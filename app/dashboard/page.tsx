"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { chatService } from "@/lib/chat"
import { favoritesService } from "@/lib/favorites"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Users, MessageSquare, Calendar } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeChats, setActiveChats] = useState(0)
  const [savedListings, setSavedListings] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return

    const updateStats = () => {
      // Get active chats count
      const userChats = chatService.getUserChats(user.id)
      setActiveChats(userChats.length)

      // Get saved listings count
      const favorites = favoritesService.getUserFavorites(user.id)
      const listingFavorites = favorites.filter((f) => f.targetType === "listing")
      setSavedListings(listingFavorites.length)

      // Get unread messages count
      const unread = chatService.getTotalUnreadCount(user.id)
      setUnreadMessages(unread)
    }

    // Initial update
    updateStats()

    // Poll for updates every 2 seconds
    const interval = setInterval(updateStats, 2000)

    return () => clearInterval(interval)
  }, [user])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const hasCompletedProfile = user.age && user.university && user.preferences

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Find your perfect roommate and housing today</p>
        </div>

        {!hasCompletedProfile && (
          <Card className="mb-8 border-blue-600">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Help us find better matches by completing your profile with preferences and lifestyle information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/profile/setup")}>Complete Profile</Button>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/roommates")}>
            <CardHeader>
              <Users className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Find Roommates</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Browse compatible students looking for roommates</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/listings")}>
            <CardHeader>
              <Home className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Browse Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Find apartments and rooms near your university</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/events")}>
            <CardHeader>
              <Calendar className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Discover and join university events</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/chat")}>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Chat with potential roommates in real-time</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Profile Completion</span>
                <span className="font-semibold">{hasCompletedProfile ? "100%" : "30%"}</span>
              </div>
              <div className="flex justify-between items-center transition-all duration-300">
                <span className="text-muted-foreground">Active Chats</span>
                <span className="font-semibold text-blue-600">{activeChats}</span>
              </div>
              <div className="flex justify-between items-center transition-all duration-300">
                <span className="text-muted-foreground">Saved Listings</span>
                <span className="font-semibold text-blue-600">{savedListings}</span>
              </div>
              <div className="flex justify-between items-center transition-all duration-300">
                <span className="text-muted-foreground">Unread Messages</span>
                <span className="font-semibold text-red-600">{unreadMessages > 0 ? unreadMessages : "0"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-full w-6 h-6 flex items-center justify-center text-sm ${hasCompletedProfile ? "bg-green-600 text-white" : "bg-gray-200"}`}
                >
                  {hasCompletedProfile ? "✓" : "1"}
                </div>
                <div>
                  <p className="font-medium">Complete your profile</p>
                  <p className="text-sm text-muted-foreground">Add preferences and lifestyle info</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-gray-200">2</div>
                <div>
                  <p className="font-medium">Browse roommates</p>
                  <p className="text-sm text-muted-foreground">Find compatible matches</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-gray-200">3</div>
                <div>
                  <p className="font-medium">Start chatting</p>
                  <p className="text-sm text-muted-foreground">Connect with potential roommates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Welcome Orientation</p>
                  <p className="text-xs text-muted-foreground">Nov 1, 2025 • 6:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Web Dev Workshop</p>
                  <p className="text-xs text-muted-foreground">Nov 5, 2025 • 2:00 PM</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 bg-transparent"
                onClick={() => router.push("/events")}
              >
                View All Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
