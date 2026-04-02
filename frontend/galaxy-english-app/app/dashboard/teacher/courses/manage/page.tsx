"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/layout/Sidebar";
import Button from "@/components/ui/Button";

interface TestSet {
  id: string;
  name: string;
  type: string;
  level: string;
}

interface Course {
  id: string;
  title: string;
  moduleIds: string[];
}

function CourseContentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [availableTests, setAvailableTests] = useState<TestSet[]>([]);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  const teacherId = user ? ((user as any).teacherId || (user as any).uid || (user as any).id) : null;

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
    if (isAuthenticated && teacherId && id) {
      Promise.all([
        fetch(`/api/admin/courses/${id}`).then(r => r.json()),
        fetch(`/api/admin/test-sets/teacher/${teacherId}`).then(r => r.json())
      ]).then(([courseData, testsData]) => {
        setCourse(courseData);
        if (Array.isArray(testsData)) setAvailableTests(testsData);
      }).catch(console.error).finally(() => setFetching(false));
    } else if (!loading && !id) {
       setFetching(false);
    }
  }, [id, loading, isAuthenticated, teacherId, router]);

  const toggleModule = (testId: string) => {
    if (!course) return;
    const moduleIds = [...(course.moduleIds || [])];
    const idx = moduleIds.indexOf(testId);
    if (idx > -1) moduleIds.splice(idx, 1);
    else moduleIds.push(testId);
    setCourse({ ...course, moduleIds });
  };

  const handleSave = async () => {
    if (!course) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course)
      });
      if (res.ok) alert("Course content updated!");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading || fetching) return <div className="p-20 text-center text-violet-400 animate-pulse">Synchronizing Course Data...</div>;
  if (!course) return <div className="p-20 text-center text-red-400">Course id({id}) not found.</div>;

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs text-left">Content Architect</p>
              <h1 className="text-3xl font-black text-white text-left">{course.title} <span className="gradient-text">🛰️</span></h1>
              <p className="text-slate-400 mt-1 text-sm text-left">Assemble missions and test sets into this learning journey.</p>
            </div>
            <Button variant="neon" onClick={handleSave} disabled={saving}>
              {saving ? "Updating..." : "🚀 Finalize Content"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest text-left">Available Test Inventory</h2>
              <div className="glass border border-white/10 rounded-2xl p-4 space-y-2 max-h-[500px] overflow-auto">
                {availableTests.length === 0 ? (
                  <p className="text-center text-slate-600 py-10 italic">No tests available. Go to Test Management to create some.</p>
                ) : (
                  availableTests.map(t => (
                    <div key={t.id} 
                         onClick={() => toggleModule(t.id)}
                         className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group
                          ${(course.moduleIds || []).includes(t.id) 
                            ? "bg-violet-600/20 border-violet-500/50" 
                            : "bg-white/5 border-white/5 hover:border-white/20"}`}>
                      <div className="text-left">
                        <p className="font-bold text-white text-sm">{t.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{t.type} • {t.level}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-all
                        ${(course.moduleIds || []).includes(t.id) 
                          ? "bg-violet-500 border-transparent text-white scale-110" 
                          : "border-white/20 text-transparent group-hover:border-white/40"}`}>
                        ✓
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest text-left">Course Architecture</h2>
              <div className="glass border border-white/10 rounded-2xl p-6 bg-gradient-to-b from-white/[0.02] to-transparent">
                 {(!course.moduleIds || course.moduleIds.length === 0) ? (
                   <div className="text-center py-20">
                     <div className="text-4xl mb-4 opacity-20">🏗️</div>
                     <p className="text-slate-500 text-sm">This course is currently empty.<br/>Add tests from your inventory to the left.</p>
                   </div>
                 ) : (
                   <div className="space-y-3">
                     {course.moduleIds.map((mid, idx) => {
                       const testInfo = availableTests.find(at => at.id === mid);
                       return (
                         <div key={mid} className="flex items-center gap-4 group">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-500">
                               {idx + 1}
                            </div>
                            <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/5 text-left">
                               <p className="text-sm font-bold text-white">{testInfo?.name || "Unknown Module"}</p>
                               <p className="text-[10px] text-violet-400 font-bold tracking-widest uppercase">{testInfo?.type || "MODULE"}</p>
                            </div>
                            <button onClick={() => toggleModule(mid)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                               🗑️
                            </button>
                         </div>
                       )
                     })}
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CourseContentPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center animate-pulse text-violet-400">Loading Content Architect...</div>}>
      <CourseContentContent />
    </Suspense>
  );
}
