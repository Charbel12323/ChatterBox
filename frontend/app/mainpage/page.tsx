'use client'


import { Button } from "@/app/components/ui/button"
import { Gamepad2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {io} from "socket.io-client"
import {useState} from 'react'
import { useRouter } from "next/navigation"
import { join } from "path"


const socket = io("http://localhost:5000");
const gameCategories = [
  {
    name: "ARCADE",
    image: "/placeholder.svg?height=200&width=200",
    players: "1-2 Players",
    difficulty: "Easy",
  },
  {
    name: "RPG",
    image: "/placeholder.svg?height=200&width=200",
    players: "1-4 Players",
    difficulty: "Medium",
  },
  {
    name: "PLATFORMER",
    image: "/placeholder.svg?height=200&width=200",
    players: "1 Player",
    difficulty: "Hard",
  },
  {
    name: "PUZZLE",
    image: "/placeholder.svg?height=200&width=200",
    players: "1 Player",
    difficulty: "Medium",
  },
  {
    name: "RACING",
    image: "/placeholder.svg?height=200&width=200",
    players: "2-4 Players",
    difficulty: "Easy",
  },
  {
    name: "FIGHTING",
    image: "/placeholder.svg?height=200&width=200",
    players: "2 Players",
    difficulty: "Hard",
  },
]

export default function Page() {
  const router = useRouter();



  const joinRoom = (roomName) => {
    router.push(`/rooms/${roomName}`)
    
  }



  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-[Press_Start_2P] antialiased">
      {/* Header */}
      <header className="border-b-4 border-[#4ade80] bg-[#1e293b] px-4 py-3">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-[#4ade80]" />
            <span className="text-lg tracking-wider">PIXEL8</span>
          </Link>
          <nav className="hidden sm:flex gap-8">
            <Link href="#" className="hover:text-[#4ade80] transition-colors text-sm">
              GAMES
            </Link>
            <Link href="#" className="hover:text-[#4ade80] transition-colors text-sm">
              PROFILE
            </Link>
            <Link href="#" className="hover:text-[#4ade80] transition-colors text-sm">
              SCORES
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl text-[#4ade80] mb-4">SELECT YOUR ROOM</h1>
          <p className="text-[#94a3b8] font-sans">Choose from our collection of retro-style games</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {gameCategories.map((category, index) => (
            <div
              key={index}
              className="group relative bg-[#1e293b] border-2 border-[#4ade80] p-4 transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-square mb-4 overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent opacity-60" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl text-center text-[#4ade80]">{category.name}</h2>
                  <div className="flex justify-between text-xs font-sans text-[#94a3b8]">
                    <span>{category.players}</span>
                    <span>{category.difficulty}</span>
                  </div>
                </div>

                <Button variant="pixel" className="w-full text-xs" onClick={() => joinRoom(category.name.toLowerCase())}>
  JOIN ROOM
</Button>

              </div>

              {/* Pixel Corners */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-[#4ade80]" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#4ade80]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#4ade80]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#4ade80]" />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-[#4ade80] bg-[#1e293b] px-4 py-8 mt-12">
        <div className="container text-center text-sm text-[#94a3b8]">
          <p className="font-sans">&copy; {new Date().getFullYear()} PIXEL8. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

