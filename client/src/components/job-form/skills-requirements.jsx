"use client"

import { useState } from "react"
import { Search, X, Plus } from "lucide-react"

// Common skills by category for suggestions
const skillSuggestions = {
  "Web Development": [
    "JavaScript",
    "React",
    "Node.js",
    "HTML",
    "CSS",
    "TypeScript",
    "Vue.js",
    "Angular",
    "PHP",
    "Laravel",
    "WordPress",
    "MongoDB",
    "SQL",
    "AWS",
    "Docker",
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
    "Mobile UI",
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
    "Interaction Design",
    "Visual Design",
  ],
  "Graphic Design": [
    "Photoshop",
    "Illustrator",
    "InDesign",
    "Logo Design",
    "Brand Identity",
    "Typography",
    "Print Design",
    "Social Media Graphics",
  ],
  "Content Writing": [
    "Blog Writing",
    "Copywriting",
    "SEO Writing",
    "Technical Writing",
    "Creative Writing",
    "Editing",
    "Proofreading",
    "Content Strategy",
  ],
  "Digital Marketing": [
    "SEO",
    "SEM",
    "Google Ads",
    "Facebook Ads",
    "Social Media Marketing",
    "Email Marketing",
    "Content Marketing",
    "Analytics",
  ],
  "Data Science": [
    "Python",
    "R",
    "Machine Learning",
    "Data Analysis",
    "Data Visualization",
    "SQL",
    "Tableau",
    "Power BI",
    "Statistics",
  ],
  "Video Editing": [
    "Premiere Pro",
    "After Effects",
    "Final Cut Pro",
    "DaVinci Resolve",
    "Motion Graphics",
    "Color Grading",
    "Sound Editing",
  ],
  "Audio Production": [
    "Pro Tools",
    "Logic Pro",
    "Ableton Live",
    "Audio Mixing",
    "Audio Mastering",
    "Voice Over",
    "Sound Design",
  ],
  Translation: ["Spanish", "French", "German", "Chinese", "Japanese", "Arabic", "Russian", "Portuguese", "Italian"],
  Other: ["Project Management", "Customer Service", "Virtual Assistant", "Accounting", "Legal", "Consulting"],
}

const SkillsRequirements = ({ jobData, handleChange }) => {
  const [skillInput, setSkillInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])

  // Get suggestions based on selected category
  const getCategorySuggestions = () => {
    return skillSuggestions[jobData.subCategory] || skillSuggestions.Other
  }

  const handleSkillInputChange = (e) => {
    const input = e.target.value
    setSkillInput(input)

    if (input.trim()) {
      const filtered = getCategorySuggestions().filter((skill) => skill.toLowerCase().includes(input.toLowerCase()))
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const addSkill = (skill = skillInput.trim()) => {
    if (skill && !jobData.skills.includes(skill)) {
      handleChange("skills", [...jobData.skills, skill])
      setSkillInput("")
      setShowSuggestions(false)
    }
  }

  const removeSkill = (skillToRemove) => {
    handleChange(
      "skills",
      jobData.skills.filter((skill) => skill !== skillToRemove),
    )
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-6">
      {/* Skills Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Skills Required <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={skillInput}
            onChange={handleSkillInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => skillInput.trim() && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="bg-[#1e1e2d] border border-[#2d2d3a] text-white rounded-md block w-full pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
            placeholder="Search for skills..."
          />
          <button
            type="button"
            onClick={() => addSkill()}
            disabled={!skillInput.trim()}
            className="absolute inset-y-0 right-0 px-3 flex items-center bg-[#9333EA] hover:bg-[#a855f7] text-white rounded-r-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
          </button>

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-[#1e1e2d] border border-[#2d2d3a] rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-[#2d2d3a] cursor-pointer"
                  onClick={() => addSkill(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400">Add skills that are required for this job</p>
      </div>

      {/* Selected Skills */}
      <div>
        <div className="text-sm font-medium text-gray-300 mb-2">Selected Skills</div>
        {jobData.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {jobData.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-[#2d2d3a] text-white px-3 py-1 rounded-full text-sm flex items-center group"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-gray-400 hover:text-white group-hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">No skills selected yet</div>
        )}
      </div>

      {/* Popular Skills */}
      <div>
        <div className="text-sm font-medium text-gray-300 mb-2">Popular Skills in {jobData.subCategory}</div>
        <div className="flex flex-wrap gap-2">
          {getCategorySuggestions()
            .slice(0, 10)
            .map((skill, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addSkill(skill)}
                disabled={jobData.skills.includes(skill)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  jobData.skills.includes(skill)
                    ? "bg-[#9333EA]/20 border-[#9333EA]/50 text-[#9333EA] cursor-not-allowed"
                    : "bg-transparent border-[#2d2d3a] text-white hover:border-[#9333EA] hover:text-[#9333EA] transition-colors"
                }`}
              >
                {skill}
              </button>
            ))}
        </div>
      </div>

      {/* Skills Tips */}
      <div className="bg-[#1e1e2d] border border-[#2d2d3a] rounded-md p-4 mt-6">
        <h3 className="font-medium mb-2">Tips for selecting skills</h3>
        <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
          <li>Be specific about the technologies and tools required</li>
          <li>Include both technical and soft skills when relevant</li>
          <li>Don't overload with too many skills - focus on the most important ones</li>
          <li>Consider including skill level requirements (beginner, intermediate, expert)</li>
        </ul>
      </div>
    </div>
  )
}

export default SkillsRequirements
