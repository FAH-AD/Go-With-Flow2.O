"use client"

import { useState } from "react"
import { Bookmark, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"

const JobCard = ({ job, onSave, onUnsave }) => {
  const [isSaved, setIsSaved] = useState(false)
  const navigate = useNavigate()
  return (
    <div className="bg-[#1e1e2d] rounded-lg p-4 mb-4 border border-[#2d2d3a] hover:border-[#9333EA]/50 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{job.title}</h3>
          <div className="flex items-center mt-1 text-sm text-gray-400">
            <span className="mr-3">PKR {job.budget}</span>
            <span className="mr-3">•</span>
            <span>{job.duration}</span>
            <span className="mr-3">•</span>
            <span>{job.postedAt}</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-[#9333EA]/20 text-[#9333EA] px-2 py-1 rounded-md text-sm font-medium mr-3">
            {job.matchScore}% Match
          </div>
          <button onClick={() => setIsSaved(!isSaved)} className="text-gray-400 hover:text-[#9333EA]">
            <Bookmark size={20} fill={isSaved ? "#9333EA" : "none"} className={isSaved ? "text-[#9333EA]" : ""} />
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-sm my-3 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-2 my-3">
        {job.skills.map((skill, index) => (
          <span key={index} className="bg-[#2d2d3a] text-gray-300 px-2 py-1 rounded-md text-xs">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#2d2d3a]">
        <div className="flex items-center">
          <img className="w-8 h-8 bg-[#9333EA]/30 rounded-full flex items-center justify-center text-[#9333EA] font-bold text-sm mr-2" src={job.client.profileImage}/>
          
          <div>
            <p className="text-sm font-medium">{job.client.name}</p>
            <div className="flex items-center text-xs">
            <span className="text-[#9333EA] font-medium">{job.client.companyName}</span>
            <span className="mx-2 text-gray-500">•</span>
              <span className="text-[#9333EA] font-medium">PKR {job.client.totalSpent} Total Spent</span>
             
            </div>
          </div>
        </div>
        {job.hasApplied ? (
          <span className="text-green-500 font-medium text-sm">Already Applied</span>
        ) : (
          <button 
            onClick={() => navigate(`/freelancer/apply-job/${job.id}`, { state: { job } })} 
            className="bg-[#9333EA] hover:bg-[#a855f7] text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  )
}

export default JobCard
