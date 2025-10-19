// Mock authentication system using localStorage
// Simulates Firebase Auth behavior without requiring API keys

export interface User {
  id: string
  email: string
  name: string
  photoURL?: string
  createdAt: string
}

export interface UserProfile extends User {
  age?: number
  gender?: string
  university?: string
  budget?: number
  verified?: boolean
  preferences?: {
    smoking: boolean
    pets: boolean
    socialHabits: "introvert" | "extrovert" | "ambivert"
    studyHabits: "early-bird" | "night-owl" | "flexible"
    cleanliness: "very-clean" | "moderate" | "relaxed"
  }
}

const USERS_KEY = "unimate_users"
const CURRENT_USER_KEY = "unimate_current_user"

// Initialize with dummy users
const initializeDummyUsers = () => {
  const existingUsers = localStorage.getItem(USERS_KEY)
  if (!existingUsers) {
    const dummyUsers: UserProfile[] = [
      {
        id: "1",
        email: "ahmed@student.ac.ae",
        name: "Ahmed Al Mansouri",
        photoURL: "/young-male-student.png",
        age: 21,
        gender: "male",
        university: "UAE University",
        budget: 3000,
        verified: true,
        preferences: {
          smoking: false,
          pets: true,
          socialHabits: "extrovert",
          studyHabits: "early-bird",
          cleanliness: "very-clean",
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        email: "fatima@student.ac.ae",
        name: "Fatima Hassan",
        photoURL: "/young-female-student.png",
        age: 20,
        gender: "female",
        university: "American University of Sharjah",
        budget: 2500,
        verified: true,
        preferences: {
          smoking: false,
          pets: false,
          socialHabits: "introvert",
          studyHabits: "night-owl",
          cleanliness: "very-clean",
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        email: "omar@student.ac.ae",
        name: "Omar Abdullah",
        photoURL: "/young-male-student-glasses.jpg",
        age: 22,
        gender: "male",
        university: "Khalifa University",
        budget: 3500,
        verified: true,
        preferences: {
          smoking: false,
          pets: true,
          socialHabits: "ambivert",
          studyHabits: "flexible",
          cleanliness: "moderate",
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        email: "sara@student.ac.ae",
        name: "Sara Mohammed",
        photoURL: "/young-female-student-hijab.jpg",
        age: 19,
        gender: "female",
        university: "UAE University",
        budget: 2000,
        verified: true,
        preferences: {
          smoking: false,
          pets: false,
          socialHabits: "extrovert",
          studyHabits: "early-bird",
          cleanliness: "very-clean",
        },
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem(USERS_KEY, JSON.stringify(dummyUsers))
  }
}

export const authService = {
  // Sign up with email and password
  signUp: async (email: string, password: string, name: string): Promise<User> => {
    initializeDummyUsers()
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")

    // Check if user already exists
    if (users.find((u: User) => u.email === email)) {
      throw new Error("User already exists")
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))

    return newUser
  },

  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<User> => {
    initializeDummyUsers()
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
    const user = users.find((u: User) => u.email === email)

    if (!user) {
      throw new Error("User not found")
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return user
  },

  // Sign in with Google (simulated)
  signInWithGoogle: async (): Promise<User> => {
    initializeDummyUsers()
    // Simulate Google OAuth by creating a demo user
    const demoUser: User = {
      id: Date.now().toString(),
      email: "demo@student.ac.ae",
      name: "Demo User",
      photoURL: "/student-avatar.png",
      createdAt: new Date().toISOString(),
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
    const existingUser = users.find((u: User) => u.email === demoUser.email)

    const user = existingUser || demoUser
    if (!existingUser) {
      users.push(demoUser)
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return user
  },

  // Sign out
  signOut: async (): Promise<void> => {
    localStorage.removeItem(CURRENT_USER_KEY)
  },

  // Get current user
  getCurrentUser: (): UserProfile | null => {
    if (typeof window === "undefined") return null
    initializeDummyUsers()
    const userStr = localStorage.getItem(CURRENT_USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
    const userIndex = users.findIndex((u: User) => u.id === userId)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    users[userIndex] = { ...users[userIndex], ...updates }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    const currentUser = authService.getCurrentUser()
    if (currentUser?.id === userId) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]))
    }

    return users[userIndex]
  },

  // Get all users (for roommate finder)
  getAllUsers: (): UserProfile[] => {
    initializeDummyUsers()
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  },

  // Verify user
  verifyUser: (userId: string): void => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
    const userIndex = users.findIndex((u: User) => u.id === userId)

    if (userIndex !== -1) {
      users[userIndex].verified = true
      localStorage.setItem(USERS_KEY, JSON.stringify(users))

      const currentUser = authService.getCurrentUser()
      if (currentUser?.id === userId) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]))
      }
    }
  },

  // Unverify user
  unverifyUser: (userId: string): void => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
    const userIndex = users.findIndex((u: User) => u.id === userId)

    if (userIndex !== -1) {
      users[userIndex].verified = false
      localStorage.setItem(USERS_KEY, JSON.stringify(users))

      const currentUser = authService.getCurrentUser()
      if (currentUser?.id === userId) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]))
      }
    }
  },

  // Delete user
  deleteUser: (userId: string): void => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
    const filtered = users.filter((u: User) => u.id !== userId)
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered))
  },
}
