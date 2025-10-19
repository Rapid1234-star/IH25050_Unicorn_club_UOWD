"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { authService, type UserProfile } from "@/lib/auth"

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    const user = await authService.signIn(email, password)
    setUser(user as UserProfile)
  }

  const signUp = async (email: string, password: string, name: string) => {
    const user = await authService.signUp(email, password, name)
    setUser(user as UserProfile)
  }

  const signInWithGoogle = async () => {
    const user = await authService.signInWithGoogle()
    setUser(user as UserProfile)
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return
    const updatedUser = await authService.updateProfile(user.id, updates)
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
