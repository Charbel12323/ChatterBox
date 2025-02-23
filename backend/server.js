const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors()); // Enable CORS for all requests

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
    },
});

// Dictionary to store active users per room
const usersInRoom = {}; 

io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

 
    let currentUser = { 
        uid: socket.id, 
        username: `Guest-${socket.id}`,
        status: "online"
    };
      
    // ✅ Handle General Chat Messages
    socket.on("general-message", ({ username, message }) => {
        console.log(`📩 ${username} sent: ${message}`);
        io.emit("message", { sender: username, text: message });
    });

    // ✅ Handle Room Joining
    socket.on("join-room", ({ room, uid, username }) => {
        socket.join(room);
        console.log(`🏠 ${username} joined room: ${room}`);

        // Update currentUser with the provided uid and username,
        // and mark them as online.
        currentUser = { uid, username, status: "online" };

        // If the room doesn't exist yet, initialize it as an empty array.
        if (!usersInRoom[room]) {
            usersInRoom[room] = [];
        }

        // Check if the user is already in the room.
        const existingIndex = usersInRoom[room].findIndex(user => user.uid === uid);
        if (existingIndex !== -1) {
            // If found, update the status to online.
            usersInRoom[room][existingIndex].status = "online";
        } else {
            // Otherwise, add the user with status "online"
            usersInRoom[room].push({ uid, username, status: "online" });
        }

        // Notify room about the new user
        io.to(room).emit("group-message", {
            sender: "Server",
            text: `${username} has joined ${room}`,
            timestamp: new Date().toLocaleTimeString(),
        });

        // Send updated user list to the room
        io.to(room).emit("active-users", usersInRoom[room]);
    });

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
    
    socket.on("disconnect", () => {
        console.log(`🔴 User Disconnected: ${currentUser.username} (${socket.id})`);

        // For each room, update the status of the user (if present) to "offline"
        for (const room in usersInRoom) {
            const userIndex = usersInRoom[room].findIndex(user => user.uid === currentUser.uid);
            if (userIndex !== -1) {
                usersInRoom[room][userIndex].status = "offline";
                // Emit the updated user list so clients can update their view
                io.to(room).emit("active-users", usersInRoom[room]);
            }
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
