// Favorites system for saving roommates and listings

export interface Favorite {
  id: string
  userId: string
  targetId: string
  targetType: "user" | "listing"
  timestamp: string
}

const FAVORITES_KEY = "unimate_favorites"

export const favoritesService = {
  // Add favorite
  addFavorite: (userId: string, targetId: string, targetType: "user" | "listing"): Favorite => {
    const favorites = favoritesService.getAllFavorites()

    // Check if already favorited
    const existing = favorites.find(
      (f) => f.userId === userId && f.targetId === targetId && f.targetType === targetType,
    )
    if (existing) return existing

    const newFavorite: Favorite = {
      id: Date.now().toString(),
      userId,
      targetId,
      targetType,
      timestamp: new Date().toISOString(),
    }

    favorites.push(newFavorite)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    return newFavorite
  },

  // Remove favorite
  removeFavorite: (userId: string, targetId: string, targetType: "user" | "listing"): void => {
    const favorites = favoritesService.getAllFavorites()
    const filtered = favorites.filter(
      (f) => !(f.userId === userId && f.targetId === targetId && f.targetType === targetType),
    )
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
  },

  // Check if favorited
  isFavorited: (userId: string, targetId: string, targetType: "user" | "listing"): boolean => {
    const favorites = favoritesService.getAllFavorites()
    return favorites.some((f) => f.userId === userId && f.targetId === targetId && f.targetType === targetType)
  },

  // Get user's favorites
  getUserFavorites: (userId: string): Favorite[] => {
    const favorites = favoritesService.getAllFavorites()
    return favorites.filter((f) => f.userId === userId)
  },

  // Get all favorites
  getAllFavorites: (): Favorite[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]")
  },

  // Toggle favorite
  toggleFavorite: (userId: string, targetId: string, targetType: "user" | "listing"): boolean => {
    const isFav = favoritesService.isFavorited(userId, targetId, targetType)
    if (isFav) {
      favoritesService.removeFavorite(userId, targetId, targetType)
      return false
    } else {
      favoritesService.addFavorite(userId, targetId, targetType)
      return true
    }
  },
}
