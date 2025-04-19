"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  ChevronLeft,
  X,
  Check,
  CheckCheck,
  Clock,
  ArrowLeft,
  Download,
  Trash2,
  Star,
  StarOff,
  File,
  Mic,
  Play,
  MessageSquare,
  Bell,
  Calendar,
  Users,
  LinkIcon,
} from "lucide-react"

const Messaging = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.Auth.user)
  const [isLoading, setIsLoading] = useState(true)
  const [conversations, setConversations] = useState([])
  const [filteredConversations, setFilteredConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [filter, setFilter] = useState("all")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingInterval, setRecordingInterval] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const messageInputRef = useRef(null)
  const [showZoomModal, setShowZoomModal] = useState(false)
  const [zoomMeetingDetails, setZoomMeetingDetails] = useState({
    topic: "",
    start_time: "",
    duration: 30,
    agenda: "",
  })
  const [isSchedulingMeeting, setIsSchedulingMeeting] = useState(false)
  const [scheduledMeetings, setScheduledMeetings] = useState([])

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/messaging", message: "Please login to access messaging" } })
    } else {
      fetchConversations()
    }
  }, [user, navigate])

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Clean up recording interval
  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval)
      }
    }
  }, [recordingInterval])

  // Fetch conversations
  const fetchConversations = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call to fetch conversations
      // For this demo, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockConversations = generateMockConversations()
      setConversations(mockConversations)
      setFilteredConversations(mockConversations)

      // Select the first conversation by default
      if (mockConversations.length > 0) {
        handleSelectConversation(mockConversations[0])
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate mock conversations
  const generateMockConversations = () => {
    const otherRole = user.role === "freelancer" ? "client" : user.role === "client" ? "freelancer" : "admin"

    const names = [
      "Emma Thompson",
      "Michael Chen",
      "Sophia Rodriguez",
      "James Wilson",
      "Olivia Parker",
      "William Davis",
      "Ava Martinez",
      "Benjamin Taylor",
      "Isabella Johnson",
      "Ethan Brown",
    ]

    const projectTopics = [
      "Website Redesign",
      "Mobile App Development",
      "Logo Design",
      "Content Writing",
      "SEO Optimization",
      "Social Media Marketing",
      "E-commerce Platform",
      "UI/UX Design",
    ]

    return Array.from({ length: 10 }, (_, i) => {
      const name = names[Math.floor(Math.random() * names.length)]
      const topic = projectTopics[Math.floor(Math.random() * projectTopics.length)]
      const lastMessageTime = new Date()
      lastMessageTime.setMinutes(lastMessageTime.getMinutes() - Math.floor(Math.random() * 10000))

      const unreadCount = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0
      const isOnline = Math.random() > 0.6
      const isStarred = Math.random() > 0.8

      return {
        id: i + 1,
        name,
        role: otherRole,
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "women" : "men"}/${Math.floor(Math.random() * 100)}.jpg`,
        lastMessage: {
          text:
            Math.random() > 0.3
              ? `About the ${topic} project, I wanted to discuss...`
              : Math.random() > 0.5
                ? "Can we schedule a call to discuss the details?"
                : "I've sent you the files you requested.",
          time: lastMessageTime,
          isRead: unreadCount === 0,
          sender: Math.random() > 0.5 ? "them" : "you",
        },
        unreadCount,
        isOnline,
        isStarred,
        projectName: `${topic} Project`,
        projectId: Math.floor(Math.random() * 1000) + 1000,
      }
    })
  }

  // Generate mock messages for a conversation
  const generateMockMessages = (conversation) => {
    const messageCount = Math.floor(Math.random() * 15) + 10
    const messages = []

    // Add a system message at the beginning
    messages.push({
      id: "system-1",
      type: "system",
      text: `Conversation started for ${conversation.projectName}`,
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    })

    let currentTime = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // Start 3 days ago

    for (let i = 0; i < messageCount; i++) {
      const isUser = Math.random() > 0.5
      const messageType = Math.random() > 0.8 ? (Math.random() > 0.5 ? "image" : "file") : "text"

      // Add some time between messages
      currentTime = new Date(currentTime.getTime() + Math.floor(Math.random() * 1000 * 60 * 60 * 3))

      const message = {
        id: `msg-${i}`,
        sender: isUser ? "you" : "them",
        senderName: isUser ? user.name : conversation.name,
        senderAvatar: isUser ? user.avatar : conversation.avatar,
        time: currentTime,
        status: isUser ? (Math.random() > 0.3 ? "read" : "delivered") : null,
      }

      if (messageType === "text") {
        message.type = "text"
        message.text = isUser
          ? [
              "Hi there! How's the project coming along?",
              "I've been working on the designs you requested.",
              "Could you provide more details about the requirements?",
              "I think we should schedule a call to discuss this further.",
              "I'll have the first draft ready by tomorrow.",
              "What do you think about the latest changes?",
              "Let me know if you need anything else from me.",
            ][Math.floor(Math.random() * 7)]
          : [
              "Hello! The project is going well.",
              "I really like what you've done so far.",
              "Sure, I'll send you the additional information shortly.",
              "Yes, a call would be great. When are you available?",
              "Looking forward to seeing the draft!",
              "The changes look good, but I have a few suggestions.",
              "Thanks for your help with this project.",
            ][Math.floor(Math.random() * 7)]
      } else if (messageType === "image") {
        message.type = "image"
        message.text = isUser ? "Here's the image you requested." : "Check out this design concept."
        message.image = `https://picsum.photos/seed/${Math.random()}/${500 + Math.floor(Math.random() * 300)}/${400 + Math.floor(Math.random() * 200)}`
      } else {
        message.type = "file"
        message.text = isUser ? "I've attached the document with the specifications." : "Here's the file you asked for."
        message.fileName = [
          "Project_Brief.pdf",
          "Design_Mockup.psd",
          "Requirements.docx",
          "Contract.pdf",
          "Invoice.pdf",
        ][Math.floor(Math.random() * 5)]
        message.fileSize = `${Math.floor(Math.random() * 10) + 1}MB`
      }

      messages.push(message)
    }

    // Add the last message from the conversation
    const lastMessage = {
      id: "last-msg",
      sender: conversation.lastMessage.sender,
      senderName: conversation.lastMessage.sender === "you" ? user.name : conversation.name,
      senderAvatar: conversation.lastMessage.sender === "you" ? user.avatar : conversation.avatar,
      type: "text",
      text: conversation.lastMessage.text,
      time: conversation.lastMessage.time,
      status:
        conversation.lastMessage.sender === "you" ? (conversation.lastMessage.isRead ? "read" : "delivered") : null,
    }

    messages.push(lastMessage)

    return messages
  }

  // Handle selecting a conversation
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)

    // Mark conversation as read
    if (conversation.unreadCount > 0) {
      const updatedConversations = conversations.map((c) => {
        if (c.id === conversation.id) {
          return { ...c, unreadCount: 0, lastMessage: { ...c.lastMessage, isRead: true } }
        }
        return c
      })
      setConversations(updatedConversations)
      setFilteredConversations(
        filteredConversations.map((c) => {
          if (c.id === conversation.id) {
            return { ...c, unreadCount: 0, lastMessage: { ...c.lastMessage, isRead: true } }
          }
          return c
        }),
      )
    }

    // Generate mock messages for this conversation
    const mockMessages = generateMockMessages(conversation)
    setMessages(mockMessages)

    // Close user info panel on mobile
    if (window.innerWidth < 768) {
      setShowUserInfo(false)
    }
  }

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg = {
      id: `new-${Date.now()}`,
      sender: "you",
      senderName: user.name,
      senderAvatar: user.avatar,
      type: "text",
      text: newMessage,
      time: new Date(),
      status: "sent",
    }

    setMessages([...messages, newMsg])

    // Update conversation with new last message
    const updatedConversations = conversations.map((c) => {
      if (c.id === selectedConversation.id) {
        return {
          ...c,
          lastMessage: {
            text: newMessage,
            time: new Date(),
            isRead: false,
            sender: "you",
          },
        }
      }
      return c
    })

    setConversations(updatedConversations)
    setFilteredConversations(
      filteredConversations.map((c) => {
        if (c.id === selectedConversation.id) {
          return {
            ...c,
            lastMessage: {
              text: newMessage,
              time: new Date(),
              isRead: false,
              sender: "you",
            },
          }
        }
        return c
      }),
    )

    setNewMessage("")

    // Simulate message being delivered and read
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.id === newMsg.id) {
            return { ...msg, status: "delivered" }
          }
          return msg
        }),
      )
    }, 1000)

    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.id === newMsg.id) {
            return { ...msg, status: "read" }
          }
          return msg
        }),
      )
    }, 2000)
  }

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const isImage = file.type.startsWith("image/")

    const newMsg = {
      id: `new-${Date.now()}`,
      sender: "you",
      senderName: user.name,
      senderAvatar: user.avatar,
      type: isImage ? "image" : "file",
      text: isImage ? "Sent an image" : `Sent a file: ${file.name}`,
      time: new Date(),
      status: "sent",
    }

    if (isImage) {
      newMsg.image = URL.createObjectURL(file)
    } else {
      newMsg.fileName = file.name
      newMsg.fileSize = `${(file.size / (1024 * 1024)).toFixed(2)}MB`
    }

    setMessages([...messages, newMsg])

    // Update conversation with new last message
    const updatedConversations = conversations.map((c) => {
      if (c.id === selectedConversation.id) {
        return {
          ...c,
          lastMessage: {
            text: isImage ? "Sent an image" : `Sent a file: ${file.name}`,
            time: new Date(),
            isRead: false,
            sender: "you",
          },
        }
      }
      return c
    })

    setConversations(updatedConversations)
    setFilteredConversations(
      filteredConversations.map((c) => {
        if (c.id === selectedConversation.id) {
          return {
            ...c,
            lastMessage: {
              text: isImage ? "Sent an image" : `Sent a file: ${file.name}`,
              time: new Date(),
              isRead: false,
              sender: "you",
            },
          }
        }
        return c
      }),
    )

    setShowAttachmentOptions(false)

    // Simulate message being delivered and read
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.id === newMsg.id) {
            return { ...msg, status: "delivered" }
          }
          return msg
        }),
      )
    }, 1000)

    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.id === newMsg.id) {
            return { ...msg, status: "read" }
          }
          return msg
        }),
      )
    }, 2000)
  }

  // Handle voice recording
  const handleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      clearInterval(recordingInterval)
      setRecordingInterval(null)
      setIsRecording(false)

      // In a real app, you would process the audio recording here
      // For this demo, we'll just simulate sending a voice message

      const newMsg = {
        id: `new-${Date.now()}`,
        sender: "you",
        senderName: user.name,
        senderAvatar: user.avatar,
        type: "audio",
        text: "Sent a voice message",
        time: new Date(),
        status: "sent",
        audioDuration: `0:${recordingTime < 10 ? "0" + recordingTime : recordingTime}`,
      }

      setMessages([...messages, newMsg])

      // Update conversation with new last message
      const updatedConversations = conversations.map((c) => {
        if (c.id === selectedConversation.id) {
          return {
            ...c,
            lastMessage: {
              text: "Sent a voice message",
              time: new Date(),
              isRead: false,
              sender: "you",
            },
          }
        }
        return c
      })

      setConversations(updatedConversations)
      setFilteredConversations(
        filteredConversations.map((c) => {
          if (c.id === selectedConversation.id) {
            return {
              ...c,
              lastMessage: {
                text: "Sent a voice message",
                time: new Date(),
                isRead: false,
                sender: "you",
              },
            }
          }
          return c
        }),
      )

      setRecordingTime(0)
    } else {
      // Start recording
      setIsRecording(true)
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
      setRecordingInterval(interval)
    }
  }

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query === "") {
      setFilteredConversations(conversations)
    } else {
      const filtered = conversations.filter(
        (conversation) =>
          conversation.name.toLowerCase().includes(query) || conversation.projectName.toLowerCase().includes(query),
      )
      setFilteredConversations(filtered)
    }
  }

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)

    if (newFilter === "all") {
      setFilteredConversations(conversations)
    } else if (newFilter === "unread") {
      setFilteredConversations(conversations.filter((c) => c.unreadCount > 0))
    } else if (newFilter === "starred") {
      setFilteredConversations(conversations.filter((c) => c.isStarred))
    }
  }

  // Toggle star conversation
  const toggleStar = (conversation, e) => {
    e.stopPropagation()

    const updatedConversations = conversations.map((c) => {
      if (c.id === conversation.id) {
        return { ...c, isStarred: !c.isStarred }
      }
      return c
    })

    setConversations(updatedConversations)
    setFilteredConversations(
      filteredConversations.map((c) => {
        if (c.id === conversation.id) {
          return { ...c, isStarred: !c.isStarred }
        }
        return c
      }),
    )

    if (selectedConversation && selectedConversation.id === conversation.id) {
      setSelectedConversation({ ...selectedConversation, isStarred: !selectedConversation.isStarred })
    }
  }

  // Format time
  const formatMessageTime = (date) => {
    const now = new Date()
    const messageDate = new Date(date)

    // If today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // If yesterday, show "Yesterday"
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }

    // If this week, show day name
    const sixDaysAgo = new Date(now)
    sixDaysAgo.setDate(now.getDate() - 6)
    if (messageDate >= sixDaysAgo) {
      return messageDate.toLocaleDateString([], { weekday: "short" })
    }

    // Otherwise show date
    return messageDate.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  // Format conversation time
  const formatConversationTime = (date) => {
    const now = new Date()
    const messageDate = new Date(date)

    // If today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // If yesterday, show "Yesterday"
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }

    // If this week, show day name
    const sixDaysAgo = new Date(now)
    sixDaysAgo.setDate(now.getDate() - 6)
    if (messageDate >= sixDaysAgo) {
      return messageDate.toLocaleDateString([], { weekday: "short" })
    }

    // Otherwise show date
    return messageDate.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  // Get message status icon
  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <Clock size={14} className="text-gray-400" />
      case "delivered":
        return <Check size={14} className="text-gray-400" />
      case "read":
        return <CheckCheck size={14} className="text-[#9333EA]" />
      default:
        return null
    }
  }

  const handleScheduleZoomMeeting = async () => {
    if (!zoomMeetingDetails.topic || !zoomMeetingDetails.start_time) {
      return
    }

    setIsSchedulingMeeting(true)

    try {
      // In a real implementation, this would be an API call to your backend
      // which would then use the Zoom API to create a meeting
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

      // Mock response data
      const mockMeetingResponse = {
        id: Math.floor(Math.random() * 1000000000),
        topic: zoomMeetingDetails.topic,
        start_time: new Date(zoomMeetingDetails.start_time).toISOString(),
        duration: zoomMeetingDetails.duration,
        join_url: `https://zoom.us/j/${Math.floor(Math.random() * 10000000000)}`,
        password: Math.random().toString(36).substring(2, 8).toUpperCase(),
      }

      // Add to scheduled meetings
      setScheduledMeetings([...scheduledMeetings, mockMeetingResponse])

      // Send message with meeting details
      const newMsg = {
        id: `new-${Date.now()}`,
        sender: "you",
        senderName: user.name,
        senderAvatar: user.avatar,
        type: "zoom-meeting",
        text: "I've scheduled a Zoom meeting",
        time: new Date(),
        status: "sent",
        meeting: mockMeetingResponse,
      }

      setMessages([...messages, newMsg])

      // Update conversation with new last message
      const updatedConversations = conversations.map((c) => {
        if (c.id === selectedConversation.id) {
          return {
            ...c,
            lastMessage: {
              text: "Scheduled a Zoom meeting",
              time: new Date(),
              isRead: false,
              sender: "you",
            },
          }
        }
        return c
      })

      setConversations(updatedConversations)
      setFilteredConversations(
        filteredConversations.map((c) => {
          if (c.id === selectedConversation.id) {
            return {
              ...c,
              lastMessage: {
                text: "Scheduled a Zoom meeting",
                time: new Date(),
                isRead: false,
                sender: "you",
              },
            }
          }
          return c
        }),
      )

      // Close modal and reset form
      setShowZoomModal(false)
      setZoomMeetingDetails({
        topic: "",
        start_time: "",
        duration: 30,
        agenda: "",
      })

      // Simulate message being delivered and read
      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg.id === newMsg.id) {
              return { ...msg, status: "delivered" }
            }
            return msg
          }),
        )
      }, 1000)

      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg.id === newMsg.id) {
              return { ...msg, status: "read" }
            }
            return msg
          }),
        )
      }, 2000)
    } catch (error) {
      console.error("Failed to schedule Zoom meeting:", error)
    } finally {
      setIsSchedulingMeeting(false)
    }
  }

  // Add this function to format the meeting date
  const formatMeetingDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#9333EA] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#9333EA]/20 to-[#0a0a0f] border-b border-[#2d2d3a] py-4 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-4 p-2 rounded-full hover:bg-[#1e1e2d] transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold">Messages</h1>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-[#1e1e2d] transition-colors">
                  <Search size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-[#1e1e2d] transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div
            className={`w-full md:w-80 lg:w-96 border-r border-[#2d2d3a] flex flex-col ${selectedConversation && window.innerWidth < 768 ? "hidden" : ""}`}
          >
            {/* Search and Filter */}
            <div className="p-4 border-b border-[#2d2d3a]">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 bg-[#1e1e2d] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                />
              </div>

              <div className="flex mt-3 border-b border-[#2d2d3a]">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-3 py-2 text-sm font-medium ${filter === "all" ? "text-[#9333EA] border-b-2 border-[#9333EA]" : "text-gray-400 hover:text-white"}`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange("unread")}
                  className={`px-3 py-2 text-sm font-medium ${filter === "unread" ? "text-[#9333EA] border-b-2 border-[#9333EA]" : "text-gray-400 hover:text-white"}`}
                >
                  Unread
                </button>
                <button
                  onClick={() => handleFilterChange("starred")}
                  className={`px-3 py-2 text-sm font-medium ${filter === "starred" ? "text-[#9333EA] border-b-2 border-[#9333EA]" : "text-gray-400 hover:text-white"}`}
                >
                  Starred
                </button>
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <div className="bg-[#1e1e2d] p-4 rounded-full mb-4">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400">No conversations found</p>
                  <p className="text-xs text-gray-500 mt-1">Try a different search term or filter</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`flex items-center p-4 border-b border-[#2d2d3a] cursor-pointer hover:bg-[#1e1e2d] transition-colors ${
                      selectedConversation && selectedConversation.id === conversation.id ? "bg-[#1e1e2d]" : ""
                    }`}
                  >
                    <div className="relative mr-3">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img
                          src={conversation.avatar || "/placeholder.svg"}
                          alt={conversation.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#0a0a0f]"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conversation.name}</h3>
                        <div className="flex items-center">
                          <button
                            onClick={(e) => toggleStar(conversation, e)}
                            className="p-1 text-gray-400 hover:text-[#9333EA]"
                          >
                            {conversation.isStarred ? (
                              <Star size={14} className="text-[#9333EA] fill-[#9333EA]" />
                            ) : (
                              <StarOff size={14} />
                            )}
                          </button>
                          <span className="text-xs text-gray-400 ml-1">
                            {formatConversationTime(conversation.lastMessage.time)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p
                          className={`text-sm truncate ${conversation.unreadCount > 0 ? "text-white font-medium" : "text-gray-400"}`}
                        >
                          {conversation.lastMessage.sender === "you" && "You: "}
                          {conversation.lastMessage.text}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-[#9333EA] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{conversation.projectName}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div className={`flex-1 flex flex-col ${!selectedConversation && window.innerWidth < 768 ? "hidden" : ""}`}>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#2d2d3a] flex items-center justify-between">
                <div className="flex items-center">
                  {window.innerWidth < 768 && (
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="mr-2 p-2 rounded-full hover:bg-[#1e1e2d] transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  <div className="relative mr-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img
                        src={selectedConversation.avatar || "/placeholder.svg"}
                        alt={selectedConversation.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {selectedConversation.isOnline && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#0a0a0f]"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedConversation.name}</h3>
                    <p className="text-xs text-gray-400">
                      {selectedConversation.isOnline ? "Online" : "Offline"}
                      <span className="mx-1">•</span>
                      {selectedConversation.projectName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-[#1e1e2d] transition-colors">
                    <Phone size={18} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-[#1e1e2d] transition-colors">
                    <Video size={18} />
                  </button>
                  <button
                    onClick={() => setShowZoomModal(true)}
                    className="p-2 rounded-full hover:bg-[#1e1e2d] transition-colors"
                    title="Schedule Zoom Meeting"
                  >
                    <Calendar size={18} />
                  </button>
                  <button
                    onClick={() => setShowUserInfo(!showUserInfo)}
                    className={`p-2 rounded-full transition-colors ${showUserInfo ? "bg-[#1e1e2d]" : "hover:bg-[#1e1e2d]"}`}
                  >
                    <Info size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => {
                  // Check if we need to show date separator
                  const showDateSeparator =
                    index === 0 ||
                    new Date(message.time).toDateString() !== new Date(messages[index - 1].time).toDateString()

                  return (
                    <React.Fragment key={message.id}>
                      {showDateSeparator && (
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-[#1e1e2d] px-3 py-1 rounded-full text-xs text-gray-400">
                            {new Date(message.time).toLocaleDateString([], {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      )}

                      {message.type === "system" ? (
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-[#1e1e2d] px-3 py-1 rounded-full text-xs text-gray-400">
                            {message.text}
                          </div>
                        </div>
                      ) : (
                        <div className={`flex ${message.sender === "you" ? "justify-end" : "justify-start"}`}>
                          <div className={`flex max-w-[75%] ${message.sender === "you" ? "flex-row-reverse" : ""}`}>
                            {message.sender !== "you" && (
                              <div className="h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                                <img
                                  src={message.senderAvatar || "/placeholder.svg"}
                                  alt={message.senderName}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div
                                className={`rounded-lg p-3 ${
                                  message.sender === "you" ? "bg-[#9333EA] text-white" : "bg-[#1e1e2d] text-white"
                                }`}
                              >
                                {message.type === "text" && <p>{message.text}</p>}

                                {message.type === "image" && (
                                  <div className="space-y-2">
                                    <p>{message.text}</p>
                                    <div className="rounded-lg overflow-hidden">
                                      <img
                                        src={message.image || "/placeholder.svg"}
                                        alt="Shared image"
                                        className="max-w-full"
                                      />
                                    </div>
                                  </div>
                                )}

                                {message.type === "file" && (
                                  <div className="space-y-2">
                                    <p>{message.text}</p>
                                    <div className="bg-[#0a0a0f]/50 rounded-lg p-3 flex items-center">
                                      <div className="bg-[#2d2d3a] p-2 rounded-md mr-3">
                                        <File size={24} className="text-[#9333EA]" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{message.fileName}</p>
                                        <p className="text-xs text-gray-400">{message.fileSize}</p>
                                      </div>
                                      <button className="p-2 text-gray-400 hover:text-white">
                                        <Download size={18} />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {message.type === "audio" && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                      <button className="bg-[#0a0a0f]/30 p-2 rounded-full">
                                        <Play size={16} />
                                      </button>
                                      <div className="flex-1 h-1 bg-[#0a0a0f]/30 rounded-full">
                                        <div className="h-full w-0 bg-white rounded-full"></div>
                                      </div>
                                      <span className="text-xs">{message.audioDuration}</span>
                                    </div>
                                  </div>
                                )}

                                {message.type === "zoom-meeting" && (
                                  <div className="space-y-2">
                                    <p>{message.text}</p>
                                    <div className="bg-[#0a0a0f]/50 rounded-lg p-3">
                                      <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-blue-600 p-2 rounded-md">
                                          <Video size={20} className="text-white" />
                                        </div>
                                        <div>
                                          <p className="font-medium">{message.meeting.topic}</p>
                                          <p className="text-xs text-gray-400">Zoom Meeting</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 mt-3">
                                        <div className="flex items-center gap-2 text-sm">
                                          <Calendar size={14} className="text-gray-400" />
                                          <span>{formatMeetingDate(message.meeting.start_time)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <Clock size={14} className="text-gray-400" />
                                          <span>{message.meeting.duration} minutes</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <LinkIcon size={14} className="text-gray-400" />
                                          <a
                                            href={message.meeting.join_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#9333EA] hover:underline truncate"
                                          >
                                            {message.meeting.join_url}
                                          </a>
                                        </div>
                                        {message.meeting.password && (
                                          <div className="flex items-center gap-2 text-sm">
                                            <Users size={14} className="text-gray-400" />
                                            <span>
                                              Password: <span className="font-medium">{message.meeting.password}</span>
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="mt-3 pt-3 border-t border-[#2d2d3a] flex justify-end">
                                        <a
                                          href={message.meeting.join_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center gap-1"
                                        >
                                          <Video size={14} />
                                          Join Meeting
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div
                                className={`flex items-center mt-1 text-xs text-gray-400 ${message.sender === "you" ? "justify-end" : ""}`}
                              >
                                <span>{formatMessageTime(message.time)}</span>
                                {message.sender === "you" && message.status && (
                                  <span className="ml-1">{getMessageStatusIcon(message.status)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-[#2d2d3a]">
                {isRecording ? (
                  <div className="flex items-center justify-between bg-[#1e1e2d] p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-3"></div>
                      <span>Recording... {recordingTime}s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          clearInterval(recordingInterval)
                          setRecordingInterval(null)
                          setIsRecording(false)
                          setRecordingTime(0)
                        }}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <X size={18} />
                      </button>
                      <button onClick={handleVoiceRecording} className="bg-[#9333EA] text-white p-2 rounded-full">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                        className="p-2 rounded-full hover:bg-[#1e1e2d] transition-colors"
                      >
                        <Paperclip size={20} />
                      </button>
                      {showAttachmentOptions && (
                        <div className="absolute bottom-full left-0 mb-2 bg-[#1e1e2d] rounded-lg border border-[#2d2d3a] shadow-lg p-2">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-2 p-2 hover:bg-[#2d2d3a] rounded-md transition-colors"
                            >
                              <File size={16} />
                              <span>File</span>
                            </button>
                            <button
                              onClick={() => {
                                fileInputRef.current?.setAttribute("accept", "image/*")
                                fileInputRef.current?.click()
                              }}
                              className="flex items-center gap-2 p-2 hover:bg-[#2d2d3a] rounded-md transition-colors"
                            >
                              <Image size={16} />
                              <span>Image</span>
                            </button>
                          </div>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        placeholder="Type a message..."
                        ref={messageInputRef}
                        className="w-full px-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent pr-10"
                      />
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <Smile size={20} />
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute bottom-full right-0 mb-2 bg-[#1e1e2d] rounded-lg border border-[#2d2d3a] shadow-lg p-2">
                          <div className="grid grid-cols-8 gap-2">
                            {[
                              "😊",
                              "😂",
                              "❤️",
                              "👍",
                              "🎉",
                              "🔥",
                              "👏",
                              "😎",
                              "🤔",
                              "😢",
                              "😍",
                              "🙏",
                              "👌",
                              "🤣",
                              "😁",
                              "😉",
                            ].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  setNewMessage((prev) => prev + emoji)
                                  setShowEmojiPicker(false)
                                  messageInputRef.current?.focus()
                                }}
                                className="w-8 h-8 flex items-center justify-center hover:bg-[#2d2d3a] rounded-md transition-colors text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {newMessage.trim() ? (
                      <button onClick={handleSendMessage} className="bg-[#9333EA] text-white p-3 rounded-full">
                        <Send size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={handleVoiceRecording}
                        className="bg-[#1e1e2d] text-gray-400 hover:text-white p-3 rounded-full transition-colors"
                      >
                        <Mic size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#0a0a0f] p-4">
              <div className="text-center">
                <div className="bg-[#1e1e2d] p-6 rounded-full inline-block mb-4">
                  <MessageSquare size={32} className="text-[#9333EA]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Your Messages</h3>
                <p className="text-gray-400 max-w-md">Select a conversation from the list to start messaging</p>
              </div>
            </div>
          )}

          {/* User Info Panel */}
          {selectedConversation && showUserInfo && (
            <div className="w-80 border-l border-[#2d2d3a] flex flex-col">
              <div className="p-4 border-b border-[#2d2d3a] flex justify-between items-center">
                <h3 className="font-medium">Contact Info</h3>
                <button
                  onClick={() => setShowUserInfo(false)}
                  className="p-2 rounded-full hover:bg-[#1e1e2d] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 flex flex-col items-center border-b border-[#2d2d3a]">
                <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                  <img
                    src={selectedConversation.avatar || "/placeholder.svg"}
                    alt={selectedConversation.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold">{selectedConversation.name}</h3>
                <p className="text-sm text-gray-400 capitalize">{selectedConversation.role}</p>
                <div className="flex items-center mt-2">
                  <div
                    className={`h-2 w-2 rounded-full ${selectedConversation.isOnline ? "bg-green-500" : "bg-gray-500"} mr-2`}
                  ></div>
                  <span className="text-sm text-gray-400">{selectedConversation.isOnline ? "Online" : "Offline"}</span>
                </div>
              </div>

              <div className="p-4 border-b border-[#2d2d3a]">
                <h4 className="text-sm font-medium mb-3">Project Details</h4>
                <div className="bg-[#1e1e2d] p-3 rounded-lg">
                  <p className="text-sm font-medium">{selectedConversation.projectName}</p>
                  <p className="text-xs text-gray-400 mt-1">Project ID: #{selectedConversation.projectId}</p>
                  <div className="flex items-center mt-2">
                    <button className="text-xs text-[#9333EA] hover:underline">View Project</button>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b border-[#2d2d3a]">
                <h4 className="text-sm font-medium mb-3">Actions</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 p-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] rounded-md transition-colors">
                    <Search size={16} />
                    <span className="text-sm">Search in Conversation</span>
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] rounded-md transition-colors">
                    <Bell size={16} />
                    <span className="text-sm">Mute Notifications</span>
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] rounded-md transition-colors">
                    <Download size={16} />
                    <span className="text-sm">Export Chat</span>
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-md transition-colors">
                    <Trash2 size={16} />
                    <span className="text-sm">Delete Conversation</span>
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-sm font-medium mb-3">Shared Media</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-md overflow-hidden bg-[#1e1e2d]">
                      <img
                        src={`https://picsum.photos/seed/${i + 100}/100/100`}
                        alt="Shared media"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <button className="w-full text-center text-xs text-[#9333EA] hover:underline mt-2">View All</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Zoom Meeting Modal */}
      {showZoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e2d] rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-[#2d2d3a] flex justify-between items-center">
              <h3 className="font-medium flex items-center gap-2">
                <Calendar size={18} className="text-[#9333EA]" />
                Schedule Zoom Meeting
              </h3>
              <button
                onClick={() => setShowZoomModal(false)}
                className="p-2 rounded-full hover:bg-[#0a0a0f]/30 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="meeting-topic" className="block text-sm font-medium mb-1">
                  Meeting Topic
                </label>
                <input
                  id="meeting-topic"
                  type="text"
                  value={zoomMeetingDetails.topic}
                  onChange={(e) => setZoomMeetingDetails({ ...zoomMeetingDetails, topic: e.target.value })}
                  placeholder="Enter meeting topic"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="meeting-time" className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  id="meeting-time"
                  type="datetime-local"
                  value={zoomMeetingDetails.start_time}
                  onChange={(e) => setZoomMeetingDetails({ ...zoomMeetingDetails, start_time: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="meeting-duration" className="block text-sm font-medium mb-1">
                  Duration (minutes)
                </label>
                <select
                  id="meeting-duration"
                  value={zoomMeetingDetails.duration}
                  onChange={(e) => setZoomMeetingDetails({ ...zoomMeetingDetails, duration: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <div>
                <label htmlFor="meeting-agenda" className="block text-sm font-medium mb-1">
                  Agenda (optional)
                </label>
                <textarea
                  id="meeting-agenda"
                  value={zoomMeetingDetails.agenda}
                  onChange={(e) => setZoomMeetingDetails({ ...zoomMeetingDetails, agenda: e.target.value })}
                  placeholder="Enter meeting agenda"
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-4 border-t border-[#2d2d3a] flex justify-end">
              <button onClick={() => setShowZoomModal(false)} className="px-4 py-2 text-gray-400 hover:text-white mr-2">
                Cancel
              </button>
              <button
                onClick={handleScheduleZoomMeeting}
                disabled={isSchedulingMeeting || !zoomMeetingDetails.topic || !zoomMeetingDetails.start_time}
                className={`px-4 py-2 bg-[#9333EA] text-white rounded-md flex items-center gap-2 ${
                  isSchedulingMeeting || !zoomMeetingDetails.topic || !zoomMeetingDetails.start_time
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#7928CA]"
                }`}
              >
                {isSchedulingMeeting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar size={16} />
                    Schedule Meeting
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Messaging
