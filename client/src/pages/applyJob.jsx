"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Briefcase,
  DollarSign,
  FileText,
  Paperclip,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react"

import Navbar from "../components/Navbar"

const ApplyJob = () => {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const user = useSelector((state) => state.Auth.user)
  const [isLoading, setIsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [job, setJob] = useState(null)

  // Application data state
  const [applicationData, setApplicationData] = useState({
    jobId: jobId || "",
    budget: 0,
    deliveryTime: 14,
    deliveryTimeUnit: "days",
    proposal: "",
    attachments: [],
    status: "pending",
    isRead: false,
    milestones: [
      {
        title: "",
        description: "",
        amount: 0,
        dueDate: "",
        status: "pending",
      },
    ],
  })

  // Check if user is authorized (freelancer role)
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: `/freelancer/apply-job/${jobId}`, message: "Please login to apply for jobs" },
      })
    } else if (user.role !== "freelancer") {
      navigate("/", { state: { message: "Only freelancers can apply for jobs" } })
    } else {
      fetchJobDetails()
    }
  }, [user, navigate, jobId])

  // Fetch job details
  const fetchJobDetails = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call to fetch job details
      // For this demo, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockJob = {
        id: jobId,
        title: "Full Stack Web Developer Needed for E-commerce Project",
        description:
          "We're looking for an experienced full stack developer to help build a modern e-commerce platform. The ideal candidate should have strong skills in both front-end and back-end development, with experience in React, Node.js, and MongoDB.",
        budget: 5000,
        deadline: "2023-08-31T23:59:59.999Z",
        skills: ["React", "Node.js", "MongoDB", "Express", "Redux", "GraphQL"],
        client: {
          name: "TechSolutions Inc.",
          rating: 4.8,
          reviews: 24,
        },
      }

      setJob(mockJob)
      setApplicationData((prev) => ({
        ...prev,
        budget: mockJob.budget,
      }))
    } catch (err) {
      setError("Failed to load job details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form data changes
  const handleChange = (field, value) => {
    setApplicationData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle milestone changes
  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...applicationData.milestones]
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value,
    }
    setApplicationData((prev) => ({
      ...prev,
      milestones: updatedMilestones,
    }))
  }

  // Add new milestone
  const addMilestone = () => {
    if (applicationData.milestones.length >= 10) {
      setError("You can add up to 10 milestones")
      return
    }

    setApplicationData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          title: "",
          description: "",
          amount: 0,
          dueDate: "",
          status: "pending",
        },
      ],
    }))
  }

  // Remove milestone
  const removeMilestone = (index) => {
    if (applicationData.milestones.length <= 1) {
      setError("You need at least one milestone")
      return
    }

    const updatedMilestones = [...applicationData.milestones]
    updatedMilestones.splice(index, 1)
    setApplicationData((prev) => ({
      ...prev,
      milestones: updatedMilestones,
    }))
  }

  // Handle file upload
  const handleFileUpload = (files) => {
    // In a real app, you would upload these files to your server/cloud storage
    // For this demo, we'll just store the file names

    if (!files || files.length === 0) return

    // Check file size (limit to 10MB per file)
    const maxSize = 10 * 1024 * 1024 // 10MB
    const oversizedFiles = Array.from(files).filter((file) => file.size > maxSize)

    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the 10MB limit: ${oversizedFiles.map((f) => f.name).join(", ")}`)
      return
    }

    // Limit to 5 files total
    if (applicationData.attachments.length + files.length > 5) {
      setError("You can upload a maximum of 5 files")
      return
    }

    // Add files to attachments
    const newAttachments = [...applicationData.attachments]
    Array.from(files).forEach((file) => {
      newAttachments.push(file.name)
    })

    setApplicationData((prev) => ({
      ...prev,
      attachments: newAttachments,
    }))
  }

  // Remove attachment
  const removeAttachment = (index) => {
    const updatedAttachments = [...applicationData.attachments]
    updatedAttachments.splice(index, 1)
    setApplicationData((prev) => ({
      ...prev,
      attachments: updatedAttachments,
    }))
  }

  // Calculate total milestone amount
  const totalMilestoneAmount = applicationData.milestones.reduce(
    (total, milestone) => total + Number(milestone.amount),
    0,
  )

  // Check if form is valid
  const isFormValid = () => {
    // Check if proposal is not empty
    if (!applicationData.proposal.trim()) return false

    // Check if budget is greater than 0
    if (applicationData.budget <= 0) return false

    // Check if delivery time is greater than 0
    if (applicationData.deliveryTime <= 0) return false

    // Check if all milestones have title, description, amount, and dueDate
    for (const milestone of applicationData.milestones) {
      if (!milestone.title.trim() || !milestone.description.trim() || milestone.amount <= 0 || !milestone.dueDate) {
        return false
      }
    }

    // Check if total milestone amount equals budget
    if (totalMilestoneAmount !== Number(applicationData.budget)) return false

    return true
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // In a real app, you would make an API call to submit the application
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      // Show success message
      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        navigate("/freelancer/dashboard", { state: { message: "Application submitted successfully!" } })
      }, 2000)
    } catch (err) {
      setError("Failed to submit application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#9333EA] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="bg-[#121218] p-8 rounded-lg border border-[#2d2d3a] max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-[#9333EA]/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-[#9333EA]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-gray-400 mb-6">Your application has been sent to the client.</p>
          <div className="animate-pulse">
            <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-12">
      {/* Header */}
      <Navbar />
      <div className="bg-gradient-to-r mb-6 h-[200px] from-[#9333EA]/20 to-[#0a0a0f] border-b border-[#2d2d3a] flex items-center">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <Briefcase className="text-[#9333EA] mr-2" size={24} />
                <h1 className="text-2xl md:text-3xl font-bold">Apply for Job</h1>
              </div>
              <p className="text-gray-400 mt-1">Submit your proposal for this project</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white px-4 py-2 rounded-md border border-[#2d2d3a] transition-colors"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Job Details */}
        {job && (
          <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] mb-8">
            <div className="p-6 border-b border-[#2d2d3a]">
              <h2 className="text-xl font-bold">{job.title}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                <span className="flex items-center">
                  <DollarSign size={16} className="mr-1" />
                  Budget: ${job.budget.toLocaleString()}
                </span>
                <span className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Briefcase size={16} className="mr-1" />
                  Client: {job.client.name}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">Job Description</h3>
              <p className="text-gray-300 mb-4">{job.description}</p>

              <h3 className="text-lg font-bold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="bg-[#2d2d3a] text-white px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-md flex items-center">
            <AlertTriangle size={20} className="text-red-400 mr-2" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] mb-8">
            <div className="p-6 border-b border-[#2d2d3a]">
              <h2 className="text-xl font-bold">Your Proposal</h2>
              <p className="text-gray-400 mt-1">Tell the client why you're the best fit for this job</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Budget and Delivery Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium mb-2">
                    Your Bid (USD) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="budget"
                      type="number"
                      min="0"
                      step="50"
                      value={applicationData.budget}
                      onChange={(e) => handleChange("budget", Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {totalMilestoneAmount !== Number(applicationData.budget)
                      ? `Your milestone total (${totalMilestoneAmount}) must equal your bid amount`
                      : "Your bid amount matches your milestone total"}
                  </p>
                </div>

                <div>
                  <label htmlFor="deliveryTime" className="block text-sm font-medium mb-2">
                    Delivery Time <span className="text-red-400">*</span>
                  </label>
                  <div className="flex">
                    <input
                      id="deliveryTime"
                      type="number"
                      min="1"
                      value={applicationData.deliveryTime}
                      onChange={(e) => handleChange("deliveryTime", Number(e.target.value))}
                      className="w-full pl-4 pr-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                      required
                    />
                    <select
                      value={applicationData.deliveryTimeUnit}
                      onChange={(e) => handleChange("deliveryTimeUnit", e.target.value)}
                      className="bg-[#1e1e2d] border-l-0 border border-[#2d2d3a] rounded-r-md text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">How long will it take you to complete this project?</p>
                </div>
              </div>

              {/* Proposal */}
              <div>
                <label htmlFor="proposal" className="block text-sm font-medium mb-2">
                  Cover Letter <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="proposal"
                  value={applicationData.proposal}
                  onChange={(e) => handleChange("proposal", e.target.value)}
                  placeholder="Introduce yourself and explain why you're the best fit for this job..."
                  rows={6}
                  className="w-full px-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent resize-none"
                  required
                ></textarea>
                <p className="mt-1 text-xs text-gray-400">
                  Highlight your relevant experience, skills, and approach to this project.
                </p>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium mb-2">Attachments</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center border-[#2d2d3a]">
                  <div className="flex flex-col items-center justify-center">
                    <Paperclip size={36} className="text-gray-400 mb-2" />
                    <p className="mb-2 text-sm">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PDF, DOCX, JPG, PNG (Max 10MB per file)</p>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="mt-4 px-4 py-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] rounded-md cursor-pointer transition-colors"
                    >
                      Select Files
                    </label>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Upload your resume, portfolio, or other relevant documents (up to 5 files).
                </p>

                {/* Attached Files */}
                {applicationData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {applicationData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-[#1e1e2d] p-3 rounded-md border border-[#2d2d3a]"
                      >
                        <div className="flex items-center">
                          <div className="bg-[#9333EA]/20 p-2 rounded-md mr-3">
                            <FileText size={16} className="text-[#9333EA]" />
                          </div>
                          <p className="text-sm font-medium truncate max-w-xs">{file}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] mb-8">
            <div className="p-6 border-b border-[#2d2d3a]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Project Milestones</h2>
                  <p className="text-gray-400 mt-1">Break down your project into manageable milestones</p>
                </div>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="flex items-center gap-2 bg-[#9333EA] hover:bg-[#a855f7] text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Plus size={18} />
                  <span>Add Milestone</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {applicationData.milestones.map((milestone, index) => (
                <div key={index} className="bg-[#1e1e2d] p-4 rounded-lg border border-[#2d2d3a]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Milestone {index + 1}</h3>
                    {applicationData.milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor={`milestone-title-${index}`} className="block text-sm font-medium mb-2">
                        Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        id={`milestone-title-${index}`}
                        type="text"
                        value={milestone.title}
                        onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
                        placeholder="e.g. Initial Design"
                        className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`milestone-amount-${index}`} className="block text-sm font-medium mb-2">
                        Amount (USD) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <DollarSign size={18} className="text-gray-400" />
                        </div>
                        <input
                          id={`milestone-amount-${index}`}
                          type="number"
                          min="0"
                          value={milestone.amount}
                          onChange={(e) => handleMilestoneChange(index, "amount", Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 bg-[#0a0a0f] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor={`milestone-description-${index}`} className="block text-sm font-medium mb-2">
                        Description <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id={`milestone-description-${index}`}
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(index, "description", e.target.value)}
                        placeholder="Describe what will be delivered in this milestone"
                        rows={3}
                        className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent resize-none"
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor={`milestone-dueDate-${index}`} className="block text-sm font-medium mb-2">
                        Due Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        id={`milestone-dueDate-${index}`}
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => handleMilestoneChange(index, "dueDate", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Milestone Summary */}
              <div className="bg-[#1e1e2d] p-4 rounded-lg border border-[#2d2d3a]">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">Total Milestone Amount</h3>
                  <p className="font-bold">${totalMilestoneAmount.toLocaleString()}</p>
                </div>
                <p
                  className={`text-sm mt-1 ${
                    totalMilestoneAmount !== Number(applicationData.budget) ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {totalMilestoneAmount !== Number(applicationData.budget)
                    ? `Total milestone amount must equal your bid amount ($${applicationData.budget})`
                    : "Total milestone amount matches your bid amount"}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid() || submitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-md transition-colors ${
                !isFormValid() || submitting
                  ? "bg-[#9333EA]/50 text-white/70 cursor-not-allowed"
                  : "bg-[#9333EA] hover:bg-[#a855f7] text-white"
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Proposal</span>
                  <CheckCircle size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApplyJob
