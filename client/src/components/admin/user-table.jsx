import { MoreHorizontal, CheckCircle, AlertCircle } from "lucide-react"

const UserTable = ({ users }) => {
  // Helper function to determine status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return { bg: "bg-green-900/20", text: "text-green-400", icon: CheckCircle }
      case "pending":
        return { bg: "bg-yellow-900/20", text: "text-yellow-400", icon: AlertCircle }
      case "suspended":
        return { bg: "bg-red-900/20", text: "text-red-400", icon: AlertCircle }
      default:
        return { bg: "bg-gray-900/20", text: "text-gray-400", icon: AlertCircle }
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm">
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3 hidden md:table-cell">Joined</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const statusBadge = getStatusBadge(user.status)
            const StatusIcon = statusBadge.icon

            return (
              <tr key={user.id} className="border-t border-[#2d2d3a] hover:bg-[#1e1e2d]">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-[#9333EA]/20 px-2 py-1 text-xs font-medium text-[#9333EA] capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-sm">
                  {new Date(user.joined).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div
                    className={`flex items-center ${statusBadge.bg} ${statusBadge.text} px-2 py-1 rounded-full text-xs`}
                  >
                    <StatusIcon size={12} className="mr-1" />
                    <span className="capitalize">{user.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative inline-block">
                    <button className="p-1 hover:bg-[#2d2d3a] rounded-full">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
