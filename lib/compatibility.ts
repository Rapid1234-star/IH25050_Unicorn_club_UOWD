// Calculate compatibility score between two users based on preferences

import type { UserProfile } from "./auth"

export const calculateCompatibility = (user1: UserProfile, user2: UserProfile): number => {
  if (!user1.preferences || !user2.preferences) return 0

  let score = 0
  let totalFactors = 0

  // Smoking compatibility (high weight)
  totalFactors += 20
  if (user1.preferences.smoking === user2.preferences.smoking) {
    score += 20
  }

  // Pets compatibility (high weight)
  totalFactors += 20
  if (user1.preferences.pets === user2.preferences.pets) {
    score += 20
  }

  // Social habits compatibility (medium weight)
  totalFactors += 15
  if (user1.preferences.socialHabits === user2.preferences.socialHabits) {
    score += 15
  } else if (user1.preferences.socialHabits === "ambivert" || user2.preferences.socialHabits === "ambivert") {
    score += 10
  }

  // Study habits compatibility (medium weight)
  totalFactors += 15
  if (user1.preferences.studyHabits === user2.preferences.studyHabits) {
    score += 15
  } else if (user1.preferences.studyHabits === "flexible" || user2.preferences.studyHabits === "flexible") {
    score += 10
  }

  // Cleanliness compatibility (medium weight)
  totalFactors += 15
  if (user1.preferences.cleanliness === user2.preferences.cleanliness) {
    score += 15
  } else {
    const cleanlinessLevels = ["relaxed", "moderate", "very-clean"]
    const diff = Math.abs(
      cleanlinessLevels.indexOf(user1.preferences.cleanliness) -
        cleanlinessLevels.indexOf(user2.preferences.cleanliness),
    )
    if (diff === 1) score += 8
  }

  // Budget compatibility (low weight)
  totalFactors += 15
  if (user1.budget && user2.budget) {
    const budgetDiff = Math.abs(user1.budget - user2.budget)
    if (budgetDiff < 500) {
      score += 15
    } else if (budgetDiff < 1000) {
      score += 10
    } else if (budgetDiff < 1500) {
      score += 5
    }
  }

  return Math.round((score / totalFactors) * 100)
}

export const getCompatibilityLabel = (score: number): { label: string; color: string } => {
  if (score >= 80) return { label: "Excellent Match", color: "text-green-600" }
  if (score >= 60) return { label: "Good Match", color: "text-blue-600" }
  if (score >= 40) return { label: "Fair Match", color: "text-yellow-600" }
  return { label: "Low Match", color: "text-red-600" }
}
