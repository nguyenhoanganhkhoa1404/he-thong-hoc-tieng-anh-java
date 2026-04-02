// app/dashboard/teacher/courses/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/layout/Sidebar";
import Button from "@/components/ui/Button";

interface Course {
  id: string;
  title: string;
  level: string;
  totalStudents: number;
  rating: number;
  price: number;
}

export default function TeacherCoursesPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
    
    const targetTeacherId = user ? ((user as any).teacherId || (user as any).uid || (user as any).id || "T-UNKNOWN") : null;

    if (isAuthenticated && targetTeacherId) {
      fetch(`/api/admin/courses/teacher/${targetTeacherId}`)
        .then(r => r.json())
        .then(data => {
          if(data && Array.isArray(data)) setCourses(data);
        })
        .catch(e => console.error(e))
        .finally(() => setFetching(false));
    } else if (!loading) {
      setFetching(false);
    }
  }, [loading, isAuthenticated, router, user]);

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-violet-400 animate-pulse text-lg">Loading Courses...</div>
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
              <h1 className="text-3xl font-extrabold text-white">Course Management <span className="gradient-text">📚</span></h1>
            </div>
            <Link href="/dashboard/teacher/create">
              <Button variant="neon">➕ Create Course</Button>
            </Link>
          </div>

          {/* Full Course Table */}
          <div className="glass border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5">All Active Courses</h2>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-3">Course Title</th>
                    <th className="pb-3 pr-3 text-center">Students</th>
                    <th className="pb-3 pr-3 text-center">Avg Rating</th>
                    <th className="pb-3 pr-3 text-center">Price</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 italic">No courses found. Start creating one!</td>
                    </tr>
                  ) : (
                    courses.map(c => (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 pr-3">
                          <p className="font-medium text-white max-w-[300px] truncate">{c.title}</p>
                          <span className="text-xs text-slate-500">{c.level}</span>
                        </td>
                        <td className="py-4 pr-3 text-center text-slate-300">{c.totalStudents || 0}</td>
                        <td className="py-4 pr-3 text-center">
                          <span className="text-yellow-400">★</span> <span className="text-slate-300">{(c.rating || 0).toFixed(1)}</span>
                        </td>
                        <td className="py-4 pr-3 text-center">
                          <span className={c.price === 0 || !c.price ? "text-emerald-400" : "text-violet-300"}>
                            {(!c.price || c.price === 0) ? "Free" : `${(c.price / 1000).toFixed(0)}K`}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <Link href={`/dashboard/teacher/courses/manage?id=${c.id}`}>
                               <Button variant="outline" size="sm" className="px-2 py-1 text-xs text-left">Manage Content</Button>
                             </Link>
                             <Button variant="outline" size="sm" className="px-2 py-1 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">Archive</Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
