"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Gamepad2, Users, Smile, Send, Volume2, VolumeX, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/Authcontent"; // ✅ Import user auth


// ✅ Connect to WebSocket server
const socket = io("http://localhost:5000");

// ✅ Define types for messages and users
type Message = {
    sender: string;
    text: string;
    timestamp: string;
};

type User = {
    username: string;
    uid: string;
    status: "online" | "offline";
};

export default function RoomPage() {
    const { user } = useAuth(); // ✅ Get the logged-in user

    const { roomName } = useParams() as { roomName: string };

    const [message, setMessage] = useState<string>(""); // ✅ Message input state
    const [messages, setMessages] = useState<Message[]>([]); // ✅ Message array
    const [users, setUsers] = useState<User[]>([]); // ✅ Active users
    const [isMuted, setIsMuted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // ✅ Runs when user enters a new room
    useEffect(() => {

        if (!user) return; // Make sure no user is logged in


        const username = user.username; // Get the username of the user

        if (socket.connected) {
          socket.emit("join-room", { room: roomName, uid: user.uid, username });
        } else {
          socket.on("connect", () => {
            socket.emit("join-room", { room: roomName, uid: user.uid, username });
          });
        }


        // 📩 Listen for incoming messages
        socket.on("group-message", (data: Message) => {
          console.log("📩 New message received:", data); // ✅ Debug log
          setMessages((prev) => [...prev, data]);
      });

        // 🟢 Listen for active users in the room
        socket.on("active-users", (data: User[]) => {
            setUsers(data);
        });

        return () => {
            socket.off("group-message");
            socket.off("active-users");
        };
    }, [roomName, user]);

    // ✅ Handle sending messages
    const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;
  
      
      if (!user) {
          alert("You must be logged in to send messages.");
          return;
      }
  
      socket.emit("group-message", {
          room: roomName,
          uid: user.uid,
          username: user.username || `Guest-${user.uid.substring(0, 5)}`, // Default guest name
          message,
      });
  
      setMessage("");
  };
  
    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-[Press_Start_2P] antialiased flex flex-col">
            {/* Header */}
            <header className="border-b-4 border-[#4ade80] bg-[#1e293b] px-4 py-3">
                <div className="container flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Gamepad2 className="h-6 w-6 text-[#4ade80]" />
                        <span className="text-lg tracking-wider">PIXEL8</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMuted(!isMuted)} className="text-[#4ade80] hover:text-[#4ade80]/80">
                            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                        <button onClick={() => setIsSidebarOpen(true)} className="text-[#4ade80] hover:text-[#4ade80]/80 md:hidden">
                            <Users className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Room Info */}
                    <div className="bg-[#1e293b] p-4 border-b-2 border-[#4ade80]">
                        <h1 className="text-lg text-[#4ade80]">ROOM: {decodeURIComponent(roomName)}</h1>
                        <p className="text-xs text-[#94a3b8] mt-1 font-sans">{users.length} players in room</p>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className="bg-[#1e293b] p-4 border-2 border-[#4ade80] relative">
                                {/* Pixel Corners */}
                                <div className="absolute top-0 left-0 w-2 h-2 bg-[#4ade80]" />
                                <div className="absolute top-0 right-0 w-2 h-2 bg-[#4ade80]" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#4ade80]" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#4ade80]" />

                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[#4ade80] text-sm">{msg.sender}</span>
                                    <span className="text-[#94a3b8] text-xs font-sans">{msg.timestamp}</span>
                                </div>
                                <p className="text-sm font-sans">{msg.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="bg-[#1e293b] p-4 border-t-2 border-[#4ade80]">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <button type="button" className="text-[#4ade80] hover:text-[#4ade80]/80">
                                <Smile className="h-5 w-5" />
                            </button>
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 border-[#4ade80] bg-[#0f172a] font-sans"
                            />
                            <Button type="submit" variant="pixel" size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Sidebar - Online Users */}
                <div
                    className={`
                        fixed inset-y-0 right-0 w-64 bg-[#1e293b] border-l-2 border-[#4ade80] transform transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
                        md:relative md:translate-x-0
                    `}
                >
                    <div className="p-4 border-b-2 border-[#4ade80] flex justify-between items-center">
                        <h2 className="text-sm text-[#4ade80]">PLAYERS</h2>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-[#4ade80] hover:text-[#4ade80]/80 md:hidden"
                        >
                            <X className="h-5 w-5" />
                        </button>
                   </div>
                    <div className="p-4 space-y-2">
                        {users.map((user, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm font-sans">
                                <span className={`w-2 h-2 rounded-full ${user.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                                {user.username}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
