import { MessageSquare, ExternalLink } from "lucide-react"

const ProjectCard = ({ project }) => {
  // Helper function to determine status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case "in_progress":
        return { bg: "bg-blue-900/20", text: "text-blue-400", label: "In Progress" }
      case "review":
        return { bg: "bg-yellow-900/20", text: "text-yellow-400", label: "In Review" }
      case "completed":
        return { bg: "bg-green-900/20", text: "text-green-400", label: "Completed" }
      case "paused":
        return { bg: "bg-gray-900/20", text: "text-gray-400", label: "Paused" }
      default:
        return { bg: "bg-gray-900/20", text: "text-gray-400", label: "Unknown" }
    }
  }

  const statusBadge = getStatusBadge(project.status)

  return (
    <div className="bg-[#1e1e2d] rounded-lg p-4 border border-[#2d2d3a] hover:border-[#9333EA]/50 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold">{project.title}</h3>
          <p className="text-gray-400 text-sm mt-1">Client: {project.client}</p>
        </div>
        <div className={`${statusBadge.bg} ${statusBadge.text} px-2 py-1 rounded-md text-xs font-medium`}>
          {statusBadge.label}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="w-full h-2 bg-[#2d2d3a] rounded-full mt-1">
          <div className="h-full bg-[#9333EA] rounded-full" style={{ width: `${project.progress}%` }}></div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#2d2d3a] flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-400">Deadline</p>
            <p className="text-sm font-medium">{project.deadline}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Budget</p>
            <p className="text-sm font-medium">${project.budget}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {project.messages > 0 && (
            <div className="relative">
              <MessageSquare size={18} className="text-[#9333EA]" />
              <span className="absolute -top-1 -right-1 bg-[#9333EA] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {project.messages}
              </span>
            </div>
          )}
          <button className="bg-[#2d2d3a] hover:bg-[#3d3d4a] p-2 rounded-md transition-colors">
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
