"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"

const SkillsRequirements = ({ jobData, handleChange }) => {
  const [skillInput, setSkillInput] = useState("")
  const [error, setError] = useState("")

  // Common skills suggestions based on category
  const skillSuggestions = {
    "Web Development": [
      "JavaScript",
      "React",
      "Vue.js",
      "Angular",
      "Node.js",
      "Express",
      "MongoDB",
      "PostgreSQL",
      "TypeScript",
      "Next.js",
      "GraphQL",
      "REST API",
      "PHP",
      "Laravel",
      "WordPress",
    ],
    "Mobile Development": [
      "React Native",
      "Flutter",
      "Swift",
      "Kotlin",
      "Java",
      "iOS",
      "Android",
      "Firebase",
      "App Store Optimization",
    ],
    "UI/UX Design": [
      "Figma",
      "Adobe XD",
      "Sketch",
      "User Research",
      "Wireframing",
      "Prototyping",
      "User Testing",
      "Responsive Design",
    ],
  }

  // Get suggestions based on selected category or default to Web Development
  const currentSuggestions = skillSuggestions[jobData.subCategory] || skillSuggestions["Web Development"]

  // Experience levels
  const experienceLevels = [
    { value: "entry", label: "Entry Level" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" },
  ]

  // Locations
  const locations = [
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
  ]

  // Add skill to the list
  const addSkill = () => {
    const trimmedSkill = skillInput.trim()

    if (!trimmedSkill) {
      setError("Please enter a skill")
      return
    }

    if (jobData.skills.includes(trimmedSkill)) {
      setError("This skill is already added")
      return
    }

    if (jobData.skills.length >= 15) {
      setError("You can add up to 15 skills")
      return
    }

    handleChange("skills", [...jobData.skills, trimmedSkill])
    setSkillInput("")
    setError("")
  }

  // Remove skill from the list
  const removeSkill = (skillToRemove) => {
    handleChange(
      "skills",
      jobData.skills.filter((skill) => skill !== skillToRemove),
    )
  }

  // Add suggested skill
  const addSuggestedSkill = (skill) => {
    if (!jobData.skills.includes(skill) && jobData.skills.length < 15) {
      handleChange("skills", [...jobData.skills, skill])
    }
  }

  return (
    <div className="space-y-6">
      {/* Skills Input */}
      <div>
        <label htmlFor="skills" className="block text-sm font-medium mb-2">
          Required Skills <span className="text-red-400">*</span>
        </label>
        <div className="flex">
          <input
            id="skills"
            type="text"
            value={skillInput}
            onChange={(e) => {
              setSkillInput(e.target.value)
              setError("")
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addSkill()
              }
            }}
            placeholder="e.g. React, Node.js, MongoDB"
            className="flex-grow px-4 py-3 bg-[#1e1e2d] border border-[#2d2d3a] rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
          />
          <button
            type="button"
            onClick={addSkill}
            className="bg-[#9333EA] hover:bg-[#a855f7] text-white px-4 py-3 rounded-r-md transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        <p className="mt-1 text-xs text-gray-400">Add up to 15 skills that best describe your project requirements.</p>

        {/* Selected Skills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {jobData.skills.map((skill) => (
            <div key={skill} className="flex items-center bg-[#2d2d3a] text-white px-3 py-1 rounded-full text-sm">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-gray-400 hover:text-white">
                <X size={14} />
              </button>
            </div>
          ))}
          {jobData.skills.length === 0 && <p className="text-sm text-gray-400">No skills added yet</p>}
        </div>
      </div>

      {/* Suggested Skills */}
      <div>
        <h4 className="text-sm font-medium mb-2">Suggested Skills</h4>
        <div className="flex flex-wrap gap-2">
          {currentSuggestions.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => addSuggestedSkill(skill)}
              disabled={jobData.skills.includes(skill)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                jobData.skills.includes(skill)
                  ? "bg-[#9333EA]/30 text-gray-400 cursor-not-allowed"
                  : "bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label htmlFor="experienceLevel" className="block text-sm font-medium mb-2">
          Experience Level
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {experienceLevels.map((level) => (
            <div
              key={level.value}
              onClick={() => handleChange("experienceLevel", level.value)}
              className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                jobData.experienceLevel === level.value
                  ? "bg-[#9333EA]/20 border border-[#9333EA]"
                  : "bg-[#1e1e2d] border border-[#2d2d3a] hover:border-[#9333EA]/50"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full mr-2 border ${
                  jobData.experienceLevel === level.value ? "border-[#9333EA] bg-[#9333EA]" : "border-[#2d2d3a]"
                }`}
              ></div>
              <span>{level.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Location Preference */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-2">
          Location Preference
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {locations.map((location) => (
            <div
              key={location.value}
              onClick={() => handleChange("location", location.value)}
              className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                jobData.location === location.value
                  ? "bg-[#9333EA]/20 border border-[#9333EA]"
                  : "bg-[#1e1e2d] border border-[#2d2d3a] hover:border-[#9333EA]/50"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full mr-2 border ${
                  jobData.location === location.value ? "border-[#9333EA] bg-[#9333EA]" : "border-[#2d2d3a]"
                }`}
              ></div>
              <span>{location.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkillsRequirements
