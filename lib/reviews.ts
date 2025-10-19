// Ratings and reviews system

export interface Review {
  id: string
  reviewerId: string
  reviewerName: string
  reviewerPhoto?: string
  targetId: string
  targetType: "user" | "listing"
  rating: number
  comment?: string
  timestamp: string
  status: "pending" | "approved" | "rejected"
}

const REVIEWS_KEY = "unimate_reviews"

export const reviewsService = {
  // Add review
  addReview: (
    reviewerId: string,
    reviewerName: string,
    targetId: string,
    targetType: "user" | "listing",
    rating: number,
    comment?: string,
    reviewerPhoto?: string,
  ): Review => {
    const reviews = reviewsService.getAllReviews()

    const newReview: Review = {
      id: Date.now().toString(),
      reviewerId,
      reviewerName,
      reviewerPhoto,
      targetId,
      targetType,
      rating,
      comment,
      timestamp: new Date().toISOString(),
      status: "approved", // Auto-approve for demo
    }

    reviews.push(newReview)
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
    return newReview
  },

  // Get reviews for target
  getReviewsForTarget: (targetId: string, targetType: "user" | "listing"): Review[] => {
    const reviews = reviewsService.getAllReviews()
    return reviews.filter((r) => r.targetId === targetId && r.targetType === targetType && r.status === "approved")
  },

  // Get average rating
  getAverageRating: (targetId: string, targetType: "user" | "listing"): { average: number; count: number } => {
    const reviews = reviewsService.getReviewsForTarget(targetId, targetType)
    if (reviews.length === 0) return { average: 0, count: 0 }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return {
      average: Math.round((sum / reviews.length) * 10) / 10,
      count: reviews.length,
    }
  },

  // Check if user has reviewed
  hasUserReviewed: (reviewerId: string, targetId: string, targetType: "user" | "listing"): boolean => {
    const reviews = reviewsService.getAllReviews()
    return reviews.some((r) => r.reviewerId === reviewerId && r.targetId === targetId && r.targetType === targetType)
  },

  // Get all reviews
  getAllReviews: (): Review[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]")
  },

  // Update review status (for admin)
  updateReviewStatus: (reviewId: string, status: "approved" | "rejected"): void => {
    const reviews = reviewsService.getAllReviews()
    const reviewIndex = reviews.findIndex((r) => r.id === reviewId)

    if (reviewIndex !== -1) {
      reviews[reviewIndex].status = status
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
    }
  },

  // Delete review (for admin)
  deleteReview: (reviewId: string): void => {
    const reviews = reviewsService.getAllReviews()
    const filtered = reviews.filter((r) => r.id !== reviewId)
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(filtered))
  },
}
