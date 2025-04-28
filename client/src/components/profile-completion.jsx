import { useState, useEffect } from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"
import axios from "axios"

const ProfileCompletion = ({ userId }) => {
  const [profileData, setProfileData] = useState(null)
  const [tasks, setTasks] = useState([])
  const [completionPercentage, setCompletionPercentage] = useState(0)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user-profile/${userId}`)
        const user = response.data.data.user
        setProfileData(user)

        const calculatedTasks = calculateCompletionTasks(user)
        setTasks(calculatedTasks)

        const completedTasksCount = calculatedTasks.filter(task => task.completed).length
        const percentage = Math.round((completedTasksCount / calculatedTasks.length) * 100)
        setCompletionPercentage(percentage)

      } catch (error) {
        console.error("Error fetching profile data:", error)
      }
    }

    fetchProfileData()
  }, [userId])

  const calculateCompletionTasks = (user) => {
    return [
      { title: "Upload profile picture", completed: !!user.profilePic },
      { title: "Add portfolio items", completed: user.portfolio && user.portfolio.length > 0 },
      { title: "Complete skills section", completed: user.skills && user.skills.length > 0 },
      { title: "Add hourly rate", completed: !!user.hourlyRate },
      { title: "Add bio", completed: !!user.bio },
    ]
  }

  if (!profileData) {
    return <div>Loading...</div>
  }

  if (completionPercentage === 100) {
    return (
      <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] p-6">
        <h2 className="text-xl font-bold mb-4">Profile Complete!</h2>
        <div className="space-y-2">
          <p><span className="text-gray-400">Name:</span> {profileData.name}</p>
          <p><span className="text-gray-400">Title:</span> {profileData.title}</p>
          <p><span className="text-gray-400">Success Score:</span> {profileData.successScore || 'N/A'}</p>
          <p><span className="text-gray-400">Total Earnings:</span> ${profileData.totalEarnings?.toLocaleString() || '0'}</p>
          <p><span className="text-gray-400">Completed Jobs:</span> {profileData.completedJobs || '0'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#121218] rounded-lg border border-[#2d2d3a] p-6">
      <h2 className="text-xl font-bold mb-4">Profile Completion</h2>
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-white">{completionPercentage}% Complete</span>
        </div>
        <div className="w-full bg-[#1e1e2d] rounded-full h-2.5">
          <div className="bg-[#9333EA] h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div key={index} className="flex items-center">
            {task.completed ? (
              <CheckCircle2 size={16} className="text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-yellow-500 mr-2 flex-shrink-0" />
            )}
            <span className={`text-sm ${task.completed ? "text-gray-400" : "text-white"}`}>{task.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfileCompletion
