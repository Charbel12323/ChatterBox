const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors()); // Enable CORS for all requests

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // ✅ General Chat Messages
    socket.on("general-message", (data) => {
        console.log(`${socket.id} has sent: ${data}`);
        io.emit("message", { sender: socket.id, text: data }); // ✅ Fixed emit
    });

    // ✅ Handle Room Joining
    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
        io.to(room).emit("room-update", { sender: "Server", text: `${socket.id} has joined ${room}` });
    });

    // ✅ Room-Based Messaging
    socket.on("group-message", ({ room, message }) => {
        console.log(`Message in ${room} from ${socket.id}: ${message}`);
        io.to(room).emit("group-message", { sender: socket.id, text: message });
    });

    // ✅ Handle Disconnect
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
