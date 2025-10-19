"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { favoritesService } from "@/lib/favorites"
import { authService, type UserProfile } from "@/lib/auth"
import { listingsService, type Listing } from "@/lib/listings"
import { calculateCompatibility, getCompatibilityLabel } from "@/lib/compatibility"
import { chatService } from "@/lib/chat"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare, MapPin, Bed, Bath, X } from "lucide-react"
import { VerifiedBadge } from "@/components/verified-badge"
import { toast } from "@/hooks/use-toast"

export default function FavoritesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [favoriteUsers, setFavoriteUsers] = useState<UserProfile[]>([])
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user])

  const loadFavorites = () => {
    if (!user) return

    const favorites = favoritesService.getUserFavorites(user.id)
    const allUsers = authService.getAllUsers()
    const allListings = listingsService.getAllListings()

    // Get favorited users
    const userFavorites = favorites.filter((f) => f.targetType === "user")
    const users = userFavorites
      .map((f) => allUsers.find((u) => u.id === f.targetId))
      .filter((u): u is UserProfile => u !== undefined)
    setFavoriteUsers(users)

    // Get favorited listings
    const listingFavorites = favorites.filter((f) => f.targetType === "listing")
    const listings = listingFavorites
      .map((f) => allListings.find((l) => l.id === f.targetId))
      .filter((l): l is Listing => l !== undefined)
    setFavoriteListings(listings)
  }

  const handleRemoveFavorite = (targetId: string, targetType: "user" | "listing") => {
    if (!user) return
    favoritesService.removeFavorite(user.id, targetId, targetType)
    loadFavorites()
    toast({
      title: "Removed from favorites",
      description: `${targetType === "user" ? "User" : "Listing"} removed from your favorites`,
    })
  }

  const handleStartChat = (otherUser: UserProfile) => {
    if (!user) return

    const chat = chatService.getOrCreateChat(
      user.id,
      otherUser.id,
      user.name,
      otherUser.name,
      user.photoURL,
      otherUser.photoURL,
    )

    router.push(`/chat?chatId=${chat.id}`)
  }

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
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">View your saved roommates and listings</p>
        </div>

        <Tabs defaultValue="roommates" className="w-full">
          <TabsList>
            <TabsTrigger value="roommates">Roommates ({favoriteUsers.length})</TabsTrigger>
            <TabsTrigger value="listings">Listings ({favoriteListings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="roommates" className="mt-6">
            {favoriteUsers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No favorite roommates yet</p>
                  <Button onClick={() => router.push("/roommates")}>Browse Roommates</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteUsers.map((otherUser) => {
                  const compatibilityScore = hasCompletedProfile ? calculateCompatibility(user, otherUser) : 0
                  const { label, color } = getCompatibilityLabel(compatibilityScore)

                  return (
                    <Card key={otherUser.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={otherUser.photoURL || "/placeholder.svg"} alt={otherUser.name} />
                            <AvatarFallback className="text-xl">{otherUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg truncate">{otherUser.name}</CardTitle>
                              {otherUser.verified && <VerifiedBadge size="sm" />}
                            </div>
                            <CardDescription className="text-sm">
                              {otherUser.age && `${otherUser.age} years old`}
                              {otherUser.gender && ` • ${otherUser.gender}`}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFavorite(otherUser.id, "user")}
                            className="shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {hasCompletedProfile && otherUser.preferences && (
                          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <span className="text-sm font-medium">Compatibility</span>
                            <div className="text-right">
                              <div className="text-2xl font-bold">{compatibilityScore}%</div>
                              <div className={`text-xs ${color}`}>{label}</div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          {otherUser.university && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">University:</span>
                              <span className="font-medium">{otherUser.university}</span>
                            </div>
                          )}
                          {otherUser.budget && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Budget:</span>
                              <span className="font-medium">{otherUser.budget} AED/month</span>
                            </div>
                          )}
                        </div>

                        {otherUser.preferences && (
                          <div className="flex flex-wrap gap-2">
                            {!otherUser.preferences.smoking && <Badge variant="secondary">Non-smoker</Badge>}
                            {otherUser.preferences.pets && <Badge variant="secondary">Pet-friendly</Badge>}
                            {otherUser.preferences.socialHabits && (
                              <Badge variant="outline">
                                {otherUser.preferences.socialHabits.charAt(0).toUpperCase() +
                                  otherUser.preferences.socialHabits.slice(1)}
                              </Badge>
                            )}
                          </div>
                        )}

                        <Button className="w-full" onClick={() => handleStartChat(otherUser)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="listings" className="mt-6">
            {favoriteListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No favorite listings yet</p>
                  <Button onClick={() => router.push("/listings")}>Browse Listings</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteListings.map((listing) => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative h-48 bg-muted">
                      <img
                        src={listing.images[0] || "/placeholder.svg?height=200&width=400"}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-blue-600">
                        {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 left-2 bg-background/80 hover:bg-background"
                        onClick={() => handleRemoveFavorite(listing.id, "listing")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {listing.location.neighborhood}, {listing.location.city}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{listing.bedrooms} bed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span>{listing.bathrooms} bath</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {listing.amenities.slice(0, 4).map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {listing.amenities.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{listing.amenities.length - 4}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{listing.price} AED</div>
                          <div className="text-xs text-muted-foreground">per month</div>
                        </div>
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
