import { CheckCircle2, AlertCircle } from "lucide-react"

const ProfileCompletion = () => {
  // Sample profile completion tasks
  const tasks = [
    { id: 1, title: "Upload profile picture", completed: true },
    { id: 2, title: "Add portfolio items", completed: true },
    { id: 3, title: "Complete skills section", completed: true },
    { id: 4, title: "Verify your identity", completed: false },
    { id: 5, title: "Link social profiles", completed: false },
  ]

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center">
          {task.completed ? (
            <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-yellow-500 mr-2 flex-shrink-0" />
          )}
          <span className={`text-sm ${task.completed ? "text-gray-400" : "text-white"}`}>{task.title}</span>
        </div>
      ))}
    </div>
  )
}

export default ProfileCompletion
