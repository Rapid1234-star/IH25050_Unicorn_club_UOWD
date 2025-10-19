"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Calculator } from "lucide-react"

interface Roommate {
  id: string
  name: string
  roomSize: number
  hasPrivateBathroom: boolean
}

export function SplitRentCalculator() {
  const [totalRent, setTotalRent] = useState<number>(3000)
  const [utilities, setUtilities] = useState<number>(500)
  const [roommates, setRoommates] = useState<Roommate[]>([
    { id: "1", name: "Roommate 1", roomSize: 100, hasPrivateBathroom: false },
    { id: "2", name: "Roommate 2", roomSize: 100, hasPrivateBathroom: false },
  ])

  const addRoommate = () => {
    const newId = (roommates.length + 1).toString()
    setRoommates([...roommates, { id: newId, name: `Roommate ${newId}`, roomSize: 100, hasPrivateBathroom: false }])
  }

  const removeRoommate = (id: string) => {
    if (roommates.length > 1) {
      setRoommates(roommates.filter((r) => r.id !== id))
    }
  }

  const updateRoommate = (id: string, field: keyof Roommate, value: string | number | boolean) => {
    setRoommates(roommates.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const calculateSplit = () => {
    const totalRoomSize = roommates.reduce((sum, r) => sum + r.roomSize, 0)
    const privateBathroomCount = roommates.filter((r) => r.hasPrivateBathroom).length
    const sharedBathroomCount = roommates.length - privateBathroomCount

    // Allocate 70% of rent based on room size, 30% equally
    const rentBySize = totalRent * 0.7
    const rentEqual = totalRent * 0.3

    // Bathroom premium (10% of total rent split among private bathroom users)
    const bathroomPremium = privateBathroomCount > 0 ? totalRent * 0.1 : 0
    const bathroomPremiumPerPerson = privateBathroomCount > 0 ? bathroomPremium / privateBathroomCount : 0

    // Utilities split equally
    const utilitiesPerPerson = utilities / roommates.length

    return roommates.map((roommate) => {
      const roomSizeShare = (roommate.roomSize / totalRoomSize) * rentBySize
      const equalShare = rentEqual / roommates.length
      const bathroomCost = roommate.hasPrivateBathroom ? bathroomPremiumPerPerson : 0

      const rentShare = roomSizeShare + equalShare + bathroomCost
      const total = rentShare + utilitiesPerPerson

      return {
        ...roommate,
        rentShare: Math.round(rentShare),
        utilitiesShare: Math.round(utilitiesPerPerson),
        total: Math.round(total),
      }
    })
  }

  const results = calculateSplit()
  const totalCalculated = results.reduce((sum, r) => sum + r.total, 0)

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Costs</CardTitle>
            <CardDescription>Enter the total monthly costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totalRent">Total Monthly Rent (AED)</Label>
              <Input
                id="totalRent"
                type="number"
                value={totalRent}
                onChange={(e) => setTotalRent(Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="utilities">Total Utilities (AED)</Label>
              <Input
                id="utilities"
                type="number"
                value={utilities}
                onChange={(e) => setUtilities(Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Monthly Cost:</span>
                <span className="text-xl font-bold text-blue-600">{totalRent + utilities} AED</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Roommates</CardTitle>
                <CardDescription>Add roommates and their room details</CardDescription>
              </div>
              <Button size="sm" onClick={addRoommate}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {roommates.map((roommate, index) => (
              <Card key={roommate.id} className="border-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Input
                      placeholder="Name"
                      value={roommate.name}
                      onChange={(e) => updateRoommate(roommate.id, "name", e.target.value)}
                      className="max-w-[200px]"
                    />
                    {roommates.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeRoommate(roommate.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Room Size (sq ft)</Label>
                    <Input
                      type="number"
                      value={roommate.roomSize}
                      onChange={(e) => updateRoommate(roommate.id, "roomSize", Number(e.target.value))}
                      min={0}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`bathroom-${roommate.id}`}
                      checked={roommate.hasPrivateBathroom}
                      onChange={(e) => updateRoommate(roommate.id, "hasPrivateBathroom", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`bathroom-${roommate.id}`} className="text-sm font-normal cursor-pointer">
                      Has private bathroom
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Split Calculation
            </CardTitle>
            <CardDescription>Fair rent split based on room size and amenities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result) => (
              <Card key={result.id} className="border-2 border-blue-100">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{result.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {result.roomSize} sq ft
                        </Badge>
                        {result.hasPrivateBathroom && (
                          <Badge variant="outline" className="text-xs">
                            Private Bath
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{result.total} AED</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Rent Share:</span>
                      <span className="font-medium">{result.rentShare} AED</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Utilities Share:</span>
                      <span className="font-medium">{result.utilitiesShare} AED</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Calculated:</span>
                <span className="text-xl font-bold">{totalCalculated} AED</span>
              </div>
              {Math.abs(totalCalculated - (totalRent + utilities)) > 5 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Note: Small rounding differences may occur in the calculation
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• 70% of rent is split based on room size</p>
            <p>• 30% of rent is split equally among all roommates</p>
            <p>• Private bathrooms add a 10% premium to rent</p>
            <p>• Utilities are always split equally</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
