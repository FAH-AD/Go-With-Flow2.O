import { Calendar, Clock, DollarSign, MapPin, Briefcase, Users, CheckCircle } from "lucide-react"

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
        return "1-3 months"
      case "3-6-months":
        return "3-6 months"
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
      case "on-site":
        return "On-site"
      case "hybrid":
        return "Hybrid"
      default:
        return location
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1e1e2d] border border-[#2d2d3a] rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">{jobData.title || "Job Title"}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center">
            <div>
              <div className="text-sm text-gray-400">Budget</div>
              <div className="font-medium">PKR {jobData.budget || 0}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Clock size={18} className="text-[#9333EA] mr-2" />
            <div>
              <div className="text-sm text-gray-400">Duration</div>
              <div className="font-medium">{formatDuration(jobData.duration)}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar size={18} className="text-[#9333EA] mr-2" />
            <div>
              <div className="text-sm text-gray-400">Deadline</div>
              <div className="font-medium">{formatDate(jobData.deadline)}</div>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin size={18} className="text-[#9333EA] mr-2" />
            <div>
              <div className="text-sm text-gray-400">Location</div>
              <div className="font-medium">{formatLocation(jobData.location)}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <div className="text-gray-300 whitespace-pre-line">{jobData.description || "No description provided."}</div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Skills Required</h3>
          <div className="flex flex-wrap gap-2">
            {jobData.skills && jobData.skills.length > 0 ? (
              jobData.skills.map((skill, index) => (
                <span key={index} className="bg-[#2d2d3a] text-white px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400">No skills specified</span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Experience Level</h3>
          <div className="flex items-center">
            <Briefcase size={18} className="text-[#9333EA] mr-2" />
            <span>{formatExperienceLevel(jobData.experienceLevel)}</span>
          </div>
        </div>

        {jobData.attachments && jobData.attachments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Attachments</h3>
            <div className="space-y-2">
              {jobData.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center bg-[#121218] p-2 rounded-md">
                  <div className="bg-[#2d2d3a] p-2 rounded mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#9333EA]"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="truncate">{attachment.name || attachment}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crowdsourcing Section */}
        {jobData.isCrowdsourced && jobData.crowdsourcingRoles && jobData.crowdsourcingRoles.length > 0 && (
          <div className="mt-8 border-t border-[#2d2d3a] pt-6">
            <div className="flex items-center mb-4">
              <Users size={20} className="text-[#9333EA] mr-2" />
              <h3 className="text-lg font-medium">Team Roles</h3>
            </div>

            <div className="space-y-4">
              {jobData.crowdsourcingRoles.map((role, index) => (
                <div key={index} className="bg-[#121218] border border-[#2d2d3a] rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{role.title || `Role #${index + 1}`}</h4>
                    <div className="bg-[#9333EA]/20 text-[#9333EA] px-2 py-1 rounded text-xs">PKR {role.budget || 0}</div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3">{role.description || "No description provided."}</p>

                  <div>
                    <div className="text-xs text-gray-400 mb-1">Required Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {role.skills && role.skills.length > 0 ? (
                        role.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="bg-[#2d2d3a] text-white px-2 py-0.5 rounded-full text-xs">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">No skills specified</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#1e1e2d] border border-[#2d2d3a] rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CheckCircle size={20} className="text-[#9333EA] mr-2" />
          <h3 className="text-lg font-medium">Ready to Post?</h3>
        </div>
        <p className="text-gray-300 mb-4">
          Please review all the details above before posting your job. Once posted, freelancers will be able to see your
          job and submit proposals.
        </p>
        <div className="bg-[#9333EA]/10 border border-[#9333EA]/30 rounded-md p-4 text-sm">
          <p className="text-[#9333EA]">
            By posting this job, you agree to our Terms of Service and confirm that all the information provided is
            accurate.
          </p>
        </div>
      </div>
    </div>
  )
}

export default JobPreview
