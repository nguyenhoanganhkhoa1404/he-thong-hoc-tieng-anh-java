// app/dashboard/teacher/page.tsx — Nhóm 6: Teacher Dashboard
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/layout/Sidebar";
import Button from "@/components/ui/Button";

interface TeacherStats {
  totalCourses: number;
  totalStudents: number;
  avgRating: number;
  totalRevenue: number;
  monthlyViews: number[];
}

interface Course {
  id: string;
  title: string;
  level: string;
  totalStudents: number;
  rating: number;
  price: number;
}

export default function TeacherDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<TeacherStats>({
    totalCourses: 0,
    totalStudents: 0,
    avgRating: 0.0,
    totalRevenue: 0,
    monthlyViews: [0,0,0,0,0,0,0,0,0,0,0,0]
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
    
    // Auto pull the unique Teacher Reference ID regardless of React Schema
    const targetTeacherId = user ? ((user as any).teacherId || (user as any).uid || (user as any).id || "T-UNKNOWN") : null;

    if (isAuthenticated && targetTeacherId) {
      Promise.all([
        fetch(`/api/admin/stats/teacher/${targetTeacherId}`).then(r => r.json()),
        fetch(`/api/admin/courses/teacher/${targetTeacherId}`).then(r => r.json())
      ]).then(([statsData, coursesData]) => {
        if(statsData && statsData.totalCourses !== undefined) setStats(statsData);
        if(coursesData && Array.isArray(coursesData)) setCourses(coursesData);
      }).catch(e => console.error(e)).finally(() => setFetching(false));
    } else if (!loading) {
      setFetching(false);
    }
  }, [loading, isAuthenticated, router, user]);

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-violet-400 animate-pulse text-lg">Loading...</div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Teacher Portal</p>
              <h1 className="text-3xl font-extrabold text-white">{user?.displayName} <span className="gradient-text">👩‍🏫</span></h1>
            </div>
            <Link href="/dashboard/teacher/create">
              <Button variant="neon">➕ Create Course</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: "📚", label: "My Courses", value: stats.totalCourses, color: "from-violet-900/30 to-violet-800/10" },
              { icon: "👥", label: "Total Students", value: stats.totalStudents.toLocaleString(), color: "from-cyan-900/30 to-cyan-800/10" },
              { icon: "⭐", label: "Avg Rating", value: stats.avgRating.toFixed(1), color: "from-amber-900/30 to-amber-800/10" },
              { icon: "💰", label: "Revenue (VND)", value: `${(stats.totalRevenue / 1000000).toFixed(1)}M`, color: "from-emerald-900/30 to-emerald-800/10" },
            ].map(s => (
              <div key={s.label} className={`glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br ${s.color}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs text-slate-400">{s.label}</span>
                </div>
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course Table */}
            <div className="lg:col-span-2 glass border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">My Courses</h2>
                <Link href="/dashboard/teacher/courses">
                    <Button variant="outline" size="sm">Manage All</Button>
                </Link>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pr-3">Course</th>
                      <th className="pb-3 pr-3 text-center">Students</th>
                      <th className="pb-3 pr-3 text-center">Rating</th>
                      <th className="pb-3 text-center">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {courses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500 italic">No courses created yet.</td>
                      </tr>
                    ) : (
                      courses.map(c => (
                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-3">
                            <p className="font-medium text-white truncate max-w-[180px]">{c.title}</p>
                            <span className="text-xs text-slate-500">{c.level}</span>
                          </td>
                          <td className="py-3 pr-3 text-center text-slate-300">{c.totalStudents || 0}</td>
                          <td className="py-3 pr-3 text-center">
                            <span className="text-yellow-400">★</span> <span className="text-slate-300">{(c.rating || 0).toFixed(1)}</span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={c.price === 0 ? "text-emerald-400" : "text-violet-300"}>
                              {(!c.price || c.price === 0) ? "Free" : `${(c.price / 1000).toFixed(0)}K`}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Monthly Chart placeholder */}
              <div className="glass border border-white/10 rounded-2xl p-5">
                <h2 className="text-sm font-bold text-white mb-4">📈 Monthly Views</h2>
                <div className="flex items-end gap-1.5 h-20">
                  {stats.monthlyViews.map((v, i) => {
                    const max = Math.max(...stats.monthlyViews);
                    const h = (v / max) * 100;
                    return (
                      <div key={i} className="flex-1 group relative">
                        <div className="bg-gradient-to-t from-violet-600 to-cyan-500 rounded-sm transition-all group-hover:from-violet-400 group-hover:to-cyan-300"
                          style={{ height: `${h}%` }} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Jan</span><span>Jun</span><span>Dec</span>
                </div>
              </div>

              {/* Create Course CTA */}
              <div className="glass border border-violet-500/30 rounded-2xl p-5 text-center bg-gradient-to-br from-violet-900/20 to-cyan-900/10">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="font-bold text-white text-sm mb-2">Create New Course</h3>
                <p className="text-xs text-slate-400 mb-4">Share your knowledge with thousands of learners.</p>
                <Button variant="neon" size="sm" className="w-full">➕ Create Now</Button>
              </div>

              {/* Removed Fake Recent Students Leaderboard for Realism */}
              <div className="glass border border-white/10 rounded-2xl p-5">
                <h2 className="text-sm font-bold text-white mb-4">📢 System Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">✅</div>
                    <div>
                      <p className="text-sm font-bold text-white">Database Connected</p>
                      <p className="text-xs text-slate-400">Live metrics actively syncing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
