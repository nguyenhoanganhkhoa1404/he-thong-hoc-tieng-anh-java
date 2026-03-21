// app/login/page.tsx — Nhóm 1: Auth Login with glass card + glow inputs
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const StarField = dynamic(() => import("@/components/background/StarField"), { ssr: false });

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await login({ email, password });
      if (data.token) {
        setSuccess(`Welcome back, ${data.user?.displayName}! 🎉`);
        setTimeout(() => {
          router.push(data.user?.role === "TEACHER" ? "/dashboard/teacher" : "/dashboard/student");
        }, 1200);
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-8">
      <StarField />

      {/* Background glow */}
      <div className="fixed inset-0 gradient-bg-hero z-0" />

      <div className="relative z-10 w-full max-w-md">
        {/* Glass card */}
        <div className="glass border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-2xl mx-auto mb-4 glow-purple">🌟</div>
            <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to continue your learning journey</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              icon="📧"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon="🔒"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <div className="pt-2">
              <Button type="submit" variant="neon" size="lg" loading={loading} className="w-full">
                🔐 Sign In
              </Button>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">
            <p className="font-semibold mb-1">🧪 Demo credentials:</p>
            <p>Student: student@demo.com / 123456</p>
            <p>Teacher: teacher@demo.com / 123456</p>
          </div>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
