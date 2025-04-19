import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// Emit event when user comes online
export const setUserOnline = (userId) => {
    socket.emit("user-online", userId);
};

// Send message
export const sendMessage = (messageData) => {
    socket.emit("send-message", messageData);
};

// Listen for new messages
export const listenForMessages = (callback) => {
    socket.on("receive-message", callback);
};

// Get online users
export const listenForOnlineUsers = (callback) => {
    socket.on("update-online-users", callback);
};

export default socket;
