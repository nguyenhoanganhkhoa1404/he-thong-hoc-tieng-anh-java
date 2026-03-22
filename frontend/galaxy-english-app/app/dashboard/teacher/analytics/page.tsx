// app/dashboard/teacher/analytics/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/layout/Sidebar";

interface TeacherStats {
  totalCourses: number;
  totalStudents: number;
  avgRating: number;
  totalRevenue: number;
  monthlyViews: number[];
}

export default function TeacherAnalyticsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<TeacherStats>({
    totalCourses: 0,
    totalStudents: 0,
    avgRating: 0.0,
    totalRevenue: 0,
    monthlyViews: [0,0,0,0,0,0,0,0,0,0,0,0]
  });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");

    const targetTeacherId = user ? ((user as any).teacherId || (user as any).uid || (user as any).id || "T-UNKNOWN") : null;

    if (isAuthenticated && targetTeacherId) {
      fetch(`/api/admin/stats/teacher/${targetTeacherId}`)
        .then(r => r.json())
        .then(data => {
          if (data && data.totalCourses !== undefined) setStats(data);
        })
        .catch(e => console.error(e))
        .finally(() => setFetching(false));
    } else if (!loading) {
      setFetching(false);
    }
  }, [loading, isAuthenticated, router, user]);

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-violet-400 animate-pulse text-lg">Loading Analytics...</div>
    </div>
  );

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const maxView = Math.max(...stats.monthlyViews, 100); // Ensure non-zero division

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 border-b border-white/10 pb-6 flex items-end justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Teacher Portal</p>
              <h1 className="text-3xl font-extrabold text-white">Performance Analytics <span className="gradient-text">📊</span></h1>
            </div>
            <div className="text-right">
               <p className="text-xs text-slate-500 uppercase tracking-widest">Total Cumulative Revenue</p>
               <p className="text-3xl font-black text-emerald-400">
                  {stats.totalRevenue === 0 ? "0 VND" : `${(stats.totalRevenue).toLocaleString()} VND`}
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
             <div className="glass border border-white/10 rounded-2xl p-6 bg-gradient-to-br from-cyan-900/20 to-violet-900/10">
                <p className="text-slate-400 text-sm mb-2">Total Students Reached</p>
                <p className="text-4xl font-extrabold text-white">{stats.totalStudents}</p>
             </div>
             <div className="glass border border-white/10 rounded-2xl p-6 bg-gradient-to-br from-amber-900/20 to-red-900/10">
                <p className="text-slate-400 text-sm mb-2">Average Satisfaction Rating</p>
                <div className="flex items-end gap-2">
                   <p className="text-4xl font-extrabold text-white">{stats.avgRating.toFixed(1)}</p>
                   <span className="text-2xl text-yellow-500 mb-1">★</span>
                </div>
             </div>
             <div className="glass border border-white/10 rounded-2xl p-6 bg-gradient-to-br from-violet-900/20 to-fuchsia-900/10">
                <p className="text-slate-400 text-sm mb-2">Total Active Courses</p>
                <p className="text-4xl font-extrabold text-white">{stats.totalCourses}</p>
             </div>
          </div>

          {/* Monthly Views Chart */}
          <div className="glass border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-8">Course Page Views (YTD)</h2>
            <div className="flex items-end justify-between h-64 gap-2 border-b border-white/10 pb-4">
              {stats.monthlyViews.map((views, i) => {
                const heightPercentage = (views / maxView) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap z-10 pointer-events-none">
                      {views.toLocaleString()} views
                    </div>
                    <div className="w-full flex justify-center h-[200px] items-end">
                       <div 
                         className="w-full max-w-[40px] bg-gradient-to-t from-violet-600 to-cyan-400 rounded-t-sm transition-all duration-500 group-hover:from-violet-400 group-hover:to-cyan-300"
                         style={{ height: `${Math.max(heightPercentage, 2)}%` }} 
                       />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 mt-4 px-2">
              {months.map(m => <span key={m} className="flex-1 text-center">{m}</span>)}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
