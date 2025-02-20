'use client'

import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Gamepad2, Github, Mail } from "lucide-react"
import { AuthWrapper } from "@/app/components/authwrapper"
import { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"; // Firebase Auth functions
import { useRouter } from "next/navigation"; // ✅ Redirect user after login
import { auth, googleProvider } from "@/firebase"; // Import Firebase

export default function LoginPage() {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter(); // ✅ Redirect after login

    // ✅ Handle Email & Password Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        if (!email.trim() || !password.trim()) {
            setError("Email and password are required.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/mainpage');
         
            
        } catch (err) {
            if (err.code === "auth/user-not-found") {
                setError("No account found with this email.");
            } else if (err.code === "auth/wrong-password") {
                setError("Incorrect password. Try again.");
            } else if (err.code === "auth/invalid-email") {
                setError("Invalid email format.");
            } else {
                setError(err.message);
            }
        }
    };

    // ✅ Handle Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push('/mainpage');

        } catch (err) {
            setError("Google Sign-In failed. Please try again.");
            console.error("Google Sign-In Error:", err.message);
        }
    };
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-[Press_Start_2P] antialiased">
      {/* Header */}
      <header className="border-b-4 border-[#4ade80] bg-[#1e293b] px-4 py-3">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-[#4ade80]" />
            <span className="text-lg tracking-wider">PIXEL8</span>
          </Link>
        </div>
      </header>

      <main className="container max-w-[400px] mx-auto px-4 py-12">
        <AuthWrapper>
          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl text-[#4ade80] mb-2">PLAYER LOGIN</h1>
            <p className="text-xs text-[#94a3b8] font-sans">Login to continue your adventure</p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs">
                EMAIL
              </Label>
              <Input
               
                value = {email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter email"
                className="border-[#4ade80] bg-[#0f172a] font-sans"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs">
                PASSWORD
              </Label>
              <Input
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
                className="border-[#4ade80] bg-[#0f172a] font-sans"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link href="/auth/forgot-password" className="text-xs text-[#4ade80] hover:underline font-sans">
                Forgot password?
              </Link>
            </div>

            <Button variant="pixel" className="w-full text-sm" type="submit">
              LOGIN
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#4ade80]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1e293b] px-2 text-[#4ade80]">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid gap-4">
            <Button variant="outline" className="border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80]/10">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button onClick={handleGoogleSignIn}   variant="outline" className="border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80]/10">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-sm font-sans">
            <span className="text-[#94a3b8]">New player? </span>
            <Link href="/auth/signup" className="text-[#4ade80] hover:underline">
              Sign up
            </Link>
          </div>
        </AuthWrapper>
      </main>
    </div>
  )
}

