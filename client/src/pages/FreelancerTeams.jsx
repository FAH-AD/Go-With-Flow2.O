"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  FileText,
  Upload,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  User,
} from "lucide-react"
import Navbar from "../components/Navbar"

const MyTeams = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.Auth.user)
  const [teams, setTeams] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [expandedMilestones, setExpandedMilestones] = useState({})

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: "/freelancer/my-teams", message: "Please login to view your teams" },
      })
    } else if (user.role !== "freelancer") {
      navigate("/", { state: { message: "Only freelancers can access this page" } })
    } else {
      fetchTeams()
    }
  }, [user, navigate])

  const fetchTeams = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // This would be the actual API call in a real application
      // For now, we'll use dummy data
      const dummyTeams = [
        {
          _id: "team1",
          job: {
            _id: "job1",
            title: "E-commerce Website Redesign",
            description: "Complete redesign of an e-commerce platform with modern UI/UX",
            client: {
              _id: "client1",
              name: "Tech Solutions Inc.",
              profilePic:
                "https://res.cloudinary.com/dxmeatsae/image/upload/v1745772539/client_verification_docs/mhpbkpi3vnkejxe0kpai.png",
            },
            budget: 150000,
            deadline: "2025-06-30T00:00:00.000Z",
            createdAt: "2025-04-15T00:00:00.000Z",
          },
          role: {
            title: "Frontend Developer",
            description: "Implement responsive UI components using React",
            budget: 50000,
          },
          milestones: [
            {
              _id: "milestone1",
              title: "Homepage Redesign",
              description: "Create a modern, responsive homepage with hero section",
              amount: 15000,
              deadline: "2025-05-15T00:00:00.000Z",
              status: "active",
              attachments: [],
            },
            {
              _id: "milestone2",
              title: "Product Listing Pages",
              description: "Implement product grid and filtering functionality",
              amount: 20000,
              deadline: "2025-06-01T00:00:00.000Z",
              status: "pending",
              attachments: [],
            },
            {
              _id: "milestone3",
              title: "Checkout Process",
              description: "Create multi-step checkout process with validation",
              amount: 15000,
              deadline: "2025-06-15T00:00:00.000Z",
              status: "pending",
              attachments: [],
            },
          ],
          teammates: [
            {
              _id: "user1",
              name: "Sarah Johnson",
              role: "UI/UX Designer",
              profilePic:
                "https://res.cloudinary.com/dxmeatsae/image/upload/v1745772539/client_verification_docs/mhpbkpi3vnkejxe0kpai.png",
            },
            {
              _id: "user2",
              name: "Michael Chen",
              role: "Backend Developer",
              profilePic:
                "https://res.cloudinary.com/dxmeatsae/image/upload/v1745772539/client_verification_docs/mhpbkpi3vnkejxe0kpai.png",
            },
          ],
        },
        {
          _id: "team2",
          job: {
            _id: "job2",
            title: "Mobile App Development",
            description: "Develop a cross-platform mobile app for fitness tracking",
            client: {
              _id: "client2",
              name: "FitLife Solutions",
              profilePic:
                "https://res.cloudinary.com/dxmeatsae/image/upload/v1745772539/client_verification_docs/mhpbkpi3vnkejxe0kpai.png",
            },
            budget: 200000,
            deadline: "2025-07-30T00:00:00.000Z",
            createdAt: "2025-04-10T00:00:00.000Z",
          },
          role: {
            title: "React Native Developer",
            description: "Implement mobile UI components and integrate with backend APIs",
            budget: 70000,
          },
          milestones: [
            {
              _id: "milestone4",
              title: "User Authentication",
              description: "Implement login, registration, and password recovery",
              amount: 20000,
              deadline: "2025-05-20T00:00:00.000Z",
              status: "completed",
              attachments: [
                {
                  name: "auth-screens.zip",
                  url: "https://example.com/files/auth-screens.zip",
                },
              ],
            },
            {
              _id: "milestone5",
              title: "Dashboard & Analytics",
              description: "Create user dashboard with activity charts and statistics",
              amount: 25000,
              deadline: "2025-06-15T00:00:00.000Z",
              status: "active",
              attachments: [],
            },
            {
              _id: "milestone6",
              title: "Workout Tracking",
              description: "Implement workout logging and progress tracking features",
              amount: 25000,
              deadline: "2025-07-10T00:00:00.000Z",
              status: "pending",
              attachments: [],
            },
          ],
          teammates: [
            {
              _id: "user3",
              name: "Jessica Williams",
              role: "UI/UX Designer",
              profilePic:
                "https://res.cloudinary.com/dxmeatsae/image/upload/v1745772539/client_verification_docs/mhpbkpi3vnkejxe0kpai.png",
            },
            {
              _id: "user4",
              name: "David Kim",
              role: "Backend Developer",
              profilePic:
                "https://res.cloudinary.com/dxmeatsae/image/upload/v1745772539/client_verification_docs/mhpbkpi3vnkejxe0kpai.png",
            },
          ],
        },
      ]

      setTeams(dummyTeams)
      if (dummyTeams.length > 0) {
        setSelectedTeam(dummyTeams[0])
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load teams. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTeam = (team) => {
    setSelectedTeam(team)
  }

  const toggleMilestoneExpand = (milestoneId) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [milestoneId]: !prev[milestoneId],
    }))
  }

  const handleSubmitMilestone = async (milestone) => {
    // This would be the actual API call in a real application
    alert(`Submitting milestone: ${milestone.title}`)

    // Update the milestone status in the UI
    const updatedTeams = teams.map((team) => {
      if (team._id === selectedTeam._id) {
        const updatedMilestones = team.milestones.map((m) => {
          if (m._id === milestone._id) {
            return { ...m, status: "submitted" }
          }
          return m
        })
        return { ...team, milestones: updatedMilestones }
      }
      return team
    })

    setTeams(updatedTeams)
    if (selectedTeam) {
      const updatedSelectedTeam = updatedTeams.find((team) => team._id === selectedTeam._id)
      setSelectedTeam(updatedSelectedTeam)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#9333EA] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white">Loading your teams...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r mb-6 h-[200px] from-[#9333EA]/20 to-[#0a0a0f] border-b border-[#2d2d3a] flex items-center">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">My Teams</h1>
          <p className="text-gray-400">Manage your team projects and milestones</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-md flex items-center">
            <AlertTriangle size={20} className="text-red-400 mr-2" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {teams.length === 0 ? (
          <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] p-8 text-center">
            <div className="w-16 h-16 bg-[#1e1e2d] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-[#9333EA]" />
            </div>
            <h3 className="text-xl font-bold mb-2">No teams found</h3>
            <p className="text-gray-400 mb-6">You're not part of any team projects yet.</p>
            <button
              onClick={() => navigate("/search/jobs")}
              className="px-4 py-2 bg-[#9333EA] hover:bg-[#a855f7] text-white rounded-md transition-colors"
            >
              Browse Team Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Teams List */}
            <div className="lg:col-span-1">
              <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] overflow-hidden">
                <div className="p-4 border-b border-[#2d2d3a]">
                  <h2 className="text-lg font-bold">My Teams</h2>
                </div>
                <div className="p-2">
                  {teams.map((team) => (
                    <div
                      key={team._id}
                      onClick={() => handleSelectTeam(team)}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedTeam?._id === team._id
                          ? "bg-[#9333EA]/20 border border-[#9333EA]/50"
                          : "hover:bg-[#1e1e2d]"
                      }`}
                    >
                      <h3 className="font-medium mb-1">{team.job.title}</h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <Users size={14} className="mr-1" />
                        <span>{team.teammates.length + 1} team members</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Calendar size={14} className="mr-1" />
                        <span>Due {formatDate(team.job.deadline)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Details */}
            {selectedTeam && (
              <div className="lg:col-span-3 space-y-6">
                {/* Project Overview */}
                <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] overflow-hidden">
                  <div className="p-6 border-b border-[#2d2d3a]">
                    <h2 className="text-xl font-bold">{selectedTeam.job.title}</h2>
                  </div>
                  <div className="p-6">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300">{selectedTeam.job.description}</p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#1e1e2d] p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Your Role</h3>
                        <p className="text-lg font-bold">{selectedTeam.role.title}</p>
                        <p className="text-sm text-gray-300 mt-1">{selectedTeam.role.description}</p>
                      </div>
                      <div className="bg-[#1e1e2d] p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Budget</h3>
                        <p className="text-lg font-bold">PKR {selectedTeam.role.budget.toLocaleString()}</p>
                      </div>
                      <div className="bg-[#1e1e2d] p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Deadline</h3>
                        <p className="text-lg font-bold">{formatDate(selectedTeam.job.deadline)}</p>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="mt-6">
                      <h3 className="text-lg font-bold mb-3">Client</h3>
                      <div className="flex items-center bg-[#1e1e2d] p-4 rounded-lg">
                        {selectedTeam.job.client.profilePic ? (
                          <img
                            src={selectedTeam.job.client.profilePic || "/placeholder.svg"}
                            alt={selectedTeam.job.client.name}
                            className="w-12 h-12 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-[#2d2d3a] rounded-full flex items-center justify-center mr-3">
                            <User size={24} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold">{selectedTeam.job.client.name}</h4>
                          <button className="text-sm text-[#9333EA] hover:text-[#a855f7] mt-1 flex items-center">
                            <MessageSquare size={14} className="mr-1" />
                            Message Client
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] overflow-hidden">
                  <div className="p-6 border-b border-[#2d2d3a]">
                    <h2 className="text-xl font-bold">Team Members</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Current User */}
                      <div className="bg-[#1e1e2d] p-4 rounded-lg border border-[#9333EA]/30">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#2d2d3a] rounded-full flex items-center justify-center mr-3">
                            <User size={24} className="text-[#9333EA]" />
                          </div>
                          <div>
                            <h4 className="font-bold">{user.name} (You)</h4>
                            <p className="text-sm text-gray-300">{selectedTeam.role.title}</p>
                          </div>
                        </div>
                      </div>

                      {/* Other Team Members */}
                      {selectedTeam.teammates.map((teammate) => (
                        <div key={teammate._id} className="bg-[#1e1e2d] p-4 rounded-lg">
                          <div className="flex items-center">
                            {teammate.profilePic ? (
                              <img
                                src={teammate.profilePic || "/placeholder.svg"}
                                alt={teammate.name}
                                className="w-12 h-12 rounded-full object-cover mr-3"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-[#2d2d3a] rounded-full flex items-center justify-center mr-3">
                                <User size={24} className="text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold">{teammate.name}</h4>
                              <p className="text-sm text-gray-300">{teammate.role}</p>
                            </div>
                          </div>
                          <button className="text-sm text-[#9333EA] hover:text-[#a855f7] mt-3 flex items-center">
                            <MessageSquare size={14} className="mr-1" />
                            Message
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] overflow-hidden">
                  <div className="p-6 border-b border-[#2d2d3a]">
                    <h2 className="text-xl font-bold">Milestones</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {selectedTeam.milestones.map((milestone) => (
                        <div
                          key={milestone._id}
                          className={`bg-[#1e1e2d] rounded-lg border ${
                            milestone.status === "active"
                              ? "border-yellow-500/30"
                              : milestone.status === "completed"
                                ? "border-green-500/30"
                                : milestone.status === "submitted"
                                  ? "border-blue-500/30"
                                  : "border-[#2d2d3a]"
                          }`}
                        >
                          <div className="p-4 cursor-pointer" onClick={() => toggleMilestoneExpand(milestone._id)}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                {milestone.status === "active" && (
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                                )}
                                {milestone.status === "completed" && (
                                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                )}
                                {milestone.status === "submitted" && (
                                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                )}
                                {milestone.status === "pending" && (
                                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                                )}
                                <h3 className="font-bold">{milestone.title}</h3>
                              </div>
                              <div className="flex items-center">
                                <span
                                  className={`text-sm px-2 py-1 rounded-full mr-3 ${
                                    milestone.status === "active"
                                      ? "bg-yellow-500/10 text-yellow-500"
                                      : milestone.status === "completed"
                                        ? "bg-green-500/10 text-green-500"
                                        : milestone.status === "submitted"
                                          ? "bg-blue-500/10 text-blue-500"
                                          : "bg-gray-500/10 text-gray-400"
                                  }`}
                                >
                                  {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                                </span>
                                <ChevronDown
                                  size={18}
                                  className={`transition-transform ${
                                    expandedMilestones[milestone._id] ? "transform rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </div>
                          </div>

                          {expandedMilestones[milestone._id] && (
                            <div className="p-4 pt-0 border-t border-[#2d2d3a] mt-2">
                              <p className="text-gray-300 mb-4">{milestone.description}</p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-400 mb-1">Amount</h4>
                                  <p className="font-bold">PKR {milestone.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-400 mb-1">Deadline</h4>
                                  <p className="font-bold">{formatDate(milestone.deadline)}</p>
                                </div>
                              </div>

                              {milestone.attachments && milestone.attachments.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-gray-400 mb-2">Attachments</h4>
                                  <div className="space-y-2">
                                    {milestone.attachments.map((attachment, index) => (
                                      <div key={index} className="flex items-center bg-[#2d2d3a] p-2 rounded-md">
                                        <FileText size={16} className="text-[#9333EA] mr-2" />
                                        <span className="text-sm flex-1 truncate">{attachment.name}</span>
                                        <a
                                          href={attachment.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[#9333EA] hover:text-[#a855f7] ml-2"
                                        >
                                          <ExternalLink size={14} />
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {milestone.status === "active" && (
                                <button
                                  onClick={() => handleSubmitMilestone(milestone)}
                                  className="w-full bg-[#9333EA] hover:bg-[#a855f7] text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors mt-2"
                                >
                                  <Upload size={16} className="mr-2" />
                                  Submit Milestone
                                </button>
                              )}

                              {milestone.status === "submitted" && (
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-3 mt-2">
                                  <p className="text-sm text-blue-400">
                                    Your submission is under review by the client.
                                  </p>
                                </div>
                              )}

                              {milestone.status === "completed" && (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-md p-3 mt-2 flex items-center">
                                  <CheckCircle size={16} className="text-green-500 mr-2" />
                                  <p className="text-sm text-green-400">
                                    This milestone has been completed and approved.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTeams
