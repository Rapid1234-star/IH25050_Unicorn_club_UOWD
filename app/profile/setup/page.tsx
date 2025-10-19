"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function ProfileSetupPage() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [photoURL, setPhotoURL] = useState(user?.photoURL || "")
  const [age, setAge] = useState(user?.age?.toString() || "")
  const [gender, setGender] = useState(user?.gender || "")
  const [university, setUniversity] = useState(user?.university || "")
  const [budget, setBudget] = useState(user?.budget?.toString() || "")
  const [smoking, setSmoking] = useState(user?.preferences?.smoking || false)
  const [pets, setPets] = useState(user?.preferences?.pets || false)
  const [socialHabits, setSocialHabits] = useState(user?.preferences?.socialHabits || "")
  const [studyHabits, setStudyHabits] = useState(user?.preferences?.studyHabits || "")
  const [cleanliness, setCleanliness] = useState(user?.preferences?.cleanliness || "")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    // Convert to base64 for storage
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoURL(reader.result as string)
      setError("")
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setPhotoURL("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!age || !gender || !university || !budget || !socialHabits || !studyHabits || !cleanliness) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      await updateProfile({
        photoURL,
        age: Number.parseInt(age),
        gender,
        university,
        budget: Number.parseInt(budget),
        preferences: {
          smoking,
          pets,
          socialHabits: socialHabits as "introvert" | "extrovert" | "ambivert",
          studyHabits: studyHabits as "early-bird" | "night-owl" | "flexible",
          cleanliness: cleanliness as "very-clean" | "moderate" | "relaxed",
        },
      })
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 py-8">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>Help us find your perfect roommate match</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={photoURL || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  {photoURL && (
                    <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">Max size: 5MB. Formats: JPG, PNG, GIF</p>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="35"
                      placeholder="21"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={gender} onValueChange={setGender} required>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university">University *</Label>
                  <Select value={university} onValueChange={setUniversity} required>
                    <SelectTrigger id="university">
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UAE University">UAE University</SelectItem>
                      <SelectItem value="American University of Sharjah">American University of Sharjah</SelectItem>
                      <SelectItem value="Khalifa University">Khalifa University</SelectItem>
                      <SelectItem value="American University of Dubai">American University of Dubai</SelectItem>
                      <SelectItem value="Zayed University">Zayed University</SelectItem>
                      <SelectItem value="Higher Colleges of Technology">Higher Colleges of Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Budget (AED) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="1000"
                    max="10000"
                    step="100"
                    placeholder="3000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Lifestyle Preferences */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Lifestyle Preferences</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smoking">Smoking</Label>
                    <p className="text-sm text-muted-foreground">Do you smoke?</p>
                  </div>
                  <Switch id="smoking" checked={smoking} onCheckedChange={setSmoking} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pets">Pets</Label>
                    <p className="text-sm text-muted-foreground">Do you have or want pets?</p>
                  </div>
                  <Switch id="pets" checked={pets} onCheckedChange={setPets} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialHabits">Social Habits *</Label>
                  <Select value={socialHabits} onValueChange={setSocialHabits} required>
                    <SelectTrigger id="socialHabits">
                      <SelectValue placeholder="Select your social style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="introvert">Introvert - Prefer quiet time alone</SelectItem>
                      <SelectItem value="extrovert">Extrovert - Love socializing and guests</SelectItem>
                      <SelectItem value="ambivert">Ambivert - Balance of both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studyHabits">Study Habits *</Label>
                  <Select value={studyHabits} onValueChange={setStudyHabits} required>
                    <SelectTrigger id="studyHabits">
                      <SelectValue placeholder="Select your study schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early-bird">Early Bird - Study in the morning</SelectItem>
                      <SelectItem value="night-owl">Night Owl - Study late at night</SelectItem>
                      <SelectItem value="flexible">Flexible - Adapt to any schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cleanliness">Cleanliness Level *</Label>
                  <Select value={cleanliness} onValueChange={setCleanliness} required>
                    <SelectTrigger id="cleanliness">
                      <SelectValue placeholder="Select your cleanliness preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-clean">Very Clean - Everything organized</SelectItem>
                      <SelectItem value="moderate">Moderate - Tidy but lived-in</SelectItem>
                      <SelectItem value="relaxed">Relaxed - Comfortable with some mess</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => router.push("/dashboard")}
                >
                  Skip for Now
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Saving..." : "Complete Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
