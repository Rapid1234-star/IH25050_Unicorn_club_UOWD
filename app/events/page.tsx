"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { eventsService, type Event } from "@/lib/events"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, MapPin, Users, Award, Search, Plus, Clock, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

export default function EventsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    banner: "",
    certified: false,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const allEvents = eventsService.getUpcomingEvents()
      setEvents(allEvents)
      setFilteredEvents(allEvents)
    }
  }, [user])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.organizerName.toLowerCase().includes(query),
      )
      setFilteredEvents(filtered)
    }
  }, [searchQuery, events])

  const handleRsvp = (eventId: string) => {
    if (!user) return

    const hasRsvpd = eventsService.hasUserRsvpd(eventId, user.id)

    if (hasRsvpd) {
      eventsService.cancelRsvp(eventId, user.id)
      toast({
        title: "RSVP Cancelled",
        description: "You have cancelled your RSVP for this event",
      })
    } else {
      eventsService.rsvpToEvent(eventId, user.id)
      toast({
        title: "RSVP Confirmed!",
        description: "You have successfully RSVP'd to this event",
      })
    }

    const allEvents = eventsService.getUpcomingEvents()
    setEvents(allEvents)
    setFilteredEvents(allEvents)

    if (selectedEvent?.id === eventId) {
      const updatedEvent = eventsService.getEventById(eventId)
      setSelectedEvent(updatedEvent)
    }
  }

  const openEventDetails = (event: Event) => {
    setSelectedEvent(event)
    setDetailsOpen(true)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  const handleCreateEvent = () => {
    if (!user) return

    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.time || !newEvent.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const createdEvent = eventsService.createEvent({
      ...newEvent,
      createdBy: user.id,
      organizerName: user.name,
      certified: newEvent.certified,
    })

    toast({
      title: "Event Created!",
      description: "Your event has been successfully created",
    })

    const allEvents = eventsService.getUpcomingEvents()
    setEvents(allEvents)
    setFilteredEvents(allEvents)

    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      banner: "",
      certified: false,
    })
    setCreateDialogOpen(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setNewEvent({ ...newEvent, banner: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">University Events</h1>
            <p className="text-muted-foreground">Discover and join exciting events on campus</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events by name, location, or organizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search" : "Check back later for upcoming events"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const hasRsvpd = user ? eventsService.hasUserRsvpd(event.id, user.id) : false

              return (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div onClick={() => openEventDetails(event)}>
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                      <img
                        src={event.banner || "/placeholder.svg?height=200&width=400"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.certified && (
                        <Badge className="absolute top-3 right-3 bg-yellow-500 hover:bg-yellow-600">
                          <Award className="h-3 w-3 mr-1" />
                          Certified
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees.length} attending</span>
                      </div>
                    </CardContent>
                  </div>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={hasRsvpd ? "outline" : "default"}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRsvp(event.id)
                      }}
                    >
                      {hasRsvpd ? "Cancel RSVP" : "RSVP / Join Event"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Event Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <div className="relative h-64 -mx-6 -mt-6 mb-4">
                <img
                  src={selectedEvent.banner || "/placeholder.svg?height=300&width=600"}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                {selectedEvent.certified && (
                  <Badge className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600">
                    <Award className="h-4 w-4 mr-1" />
                    Certificate Provided
                  </Badge>
                )}
              </div>

              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
                <DialogDescription className="text-base">{selectedEvent.organizerName}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Event Details</h3>
                  <p className="text-muted-foreground">{selectedEvent.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">{formatDate(selectedEvent.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-sm text-muted-foreground">{selectedEvent.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Attendees</p>
                        <p className="text-sm text-muted-foreground">{selectedEvent.attendees.length} students</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  variant={user && eventsService.hasUserRsvpd(selectedEvent.id, user.id) ? "outline" : "default"}
                  onClick={() => {
                    handleRsvp(selectedEvent.id)
                    setDetailsOpen(false)
                  }}
                >
                  {user && eventsService.hasUserRsvpd(selectedEvent.id, user.id) ? "Cancel RSVP" : "RSVP / Join Event"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Fill in the details to create a new university event</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Name *</Label>
              <Input
                id="title"
                placeholder="e.g., Welcome Orientation 2025"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your event..."
                rows={4}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., University Campus, Dubai - Main Auditorium"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="banner">Event Banner (Optional)</Label>
              <Input id="banner" type="file" accept="image/*" onChange={handleImageUpload} className="cursor-pointer" />
              {newEvent.banner && (
                <div className="mt-2 relative">
                  <img
                    src={newEvent.banner || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setNewEvent({ ...newEvent, banner: "" })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="certified">Provide Certificate</Label>
                <p className="text-sm text-muted-foreground">Will attendees receive a certificate?</p>
              </div>
              <Switch
                id="certified"
                checked={newEvent.certified}
                onCheckedChange={(checked) => setNewEvent({ ...newEvent, certified: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleCreateEvent} className="flex-1">
                Create Event
              </Button>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
