// Dummy listings data with coordinates

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  type: "apartment" | "room" | "studio"
  bedrooms: number
  bathrooms: number
  images: string[]
  location: {
    city: string
    neighborhood: string
    latitude: number
    longitude: number
  }
  amenities: string[]
  ownerId: string
  ownerName: string
  createdAt: string
}

// Dummy listings for UAE cities
export const dummyListings: Listing[] = [
  {
    id: "1",
    title: "Modern 2BR Apartment near UAE University",
    description:
      "Spacious 2-bedroom apartment perfect for students. Walking distance to campus, fully furnished with modern amenities. This beautiful apartment features a modern kitchen, comfortable living room, and two well-sized bedrooms. The building offers excellent facilities including a gym, swimming pool, and 24/7 security. Located in a quiet neighborhood with easy access to public transportation and shopping centers.",
    price: 3000,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "/modern-apartment-living-room.png",
      "/modern-bedroom.png",
      "/modern-kitchen.png",
      "/modern-apartment-living-room.png",
    ],
    location: {
      city: "Al Ain",
      neighborhood: "Al Jimi",
      latitude: 24.2075,
      longitude: 55.7447,
    },
    amenities: ["WiFi", "AC", "Parking", "Gym", "Pool", "Furnished", "Security"],
    ownerId: "1",
    ownerName: "Ahmed Al Mansouri",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Cozy Studio in Sharjah",
    description:
      "Affordable studio apartment near American University of Sharjah. Perfect for a single student. This cozy studio features an open-plan layout with a kitchenette, comfortable sleeping area, and a modern bathroom. The building is well-maintained with friendly neighbors and excellent security. Walking distance to the university campus and local amenities.",
    price: 1800,
    type: "studio",
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "/cozy-studio-apartment.png",
      "/small-modern-kitchen.jpg",
      "/studio-bathroom.jpg",
      "/cozy-studio-apartment.png",
    ],
    location: {
      city: "Sharjah",
      neighborhood: "University City",
      latitude: 25.314,
      longitude: 55.4885,
    },
    amenities: ["WiFi", "AC", "Furnished", "Security", "Laundry"],
    ownerId: "2",
    ownerName: "Fatima Hassan",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Shared Room in Dubai Marina",
    description:
      "Looking for a roommate to share a spacious room in Dubai Marina. Great location with metro access. This large room in a 2-bedroom apartment offers plenty of space for two students. The apartment features a modern kitchen, comfortable living area, and is located in one of Dubai's most vibrant neighborhoods. Easy access to the metro, beaches, and entertainment options.",
    price: 2200,
    type: "room",
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "/shared-bedroom-modern.jpg",
      "/dubai-marina-view.jpg",
      "/cozy-apartment-living-room.png",
      "/dubai-marina-apartment.jpg",
    ],
    location: {
      city: "Dubai",
      neighborhood: "Dubai Marina",
      latitude: 25.0805,
      longitude: 55.1403,
    },
    amenities: ["WiFi", "AC", "Metro Access", "Gym", "Pool", "Security", "Balcony"],
    ownerId: "3",
    ownerName: "Omar Abdullah",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "3BR Apartment for Students - Abu Dhabi",
    description:
      "Large 3-bedroom apartment perfect for 3 students. Near Khalifa University, fully equipped kitchen. This spacious apartment offers three comfortable bedrooms, two modern bathrooms, a large living area, and a fully equipped kitchen. The building features excellent amenities including a gym, swimming pool, and covered parking. Located in a safe, family-friendly neighborhood with easy access to the university.",
    price: 4500,
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "/spacious-apartment-interior.jpg",
      "/modern-living-room.png",
      "/equipped-kitchen-modern.jpg",
      "/bedroom-with-balcony.jpg",
      "/spacious-3-bedroom-apartment.jpg",
    ],
    location: {
      city: "Abu Dhabi",
      neighborhood: "Al Reem Island",
      latitude: 24.498,
      longitude: 54.3943,
    },
    amenities: ["WiFi", "AC", "Parking", "Gym", "Pool", "Security", "Balcony", "Furnished", "Laundry"],
    ownerId: "4",
    ownerName: "Sara Mohammed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Budget-Friendly Room in Ajman",
    description:
      "Affordable room for students on a budget. Quiet neighborhood, good transport links. This comfortable room in a shared apartment offers great value for money. The apartment is clean, well-maintained, and located in a peaceful area. Good public transportation connections make it easy to reach universities and shopping areas. Perfect for students looking for affordable accommodation.",
    price: 1500,
    type: "room",
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "/simple-bedroom-clean.jpg",
      "/basic-apartment-interior.jpg",
      "/shared-kitchen.jpg",
      "/budget-friendly-room.jpg",
    ],
    location: {
      city: "Ajman",
      neighborhood: "Al Nuaimiya",
      latitude: 25.4052,
      longitude: 55.5136,
    },
    amenities: ["WiFi", "AC", "Furnished", "Laundry"],
    ownerId: "1",
    ownerName: "Ahmed Al Mansouri",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Luxury 2BR near Dubai Knowledge Park",
    description:
      "Premium 2-bedroom apartment in a modern building near Dubai Knowledge Park. Features high-end finishes, smart home technology, and stunning city views. The apartment includes a spacious living area, modern kitchen with appliances, master bedroom with ensuite, and a second bedroom. Building amenities include a rooftop pool, state-of-the-art gym, and 24/7 concierge service.",
    price: 3800,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "/luxury-apartment-living-room.png",
      "/modern-luxury-bedroom.jpg",
      "/high-end-kitchen.jpg",
      "/city-view-balcony.jpg",
      "/dubai-luxury-apartment.png",
    ],
    location: {
      city: "Dubai",
      neighborhood: "Al Sufouh",
      latitude: 25.1122,
      longitude: 55.1702,
    },
    amenities: ["WiFi", "AC", "Parking", "Gym", "Pool", "Security", "Balcony", "Furnished", "Smart Home", "Concierge"],
    ownerId: "2",
    ownerName: "Fatima Hassan",
    createdAt: new Date().toISOString(),
  },
]

const LISTINGS_KEY = "unimate_listings"

export const listingsService = {
  // Initialize listings
  initializeListings: () => {
    if (typeof window === "undefined") return
    const existing = localStorage.getItem(LISTINGS_KEY)
    if (!existing) {
      localStorage.setItem(LISTINGS_KEY, JSON.stringify(dummyListings))
    }
  },

  // Get all listings
  getAllListings: (): Listing[] => {
    if (typeof window === "undefined") return dummyListings
    listingsService.initializeListings()
    return JSON.parse(localStorage.getItem(LISTINGS_KEY) || JSON.stringify(dummyListings))
  },

  // Add new listing
  addListing: (listing: Omit<Listing, "id" | "createdAt">): Listing => {
    const listings = listingsService.getAllListings()
    const newListing: Listing = {
      ...listing,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    listings.push(newListing)
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings))
    return newListing
  },

  // Delete listing
  deleteListing: (id: string): void => {
    const listings = listingsService.getAllListings()
    const filtered = listings.filter((l) => l.id !== id)
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(filtered))
  },
}
