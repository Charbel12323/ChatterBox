'use client'

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// ✅ Define a proper type for user data
type UserType = {
    uid: string;
    email: string;
    username: string;
    profilePic?: string;
} | null;

type AuthContextType = {
    user: UserType;
};

// ✅ Create AuthContext with the correct type
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                if (userDoc.exists()) {
                    setUser(userDoc.data() as UserType);
                } else {
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email!,
                        username: firebaseUser.displayName || "User",
                        profilePic: firebaseUser.photoURL || "",
                    });
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

// ✅ Custom Hook to Get User
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
