"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/layout/Sidebar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface QuizQuestion {
  id?: string;
  type: "MULTIPLE_CHOICE" | "FILL_BLANK" | "DRAG_DROP";
  questionText: string;
  options: string[];
  correctAnswer: string;
  correctAnswers: string[];
  explanation: string;
  order: number;
  difficultyLevel: string;
}

interface TestSet {
  id?: string;
  name: string;
  type: string;
  duration: number;
  level: string;
  description: string;
  teacherId: string;
  questions: QuizQuestion[];
}

function TestEditorContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEdit = !!id;
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [test, setTest] = useState<TestSet>({
    name: "",
    type: "FULL_TEST",
    duration: 60,
    level: "A1",
    description: "",
    teacherId: "",
    questions: []
  });

  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const teacherId = user ? ((user as any).teacherId || (user as any).uid || (user as any).id) : null;

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
    if (isAuthenticated && isEdit && id) {
      fetch(`/api/admin/test-sets/${id}`)
        .then(r => r.json())
        .then(data => {
          if (data && data.id) setTest(data);
        })
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, loading, isAuthenticated, router]);

  const handleSaveTest = async () => {
    if (!test.name) return alert("Please enter a test name");
    setSaving(true);
    try {
      const payload = { ...test, teacherId };
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/admin/test-sets/${id}` : "/api/admin/test-sets";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedTest = await res.json();
        if (!isEdit) router.push(`/dashboard/teacher/tests/edit?id=${savedTest.id}`);
        else alert("Test saved successfully!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    const newQ: QuizQuestion = {
      type: "MULTIPLE_CHOICE",
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      correctAnswers: [],
      explanation: "",
      order: test.questions.length + 1,
      difficultyLevel: test.level
    };
    setTest({ ...test, questions: [...test.questions, newQ] });
  };

  const updateQuestion = (index: number, fields: Partial<QuizQuestion>) => {
    const qs = [...test.questions];
    qs[index] = { ...qs[index], ...fields };
    setTest({ ...test, questions: qs });
  };

  const removeQuestion = async (index: number) => {
    const q = test.questions[index];
    if (q.id) {
       if (!confirm("Delete this question from database?")) return;
       await fetch(`/api/admin/questions/${q.id}`, { method: "DELETE" });
    }
    const qs = [...test.questions];
    qs.splice(index, 1);
    setTest({ ...test, questions: qs });
  };

  const saveQuestion = async (index: number) => {
    if (!isEdit) return alert("Please save the test metadata first!");
    const q = test.questions[index];
    try {
      const res = await fetch(`/api/admin/test-sets/${id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(q)
      });
      if (res.ok) {
        const savedQ = await res.json();
        const qs = [...test.questions];
        qs[index] = savedQ;
        setTest({ ...test, questions: qs });
        alert("Question saved!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || fetching) return <div className="p-20 text-center animate-pulse text-violet-400">Loading Test Forge...</div>;

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
             <div onClick={() => router.push("/dashboard/teacher/tests")} className="group cursor-pointer">
                <p className="text-slate-500 text-xs flex items-center gap-1 group-hover:text-cyan-400">
                   ⬅️ Back to Management
                </p>
                <h1 className="text-3xl font-black text-white">
                  {isEdit ? "Refining Assessment" : "Forging New Test"} <span className="gradient-text">⚡</span>
                </h1>
             </div>
             <Button variant="neon" onClick={handleSaveTest} disabled={saving}>
               {saving ? "Saving..." : "💾 Save Test Blueprint"}
             </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Metadata Card */}
            <div className="lg:col-span-1 space-y-6">
               <div className="glass border border-white/10 rounded-2xl p-6 sticky top-8">
                  <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Metadata</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Test Name</label>
                      <Input value={test.name} onChange={e => setTest({...test, name: e.target.value})} placeholder="E.g. Mid-term Reading A2" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Type</label>
                      <select className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white"
                              value={test.type} onChange={e => setTest({...test, type: e.target.value})}>
                         <option value="READING">Reading</option>
                         <option value="LISTENING">Listening</option>
                         <option value="WRITING">Writing</option>
                         <option value="SPEAKING">Speaking</option>
                         <option value="FULL_TEST">Full Test</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Level</label>
                        <select className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white"
                                value={test.level} onChange={e => setTest({...test, level: e.target.value})}>
                           {["A1", "A2", "B1", "B2", "C1", "C2"].map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Minutes</label>
                        <Input type="number" value={test.duration} onChange={e => setTest({...test, duration: parseInt(e.target.value)})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
                      <textarea className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white h-24 resize-none"
                                value={test.description} onChange={e => setTest({...test, description: e.target.value})} />
                    </div>
                  </div>
               </div>
            </div>

            {/* Questions Card */}
            <div className="lg:col-span-2 space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Question Array ({test.questions.length})</h2>
                  <Button variant="ghost" size="sm" onClick={addQuestion}>➕ Add Question</Button>
               </div>

               {test.questions.length === 0 ? (
                 <div className="glass border border-dashed border-white/20 rounded-3xl p-16 text-center text-slate-500 italic">
                   The test is currently empty. Start adding questions to evaluate student potential.
                 </div>
               ) : (
                 <div className="space-y-6 pb-20">
                   {test.questions.sort((a,b) => a.order - b.order).map((q, idx) => (
                      <div key={idx} className="glass border border-white/10 rounded-2xl p-6 relative group overflow-hidden">
                         <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-violet-500 opacity-50" />
                         
                         <div className="flex items-center justify-between mb-4">
                            <span className="bg-white/5 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                              Question #{idx + 1}
                            </span>
                            <div className="flex items-center gap-2">
                               <button onClick={() => saveQuestion(idx)} className="text-xs text-cyan-400 hover:bg-cyan-400/10 px-2 py-1 rounded-lg transition-all font-bold">Save</button>
                               <button onClick={() => removeQuestion(idx)} className="text-xs text-red-500 hover:bg-red-500/10 px-2 py-1 rounded-lg transition-all font-bold">Delete</button>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <textarea
                              placeholder="Describe the challenge..."
                              className="w-full bg-transparent text-lg font-bold text-white placeholder-slate-700 border-b border-white/5 focus:border-cyan-500 focus:outline-none py-2 resize-none"
                              value={q.questionText}
                              onChange={e => updateQuestion(idx, { questionText: e.target.value })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="text-[10px] uppercase font-black text-slate-500 mb-1 block">Logic Type</label>
                                  <select className="w-full bg-slate-900/50 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-slate-300"
                                          value={q.type} onChange={e => updateQuestion(idx, { type: e.target.value as any })}>
                                     <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                     <option value="FILL_BLANK">Fill in the Blank</option>
                                     <option value="DRAG_DROP">Drag & Drop</option>
                                  </select>
                               </div>
                               <div>
                                  <label className="text-[10px] uppercase font-black text-slate-500 mb-1 block">Level</label>
                                  <select className="w-full bg-slate-900/50 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-slate-300"
                                          value={q.difficultyLevel} onChange={e => updateQuestion(idx, { difficultyLevel: e.target.value })}>
                                      {["A1", "A2", "B1", "B2", "C1", "C2"].map(l => <option key={l} value={l}>{l}</option>)}
                                  </select>
                               </div>
                            </div>

                            {q.type === "MULTIPLE_CHOICE" && (
                              <div className="grid grid-cols-2 gap-3 mt-4">
                                 {q.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="flex items-center gap-2">
                                       <input 
                                         type="radio" 
                                         checked={q.correctAnswer === opt && opt !== ""} 
                                         onChange={() => updateQuestion(idx, { correctAnswer: opt })}
                                         className="accent-cyan-500"
                                       />
                                       <input 
                                         placeholder={`Option ${oIdx + 1}`}
                                         className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                                         value={opt}
                                         onChange={e => {
                                           const opts = [...q.options];
                                           opts[oIdx] = e.target.value;
                                           updateQuestion(idx, { options: opts });
                                         }}
                                       />
                                    </div>
                                 ))}
                              </div>
                            )}

                            <div>
                               <label className="text-[10px] uppercase font-black text-slate-500 mb-1 block">Teacher Advice / Explanation</label>
                               <textarea
                                 className="w-full bg-slate-900/30 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-400 italic resize-none"
                                 placeholder="Why is it right/wrong?"
                                 value={q.explanation}
                                 onChange={e => updateQuestion(idx, { explanation: e.target.value })}
                               />
                            </div>
                         </div>
                      </div>
                   ))}
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TestEditorPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center animate-pulse text-violet-400">Loading Forge Context...</div>}>
      <TestEditorContent />
    </Suspense>
  );
}
