"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useBudgetStore, setupStoreSync } from "@/store/budgetStore";

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubSync: (() => void) | undefined;

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            useBudgetStore.getState().setUid(user ? user.uid : null);

            if (user) {
                unsubSync = setupStoreSync(user.uid);
            } else {
                if (unsubSync) unsubSync();
                useBudgetStore.setState({ transactions: [], monthlyLimit: 2000, savingsGoal: 1000, savingsProgress: 0, gamePoints: 0 });
            }

            setLoading(false);
        });

        return () => {
            unsubscribe();
            if (unsubSync) unsubSync();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
