"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Welcome back!");
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                toast.success("Account created successfully!");
            }
            router.push('/');
        } catch (error: any) {
            toast.error(error.message || "An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass-card rounded-2xl p-8 z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                        💜 BudgetFlow
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {isLogin ? 'Welcome back! Please enter your details.' : 'Create an account to start tracking.'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary hover:underline font-medium transition-colors"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
