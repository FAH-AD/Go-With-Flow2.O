import { Calendar, Clock, DollarSign, Globe, Users, File } from "lucide-react"

const JobPreview = ({ jobData }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format duration for display
  const formatDuration = (duration) => {
    switch (duration) {
      case "less-than-1-month":
        return "Less than 1 month"
      case "1-3-months":
        return "1 to 3 months"
      case "3-6-months":
        return "3 to 6 months"
      case "more-than-6-months":
        return "More than 6 months"
      default:
        return duration
    }
  }

  // Format experience level for display
  const formatExperienceLevel = (level) => {
    switch (level) {
      case "entry":
        return "Entry Level"
      case "intermediate":
        return "Intermediate"
      case "expert":
        return "Expert"
      default:
        return level
    }
  }

  // Format location for display
  const formatLocation = (location) => {
    switch (location) {
      case "remote":
        return "Remote"
      case "onsite":
        return "On-site"
      case "hybrid":
        return "Hybrid"
      default:
        return location
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <div className="bg-[#1e1e2d] p-4 rounded-lg border border-[#2d2d3a]">
        <div className="flex items-center">
          <div className="bg-[#9333EA]/20 p-2 rounded-lg mr-3">
            <Users size={20} className="text-[#9333EA]" />
          </div>
          <div>
            <h4 className="font-medium">Job Preview</h4>
            <p className="text-xs text-gray-400">This is how your job will appear to freelancers</p>
          </div>
        </div>
      </div>

      {/* Job Title */}
      <div>
        <h2 className="text-xl font-bold">{jobData.title || "Job Title"}</h2>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
          <span className="flex items-center">
            <Calendar size={16} className="mr-1" />
            Posted {new Date().toLocaleDateString()}
          </span>
          <span className="flex items-center">
            <Globe size={16} className="mr-1" />
            {formatLocation(jobData.location)}
          </span>
          <span className="flex items-center">
            <Users size={16} className="mr-1" />
            {formatExperienceLevel(jobData.experienceLevel)}
          </span>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1e1e2d] p-4 rounded-lg border border-[#2d2d3a]">
          <div className="flex items-center mb-2">
            <DollarSign size={18} className="text-[#9333EA] mr-2" />
            <h4 className="font-medium">Budget</h4>
          </div>
          <p className="text-xl font-bold">${jobData.budget.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Fixed Price</p>
        </div>

        <div className="bg-[#1e1e2d] p-4 rounded-lg border border-[#2d2d3a]">
          <div className="flex items-center mb-2">
            <Calendar size={18} className="text-[#9333EA] mr-2" />
            <h4 className="font-medium">Deadline</h4>
          </div>
          <p className="text-xl font-bold">{formatDate(jobData.deadline)}</p>
          <p className="text-xs text-gray-400 mt-1">Project Due Date</p>
        </div>

        <div className="bg-[#1e1e2d] p-4 rounded-lg border border-[#2d2d3a]">
          <div className="flex items-center mb-2">
            <Clock size={18} className="text-[#9333EA] mr-2" />
            <h4 className="font-medium">Duration</h4>
          </div>
          <p className="text-xl font-bold">{formatDuration(jobData.duration)}</p>
          <p className="text-xs text-gray-400 mt-1">Estimated Time</p>
        </div>
      </div>

      {/* Job Description */}
      <div>
        <h3 className="text-lg font-bold mb-2">Description</h3>
        <div className="bg-[#1e1e2d] p-4 rounded-lg border border-[#2d2d3a]">
          <p className="whitespace-pre-wrap">{jobData.description || "No description provided."}</p>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-lg font-bold mb-2">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {jobData.skills.length > 0 ? (
            jobData.skills.map((skill, index) => (
              <span key={index} className="bg-[#2d2d3a] text-white px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-400">No skills specified</p>
          )}
        </div>
      </div>

      {/* Attachments */}
      {jobData.attachments.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-2">Attachments</h3>
          <div className="bg-[#1e1e2d] p-4 rounded-lg border border-[#2d2d3a]">
            <div className="space-y-2">
              {jobData.attachments.map((file, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-[#9333EA]/20 p-2 rounded-md mr-3">
                    <File size={16} className="text-[#9333EA]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visibility Badge */}
      <div className="mt-6">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            jobData.isPublic ? "bg-green-900/20 text-green-400" : "bg-yellow-900/20 text-yellow-400"
          }`}
        >
          {jobData.isPublic ? (
            <>
              <Globe size={14} className="mr-1" />
              Public Job
            </>
          ) : (
            <>
              <Users size={14} className="mr-1" />
              Private Job (Invite Only)
            </>
          )}
        </div>

        {jobData.isPromoted && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#9333EA]/20 text-[#9333EA] ml-2">
            <span className="mr-1">★</span>
            Featured Job
          </div>
        )}
      </div>
    </div>
  )
}

export default JobPreview
