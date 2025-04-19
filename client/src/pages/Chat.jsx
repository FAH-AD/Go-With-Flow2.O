import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const socket = io("http://localhost:5000"); // Backend Socket.io Server

const Chat = () => {
  const user = useSelector((state) => state.Auth.user);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [freelancerId, setFreelancerId] = useState(null);

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to chat.");
      return;
    }

    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:5000/api/jobs/67b9d60d4cfe32251730de21/applications",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success && response.data.applications.length > 0) {
          setJobId(response.data.applications[0].jobId);
          setFreelancerId(response.data.applications[0].freelancerId._id);
        } else {
          toast.error("No jobs available.");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs.");
      }
    };

    fetchJobs();
  }, [user]);

  useEffect(() => {
    if (!jobId || !freelancerId) return;

    const fetchChatDetails = async () => {
      try {
        const res = await axios.post("/api/messages/start", {
          jobId: jobId,
          clientId: user.role === "client" ? user._id : null,
          freelancerId: freelancerId,
        });

        setChatId(res.data._id);
        setMessages(res.data.messages || []);

        // Join chat room for real-time updates
        socket.emit("joinRoom", { jobId });
      } catch (error) {
        console.error("Error fetching chat:", error);
        toast.error("Error loading chat.");
      }
    };

    fetchChatDetails();

    // Listen for new messages
    const messageListener = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("receiveMessage", messageListener);

    return () => {
      socket.off("receiveMessage", messageListener); // Cleanup listener
    };
  }, [jobId, freelancerId, user]);

  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error("Cannot send an empty message.");
      return;
    }

    const chatData = {
      jobId: jobId,
      clientId: user.role === "client" ? user._id : null,
      freelancerId: user.role === "freelancer" ? user._id : freelancerId,
      senderId: user?._id,
      text: message,
      clientName: user.name,
    };

    // Emit message to Socket.IO
    socket.emit("sendMessage", chatData);

    // Optimistically update UI before saving to DB
    setMessages((prev) => [...prev, { ...chatData, timestamp: new Date().toISOString() }]);
    setMessage("");

    try {
      await axios.post("/api/messages/message", chatData);
    } catch (err) {
      console.error("Error saving message:", err);
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-3">Chat about this Job</h2>

      {jobId ? (
        <>
          <div className="h-64 overflow-y-auto bg-gray-800 p-3 rounded-md">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.senderId === user?._id ? "text-right" : "text-left"}`}
              >
                <p
                  className={`inline-block p-2 rounded-md ${
                    msg.senderId === user?._id ? "bg-purple-600" : "bg-gray-700"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          <div className="flex mt-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-l-md text-black"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="bg-purple-600 px-4 py-2 rounded-r-md" onClick={sendMessage}>
              Send
            </button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Chat;
