"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { UniMateLogo } from "@/components/unimate-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Users, MessageSquare, Shield } from "lucide-react"

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Redirect to dashboard if already logged in
      router.push("/dashboard")
    }
  }, [user, loading, router])

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <UniMateLogo className="h-20 w-20 md:h-24 md:w-24" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-balance">
            Find Your Perfect <span className="text-blue-600">Roommate</span> &{" "}
            <span className="text-blue-600">Home</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            UniMate connects UAE university students with compatible roommates and affordable housing. Start your
            journey to finding the perfect living situation today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => router.push("/auth/signup")} className="text-lg px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/auth/login")} className="text-lg px-8">
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our compatibility algorithm matches you with roommates based on lifestyle, study habits, and
                preferences.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Home className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Verified Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Browse student-friendly apartments and rooms near your university with transparent pricing.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Real-Time Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect instantly with potential roommates through our built-in messaging system.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Student-Only</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Safe and secure platform exclusively for verified UAE university students.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground text-sm">
                Tell us about yourself, your university, budget, and lifestyle preferences.
              </p>
            </div>
            <div>
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Find Matches</h3>
              <p className="text-muted-foreground text-sm">
                Browse compatible roommates and housing options tailored to your needs.
              </p>
            </div>
            <div>
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Connect & Move In</h3>
              <p className="text-muted-foreground text-sm">
                Chat with matches, arrange viewings, and find your perfect home.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of students who have found their ideal living situation through UniMate.
          </p>
          <Button size="lg" variant="secondary" onClick={() => router.push("/auth/signup")} className="text-lg px-8">
            Sign Up Now
          </Button>
        </div>
      </div>
    </div>
  )
}
