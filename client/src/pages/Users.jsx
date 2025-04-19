"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Filter,
  ChevronDown,
  Shield,
  AlertTriangle,
  Mail,
  UserX,
  CheckCircle,
  X,
  RefreshCw,
  Download,
  Users,
  ArrowLeft,
  ArrowRight,
  Eye,
} from "lucide-react"
import Navbar from "../components/Navbar"

const AdminUsers = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.Auth.user)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [totalUsers, setTotalUsers] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")
  const [actionSuccess, setActionSuccess] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest(".dropdown-container")) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdown])

  // Check if user is authorized (admin role)
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/admin/users", message: "Please login to access admin panel" } })
    } else if (user.role !== "admin") {
      navigate("/", { state: { message: "You don't have permission to access this page" } })
    } else {
      fetchUsers()
    }
  }, [user, navigate])

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call to fetch users
      // For this demo, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockUsers = generateMockUsers(100)
      setUsers(mockUsers)
      setTotalUsers(mockUsers.length)
      applyFilters(mockUsers, searchQuery, filterRole, filterStatus, sortBy)
    } catch (err) {
      console.error("Failed to fetch users:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate mock users
  const generateMockUsers = (count) => {
    const roles = ["freelancer", "client", "admin"]
    const statuses = ["active", "pending", "deactivated", "warned"]
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
      "Mia Anderson",
      "Alexander White",
      "Charlotte Lewis",
      "Daniel Harris",
      "Amelia Clark",
      "Matthew Walker",
      "Harper Young",
      "Joseph Allen",
      "Abigail King",
      "David Wright",
    ]

    return Array.from({ length: count }, (_, i) => {
      const role = roles[Math.floor(Math.random() * roles.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const name = names[Math.floor(Math.random() * names.length)]
      const email = `${name.toLowerCase().replace(/\s+/g, ".")}@${role === "freelancer" ? "freelancer" : role === "client" ? "company" : "admin"}.com`

      // Generate a random date within the last 90 days
      const joinedDate = new Date()
      joinedDate.setDate(joinedDate.getDate() - Math.floor(Math.random() * 90))

      return {
        id: i + 1,
        name,
        email,
        role,
        status,
        joined: joinedDate.toISOString(),
        lastActive: status !== "deactivated" ? new Date().toISOString() : joinedDate.toISOString(),
        projects: Math.floor(Math.random() * 20),
        earnings: role === "freelancer" ? Math.floor(Math.random() * 10000) : 0,
        spent: role === "client" ? Math.floor(Math.random() * 15000) : 0,
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "women" : "men"}/${Math.floor(Math.random() * 100)}.jpg`,
        verified: Math.random() > 0.2,
        warnings: Math.floor(Math.random() * 3),
        location: ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "India", "Japan"][
          Math.floor(Math.random() * 8)
        ],
      }
    })
  }

  // Apply filters and search
  const applyFilters = (allUsers, query, role, status, sort) => {
    let result = [...allUsers]

    // Apply search query
    if (query) {
      const lowercaseQuery = query.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery) ||
          user.id.toString().includes(lowercaseQuery),
      )
    }

    // Apply role filter
    if (role !== "all") {
      result = result.filter((user) => user.role === role)
    }

    // Apply status filter
    if (status !== "all") {
      result = result.filter((user) => user.status === status)
    }

    // Apply sorting
    switch (sort) {
      case "newest":
        result.sort((a, b) => new Date(b.joined) - new Date(a.joined))
        break
      case "oldest":
        result.sort((a, b) => new Date(a.joined) - new Date(b.joined))
        break
      case "a-z":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "z-a":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }

    setFilteredUsers(result)
    setTotalUsers(result.length)
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    applyFilters(users, query, filterRole, filterStatus, sortBy)
  }

  // Handle role filter
  const handleRoleFilter = (role) => {
    setFilterRole(role)
    applyFilters(users, searchQuery, role, filterStatus, sortBy)
  }

  // Handle status filter
  const handleStatusFilter = (status) => {
    setFilterStatus(status)
    applyFilters(users, searchQuery, filterRole, status, sortBy)
  }

  // Handle sort
  const handleSort = (sort) => {
    setSortBy(sort)
    applyFilters(users, searchQuery, filterRole, filterStatus, sort)
  }

  // Handle pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo(0, 0)
  }

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(totalUsers / usersPerPage)

  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  // Handle send warning
  const handleSendWarning = (user) => {
    setSelectedUser(user)
    setWarningMessage("")
    setShowWarningModal(true)
  }

  // Handle deactivate user
  const handleDeactivateUser = (user) => {
    setSelectedUser(user)
    setShowDeactivateModal(true)
  }

  // Submit warning
  const submitWarning = async () => {
    if (!warningMessage.trim()) {
      setActionError("Please enter a warning message")
      return
    }

    try {
      // In a real app, you would make an API call to send the warning
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Update user status in the local state
      const updatedUsers = users.map((u) => {
        if (u.id === selectedUser.id) {
          return { ...u, status: "warned", warnings: u.warnings + 1 }
        }
        return u
      })

      setUsers(updatedUsers)
      applyFilters(updatedUsers, searchQuery, filterRole, filterStatus, sortBy)
      setShowWarningModal(false)
      setActionSuccess(`Warning sent to ${selectedUser.name}`)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null)
      }, 3000)
    } catch (err) {
      setActionError("Failed to send warning. Please try again.")
    }
  }

  // Submit deactivation
  const submitDeactivation = async () => {
    try {
      // In a real app, you would make an API call to deactivate the user
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Update user status in the local state
      const updatedUsers = users.map((u) => {
        if (u.id === selectedUser.id) {
          return { ...u, status: "deactivated" }
        }
        return u
      })

      setUsers(updatedUsers)
      applyFilters(updatedUsers, searchQuery, filterRole, filterStatus, sortBy)
      setShowDeactivateModal(false)
      setActionSuccess(`${selectedUser.name}'s account has been deactivated`)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null)
      }, 3000)
    } catch (err) {
      setActionError("Failed to deactivate user. Please try again.")
    }
  }

  // Reactivate user
  const handleReactivateUser = async (user) => {
    try {
      // In a real app, you would make an API call to reactivate the user
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Update user status in the local state
      const updatedUsers = users.map((u) => {
        if (u.id === user.id) {
          return { ...u, status: "active" }
        }
        return u
      })

      setUsers(updatedUsers)
      applyFilters(updatedUsers, searchQuery, filterRole, filterStatus, sortBy)
      setActionSuccess(`${user.name}'s account has been reactivated`)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null)
      }, 3000)
    } catch (err) {
      setActionError("Failed to reactivate user. Please try again.")
    }
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Helper function to get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return { bg: "bg-green-900/20", text: "text-green-400" }
      case "pending":
        return { bg: "bg-yellow-900/20", text: "text-yellow-400" }
      case "deactivated":
        return { bg: "bg-red-900/20", text: "text-red-400" }
      case "warned":
        return { bg: "bg-orange-900/20", text: "text-orange-400" }
      default:
        return { bg: "bg-gray-900/20", text: "text-gray-400" }
    }
  }

  // Helper function to get role badge style
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return { bg: "bg-purple-900/20", text: "text-purple-400" }
      case "client":
        return { bg: "bg-blue-900/20", text: "text-blue-400" }
      case "freelancer":
        return { bg: "bg-green-900/20", text: "text-green-400" }
      default:
        return { bg: "bg-gray-900/20", text: "text-gray-400" }
    }
  }

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#9333EA] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-12">
        <Navbar/>
      {/* Header */}
      <div className="bg-gradient-to-r mb-6 h-[200px] from-[#9333EA]/20 to-[#0a0a0f] border-b border-[#2d2d3a] flex items-center">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <Shield className="text-[#9333EA] mr-2" size={24} />
                <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
              </div>
              <p className="text-gray-400 mt-1">Manage all users on the platform</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white px-4 py-2 rounded-md border border-[#2d2d3a] transition-colors"
              >
                <ArrowLeft size={18} />
                <span>Back to Dashboard</span>
              </button>
              <button
                onClick={() => fetchUsers()}
                className="flex items-center gap-2 bg-[#9333EA] hover:bg-[#a855f7] text-white px-4 py-2 rounded-md transition-colors"
              >
                <RefreshCw size={18} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Success/Error Messages */}
        {actionSuccess && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle size={20} className="text-green-400 mr-2" />
              <p className="text-green-400">{actionSuccess}</p>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
        )}

        {actionError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle size={20} className="text-red-400 mr-2" />
              <p className="text-red-400">{actionError}</p>
            </div>
            <button onClick={() => setActionError(null)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email or ID..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Role Filter */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => toggleDropdown("role")}
                    className="flex items-center gap-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white px-4 py-3 rounded-md border border-[#2d2d3a] transition-colors"
                  >
                    <Filter size={16} />
                    <span>Role: {filterRole === "all" ? "All" : filterRole}</span>
                    <ChevronDown size={16} />
                  </button>
                  {openDropdown === "role" && (
                    <div className="absolute z-10 mt-2 w-48 rounded-md bg-[#1e1e2d] border border-[#2d2d3a] shadow-lg">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleRoleFilter("all")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${filterRole === "all" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          All Roles
                        </button>
                        <button
                          onClick={() => {
                            handleRoleFilter("admin")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${filterRole === "admin" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          Admin
                        </button>
                        <button
                          onClick={() => {
                            handleRoleFilter("client")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${filterRole === "client" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          Client
                        </button>
                        <button
                          onClick={() => {
                            handleRoleFilter("freelancer")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${filterRole === "freelancer" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          Freelancer
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Filter */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => toggleDropdown("status")}
                    className="flex items-center gap-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white px-4 py-3 rounded-md border border-[#2d2d3a] transition-colors"
                  >
                    <Filter size={16} />
                    <span>Status: {filterStatus === "all" ? "All" : filterStatus}</span>
                    <ChevronDown size={16} />
                  </button>
                  {openDropdown === "status" && (
                    <div className="absolute z-10 mt-2 w-48 rounded-md bg-[#1e1e2d] border border-[#2d2d3a] shadow-lg">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleStatusFilter("all")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${filterStatus === "all" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          All Statuses
                        </button>
                        <button
                          onClick={() => {
                            handleStatusFilter("active")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${filterStatus === "active" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          Active
                        </button>
                        <button
                          onClick={() => {
                            handleStatusFilter("pending")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${filterStatus === "pending" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => {
                            handleStatusFilter("warned")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${filterStatus === "warned" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          Warned
                        </button>
                        <button
                          onClick={() => {
                            handleStatusFilter("deactivated")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${filterStatus === "deactivated" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          Deactivated
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort Filter */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => toggleDropdown("sort")}
                    className="flex items-center gap-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white px-4 py-3 rounded-md border border-[#2d2d3a] transition-colors"
                  >
                    <Filter size={16} />
                    <span>
                      Sort:{" "}
                      {sortBy === "newest"
                        ? "Newest"
                        : sortBy === "oldest"
                          ? "Oldest"
                          : sortBy === "a-z"
                            ? "A-Z"
                            : "Z-A"}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  {openDropdown === "sort" && (
                    <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-[#1e1e2d] border border-[#2d2d3a] shadow-lg">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleSort("newest")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "newest" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          Newest First
                        </button>
                        <button
                          onClick={() => {
                            handleSort("oldest")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "oldest" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          Oldest First
                        </button>
                        <button
                          onClick={() => {
                            handleSort("a-z")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "a-z" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          Name (A-Z)
                        </button>
                        <button
                          onClick={() => {
                            handleSort("z-a")
                            setOpenDropdown(null)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "z-a" ? "bg-[#9333EA]/20 text-[#9333EA]" : "text-white hover:bg-[#2d2d3a]"}`}
                        >
                          Name (Z-A)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Export Button */}
                <button className="flex items-center gap-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white px-4 py-3 rounded-md border border-[#2d2d3a] transition-colors">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Showing{" "}
                <span className="text-white">
                  {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, totalUsers)}
                </span>{" "}
                of <span className="text-white">{totalUsers}</span> users
              </p>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <span className="text-sm">
                  {filterRole === "all"
                    ? "All Roles"
                    : filterRole === "admin"
                      ? "Admins"
                      : filterRole === "client"
                        ? "Clients"
                        : "Freelancers"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] mb-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#1e1e2d] text-left text-gray-400 text-sm">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 hidden md:table-cell">Joined</th>
                  <th className="px-6 py-4 hidden lg:table-cell">Location</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => {
                  const statusBadge = getStatusBadge(user.status)
                  const roleBadge = getRoleBadge(user.role)

                  return (
                    <tr key={user.id} className="border-t border-[#2d2d3a] hover:bg-[#1e1e2d]">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-gray-400 text-sm">
                        {formatDate(user.joined)}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-gray-400 text-sm">{user.location}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="p-2 hover:bg-[#2d2d3a] rounded-md text-gray-400 hover:text-white transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          {user.status !== "deactivated" && (
                            <>
                              <button
                                onClick={() => handleSendWarning(user)}
                                className="p-2 hover:bg-[#2d2d3a] rounded-md text-gray-400 hover:text-yellow-400 transition-colors"
                              >
                                <Mail size={16} />
                              </button>
                              <button
                                onClick={() => handleDeactivateUser(user)}
                                className="p-2 hover:bg-[#2d2d3a] rounded-md text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <UserX size={16} />
                              </button>
                            </>
                          )}
                          {user.status === "deactivated" && (
                            <button
                              onClick={() => handleReactivateUser(user)}
                              className="p-2 hover:bg-[#2d2d3a] rounded-md text-gray-400 hover:text-green-400 transition-colors"
                            >
                              <RefreshCw size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {currentUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No users found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-[#1e1e2d] text-gray-500 cursor-not-allowed"
                  : "bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white"
              }`}
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
            </button>

            <div className="hidden md:flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${
                    currentPage === page ? "bg-[#9333EA] text-white" : "bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <div className="md:hidden">
              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-[#1e1e2d] text-gray-500 cursor-not-allowed"
                  : "bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white"
              }`}
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#2d2d3a] flex justify-between items-center">
              <h2 className="text-xl font-bold">User Details</h2>
              <button onClick={() => setShowUserDetails(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                    <img
                      src={selectedUser.avatar || "/placeholder.svg"}
                      alt={selectedUser.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadge(selectedUser.role).bg} ${getRoleBadge(selectedUser.role).text}`}
                    >
                      {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(selectedUser.status).bg} ${getStatusBadge(selectedUser.status).text}`}
                    >
                      {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-1">{selectedUser.name}</h3>
                  <p className="text-gray-400 mb-4">{selectedUser.email}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-gray-400 text-sm">User ID</p>
                      <p className="font-medium">{selectedUser.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Joined Date</p>
                      <p className="font-medium">{formatDate(selectedUser.joined)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Last Active</p>
                      <p className="font-medium">{formatDate(selectedUser.lastActive)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="font-medium">{selectedUser.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Verification</p>
                      <p className="font-medium">{selectedUser.verified ? "Verified" : "Not Verified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Warnings</p>
                      <p className="font-medium">{selectedUser.warnings}</p>
                    </div>
                  </div>

                  {selectedUser.role === "freelancer" && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Freelancer Stats</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#1e1e2d] p-3 rounded-md">
                          <p className="text-gray-400 text-xs">Projects</p>
                          <p className="text-lg font-bold">{selectedUser.projects}</p>
                        </div>
                        <div className="bg-[#1e1e2d] p-3 rounded-md">
                          <p className="text-gray-400 text-xs">Earnings</p>
                          <p className="text-lg font-bold">${selectedUser.earnings.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedUser.role === "client" && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Client Stats</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#1e1e2d] p-3 rounded-md">
                          <p className="text-gray-400 text-xs">Projects</p>
                          <p className="text-lg font-bold">{selectedUser.projects}</p>
                        </div>
                        <div className="bg-[#1e1e2d] p-3 rounded-md">
                          <p className="text-gray-400 text-xs">Total Spent</p>
                          <p className="text-lg font-bold">${selectedUser.spent.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {selectedUser.status !== "deactivated" ? (
                      <>
                        <button
                          onClick={() => {
                            setShowUserDetails(false)
                            handleSendWarning(selectedUser)
                          }}
                          className="flex items-center gap-2 bg-yellow-900/20 hover:bg-yellow-900/30 text-yellow-400 px-4 py-2 rounded-md transition-colors"
                        >
                          <Mail size={16} />
                          <span>Send Warning</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowUserDetails(false)
                            handleDeactivateUser(selectedUser)
                          }}
                          className="flex items-center gap-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 px-4 py-2 rounded-md transition-colors"
                        >
                          <UserX size={16} />
                          <span>Deactivate</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setShowUserDetails(false)
                          handleReactivateUser(selectedUser)
                        }}
                        className="flex items-center gap-2 bg-green-900/20 hover:bg-green-900/30 text-green-400 px-4 py-2 rounded-md transition-colors"
                      >
                        <RefreshCw size={16} />
                        <span>Reactivate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarningModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] w-full max-w-md">
            <div className="p-6 border-b border-[#2d2d3a] flex justify-between items-center">
              <h2 className="text-xl font-bold">Send Warning</h2>
              <button onClick={() => setShowWarningModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={selectedUser.avatar || "/placeholder.svg"}
                    alt={selectedUser.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-gray-400 text-sm">{selectedUser.email}</p>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="warning-message" className="block text-sm font-medium mb-2">
                  Warning Message
                </label>
                <textarea
                  id="warning-message"
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  placeholder="Enter your warning message..."
                  rows={5}
                  className="w-full px-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="px-4 py-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitWarning}
                  className="px-4 py-2 bg-yellow-900/20 hover:bg-yellow-900/30 text-yellow-400 rounded-md transition-colors"
                >
                  Send Warning
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] w-full max-w-md">
            <div className="p-6 border-b border-[#2d2d3a] flex justify-between items-center">
              <h2 className="text-xl font-bold">Deactivate User</h2>
              <button onClick={() => setShowDeactivateModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={selectedUser.avatar || "/placeholder.svg"}
                    alt={selectedUser.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-gray-400 text-sm">{selectedUser.email}</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-md">
                <p className="text-red-400">
                  Are you sure you want to deactivate this user? They will no longer be able to access the platform.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="px-4 py-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitDeactivation}
                  className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-md transition-colors"
                >
                  Deactivate User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
