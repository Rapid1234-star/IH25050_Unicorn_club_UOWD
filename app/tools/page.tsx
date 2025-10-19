"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Map } from "lucide-react"
import { SplitRentCalculator } from "@/components/split-rent-calculator"
import { HeatMap } from "@/components/heat-map"

export default function ToolsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
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

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Tools</h1>
          <p className="text-muted-foreground">Helpful tools for managing your student housing</p>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="calculator">
              <Calculator className="h-4 w-4 mr-2" />
              Rent Calculator
            </TabsTrigger>
            <TabsTrigger value="heatmap">
              <Map className="h-4 w-4 mr-2" />
              Heat Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="mt-6">
            <SplitRentCalculator />
          </TabsContent>

          <TabsContent value="heatmap" className="mt-6">
            <HeatMap />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
