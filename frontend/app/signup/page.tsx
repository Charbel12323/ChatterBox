'use client'

import React, { useState } from 'react'
import { auth, db, googleProvider } from "@/firebase"; // Import Google Auth
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth"; // Import Google sign-in
import { doc, setDoc } from "firebase/firestore"; // Firestore functions

import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Gamepad2, Github, Mail } from "lucide-react"
import { AuthWrapper } from "@/app/components/authwrapper"

const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [username, setUsername] = useState(""); // New field for extra user data

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match. Please try again.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                username: username,
                createdAt: new Date(),
            });

            alert("User Registered Successfully!");
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setError("");
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setError("This email is already in use. Try logging in.");
            } else if (err.code === "auth/invalid-email") {
                setError("Invalid email format. Please enter a valid email.");
            } else if (err.code === "auth/weak-password") {
                setError("Password is too weak. Try a stronger one.");
            } else {
                setError(err.message);
            }
        }
    };

    // ✅ Google Sign-In Function
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user; // Get user info

            // ✅ Check if user exists in Firestore
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                username: user.displayName, // Get Google username
                profilePic: user.photoURL,  // Get Google profile picture
                createdAt: new Date(),
            }, { merge: true });

            alert(`Welcome ${user.displayName}!`);
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
                        <h1 className="text-2xl text-[#4ade80] mb-2">NEW PLAYER</h1>
                        <p className="text-xs text-[#94a3b8] font-sans">Create your player profile</p>
                    </div>

                    {/* Display Error Message */}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {/* Auth Form */}
                    <form onSubmit={handleSignUp} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-xs">USERNAME</Label>
                            <Input type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border-[#4ade80] bg-[#0f172a] font-sans" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs">EMAIL</Label>
                            <Input type="email" value={email} placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} className="border-[#4ade80] bg-[#0f172a] font-sans" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs">PASSWORD</Label>
                            <Input type="password" value={password} placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} className="border-[#4ade80] bg-[#0f172a] font-sans" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="text-xs">CONFIRM PASSWORD</Label>
                            <Input type="password" value={confirmPassword} placeholder="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)} className="border-[#4ade80] bg-[#0f172a] font-sans" />
                        </div>

                        <Button variant="pixel" className="w-full text-sm" type="submit">SIGN UP</Button>
                    </form>

                    {/* Social Login */}
                    <div className="grid gap-4 mt-4">
                        <Button variant="outline" onClick={handleGoogleSignIn} className="border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80]/10">
                            <Mail className="mr-2 h-4 w-4" />
                            Sign in with Google
                        </Button>
                    </div>

                    <div className="mt-8 text-center text-sm font-sans">
            <span className="text-[#94a3b8]">Already have an account? </span>
            <Link href="/login" className="text-[#4ade80] hover:underline">
              Login
            </Link>
          </div>
                </AuthWrapper>
            </main>
        </div>
    );
};

export default SignupPage;
