"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { authService, type UserProfile } from "@/lib/auth"
import { calculateCompatibility, getCompatibilityLabel } from "@/lib/compatibility"
import { chatService } from "@/lib/chat"
import { favoritesService } from "@/lib/favorites"
import { reviewsService } from "@/lib/reviews"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Search, Filter, Heart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ReportDialog } from "@/components/report-dialog"
import { VerifiedBadge } from "@/components/verified-badge"
import { RatingDisplay } from "@/components/rating-display"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function RoommatesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [allUsers, setAllUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [universityFilter, setUniversityFilter] = useState("all")
  const [budgetFilter, setBudgetFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const users = authService.getAllUsers().filter((u) => u.id !== user.id)
      setAllUsers(users)
      setFilteredUsers(users)

      // Load favorites
      const userFavorites = favoritesService.getUserFavorites(user.id)
      const favIds = new Set(userFavorites.filter((f) => f.targetType === "user").map((f) => f.targetId))
      setFavorites(favIds)
    }
  }, [user])

  useEffect(() => {
    let filtered = allUsers

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.university?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // University filter
    if (universityFilter !== "all") {
      filtered = filtered.filter((u) => u.university === universityFilter)
    }

    // Budget filter
    if (budgetFilter !== "all") {
      filtered = filtered.filter((u) => {
        if (!u.budget) return false
        if (budgetFilter === "low") return u.budget < 2000
        if (budgetFilter === "medium") return u.budget >= 2000 && u.budget < 3500
        if (budgetFilter === "high") return u.budget >= 3500
        return true
      })
    }

    // Gender filter
    if (genderFilter !== "all") {
      filtered = filtered.filter((u) => u.gender === genderFilter)
    }

    // Verified filter
    if (verifiedOnly) {
      filtered = filtered.filter((u) => u.verified === true)
    }

    setFilteredUsers(filtered)
  }, [searchQuery, universityFilter, budgetFilter, genderFilter, verifiedOnly, allUsers])

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

  const handleToggleFavorite = (userId: string) => {
    if (!user) return

    const isFavorited = favoritesService.toggleFavorite(user.id, userId, "user")

    if (isFavorited) {
      setFavorites(new Set([...favorites, userId]))
      toast({
        title: "Added to favorites",
        description: "User added to your favorites",
      })
    } else {
      const newFavorites = new Set(favorites)
      newFavorites.delete(userId)
      setFavorites(newFavorites)
      toast({
        title: "Removed from favorites",
        description: "User removed from your favorites",
      })
    }
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
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Roommate</h1>
          <p className="text-muted-foreground">Browse compatible students and connect with potential roommates</p>
        </div>

        {!hasCompletedProfile && (
          <Alert className="mb-6">
            <AlertDescription>
              Complete your profile to see compatibility scores with other students.{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/profile/setup")}>
                Complete Profile
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={universityFilter} onValueChange={setUniversityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  <SelectItem value="UAE University">UAE University</SelectItem>
                  <SelectItem value="American University of Sharjah">American University of Sharjah</SelectItem>
                  <SelectItem value="Khalifa University">Khalifa University</SelectItem>
                  <SelectItem value="American University of Dubai">American University of Dubai</SelectItem>
                  <SelectItem value="Zayed University">Zayed University</SelectItem>
                </SelectContent>
              </Select>

              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Budgets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Budgets</SelectItem>
                  <SelectItem value="low">Low (Under 2000 AED)</SelectItem>
                  <SelectItem value="medium">Medium (2000-3500 AED)</SelectItem>
                  <SelectItem value="high">High (3500+ AED)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={verifiedOnly}
                onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
              />
              <Label htmlFor="verified" className="text-sm font-normal cursor-pointer">
                Show only verified users
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {allUsers.length} students
        </div>

        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No students found matching your filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setUniversityFilter("all")
                  setBudgetFilter("all")
                  setGenderFilter("all")
                  setVerifiedOnly(false)
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((otherUser) => {
              const compatibilityScore = hasCompletedProfile ? calculateCompatibility(user, otherUser) : 0
              const { label, color } = getCompatibilityLabel(compatibilityScore)
              const isFavorited = favorites.has(otherUser.id)
              const { average, count } = reviewsService.getAverageRating(otherUser.id, "user")

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
                        {count > 0 && <RatingDisplay rating={average} count={count} size="sm" />}
                      </div>
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
                        {otherUser.preferences.cleanliness && (
                          <Badge variant="outline">
                            {otherUser.preferences.cleanliness === "very-clean"
                              ? "Very Clean"
                              : otherUser.preferences.cleanliness.charAt(0).toUpperCase() +
                                otherUser.preferences.cleanliness.slice(1)}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1" onClick={() => handleStartChat(otherUser)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button
                        variant={isFavorited ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleToggleFavorite(otherUser.id)}
                      >
                        <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                    <ReportDialog targetId={otherUser.id} targetType="user" targetName={otherUser.name} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
