"use client"

import { FileText, Briefcase, MapPin } from "lucide-react"

const BasicDetails = ({ jobData, handleChange }) => {
  return (
    <div className="space-y-6">
      {/* Job Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Job Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            id="title"
            value={jobData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="bg-[#1e1e2d] border border-[#2d2d3a] text-white rounded-md block w-full pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
            placeholder="e.g. Full Stack Developer for E-commerce Website"
            maxLength={100}
            required
          />
        </div>
        <p className="text-xs text-gray-400">
          Be specific and concise. Maximum 100 characters.
          <span className="ml-1 text-gray-500">{jobData.title.length}/100</span>
        </p>
      </div>

      {/* Job Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Job Description <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <FileText size={18} className="text-gray-400" />
          </div>
          <textarea
            id="description"
            value={jobData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="bg-[#1e1e2d] border border-[#2d2d3a] text-white rounded-md block w-full pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
            placeholder="Describe your project in detail..."
            rows="8"
            required
          ></textarea>
        </div>
        <p className="text-xs text-gray-400">
          Include all relevant details about your project, requirements, and expectations.
        </p>
      </div>

      {/* Sub Category */}
      <div className="space-y-2">
        <label htmlFor="subCategory" className="block text-sm font-medium text-gray-300">
          Category
        </label>
        <select
          id="subCategory"
          value={jobData.subCategory}
          onChange={(e) => handleChange("subCategory", e.target.value)}
          className="bg-[#1e1e2d] border border-[#2d2d3a] text-white rounded-md block w-full px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent appearance-none"
        >
          <option value="Web Development">Web Development</option>
          <option value="Mobile Development">Mobile Development</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Content Writing">Content Writing</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="Data Science">Data Science</option>
          <option value="Video Editing">Video Editing</option>
          <option value="Audio Production">Audio Production</option>
          <option value="Translation">Translation</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Location Preference</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            className={`border ${
              jobData.location === "remote" ? "border-[#9333EA] bg-[#9333EA]/10" : "border-[#2d2d3a] bg-[#1e1e2d]"
            } rounded-md p-4 cursor-pointer transition-colors`}
            onClick={() => handleChange("location", "remote")}
          >
            <div className="flex items-center mb-2">
              <MapPin size={18} className="text-[#9333EA] mr-2" />
              <div className="font-medium">Remote</div>
            </div>
            <div className="text-sm text-gray-400">Work from anywhere</div>
          </div>
          <div
            className={`border ${
              jobData.location === "on-site" ? "border-[#9333EA] bg-[#9333EA]/10" : "border-[#2d2d3a] bg-[#1e1e2d]"
            } rounded-md p-4 cursor-pointer transition-colors`}
            onClick={() => handleChange("location", "on-site")}
          >
            <div className="flex items-center mb-2">
              <MapPin size={18} className="text-[#9333EA] mr-2" />
              <div className="font-medium">On-site</div>
            </div>
            <div className="text-sm text-gray-400">Work at your location</div>
          </div>
          <div
            className={`border ${
              jobData.location === "hybrid" ? "border-[#9333EA] bg-[#9333EA]/10" : "border-[#2d2d3a] bg-[#1e1e2d]"
            } rounded-md p-4 cursor-pointer transition-colors`}
            onClick={() => handleChange("location", "hybrid")}
          >
            <div className="flex items-center mb-2">
              <MapPin size={18} className="text-[#9333EA] mr-2" />
              <div className="font-medium">Hybrid</div>
            </div>
            <div className="text-sm text-gray-400">Mix of remote and on-site</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicDetails
