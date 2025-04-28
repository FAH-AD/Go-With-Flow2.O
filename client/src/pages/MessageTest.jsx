import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { MessageSquare } from 'lucide-react'

/**
 * A button component to start a conversation with a freelancer from a job posting
 * 
 * @param {Object} props
 * @param {string} props.userId - The ID of the user to message
 * @param {string} props.jobId - Optional job ID to associate with the conversation
 * @param {string} props.buttonText - Optional custom button text
 * @param {string} props.variant - Button variant: "primary", "secondary", or "icon"
 * @param {string} props.size - Button size: "sm", "md", or "lg"
 */
const MessageTest = ({ 
  userId, 
  jobId = null, 
  buttonText = "Message", 
  variant = "primary",
  size = "md" 
}) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.Auth.user)
  const [isLoading, setIsLoading] = useState(false)
  
  // Handle click to start a conversation
  const handleStartConversation = async () => {
    if (!user) {
      navigate("/login", { 
        state: { 
          from: jobId ? `/jobs/${jobId}` : "/", 
          message: "Please login to send messages" 
        } 
      })
      return
    }
    
    setIsLoading(true)
    const dummyPayload = {
        participantId: "675740971d148668a920b186"  // This is a fake MongoDB ObjectId
      }
    try {
      // Create or get conversation
      const payload = { userId }
      if (jobId) payload.jobId = jobId
      
      const response = await fetch("http://localhost:5000/api/messages/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({
            userId: "680cad7c9b413fc58f51843e",
            jobId: "680bd9a59b5c8298f1d48054"
          })
      })
      
      if (!response.ok) {
        throw new Error("Failed to create conversation")
      }
      
      const data = await response.json()
      
      // Navigate to the conversation
      navigate(`/client/messaging`)
      
    } catch (error) {
      console.error("Error starting conversation:", error)
      // You could show an error toast here
    } finally {
      setIsLoading(false)
    }
  }
  
  // Button variants
  const variantClasses = {
    primary: "bg-[#9333EA] hover:bg-[#7e22ce] text-white",
    secondary: "bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white border border-[#2d2d3a]",
    icon: "bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white p-2 rounded-full"
  }
  
  // Button sizes
  const sizeClasses = {
    sm: "text-xs py-1 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-3 px-6"
  }
  
  // For icon variant
  if (variant === "icon") {
    return (
      <button
        onClick={handleStartConversation}
        disabled={isLoading}
        className={`${variantClasses[variant]} rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:ring-opacity-50`}
        title="Send message"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <MessageSquare size={variant === "sm" ? 14 : variant === "lg" ? 20 : 16} />
        )}
      </button>
    )
  }
  
  return (
    <button
      onClick={handleStartConversation}
      disabled={isLoading}
      className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <MessageSquare size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
      )}
      <span>{buttonText}</span>
    </button>
  )
}

export default MessageTest
