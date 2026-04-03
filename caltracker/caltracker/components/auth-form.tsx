
"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (mode === "signup") {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            router.push("/journal");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Une erreur est survenue.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-black p-4">
            <div className="w-full max-w-md glass-panel rounded-3xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-black text-white">
                        {mode === "login" ? "Connexion" : "Inscription"}
                    </h1>
                    <p className="text-sm text-neutral-400">
                        {mode === "login"
                            ? "Entrez vos identifiants pour accéder à votre espace."
                            : "Créez un compte pour commencer à suivre vos calories."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                            {error}
                        </p>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-neutral-300">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-bold text-neutral-300">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-black text-lg py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Chargement..."
                            : mode === "login"
                                ? "Se connecter"
                                : "S'inscrire"}
                    </button>

                    <p className="text-sm text-center text-neutral-500">
                        {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}
                        <button
                            type="button"
                            className="text-white font-bold ml-1 hover:underline"
                            onClick={() => router.push(mode === "login" ? "/signup" : "/login")}
                        >
                            {mode === "login" ? "S'inscrire" : "Se connecter"}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
