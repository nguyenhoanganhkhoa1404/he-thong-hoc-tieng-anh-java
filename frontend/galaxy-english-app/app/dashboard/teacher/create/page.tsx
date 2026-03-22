// app/dashboard/teacher/create/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/layout/Sidebar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CreateCoursePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("A1");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && !isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and Description are required");
      return;
    }
    
    setSubmitting(true);
    setError("");

    const targetTeacherId = user ? ((user as any).teacherId || (user as any).uid || (user as any).id || "T-UNKNOWN") : null;

    try {
      const payload = {
        title,
        description,
        level,
        price: price ? parseFloat(price) : 0,
        published,
        teacherId: targetTeacherId,
        rating: 0.0,
        totalStudents: 0
      };

      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
         router.push("/dashboard/teacher/courses");
      } else {
         setError("Failed to create course. Please try again.");
      }
    } catch (err: any) {
      setError("Network error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 border-b border-white/10 pb-6">
            <p className="text-slate-400 text-sm mb-1">Teacher Portal</p>
            <h1 className="text-3xl font-extrabold text-white">Design a New Course <span className="gradient-text">✨</span></h1>
          </div>

          <div className="glass border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Title Section */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Course Title <span className="text-red-500">*</span></label>
                <Input 
                  placeholder="E.g. Advanced English Grammar Patterns" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target Grade / Level</label>
                  <select 
                    value={level} 
                    onChange={e => setLevel(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors">
                    <option value="A1">A1 - Beginner</option>
                    <option value="A2">A2 - Elementary</option>
                    <option value="B1">B1 - Intermediate</option>
                    <option value="B2">B2 - Upper Intermediate</option>
                    <option value="C1">C1 - Advanced</option>
                    <option value="C2">C2 - Proficient</option>
                  </select>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Price (VND) - Optional</label>
                   <Input 
                     type="number"
                     placeholder="0 = Free" 
                     value={price} 
                     onChange={e => setPrice(e.target.value)} 
                     min="0"
                     step="1000"
                   />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Course Description <span className="text-red-500">*</span></label>
                <textarea 
                  rows={6}
                  placeholder="Describe the learning outcomes, materials provided, and requirements..."
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                 <input 
                   type="checkbox" 
                   id="publishToggle" 
                   checked={published}
                   onChange={e => setPublished(e.target.checked)}
                   className="w-5 h-5 accent-violet-500 rounded cursor-pointer"
                 />
                 <label htmlFor="publishToggle" className="text-sm text-slate-300 font-medium cursor-pointer">
                   Publish immediately? <span className="text-slate-500 block text-xs font-normal">If unchecked, the course is saved as a draft.</span>
                 </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                 <Button variant="ghost" type="button" onClick={() => router.push("/dashboard/teacher/courses")}>Discard Draft</Button>
                 <Button variant="neon" type="submit" disabled={submitting}>
                    {submitting ? "Deploying..." : "Forge Course 🚀"}
                 </Button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
