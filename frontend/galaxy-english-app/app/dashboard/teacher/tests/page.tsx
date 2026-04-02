"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/layout/Sidebar";
import Button from "@/components/ui/Button";

interface TestSet {
  id: string;
  name: string;
  type: string;
  duration: number;
  level: string;
  description: string;
}

export default function TestManagementPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [tests, setTests] = useState<TestSet[]>([]);
  const [fetching, setFetching] = useState(true);

  const teacherId = user ? ((user as any).teacherId || (user as any).uid || (user as any).id) : null;

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
    if (isAuthenticated && teacherId) {
      fetch(`/api/admin/test-sets/teacher/${teacherId}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setTests(data);
        })
        .catch(console.error)
        .finally(() => setFetching(false));
    } else if (!loading) {
      setFetching(false);
    }
  }, [loading, isAuthenticated, teacherId, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test set?")) return;
    try {
      const res = await fetch(`/api/admin/test-sets/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTests(prev => prev.filter(t => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

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
              <h1 className="text-3xl font-extrabold text-white">Test Management <span className="gradient-text">📋</span></h1>
              <p className="text-slate-400 mt-2 text-sm">Create and manage real test sets to evaluate student performance.</p>
            </div>
            <Link href="/dashboard/teacher/tests/create">
              <Button variant="neon">➕ Create New Test</Button>
            </Link>
          </div>

          <div className="glass border border-white/10 rounded-2xl p-6">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-3">Test Name</th>
                    <th className="pb-3 pr-3">Type</th>
                    <th className="pb-3 pr-3 text-center">Level</th>
                    <th className="pb-3 pr-3 text-center">Duration</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 italic">No tests created yet.</td>
                    </tr>
                  ) : (
                    tests.map(t => (
                      <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-4 pr-3">
                          <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">{t.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{t.description || "No description provided."}</p>
                        </td>
                        <td className="py-4 pr-3 capitalize text-slate-300 font-medium">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] border border-white/5">
                            {t.type.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 pr-3 text-center">
                          <span className="font-bold text-violet-400 bg-violet-400/10 px-2 py-1 rounded-lg text-xs border border-violet-400/20">
                            {t.level}
                          </span>
                        </td>
                        <td className="py-4 pr-3 text-center text-slate-300">
                          {t.duration} min
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/dashboard/teacher/tests/edit?id=${t.id}`}>
                              <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all" title="Edit Test">
                                ⚙️
                              </button>
                            </Link>
                            <button 
                              onClick={() => handleDelete(t.id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" 
                              title="Delete Test">
                              🗑️
                            </button>
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
