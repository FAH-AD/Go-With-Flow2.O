import { Bell, AlertTriangle, Shield, FileText } from "lucide-react"

const ActivityLog = ({ logs }) => {
  // Helper function to determine log icon and style
  const getLogStyle = (type) => {
    switch (type) {
      case "system":
        return { icon: Bell, bg: "bg-blue-900/20", text: "text-blue-400" }
      case "issue":
        return { icon: AlertTriangle, bg: "bg-red-900/20", text: "text-red-400" }
      case "admin":
        return { icon: Shield, bg: "bg-[#9333EA]/20", text: "text-[#9333EA]" }
      case "project":
        return { icon: FileText, bg: "bg-green-900/20", text: "text-green-400" }
      default:
        return { icon: Bell, bg: "bg-gray-900/20", text: "text-gray-400" }
    }
  }

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => {
        const { icon: Icon, bg, text } = getLogStyle(log.type)

        return (
          <div key={log.id} className="flex items-start p-3 bg-[#1e1e2d] rounded-lg">
            <div className={`${bg} p-2 rounded-lg mr-3 flex-shrink-0`}>
              <Icon size={16} className={text} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-medium text-sm">{log.user}</p>
                <span className="text-gray-400 text-xs">{formatTime(log.timestamp)}</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">{log.action}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ActivityLog
