"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { chatService, type Chat, type Message } from "@/lib/chat"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageSquare, Paperclip, FileText, Download } from "lucide-react"
import { formatDistanceToNow } from "@/lib/date-fns"

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatIdFromUrl = searchParams.get("chatId")

  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  // Load user's chats
  useEffect(() => {
    if (user) {
      const userChats = chatService.getUserChats(user.id)
      setChats(userChats)

      // If chatId in URL, select that chat
      if (chatIdFromUrl) {
        const chat = userChats.find((c) => c.id === chatIdFromUrl)
        if (chat) {
          setSelectedChat(chat)
        }
      }
    }
  }, [user, chatIdFromUrl])

  // Load messages for selected chat and mark as read
  useEffect(() => {
    if (selectedChat && user) {
      const chatMessages = chatService.getChatMessages(selectedChat.id)
      setMessages(chatMessages)

      // Mark messages as read
      chatService.markMessagesAsRead(selectedChat.id, user.id)

      // Update chats list to reflect read status
      const updatedChats = chatService.getUserChats(user.id)
      setChats(updatedChats)
    }
  }, [selectedChat, user])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Poll for new messages (simulating real-time)
  useEffect(() => {
    if (!selectedChat || !user) return

    const interval = setInterval(() => {
      const chatMessages = chatService.getChatMessages(selectedChat.id)
      setMessages(chatMessages)

      // Mark new messages as read
      chatService.markMessagesAsRead(selectedChat.id, user.id)

      // Update chats list
      const updatedChats = chatService.getUserChats(user.id)
      setChats(updatedChats)
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(interval)
  }, [selectedChat, user])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedChat || !user) return

    chatService.sendMessage(selectedChat.id, user.id, user.name, messageText, user.photoURL)
    setMessageText("")

    // Immediately update messages
    const updatedMessages = chatService.getChatMessages(selectedChat.id)
    setMessages(updatedMessages)

    // Update chats list
    const updatedChats = chatService.getUserChats(user.id)
    setChats(updatedChats)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedChat || !user) return

    // Convert file to base64 for demo purposes
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      const fileType = file.type.startsWith("image/") ? "image" : file.type === "application/pdf" ? "pdf" : "other"

      chatService.sendMessage(selectedChat.id, user.id, user.name, "", user.photoURL, base64String, fileType, file.name)

      // Immediately update messages
      const updatedMessages = chatService.getChatMessages(selectedChat.id)
      setMessages(updatedMessages)

      // Update chats list
      const updatedChats = chatService.getUserChats(user.id)
      setChats(updatedChats)
    }
    reader.readAsDataURL(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getOtherParticipant = (chat: Chat) => {
    if (!user) return null
    const otherIndex = chat.participants.findIndex((p) => p !== user.id)
    return {
      name: chat.participantNames[otherIndex],
      photo: chat.participantPhotos[otherIndex],
    }
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Chat with potential roommates in real-time</p>
        </div>

        <Card className="h-[calc(100vh-250px)]">
          <CardContent className="p-0 h-full">
            <div className="grid lg:grid-cols-3 h-full">
              {/* Chat List */}
              <div className="border-r">
                <div className="p-4 border-b">
                  <h2 className="font-semibold">Conversations</h2>
                </div>
                <ScrollArea className="h-[calc(100%-60px)]">
                  {chats.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">No conversations yet</p>
                      <Button size="sm" onClick={() => router.push("/roommates")}>
                        Find Roommates
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {chats.map((chat) => {
                        const other = getOtherParticipant(chat)
                        if (!other) return null
                        const unreadCount = chat.unreadCount?.[user.id] || 0

                        return (
                          <div
                            key={chat.id}
                            className={`p-4 cursor-pointer hover:bg-muted transition-colors ${selectedChat?.id === chat.id ? "bg-muted" : ""}`}
                            onClick={() => setSelectedChat(chat)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <Avatar>
                                  <AvatarImage src={other.photo || "/placeholder.svg"} alt={other.name} />
                                  <AvatarFallback>{other.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {unreadCount > 0 && (
                                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-semibold">{unreadCount}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="font-semibold text-sm truncate">{other.name}</p>
                                  {chat.lastMessageTime && (
                                    <span className="text-xs text-muted-foreground">
                                      {formatDistanceToNow(new Date(chat.lastMessageTime), { addSuffix: true })}
                                    </span>
                                  )}
                                </div>
                                {chat.lastMessage && (
                                  <p
                                    className={`text-sm truncate ${unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                                  >
                                    {chat.lastMessage}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Chat Messages */}
              <div className="lg:col-span-2 flex flex-col">
                {selectedChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={getOtherParticipant(selectedChat)?.photo || "/placeholder.svg"}
                          alt={getOtherParticipant(selectedChat)?.name}
                        />
                        <AvatarFallback>{getOtherParticipant(selectedChat)?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{getOtherParticipant(selectedChat)?.name}</p>
                        <p className="text-xs text-muted-foreground">Active now</p>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                          </div>
                        ) : (
                          messages.map((message) => {
                            const isOwn = message.senderId === user.id

                            return (
                              <div key={message.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={message.senderPhoto || "/placeholder.svg"}
                                    alt={message.senderName}
                                  />
                                  <AvatarFallback className="text-xs">{message.senderName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[70%]`}>
                                  <div
                                    className={`rounded-lg px-4 py-2 ${isOwn ? "bg-blue-600 text-white" : "bg-muted"}`}
                                  >
                                    {message.attachmentUrl ? (
                                      <div className="space-y-2">
                                        {message.attachmentType === "image" ? (
                                          <img
                                            src={message.attachmentUrl || "/placeholder.svg"}
                                            alt={message.attachmentName || "Attachment"}
                                            className="max-w-full rounded"
                                          />
                                        ) : (
                                          <div className="flex items-center gap-2 p-2 bg-background/10 rounded">
                                            {message.attachmentType === "pdf" ? (
                                              <FileText className="h-8 w-8" />
                                            ) : (
                                              <Download className="h-8 w-8" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium truncate">
                                                {message.attachmentName || "File"}
                                              </p>
                                              <p className="text-xs opacity-75">
                                                {message.attachmentType?.toUpperCase() || "FILE"}
                                              </p>
                                            </div>
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              className="shrink-0"
                                              onClick={() => {
                                                const link = document.createElement("a")
                                                link.href = message.attachmentUrl!
                                                link.download = message.attachmentName || "file"
                                                link.click()
                                              }}
                                            >
                                              <Download className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        )}
                                        {message.text && <p className="text-sm">{message.text}</p>}
                                      </div>
                                    ) : (
                                      <p className="text-sm">{message.text}</p>
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground mt-1">
                                    {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                                  </span>
                                </div>
                              </div>
                            )
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-4 border-t">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!messageText.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Select a conversation to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
