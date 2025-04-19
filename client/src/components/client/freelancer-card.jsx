"use client"

import { Star, Bookmark } from "lucide-react"
import { useState } from "react"

const FreelancerCard = ({ freelancer }) => {
  const [isSaved, setIsSaved] = useState(true)

  return (
    <div className="bg-[#1e1e2d] rounded-lg p-4 border border-[#2d2d3a] hover:border-[#9333EA]/50 transition-all">
      <div className="flex items-start">
        <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
          <img
            src={freelancer.avatar || "/placeholder.svg"}
            alt={freelancer.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">{freelancer.name}</h3>
              <p className="text-gray-400 text-sm">{freelancer.title}</p>
            </div>
            <button onClick={() => setIsSaved(!isSaved)} className="text-gray-400 hover:text-[#9333EA]">
              <Bookmark size={18} fill={isSaved ? "#9333EA" : "none"} className={isSaved ? "text-[#9333EA]" : ""} />
            </button>
          </div>

          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <Star size={14} fill="#9333EA" className="text-[#9333EA]" />
              <span className="ml-1 text-sm font-medium">{freelancer.rating}</span>
              <span className="text-gray-400 text-xs ml-1">({freelancer.reviews} reviews)</span>
            </div>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-sm">${freelancer.hourlyRate}/hr</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {freelancer.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="bg-[#2d2d3a] text-gray-300 px-2 py-1 rounded-md text-xs">
                {skill}
              </span>
            ))}
            {freelancer.skills.length > 3 && (
              <span className="bg-[#2d2d3a] text-gray-300 px-2 py-1 rounded-md text-xs">
                +{freelancer.skills.length - 3}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#2d2d3a]">
            <span className="text-xs text-gray-400">{freelancer.availability}</span>
            <button className="bg-[#9333EA] hover:bg-[#a855f7] text-white px-3 py-1 rounded-md text-sm transition-colors">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FreelancerCard
