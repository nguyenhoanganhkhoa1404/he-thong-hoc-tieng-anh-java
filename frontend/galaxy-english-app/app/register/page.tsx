// app/register/page.tsx — Nhóm 1: Register with role selection
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const StarField = dynamic(() => import("@/components/background/StarField"), { ssr: false });

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<"LEARNER" | "TEACHER">("LEARNER");
  const [form, setForm] = useState({ displayName: "", email: "", password: "", teacherId: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); setLoading(true);
    try {
      const data = await register({ ...form, role });
      if (data.message?.includes("thành công") || data.token !== undefined) {
        setMessage({ type: "success", text: "Account created! Redirecting to login... 🎉" });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Registration failed. Please try again." });
      }
    } catch {
      setMessage({ type: "error", text: "Cannot connect to server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-8">
      <StarField />
      <div className="fixed inset-0 gradient-bg-hero z-0" />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-violet-500 flex items-center justify-center text-2xl mx-auto mb-4 glow-cyan">🚀</div>
            <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
            <p className="text-slate-400 text-sm mt-1">Join the galaxy of English learners</p>
          </div>

          {/* Role selection */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">I am a...</p>
            <div className="grid grid-cols-2 gap-3">
              {(["LEARNER", "TEACHER"] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-4 rounded-2xl border text-center transition-all duration-200 ${
                    role === r
                      ? "border-violet-500 bg-violet-600/20 text-white glow-purple"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <div className="text-2xl mb-2">{r === "LEARNER" ? "🎓" : "👩‍🏫"}</div>
                  <div className="text-sm font-semibold">{r === "LEARNER" ? "Student" : "Teacher"}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{r === "LEARNER" ? "Learn English" : "Teach Courses"}</div>
                </button>
              ))}
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-xl text-sm border ${
              message.type === "error" ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            }`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="Nguyen Van A" icon="👤"
              value={form.displayName} onChange={e => setForm({...form, displayName: e.target.value})} required />
            <Input label="Email" type="email" placeholder="your@email.com" icon="📧"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <Input label="Password" type="password" placeholder="At least 6 characters" icon="🔒"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
            {role === "TEACHER" && (
              <Input label="Teacher ID" placeholder="TCH-2026-..." icon="🔑"
                value={form.teacherId} onChange={e => setForm({...form, teacherId: e.target.value})} required />
            )}
            <div className="pt-2">
              <Button type="submit" variant="neon" size="lg" loading={loading} className="w-full">
                ✨ Create Free Account
              </Button>
            </div>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
