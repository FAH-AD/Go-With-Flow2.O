"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { AlertCircle, CheckCircle, X } from "lucide-react"

const HirePopup = ({ bid, onClose, jobId, isCrowdsourced = false, roles = [], freelancerId = null }) => {
  const [milestoneTitle, setMilestoneTitle] = useState("")
  const [milestoneDescription, setMilestoneDescription] = useState("")
  const [milestoneAmount, setMilestoneAmount] = useState("")
  const [milestoneDeadline, setMilestoneDeadline] = useState("")
  const [roleTitle, setRoleTitle] = useState(roles.length > 0 ? roles[0] : "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const token = localStorage.getItem("authToken")

  const handleHire = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let response

      if (isCrowdsourced) {
        // For crowdsourced jobs, use the team API
        console.log("freelancerId in hire popup", freelancerId)
        response = await axios.post(
          `http://localhost:5000/api/jobs/${jobId}/team/${bid}`,
          {
            freelancerId: freelancerId || bid.freelancer._id,
            roleTitle,
            milestoneTitle,
            milestoneDescription,
            milestoneAmount: Number.parseFloat(milestoneAmount),
            milestoneDeadline,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      } else {
        // For regular jobs, use the hire API
        response = await axios.post(
          `http://localhost:5000/api/jobs/${jobId}/hire/${bid}`,
          {
            milestoneTitle,
            milestoneDescription,
            milestoneAmount: Number.parseFloat(milestoneAmount),
            milestoneDeadline,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      }

      console.log("Hire response:", response.data)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Error hiring freelancer:", error)
      setError(error.response?.data?.message || "Failed to hire freelancer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4 py-6 sm:p-0"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-[#1c1c24] rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto  relative overflow-y-auto max-h-[500px]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {isCrowdsourced ? "Add Team Member" : "Hire Freelancer"}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {isCrowdsourced
            ? "Add this freelancer to your team with a specific role and milestone"
            : "Create the first milestone to hire this freelancer"}
        </p>

        {success && (
          <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-3 rounded mb-4 flex items-center">
            <CheckCircle size={18} className="mr-2" />
            <span>{isCrowdsourced ? "Add to team request sent successfully!" : "Hire offer sent to freelancer!"}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle size={18} className="mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleHire} className="space-y-4">
          {isCrowdsourced && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
              <select
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full bg-[#2d2d3a] text-white rounded-md px-3 py-2 text-sm border border-[#3d3d4a] focus:border-[#9333EA] focus:outline-none"
                required
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Milestone Title</label>
            <input
              type="text"
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
              className="w-full bg-[#2d2d3a] text-white rounded-md px-3 py-2 text-sm border border-[#3d3d4a] focus:border-[#9333EA] focus:outline-none"
              placeholder="e.g., Initial Design Phase"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Milestone Description</label>
            <textarea
              value={milestoneDescription}
              onChange={(e) => setMilestoneDescription(e.target.value)}
              className="w-full bg-[#2d2d3a] text-white rounded-md px-3 py-2 text-sm border border-[#3d3d4a] focus:border-[#9333EA] focus:outline-none"
              rows="3"
              placeholder="Describe what should be delivered in this milestone"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Milestone Amount (PKR)</label>
            <input
              type="number"
              value={milestoneAmount}
              onChange={(e) => setMilestoneAmount(e.target.value)}
              className="w-full bg-[#2d2d3a] text-white rounded-md px-3 py-2 text-sm border border-[#3d3d4a] focus:border-[#9333EA] focus:outline-none"
              placeholder="e.g., 500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Milestone Deadline</label>
            <input
              type="datetime-local"
              value={milestoneDeadline}
              onChange={(e) => setMilestoneDeadline(e.target.value)}
              className="w-full bg-[#2d2d3a] text-white rounded-md px-3 py-2 text-sm border border-[#3d3d4a] focus:border-[#9333EA] focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6">
            <button
              type="submit"
              disabled={loading || success}
              className={`${
                loading || success ? "bg-[#9333EA]/50 cursor-not-allowed" : "bg-[#9333EA] hover:bg-[#7928CA]"
              } text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Processing...
                </>
              ) : success ? (
                <>
                  <CheckCircle size={16} className="mr-2" />
                  {isCrowdsourced ? "Added!" : "Hired!"}
                </>
              ) : isCrowdsourced ? (
                "Add to Team"
              ) : (
                "Hire"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-[#2D3748] text-white px-4 py-2 rounded-md hover:bg-[#4A5568] text-sm font-medium w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default HirePopup
