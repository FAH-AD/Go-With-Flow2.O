"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import axios from "axios"
import {
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  User,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"

const HireOffers = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.Auth.user)
  const [activeTab, setActiveTab] = useState("regular")
  const [offers, setOffers] = useState([])
  const [teamOffers, setTeamOffers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [respondingOffer, setRespondingOffer] = useState(null)
  const [isResponding, setIsResponding] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: "/freelancer/hire-offers", message: "Please login to view your offers" },
      })
    } else if (user.role !== "freelancer") {
      navigate("/", { state: { message: "Only freelancers can access this page" } })
    } else {
      fetchOffers()
    }
  }, [user, navigate])

  const fetchOffers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get("http://localhost:5000/api/freelancer/offers/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      // Separate regular offers and team offers
      const allOffers = response.data.data || []
      console.log("all offers",response.data.data)
      console.log("all offers length")
      console.log(allOffers.filter((offer) => !offer.isCrowdsourced))
      console.log(allOffers.filter((offer) => offer.isCrowdsourced))

      const regular = allOffers.filter((offer) => !offer.isCrowdsourced)
      const team = allOffers.filter((offer) => offer.isCrowdsourced)
     
      setOffers(regular)
      setTeamOffers(team)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load offers. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRespondToOffer = async (jobId, offerId, accept) => {
    setRespondingOffer(offerId)
    setIsResponding(true)

    try {
      await axios.post(
        `http://localhost:5000/api/freelancer/jobs/${jobId}/offer/${offerId}/respond`,
        {
          accept: accept,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      )

      // Remove the responded offer from the list
      if (activeTab === "regular") {
        setOffers(offers.filter((offer) => offer._id !== offerId))
      } else {
        setTeamOffers(teamOffers.filter((offer) => offer._id !== offerId))
      }

      // If accepted, navigate to the job details
      if (accept) {
        navigate(`/freelancer/jobs/${jobId}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to respond to offer. Please try again.")
    } finally {
      setRespondingOffer(null)
      setIsResponding(false)
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
            <p className="mt-4 text-white">Loading your offers...</p>
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
          <h1 className="text-3xl font-bold mb-2">Hire Offers</h1>
          <p className="text-gray-400">Review and respond to job offers from clients</p>
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

        {/* Tabs */}
        <div className="flex border-b border-[#2d2d3a] mb-6">
          <button
            onClick={() => setActiveTab("regular")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "regular" ? "border-b-2 border-[#9333EA] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Regular Jobs
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`px-6 py-3 font-medium text-sm flex items-center ${
              activeTab === "team" ? "border-b-2 border-[#9333EA] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Users size={16} className="mr-2" />
            Team Projects
          </button>
        </div>

        {/* Offers List */}
        <div className="space-y-6">
          {activeTab === "regular" ? (
            offers.length === 0 ? (
              <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] p-8 text-center">
                <div className="w-16 h-16 bg-[#1e1e2d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase size={24} className="text-[#9333EA]" />
                </div>
                <h3 className="text-xl font-bold mb-2">No pending offers</h3>
                <p className="text-gray-400 mb-6">You don't have any pending job offers at the moment.</p>
                <button
                  onClick={() => navigate("/search/jobs")}
                  className="px-4 py-2 bg-[#9333EA] hover:bg-[#a855f7] text-white rounded-md transition-colors"
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              offers.map((offer) => (
                <OfferCard
                  key={offer._id}
                  offer={offer}
                  isTeam={false}
                  onRespond={handleRespondToOffer}
                  isResponding={isResponding && respondingOffer === offer.id}
                  formatDate={formatDate}
                />
              ))
            )
          ) : teamOffers.length === 0 ? (
            <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] p-8 text-center">
              <div className="w-16 h-16 bg-[#1e1e2d] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-[#9333EA]" />
              </div>
              <h3 className="text-xl font-bold mb-2">No team project offers</h3>
              <p className="text-gray-400 mb-6">You don't have any pending team project offers at the moment.</p>
              <button
                onClick={() => navigate("/search/jobs")}
                className="px-4 py-2 bg-[#9333EA] hover:bg-[#a855f7] text-white rounded-md transition-colors"
              >
                Browse Team Projects
              </button>
            </div>
          ) : (
            teamOffers.map((offer) => (
              <OfferCard
                key={offer._id}
                offer={offer}
                isTeam={true}
                onRespond={handleRespondToOffer}
                isResponding={isResponding && respondingOffer === offer.id}
                formatDate={formatDate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const OfferCard = ({ offer, isTeam, onRespond, isResponding, formatDate }) => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#121218] rounded-lg border border-[#2d2d3a] overflow-hidden hover:border-[#9333EA]/50 transition-colors"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isTeam && (
                <span className="bg-[#9333EA]/20 text-[#9333EA] px-2 py-1 rounded-full text-xs flex items-center">
                  <Users size={12} className="mr-1" />
                  Team Project
                </span>
              )}
              <h3
                className="text-xl font-bold cursor-pointer hover:text-[#9333EA]"
                onClick={() => navigate(`/jobs/${offer.job._id}`)}
              >
                {offer.jobTitle}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center">
               
                {isTeam
                  ? `Role Budget: PKR ${offer.roleAmount?.toLocaleString()}`
                  : `PKR ${offer.milestoneAmount?.toLocaleString()}`}
              </span>
              <span className="flex items-center">
                <Clock size={14} className="mr-1" />
                {offer.milestoneDeadline ? formatDate(offer.milestoneDeadline) : "No deadline specified"}
              </span>
              
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="flex items-center mb-4 bg-[#1e1e2d] p-3 rounded-md">
          <div className="w-10 h-10 bg-[#2d2d3a] rounded-full flex items-center justify-center mr-3">
            {offer.client?.profilePic ? (
              <img
                src={offer.client.profilePic || "/placeholder.svg"}
                alt={offer.client.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User size={20} className="text-gray-400" />
            )}
          </div>
          <div>
            <h4 className="font-medium">{offer.client?.name || "Client"}</h4>
            <p className="text-sm text-gray-400">{offer.client?.companyName}</p>
          </div>
        </div>

        {/* Offer Details */}
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Offer Details</h4>
          <div className="bg-[#1e1e2d] p-4 rounded-md">
            {isTeam && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-400 mb-1">Role</h5>
                <p className="font-medium">{offer.roleTitle}</p>
              </div>
            )}
            <div className="mb-3">
              <h5 className="text-sm font-medium text-gray-400 mb-1">Milestone</h5>
              <p className="font-medium">{offer.milestoneTitle}</p>
              <p className="text-sm text-gray-300 mt-1">{offer.milestoneDescription}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-400 mb-1">Amount</h5>
                <p className="font-medium">PKR {offer.milestoneAmount?.toLocaleString()}</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-400 mb-1">Deadline</h5>
                <p className="font-medium">{formatDate(offer.milestoneDeadline)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRespond(offer.jobId, offer.id, true)}
            disabled={isResponding}
            className="flex-1 bg-[#9333EA] hover:bg-[#a855f7] text-white px-4 py-3 rounded-md flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResponding ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <CheckCircle size={18} className="mr-2" />
            )}
            Accept Offer
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRespond(offer.job._id, offer._id, false)}
            disabled={isResponding}
            className="flex-1 bg-[#2D3748] hover:bg-[#4A5568] text-white px-4 py-3 rounded-md flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResponding ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <XCircle size={18} className="mr-2" />
            )}
            Decline
          </motion.button>
        </div>

        {/* View Job Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => navigate(`/freelancer/jobs/${offer.jobId}`)}
            className="flex items-center text-[#9333EA] hover:text-[#a855f7] transition-colors"
          >
            View Job Details
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default HireOffers
