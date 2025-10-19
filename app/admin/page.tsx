"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { authService, type UserProfile } from "@/lib/auth"
import { listingsService, type Listing } from "@/lib/listings"
import { reportsService, type Report } from "@/lib/reports"
import { eventsService, type Event } from "@/lib/events"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Users,
  Home,
  MessageSquare,
  TrendingUp,
  Trash2,
  CheckCircle,
  XCircle,
  Flag,
  Check,
  X,
  Calendar,
} from "lucide-react"
import { VerifiedBadge } from "@/components/verified-badge"
import { toast } from "@/hooks/use-toast"

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [allUsers, setAllUsers] = useState<UserProfile[]>([])
  const [allListings, setAllListings] = useState<Listing[]>([])
  const [allReports, setAllReports] = useState<Report[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: "user" | "listing" | "event"; id: string } | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const users = authService.getAllUsers()
      setAllUsers(users)

      const listings = listingsService.getAllListings()
      setAllListings(listings)

      const reports = reportsService.getAllReports()
      setAllReports(reports)

      const events = eventsService.getAllEvents()
      setAllEvents(events)
    }
  }, [user])

  const handleDeleteUser = (userId: string) => {
    setItemToDelete({ type: "user", id: userId })
    setDeleteDialogOpen(true)
  }

  const handleDeleteListing = (listingId: string) => {
    setItemToDelete({ type: "listing", id: listingId })
    setDeleteDialogOpen(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    setItemToDelete({ type: "event", id: eventId })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return

    if (itemToDelete.type === "user") {
      authService.deleteUser(itemToDelete.id)
      setAllUsers(authService.getAllUsers())
    } else if (itemToDelete.type === "listing") {
      listingsService.deleteListing(itemToDelete.id)
      setAllListings(listingsService.getAllListings())
    } else if (itemToDelete.type === "event") {
      eventsService.deleteEvent(itemToDelete.id)
      setAllEvents(eventsService.getAllEvents())
    }

    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleToggleVerification = (userId: string, currentStatus: boolean) => {
    if (currentStatus) {
      authService.unverifyUser(userId)
    } else {
      authService.verifyUser(userId)
    }
    setAllUsers(authService.getAllUsers())
    toast({
      title: currentStatus ? "User unverified" : "User verified",
      description: currentStatus ? "User verification has been removed" : "User has been verified successfully",
    })
  }

  const handleResolveReport = (reportId: string, status: "resolved" | "dismissed") => {
    if (!user) return
    reportsService.resolveReport(reportId, user.id, status)
    setAllReports(reportsService.getAllReports())
    toast({
      title: status === "resolved" ? "Report resolved" : "Report dismissed",
      description: `The report has been ${status}`,
    })
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

  const verifiedUsers = allUsers.filter((u) => u.verified)
  const unverifiedUsers = allUsers.filter((u) => !u.verified)
  const pendingReports = allReports.filter((r) => r.status === "pending")
  const upcomingEvents = allEvents.filter((e) => new Date(e.date) >= new Date())

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, listings, and platform activity</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-3xl font-bold">{allUsers.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                <span className="text-3xl font-bold">{allListings.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-3xl font-bold">{allEvents.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-3xl font-bold">{verifiedUsers.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-red-600" />
                <span className="text-3xl font-bold">{pendingReports.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="listings">Listing Management</TabsTrigger>
            <TabsTrigger value="events">Event Management</TabsTrigger>
            <TabsTrigger value="reports">
              Reports
              {pendingReports.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                  {pendingReports.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>Manage and verify student profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{user.name}</p>
                                {user.verified && <VerifiedBadge size="sm" />}
                              </div>
                              <p className="text-xs text-muted-foreground">{user.age && `${user.age} years old`}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.university || "Not set"}</TableCell>
                        <TableCell>
                          {user.preferences ? (
                            <Badge variant="default" className="bg-green-600">
                              Complete
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Incomplete</Badge>
                          )}
                        </TableCell>
                        <TableCell>{user.budget ? `${user.budget} AED` : "Not set"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleVerification(user.id, user.verified || false)}
                              className={
                                user.verified
                                  ? "text-yellow-600 hover:text-yellow-700"
                                  : "text-green-600 hover:text-green-700"
                              }
                            >
                              {user.verified ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Listings</CardTitle>
                <CardDescription>Review and manage housing listings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={listing.images[0] || "/placeholder.svg?height=40&width=60"}
                              alt={listing.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium line-clamp-1">{listing.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {listing.bedrooms} bed • {listing.bathrooms} bath
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{listing.location.city}</p>
                            <p className="text-xs text-muted-foreground">{listing.location.neighborhood}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{listing.price} AED</TableCell>
                        <TableCell>{listing.ownerName}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteListing(listing.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Event Management</CardTitle>
                    <CardDescription>Review and manage university events</CardDescription>
                  </div>
                  <Button onClick={() => router.push("/events/create")}>Create Event</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={event.banner || "/placeholder.svg?height=40&width=60"}
                              alt={event.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium line-clamp-1">{event.title}</p>
                              {event.certified && (
                                <Badge variant="secondary" className="mt-1">
                                  Certified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">{event.time}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="line-clamp-2 text-sm">{event.location}</p>
                        </TableCell>
                        <TableCell>{event.organizerName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{event.attendees.length}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(event.date) >= new Date() ? (
                            <Badge className="bg-green-600">Upcoming</Badge>
                          ) : (
                            <Badge variant="secondary">Past</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Reports</CardTitle>
                <CardDescription>Review and moderate reported content</CardDescription>
              </CardHeader>
              <CardContent>
                {allReports.length === 0 ? (
                  <div className="text-center py-12">
                    <Flag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No reports submitted yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.reporterName}</TableCell>
                          <TableCell>{report.targetName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {report.targetType.charAt(0).toUpperCase() + report.targetType.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{report.reason}</p>
                              {report.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">{report.description}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {report.status === "pending" && <Badge variant="secondary">Pending</Badge>}
                            {report.status === "resolved" && <Badge className="bg-green-600">Resolved</Badge>}
                            {report.status === "dismissed" && <Badge variant="outline">Dismissed</Badge>}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(report.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {report.status === "pending" && (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResolveReport(report.id, "resolved")}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResolveReport(report.id, "dismissed")}
                                  className="text-gray-600 hover:text-gray-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Platform activity and user interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">New user registration</p>
                      <p className="text-sm text-muted-foreground">Demo User joined the platform</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <Home className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">New listing added</p>
                      <p className="text-sm text-muted-foreground">Modern 2BR Apartment near UAE University</p>
                      <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Chat initiated</p>
                      <p className="text-sm text-muted-foreground">Ahmed and Fatima started a conversation</p>
                      <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Profile completed</p>
                      <p className="text-sm text-muted-foreground">Sara Mohammed completed their profile</p>
                      <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {itemToDelete?.type === "user" ? "user profile" : itemToDelete?.type === "listing" ? "listing" : "event"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
