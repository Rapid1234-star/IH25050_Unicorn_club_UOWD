"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { listingsService, type Listing } from "@/lib/listings"
import { favoritesService } from "@/lib/favorites"
import { reviewsService } from "@/lib/reviews"
import { chatService } from "@/lib/chat"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Bed, Bath, Heart, MessageSquare, Map, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { ReportDialog } from "@/components/report-dialog"
import { ReviewDialog } from "@/components/review-dialog"
import { RatingDisplay } from "@/components/rating-display"
import { ReviewsList } from "@/components/reviews-list"
import { PostListingDialog } from "@/components/post-listing-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

export default function ListingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [allListings, setAllListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [detailListing, setDetailListing] = useState<Listing | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const refreshListings = () => {
    const listings = listingsService.getAllListings()
    setAllListings(listings)
    setFilteredListings(listings)
  }

  useEffect(() => {
    refreshListings()

    if (user) {
      // Load favorites
      const userFavorites = favoritesService.getUserFavorites(user.id)
      const favIds = new Set(userFavorites.filter((f) => f.targetType === "listing").map((f) => f.targetId))
      setFavorites(favIds)
    }
  }, [user])

  useEffect(() => {
    let filtered = allListings

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.location.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // City filter
    if (cityFilter !== "all") {
      filtered = filtered.filter((l) => l.location.city === cityFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((l) => l.type === typeFilter)
    }

    // Price filter
    if (priceFilter !== "all") {
      filtered = filtered.filter((l) => {
        if (priceFilter === "low") return l.price < 2000
        if (priceFilter === "medium") return l.price >= 2000 && l.price < 3500
        if (priceFilter === "high") return l.price >= 3500
        return true
      })
    }

    setFilteredListings(filtered)
  }, [searchQuery, cityFilter, typeFilter, priceFilter, allListings])

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [detailListing])

  const handleToggleFavorite = (listingId: string) => {
    if (!user) return

    const isFavorited = favoritesService.toggleFavorite(user.id, listingId, "listing")

    if (isFavorited) {
      setFavorites(new Set([...favorites, listingId]))
      toast({
        title: "Added to favorites",
        description: "Listing added to your favorites",
      })
    } else {
      const newFavorites = new Set(favorites)
      newFavorites.delete(listingId)
      setFavorites(newFavorites)
      toast({
        title: "Removed from favorites",
        description: "Listing removed from your favorites",
      })
    }
  }

  const handleContactOwner = (listing: Listing) => {
    if (!user) return

    // Create or get conversation with owner
    chatService.sendMessage(user.id, listing.ownerId, `Hi! I'm interested in your listing: ${listing.title}`)

    toast({
      title: "Message sent",
      description: "Opening chat with listing owner...",
    })

    // Navigate to chat
    router.push("/chat")
  }

  const nextImage = () => {
    if (detailListing) {
      setCurrentImageIndex((prev) => (prev + 1) % detailListing.images.length)
    }
  }

  const prevImage = () => {
    if (detailListing) {
      setCurrentImageIndex((prev) => (prev - 1 + detailListing.images.length) % detailListing.images.length)
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Listings</h1>
            <p className="text-muted-foreground">Find your perfect student accommodation across UAE</p>
          </div>
          <PostListingDialog onListingAdded={refreshListings} />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="Dubai">Dubai</SelectItem>
                  <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                  <SelectItem value="Sharjah">Sharjah</SelectItem>
                  <SelectItem value="Al Ain">Al Ain</SelectItem>
                  <SelectItem value="Ajman">Ajman</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="room">Room</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under 2000 AED</SelectItem>
                  <SelectItem value="medium">2000-3500 AED</SelectItem>
                  <SelectItem value="high">3500+ AED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredListings.length} of {allListings.length} listings
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            {filteredListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No listings found matching your filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setCityFilter("all")
                      setTypeFilter("all")
                      setPriceFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => {
                  const isFavorited = favorites.has(listing.id)
                  const ratingData = reviewsService.getAverageRating(listing.id, "listing")

                  return (
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
                        {ratingData.count > 0 && (
                          <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {ratingData.average}
                          </Badge>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                          <Button
                            variant={isFavorited ? "default" : "ghost"}
                            size="icon"
                            className="shrink-0"
                            onClick={() => handleToggleFavorite(listing.id)}
                          >
                            <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {listing.location.neighborhood}, {listing.location.city}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {ratingData.count > 0 && (
                          <div className="flex items-center gap-2">
                            <RatingDisplay rating={ratingData.average} size="sm" />
                            <span className="text-sm text-muted-foreground">({ratingData.count} reviews)</span>
                          </div>
                        )}

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
                          <Button size="sm" onClick={() => handleContactOwner(listing)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => setDetailListing(listing)}
                          >
                            View Details
                          </Button>
                          <ReportDialog targetId={listing.id} targetType="listing" targetName={listing.title} />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Map View */}
                  <div className="h-[600px] bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                        <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold mb-2">Interactive Map</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Dummy location data displayed below. Click on a listing to see its location.
                        </p>
                        {selectedListing && (
                          <div className="bg-background p-4 rounded-lg shadow-lg max-w-sm mx-auto">
                            <p className="font-semibold mb-2">{selectedListing.title}</p>
                            <p className="text-sm text-muted-foreground mb-2">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {selectedListing.location.neighborhood}, {selectedListing.location.city}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Coordinates: {selectedListing.location.latitude.toFixed(4)},{" "}
                              {selectedListing.location.longitude.toFixed(4)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Listings Sidebar */}
                  <div className="h-[600px] overflow-y-auto p-4 space-y-4">
                    {filteredListings.map((listing) => {
                      const isFavorited = favorites.has(listing.id)

                      return (
                        <Card
                          key={listing.id}
                          className={`cursor-pointer transition-all ${selectedListing?.id === listing.id ? "ring-2 ring-blue-600" : ""}`}
                          onClick={() => setSelectedListing(listing)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex gap-3">
                              <img
                                src={listing.images[0] || "/placeholder.svg?height=80&width=80"}
                                alt={listing.title}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base line-clamp-1">{listing.title}</CardTitle>
                                <CardDescription className="text-xs flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" />
                                  {listing.location.neighborhood}, {listing.location.city}
                                </CardDescription>
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Bed className="h-3 w-3" />
                                    {listing.bedrooms}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Bath className="h-3 w-3" />
                                    {listing.bathrooms}
                                  </span>
                                  <span className="font-semibold text-blue-600">{listing.price} AED</span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!detailListing} onOpenChange={(open) => !open && setDetailListing(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {detailListing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{detailListing.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  {detailListing.location?.neighborhood || "Unknown"}, {detailListing.location?.city || "Unknown"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {detailListing.images && detailListing.images.length > 0 ? (
                  <div className="relative group">
                    <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={detailListing.images[currentImageIndex] || "/placeholder.svg?height=400&width=800"}
                        alt={`${detailListing.title} ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.src = "/modern-city-apartment.png"
                        }}
                      />

                      {/* Navigation buttons */}
                      {detailListing.images.length > 1 && (
                        <>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={prevImage}
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={nextImage}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </>
                      )}

                      {/* Image indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {detailListing.images.map((_, idx) => (
                          <button
                            key={idx}
                            className={`h-2 rounded-full transition-all ${
                              idx === currentImageIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                            }`}
                            onClick={() => setCurrentImageIndex(idx)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Thumbnail strip */}
                    {detailListing.images.length > 1 && (
                      <div className="flex gap-2 mt-2 overflow-x-auto">
                        {detailListing.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`relative shrink-0 w-20 h-20 rounded overflow-hidden transition-all ${
                              idx === currentImageIndex ? "ring-2 ring-blue-600" : "opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={img || "/placeholder.svg?height=80&width=80"}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Fallback if no images
                  <div className="relative h-96 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    <p className="text-muted-foreground">No images available</p>
                  </div>
                )}

                {/* Price and quick info */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{detailListing.price || 0} AED</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">{detailListing.bedrooms || 0}</div>
                      <div className="text-muted-foreground">Bedrooms</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{detailListing.bathrooms || 0}</div>
                      <div className="text-muted-foreground">Bathrooms</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold capitalize">{detailListing.type || "N/A"}</div>
                      <div className="text-muted-foreground">Type</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {detailListing.description || "No description available."}
                  </p>
                </div>

                {/* Amenities */}
                {detailListing.amenities && detailListing.amenities.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Amenities & Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {detailListing.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-sm py-1 px-3">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ratings & Reviews */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Ratings & Reviews</h3>
                    <ReviewDialog targetId={detailListing.id} targetType="listing" targetName={detailListing.title} />
                  </div>
                  <ReviewsList targetId={detailListing.id} targetType="listing" />
                </div>

                {/* Contact button */}
                <Button className="w-full" size="lg" onClick={() => handleContactOwner(detailListing)}>
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact Owner
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
