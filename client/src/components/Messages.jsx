import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const Chat = ({ jobId, clientId, freelancerId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.emit("joinRoom", { jobId });

        axios.get(`http://localhost:5000/chat/${jobId}`)
            .then(response => setMessages(response.data))
            .catch(error => console.error(error));

        socket.on("receiveMessage", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [jobId]);

    const sendMessage = async () => {
        if (message.trim() === "") return;
        const newMessage = { jobId, senderId: currentUser, text: message };

        try {
            await axios.post("http://localhost:5000/api/messages/message", newMessage);
            socket.emit("sendMessage", newMessage);
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div>
            <h3>Chat for Job {jobId}</h3>
            <div style={{ border: "1px solid gray", padding: "10px", height: "300px", overflowY: "auto" }}>
                {messages.map((msg, index) => (
                    <p key={index} style={{ textAlign: msg.senderId === currentUser ? "right" : "left" }}>
                        <strong>{msg.senderId === clientId ? "Client: " : "Freelancer: "}</strong>
                        {msg.text}
                    </p>
                ))}
            </div>
            <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Type a message..." 
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
