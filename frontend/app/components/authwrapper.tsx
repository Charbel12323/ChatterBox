import type React from "react"
interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <div className="relative">
      {/* Pixel Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-[#4ade80]" />
      <div className="absolute top-0 right-0 w-2 h-2 bg-[#4ade80]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#4ade80]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#4ade80]" />

      <div className="border-2 border-[#4ade80] bg-[#1e293b] p-6 md:p-8">{children}</div>
    </div>
  )
}

