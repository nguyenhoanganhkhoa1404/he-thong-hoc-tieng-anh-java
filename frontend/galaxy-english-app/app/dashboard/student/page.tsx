// app/dashboard/student/page.tsx — Nhóm 4+5: Student Dashboard
"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/layout/Sidebar";
import { mockCourses, mockLeaderboard, mockPlan } from "@/data/mockData";
import Button from "@/components/ui/Button";

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br ${color}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function StudentDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-violet-400 animate-pulse text-lg">Loading Galaxy...</div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="ml-64 flex-1 p-8 max-w-full">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-slate-400 text-sm mb-1">Welcome back,</p>
            <h1 className="text-3xl font-extrabold text-white">
              {user?.displayName || "Learner"} <span className="gradient-text">✨</span>
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="glass border border-violet-500/30 px-3 py-1 rounded-full text-xs text-violet-300">
                Level {user?.level || "A1"}
              </span>
              <span className="glass border border-cyan-500/30 px-3 py-1 rounded-full text-xs text-cyan-300">
                🔥 {user?.streak || 7} day streak
              </span>
              <span className="glass border border-yellow-500/30 px-3 py-1 rounded-full text-xs text-yellow-300">
                ⚡ {user?.xp || 4200} XP
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="📚" label="Courses Enrolled" value={3} sub="+1 this week" color="from-violet-900/30 to-violet-800/10" />
            <StatCard icon="🎯" label="Quiz Score" value="82%" sub="Avg last 10 quizzes" color="from-cyan-900/30 to-cyan-800/10" />
            <StatCard icon="🔤" label="Words Learned" value={240} sub="45 this week" color="from-emerald-900/30 to-emerald-800/10" />
            <StatCard icon="🏆" label="Global Rank" value="#5" sub="Top 10 leaderboard" color="from-amber-900/30 to-amber-800/10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Courses */}
            <div className="lg:col-span-2 glass border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">My Courses</h2>
                <Link href="/courses" className="text-xs text-violet-400 hover:text-violet-300">View all →</Link>
              </div>
              <div className="space-y-3">
                {mockCourses.slice(0, 3).map(course => (
                  <Link key={course.id} href={`/courses/${course.id}`}>
                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-xl flex-shrink-0">
                        📚
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{course.title}</p>
                        <p className="text-xs text-slate-400">{course.teacher.displayName}</p>
                        <div className="mt-1.5 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="progress-neon h-full rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }} />
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 flex-shrink-0">{Math.round(Math.random() * 60 + 20)}%</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/courses"><Button variant="ghost" size="sm" className="w-full">Browse More Courses</Button></Link>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Today's Plan */}
              <div className="glass border border-white/10 rounded-2xl p-5">
                <h2 className="text-sm font-bold text-white mb-4">📅 Today&apos;s Plan</h2>
                <div className="space-y-2">
                  {mockPlan.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${task.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-600"}`}>
                        {task.completed && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`text-xs ${task.completed ? "line-through text-slate-500" : "text-slate-300"}`}>{task.title}</span>
                      <span className="ml-auto text-xs text-slate-500">{task.durationMinutes}m</span>
                    </div>
                  ))}
                </div>
                <Link href="/plan"><Button variant="outline" size="sm" className="w-full mt-4">View Full Plan</Button></Link>
              </div>

              {/* Leaderboard */}
              <div className="glass border border-white/10 rounded-2xl p-5">
                <h2 className="text-sm font-bold text-white mb-4">🏆 Leaderboard</h2>
                <div className="space-y-2">
                  {mockLeaderboard.slice(0, 5).map(entry => (
                    <div key={entry.rank} className="flex items-center gap-3">
                      <span className={`text-xs font-bold w-5 text-center ${entry.rank <= 3 ? "text-yellow-400" : "text-slate-500"}`}>
                        {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {entry.user.displayName.charAt(0)}
                      </div>
                      <span className="text-xs text-slate-300 flex-1 truncate">{entry.user.displayName}</span>
                      <span className="text-xs text-violet-400 font-bold">{entry.xp.toLocaleString()} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: "/vocabulary", icon: "🔤", label: "Study Vocab" },
              { href: "/quiz", icon: "🎯", label: "Take Quiz" },
              { href: "/listening", icon: "🎧", label: "Practice Listening" },
              { href: "/forum", icon: "💬", label: "Join Forum" },
            ].map(a => (
              <Link key={a.href} href={a.href}>
                <div className="glass border border-white/10 rounded-xl p-4 text-center card-hover cursor-pointer">
                  <div className="text-2xl mb-2">{a.icon}</div>
                  <p className="text-xs font-semibold text-slate-300">{a.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
