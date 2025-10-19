"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface AreaData {
  name: string
  city: string
  avgRent: number
  priceChange: number
  popularity: "high" | "medium" | "low"
  studentFriendly: number
  nearUniversities: string[]
  amenities: string[]
}

const areaData: AreaData[] = [
  {
    name: "Dubai Marina",
    city: "Dubai",
    avgRent: 4500,
    priceChange: 5.2,
    popularity: "high",
    studentFriendly: 85,
    nearUniversities: ["American University of Dubai"],
    amenities: ["Metro", "Beach", "Restaurants", "Gyms"],
  },
  {
    name: "Al Nahda",
    city: "Dubai",
    avgRent: 2200,
    priceChange: 2.1,
    popularity: "high",
    studentFriendly: 90,
    nearUniversities: ["University of Sharjah"],
    amenities: ["Metro", "Shopping", "Affordable"],
  },
  {
    name: "Academic City",
    city: "Dubai",
    avgRent: 2800,
    priceChange: 3.5,
    popularity: "high",
    studentFriendly: 95,
    nearUniversities: ["Heriot-Watt University", "Middlesex University"],
    amenities: ["Campus", "Libraries", "Student Housing"],
  },
  {
    name: "Al Ain City",
    city: "Al Ain",
    avgRent: 1800,
    priceChange: 1.2,
    popularity: "medium",
    studentFriendly: 92,
    nearUniversities: ["UAE University"],
    amenities: ["Affordable", "Quiet", "Parks"],
  },
  {
    name: "Sharjah University City",
    city: "Sharjah",
    avgRent: 2000,
    priceChange: 2.8,
    popularity: "high",
    studentFriendly: 93,
    nearUniversities: ["University of Sharjah", "American University of Sharjah"],
    amenities: ["Campus", "Affordable", "Student Services"],
  },
  {
    name: "Al Khalidiyah",
    city: "Abu Dhabi",
    avgRent: 3200,
    priceChange: 4.1,
    popularity: "medium",
    studentFriendly: 80,
    nearUniversities: ["Khalifa University"],
    amenities: ["Beach", "Restaurants", "Shopping"],
  },
  {
    name: "Muwaileh",
    city: "Sharjah",
    avgRent: 1900,
    priceChange: 1.8,
    popularity: "medium",
    studentFriendly: 88,
    nearUniversities: ["University of Sharjah"],
    amenities: ["Affordable", "Residential", "Markets"],
  },
  {
    name: "JBR",
    city: "Dubai",
    avgRent: 5200,
    priceChange: 6.5,
    popularity: "high",
    studentFriendly: 70,
    nearUniversities: ["American University of Dubai"],
    amenities: ["Beach", "Luxury", "Nightlife", "Restaurants"],
  },
]

export function HeatMap() {
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popularity")

  const filteredData = areaData.filter((area) => selectedCity === "all" || area.city === selectedCity)

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.avgRent - b.avgRent
      case "price-high":
        return b.avgRent - a.avgRent
      case "student-friendly":
        return b.studentFriendly - a.studentFriendly
      case "popularity":
      default:
        const popularityOrder = { high: 3, medium: 2, low: 1 }
        return popularityOrder[b.popularity] - popularityOrder[a.popularity]
    }
  })

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case "high":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStudentFriendlyColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>UAE Student Housing Heat Map</CardTitle>
          <CardDescription>Explore popular areas and average rental prices across UAE</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by City</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="Dubai">Dubai</SelectItem>
                  <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                  <SelectItem value="Sharjah">Sharjah</SelectItem>
                  <SelectItem value="Al Ain">Al Ain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="student-friendly">Student Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {sortedData.map((area) => (
              <Card key={area.name} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        {area.name}
                      </CardTitle>
                      <CardDescription className="mt-1">{area.city}</CardDescription>
                    </div>
                    <Badge className={getPopularityColor(area.popularity)}>
                      {area.popularity.charAt(0).toUpperCase() + area.popularity.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">Avg. Rent</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">{area.avgRent} AED</div>
                      <div className="flex items-center gap-1 text-xs">
                        {area.priceChange > 0 ? (
                          <>
                            <TrendingUp className="h-3 w-3 text-red-600" />
                            <span className="text-red-600">+{area.priceChange}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">{area.priceChange}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Student Friendly Score</span>
                      <span className={`font-bold text-lg ${getStudentFriendlyColor(area.studentFriendly)}`}>
                        {area.studentFriendly}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${area.studentFriendly}%` }}
                      />
                    </div>
                  </div>

                  {area.nearUniversities.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Near Universities:</p>
                      <div className="flex flex-wrap gap-1">
                        {area.nearUniversities.map((uni) => (
                          <Badge key={uni} variant="outline" className="text-xs">
                            {uni}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {area.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">About the Heat Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            • <strong>Student Friendly Score:</strong> Based on proximity to universities, affordability, and student
            amenities
          </p>
          <p>
            • <strong>Popularity:</strong> Indicates demand and competition for housing in the area
          </p>
          <p>
            • <strong>Price Change:</strong> Year-over-year rental price trends
          </p>
          <p>• Data is updated regularly to reflect current market conditions</p>
        </CardContent>
      </Card>
    </div>
  )
}
