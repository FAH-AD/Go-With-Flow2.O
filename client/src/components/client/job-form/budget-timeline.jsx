"use client"
import { Calendar, Clock, DollarSign, HelpCircle } from "lucide-react"

const BudgetTimeline = ({ jobData, handleChange }) => {
  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  // Duration options
  const durationOptions = [
    { value: "less-than-1-month", label: "Less than 1 month" },
    { value: "1-3-months", label: "1 to 3 months" },
    { value: "3-6-months", label: "3 to 6 months" },
    { value: "more-than-6-months", label: "More than 6 months" },
  ]

  return (
    <div className="space-y-6">
      {/* Budget */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium mb-2">
          Budget (USD) <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <DollarSign size={18} className="text-gray-400" />
          </div>
          <input
            id="budget"
            type="number"
            min="0"
            step="100"
            value={jobData.budget}
            onChange={(e) => handleChange("budget", Number(e.target.value))}
            placeholder="e.g. 5000"
            className="w-full pl-10 pr-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
            required
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">Set a realistic budget to attract qualified freelancers.</p>
      </div>

      {/* Deadline */}
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium mb-2">
          Deadline <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Calendar size={18} className="text-gray-400" />
          </div>
          <input
            id="deadline"
            type="date"
            value={formatDateForInput(jobData.deadline)}
            onChange={(e) => handleChange("deadline", e.target.value)}
            min={formatDateForInput(new Date().toISOString())}
            className="w-full pl-10 pr-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
            required
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">When do you need this project to be completed?</p>
      </div>

      {/* Project Duration */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium mb-2">
          Project Duration
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Clock size={18} className="text-gray-400" />
          </div>
          <select
            id="duration"
            value={jobData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
          >
            {durationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-1 text-xs text-gray-400">How long do you expect this project to take?</p>
      </div>

      {/* Budget Tips */}
      <div className="bg-[#1e1e2d] p-4 rounded-lg border border-[#2d2d3a] mt-6">
        <div className="flex items-start">
          <div className="bg-[#9333EA]/20 p-2 rounded-lg mr-3">
            <HelpCircle size={20} className="text-[#9333EA]" />
          </div>
          <div>
            <h4 className="font-medium mb-2">Budget & Timeline Tips</h4>
            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-4">
              <li>Set a competitive budget to attract quality freelancers</li>
              <li>Consider the complexity of your project when setting the deadline</li>
              <li>Be realistic about the time needed to complete the work</li>
              <li>Include buffer time for revisions and unexpected delays</li>
              <li>For larger projects, consider breaking it into milestones</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BudgetTimeline
