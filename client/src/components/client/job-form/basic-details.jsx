"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"

const BasicDetails = ({ jobData, handleChange }) => {
  const [titleCount, setTitleCount] = useState(jobData.title.length)
  const [descriptionCount, setDescriptionCount] = useState(jobData.description.length)

  const categories = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Graphic Design",
    "Content Writing",
    "Digital Marketing",
    "Data Science",
    "Video & Animation",
    "Audio Production",
    "Business",
    "Other",
  ]

  return (
    <div className="space-y-6">
      {/* Job Title */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Job Title <span className="text-red-400">*</span>
          </label>
          <span className={`text-xs ${titleCount > 80 ? "text-red-400" : "text-gray-400"}`}>{titleCount}/100</span>
        </div>
        <input
          id="title"
          type="text"
          value={jobData.title}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              handleChange("title", e.target.value)
              setTitleCount(e.target.value.length)
            }
          }}
          placeholder="e.g. Full Stack Web Developer Needed for E-commerce Project"
          className="w-full px-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
          required
        />
        <p className="mt-1 text-xs text-gray-400">A clear, specific title will attract more qualified freelancers.</p>
      </div>

      {/* Job Description */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Job Description <span className="text-red-400">*</span>
          </label>
          <span className={`text-xs ${descriptionCount > 3000 ? "text-red-400" : "text-gray-400"}`}>
            {descriptionCount}/4000
          </span>
        </div>
        <textarea
          id="description"
          value={jobData.description}
          onChange={(e) => {
            if (e.target.value.length <= 4000) {
              handleChange("description", e.target.value)
              setDescriptionCount(e.target.value.length)
            }
          }}
          placeholder="Describe your project in detail..."
          rows={8}
          className="w-full px-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent resize-none"
          required
        ></textarea>
        <p className="mt-1 text-xs text-gray-400">
          Include all relevant details about your project, requirements, and expectations.
        </p>
      </div>

      {/* Job Category */}
      <div>
        <label htmlFor="subCategory" className="block text-sm font-medium mb-2">
          Job Category
        </label>
        <select
          id="subCategory"
          value={jobData.subCategory}
          onChange={(e) => handleChange("subCategory", e.target.value)}
          className="w-full px-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Tips Section */}
      <div className="bg-[#1e1e2d] p-4 rounded-lg border border-[#2d2d3a] mt-6">
        <div className="flex items-start">
          <div className="bg-[#9333EA]/20 p-2 rounded-lg mr-3">
            <HelpCircle size={20} className="text-[#9333EA]" />
          </div>
          <div>
            <h4 className="font-medium mb-2">Tips for a Great Job Post</h4>
            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-4">
              <li>Be specific about what you're looking for</li>
              <li>Clearly outline deliverables and expectations</li>
              <li>Mention any specific technologies or skills required</li>
              <li>Include information about your company or project</li>
              <li>Be realistic about your budget and timeline</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicDetails
