import { Button } from "@/app/components/ui/button"
import { ChevronRight, Gamepad2, Zap, Trophy, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-[Press_Start_2P] antialiased">
      {/* Header */}
      <header className="border-b-4 border-[#4ade80] bg-[#1e293b] px-4 py-3">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-[#4ade80]" />
            <span className="text-lg tracking-wider">ChatterBox</span>
          </Link>
          <nav className="hidden sm:flex gap-8">
            <Link href="#" className="hover:text-[#4ade80] transition-colors text-sm">
              Chat
            </Link>
            <Link href="#" className="hover:text-[#4ade80] transition-colors text-sm">
              ABOUT
            </Link>
            
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block animate-pulse">
              <div className="px-4 py-1 bg-[#4ade80] text-[#0f172a] text-sm">NEW RELEASE</div>
            </div>
            <h1 className="text-4xl md:text-5xl leading-tight">
              ENTER THE
              <br />
              <span className="text-[#4ade80]">PIXEL VERSE</span>
            </h1>
            <p className="text-[#94a3b8] leading-relaxed font-sans">
              Experience the ultimate retro gaming adventure. Join thousands of players in a pixelated universe of
              endless possibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">

                <Button className="group bg-[#4ade80] hover:bg-[#4ade80]/90 text-[#0f172a] font-[Press_Start_2P] text-sm">
                PLAY NOW
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
                
                
                </Link>
              
              <Button
                variant="outline"
                  className="border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80]/10 font-[Press_Start_2P] text-sm"
              >
                LEARN MORE
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square relative">
              <Image
                src="/placeholder.svg?height=512&width=512"
                alt="Retro Game Character"
                width={512}
                height={512}
                className="object-contain"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container px-4  ">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl text-[#4ade80] mb-4">FEATURES</h2>
          <p className="text-[#94a3b8] font-sans">Level up your gaming experience with our unique features</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="h-8 w-8" />,
              title: "INSTANT PLAY",
              description: "Jump right into the action with no downloads required",
            },
            {
              icon: <Trophy className="h-8 w-8" />,
              title: "LEADERBOARDS",
              description: "Compete globally and climb the rankings",
            },
            {
              icon: <Users className="h-8 w-8" />,
              title: "MULTIPLAYER",
              description: "Team up or battle against players worldwide",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 border-2 border-[#4ade80] bg-[#1e293b] hover:bg-[#1e293b]/80 transition-colors"
            >
              <div className="mb-4 text-[#4ade80]">{feature.icon}</div>
              <h3 className="text-lg mb-2">{feature.title}</h3>
              <p className="text-[#94a3b8] font-sans">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container px-4 py-16 md:py-24">
        <div className="border-2 border-[#4ade80] p-8 md:p-12 text-center bg-[#1e293b]">
          <h2 className="text-2xl md:text-3xl mb-6">READY TO START?</h2>
          <p className="text-[#94a3b8] mb-8 max-w-2xl mx-auto font-sans">
            Join our community of retro gaming enthusiasts and start your pixel adventure today.
          </p>
          <Button className="bg-[#4ade80] hover:bg-[#4ade80]/90 text-[#0f172a] font-[Press_Start_2P] text-sm">
            CREATE ACCOUNT
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-[#4ade80] bg-[#1e293b] px-4 py-8">
        <div className="container text-center text-sm text-[#94a3b8]">
          <p className="font-sans">&copy; {new Date().getFullYear()} PIXEL8. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

