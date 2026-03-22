// app/dashboard/teacher/students/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/layout/Sidebar";

interface Student {
  uid: string;
  displayName: string;
  email: string;
  level: string;
  xp: number;
}

export default function TeacherStudentsPage() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");

    if (isAuthenticated) {
      fetch("/api/admin/students")
        .then(r => r.json())
        .then(data => {
          if (data && Array.isArray(data)) setStudents(data);
        })
        .catch(e => console.error(e))
        .finally(() => setFetching(false));
    }
  }, [loading, isAuthenticated, router]);

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-violet-400 animate-pulse text-lg">Loading Students...</div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-slate-400 text-sm mb-1">Teacher Portal</p>
            <h1 className="text-3xl font-extrabold text-white">Student Management <span className="gradient-text">👥</span></h1>
          </div>

          {/* Student Table */}
          <div className="glass border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5">Global Learners</h2>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-3">Learner</th>
                    <th className="pb-3 pr-3 text-center">Email</th>
                    <th className="pb-3 pr-3 text-center">Level</th>
                    <th className="pb-3 pr-3 text-center">XP</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 italic">No students registered yet.</td>
                    </tr>
                  ) : (
                    students.map(s => (
                      <tr key={s.uid} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 pr-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {s.displayName.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-medium text-white max-w-[200px] truncate">{s.displayName}</p>
                        </td>
                        <td className="py-4 pr-3 text-center text-slate-300">{s.email}</td>
                        <td className="py-4 pr-3 text-center">
                           <span className="px-2 py-1 text-xs rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20">{s.level || "A1"}</span>
                        </td>
                        <td className="py-4 pr-3 text-center text-emerald-400 font-medium">{s.xp} XP</td>
                        <td className="py-4 text-right">
                          <Link href={`/profile?id=${s.uid}&readonly=true`} className="text-xs text-slate-400 hover:text-white underline underline-offset-2">
                            View Profile
                          </Link>
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
