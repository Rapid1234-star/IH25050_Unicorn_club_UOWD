// Events management system using localStorage
// Simulates event creation, RSVP, and management

export interface Event {
  id: string
  title: string
  description: string
  date: string // ISO date string
  time: string
  location: string
  banner?: string
  certified: boolean
  createdBy: string
  organizerName: string
  timestamp: string
  attendees: string[] // Array of user IDs who RSVP'd
}

const EVENTS_KEY = "unimate_events"

// Initialize with dummy events
const initializeDummyEvents = () => {
  if (typeof window === "undefined") return

  const existingEvents = localStorage.getItem(EVENTS_KEY)
  if (!existingEvents) {
    const dummyEvents: Event[] = [
      {
        id: "1",
        title: "Welcome Orientation 2025",
        description:
          "Join us for an exciting welcome orientation for new students! Meet fellow students, learn about campus resources, and get ready for an amazing academic year. This event includes campus tours, information sessions, and networking opportunities.",
        date: "2025-11-01",
        time: "18:00",
        location: "University Campus, Dubai - Main Auditorium",
        banner: "/university-orientation-event.jpg",
        certified: false,
        createdBy: "admin",
        organizerName: "Student Affairs Office",
        timestamp: new Date().toISOString(),
        attendees: ["1", "2"],
      },
      {
        id: "2",
        title: "Web Development Workshop",
        description:
          "Learn modern web development with React and Next.js in this hands-on workshop. Perfect for beginners and intermediate developers. You'll build a complete web application from scratch and receive a certificate of completion.",
        date: "2025-11-05",
        time: "14:00",
        location: "American University of Sharjah - Computer Lab B",
        banner: "/coding-workshop-students.jpg",
        certified: true,
        createdBy: "admin",
        organizerName: "Tech Club AUS",
        timestamp: new Date().toISOString(),
        attendees: ["1", "3", "4"],
      },
      {
        id: "3",
        title: "Career Fair 2025",
        description:
          "Connect with top employers in the UAE! This career fair features companies from various industries looking to hire talented students and recent graduates. Bring your resume and dress professionally.",
        date: "2025-11-10",
        time: "10:00",
        location: "Khalifa University - Exhibition Hall",
        banner: "/career-fair-professional.jpg",
        certified: false,
        createdBy: "admin",
        organizerName: "Career Services",
        timestamp: new Date().toISOString(),
        attendees: ["2", "3"],
      },
      {
        id: "4",
        title: "AI & Machine Learning Bootcamp",
        description:
          "Intensive 3-day bootcamp covering fundamentals of AI and Machine Learning. Learn Python, TensorFlow, and build real-world ML models. Certificate provided upon completion. Limited seats available!",
        date: "2025-11-15",
        time: "09:00",
        location: "UAE University - Innovation Center",
        banner: "/artificial-intelligence-technology.png",
        certified: true,
        createdBy: "admin",
        organizerName: "AI Research Lab",
        timestamp: new Date().toISOString(),
        attendees: ["1"],
      },
      {
        id: "5",
        title: "Student Housing Meetup",
        description:
          "Meet potential roommates and learn about housing options near campus. Share experiences, tips, and connect with students looking for accommodation. Refreshments will be provided.",
        date: "2025-11-20",
        time: "17:00",
        location: "Dubai Knowledge Park - Community Center",
        banner: "/students-meeting-community.jpg",
        certified: false,
        createdBy: "admin",
        organizerName: "UniMate Team",
        timestamp: new Date().toISOString(),
        attendees: ["2", "4"],
      },
      {
        id: "6",
        title: "Entrepreneurship Summit",
        description:
          "Learn from successful entrepreneurs and startup founders. Pitch your ideas, network with investors, and discover resources for launching your own business. Certified attendance for all participants.",
        date: "2025-11-25",
        time: "13:00",
        location: "Sharjah - Innovation Hub",
        banner: "/business-entrepreneurship-summit.jpg",
        certified: true,
        createdBy: "admin",
        organizerName: "Entrepreneurship Center",
        timestamp: new Date().toISOString(),
        attendees: ["1", "3"],
      },
    ]
    localStorage.setItem(EVENTS_KEY, JSON.stringify(dummyEvents))
  }
}

export const eventsService = {
  // Get all events
  getAllEvents: (): Event[] => {
    if (typeof window === "undefined") return []
    initializeDummyEvents()
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]")
  },

  // Get event by ID
  getEventById: (eventId: string): Event | null => {
    if (typeof window === "undefined") return null
    const events = eventsService.getAllEvents()
    return events.find((e) => e.id === eventId) || null
  },

  // Create new event
  createEvent: (eventData: Omit<Event, "id" | "timestamp" | "attendees">): Event => {
    const events = eventsService.getAllEvents()
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      attendees: [],
    }
    events.push(newEvent)
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
    return newEvent
  },

  // Update event
  updateEvent: (eventId: string, updates: Partial<Event>): Event | null => {
    const events = eventsService.getAllEvents()
    const eventIndex = events.findIndex((e) => e.id === eventId)

    if (eventIndex === -1) return null

    events[eventIndex] = { ...events[eventIndex], ...updates }
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
    return events[eventIndex]
  },

  // Delete event
  deleteEvent: (eventId: string): void => {
    const events = eventsService.getAllEvents()
    const filtered = events.filter((e) => e.id !== eventId)
    localStorage.setItem(EVENTS_KEY, JSON.stringify(filtered))
  },

  // RSVP to event
  rsvpToEvent: (eventId: string, userId: string): boolean => {
    const events = eventsService.getAllEvents()
    const eventIndex = events.findIndex((e) => e.id === eventId)

    if (eventIndex === -1) return false

    if (!events[eventIndex].attendees.includes(userId)) {
      events[eventIndex].attendees.push(userId)
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
      return true
    }
    return false
  },

  // Cancel RSVP
  cancelRsvp: (eventId: string, userId: string): boolean => {
    const events = eventsService.getAllEvents()
    const eventIndex = events.findIndex((e) => e.id === eventId)

    if (eventIndex === -1) return false

    events[eventIndex].attendees = events[eventIndex].attendees.filter((id) => id !== userId)
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
    return true
  },

  // Check if user has RSVP'd
  hasUserRsvpd: (eventId: string, userId: string): boolean => {
    const event = eventsService.getEventById(eventId)
    return event ? event.attendees.includes(userId) : false
  },

  // Get user's RSVP'd events
  getUserEvents: (userId: string): Event[] => {
    const events = eventsService.getAllEvents()
    return events.filter((e) => e.attendees.includes(userId))
  },

  // Get upcoming events (sorted by date)
  getUpcomingEvents: (): Event[] => {
    const events = eventsService.getAllEvents()
    const now = new Date()
    return events
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  },
}
