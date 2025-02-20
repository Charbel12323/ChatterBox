const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors()); // Enable CORS for all requests

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001", // Make sure this matches your frontend
        methods: ["GET", "POST"],
    },
});

const usersInRoom = {}; // Stores active users in rooms

io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    // ✅ Store user data for this session
    let currentUser = { uid: socket.id, username: `Guest-${socket.id}` };

    // ✅ Handle General Chat Messages
    socket.on("general-message", ({ username, message }) => {
        console.log(`📩 ${username} sent: ${message}`);
        io.emit("message", { sender: username, text: message });
    });

    // ✅ Handle Room Joining

    
    socket.on("join-room", ({ room, uid, username }) => {
        socket.join(room);
        console.log(`🏠 ${username} joined room: ${room}`);

        currentUser = { uid, username }; // Store user info

        if (!usersInRoom[room]) {
            usersInRoom[room] = [];
        }

        // ✅ Avoid duplicate users
        const isUserAlreadyInRoom = usersInRoom[room].some(user => user.uid === uid);
        if (!isUserAlreadyInRoom) {
            usersInRoom[room].push({ uid, username });
        }

        // ✅ Notify room about new user
        io.to(room).emit("group-message", {
            sender: "Server",
            text: `${username} has joined ${room}`,
            timestamp: new Date().toLocaleTimeString(),
        });

        // ✅ Send updated user list
        io.to(room).emit("active-users", usersInRoom[room]);
    });

    // ✅ Handle Room-Based Messaging
    socket.on("group-message", ({ room, uid, username, message }) => {
        if (!room || !uid || !username || !message) {
            console.error("⚠️ Missing required fields in group-message:", { room, uid, username, message });
            return;
        }
    
        console.log(`📨 ${username} in ${room}: ${message}`);
    
        io.to(room).emit("group-message", {
            sender: username,
            text: message,
            timestamp: new Date().toLocaleTimeString(),
        });
    });
    

    // ✅ Handle Disconnect
    socket.on("disconnect", () => {
        console.log(`🔴 User Disconnected: ${currentUser.username} (${socket.id})`);

        // ✅ Remove user from all rooms
        for (const room in usersInRoom) {
            usersInRoom[room] = usersInRoom[room].filter(user => user.uid !== currentUser.uid);
            io.to(room).emit("active-users", usersInRoom[room]); // Update user list
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
