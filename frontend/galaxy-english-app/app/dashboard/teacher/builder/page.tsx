"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";

export default function LessonBuilderPage() {
  const [name, setName] = useState("New IELTS Mission");
  const [level, setLevel] = useState("B2");
  const [passage, setPassage] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addQuestion = () => {
    setQuestions([...questions, { text: "New Question?", options: "A,B,C,D", correct: "A" }]);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    const missionId = "mission_" + Date.now();
    const payload = {
      id: missionId,
      name,
      type: "FULL_TEST",
      level,
      description: "AI Generated Mission from Teacher Forge",
      duration: 60,
      passageContent: passage,
      questions: questions
    };

    try {
      const res = await fetch("/api/tests/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Mission Published Successfully! ID: " + missionId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#020617]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
           <div>
              <p className="text-violet-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Teacher's Forge</p>
              <h1 className="text-4xl font-black text-white tracking-tight">Mission <span className="gradient-text">Builder</span></h1>
           </div>
           <div className="flex gap-3">
              <Button variant="ghost">Save Draft</Button>
              <Button variant="neon" onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? "Synchronizing..." : "Publish Mission"}
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <aside className="lg:col-span-1 space-y-6">
              <div className="glass-dark border border-white/10 rounded-3xl p-6">
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Mission Meta</h3>
                 <input 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm mb-4 focus:border-violet-500 outline-none"
                    placeholder="Mission Name"
                 />
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Difficulty</h3>
                 <div className="flex gap-2">
                    {["A1", "A2", "B1", "B2", "C1"].map(lvl => (
                      <button 
                        key={lvl} 
                        onClick={() => setLevel(lvl)}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${lvl === level ? "bg-violet-600 text-white" : "bg-white/5 text-slate-500 hover:bg-white/10"}`}
                      >
                        {lvl}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="glass-dark border border-white/10 rounded-3xl p-6">
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Component Forge</h3>
                 <div className="space-y-3">
                    <div onClick={() => setPassage("The technological renaissance...")} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-violet-500/50 cursor-pointer transition-all group">
                       <span className="text-xl group-hover:scale-110 transition-transform">📝</span>
                       <span className="text-sm font-bold text-slate-400 group-hover:text-white">Text Block</span>
                    </div>
                    <div onClick={addQuestion} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-violet-500/50 cursor-pointer transition-all group">
                       <span className="text-xl group-hover:scale-110 transition-transform">❓</span>
                       <span className="text-sm font-bold text-slate-400 group-hover:text-white">Quiz Question</span>
                    </div>
                     <label className={`flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-violet-500/50 cursor-pointer transition-all group ${isParsing ? "opacity-50 pointer-events-none" : ""}`}>
                        <span className="text-xl group-hover:scale-110 transition-transform">{isParsing ? "⏳" : "📂"}</span>
                        <span className="text-sm font-bold text-slate-400 group-hover:text-white">
                          {isParsing ? "Analyzing Document..." : "Import from PDF/Word"}
                        </span>
                        <input 
                          type="file" 
                          accept=".pdf,.docx,.doc" 
                          className="hidden" 
                          disabled={isParsing}
                          onChange={async (e) => {
                             const file = e.target.files?.[0];
                             if (!file) return;
                             
                             setIsParsing(true);
                             setError(null);
                             
                             const formData = new FormData();
                             formData.append("file", file);
                             try {
                                const res = await fetch("/api/admin/test-sets/parse-file", {
                                   method: "POST",
                                   body: formData
                                });
                                if (res.ok) {
                                   const data = await res.json();
                                   if (data.passage) setPassage(prev => prev + "\n" + data.passage);
                                   if (data.questions) setQuestions(prev => [...prev, ...data.questions]);
                                } else {
                                   const msg = await res.text();
                                   setError("Import failed: " + (msg || "Server error"));
                                }
                             } catch (err) {
                                console.error(err);
                                setError("Network error: Could not reach the server.");
                             } finally {
                                setIsParsing(false);
                             }
                          }}
                        />
                     </label>
                     {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold">
                           ⚠️ {error}
                        </div>
                     )}
                 </div>
              </div>
           </aside>

           <main className="lg:col-span-3">
              <div className="glass-dark border-2 border-dashed border-white/10 rounded-[3rem] p-10 min-h-[600px] bg-black/20">
                 {passage || questions.length > 0 ? (
                    <div className="space-y-8">
                       {passage && (
                          <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                             <h4 className="text-xs font-black text-violet-400 uppercase mb-4">Reading Passage</h4>
                             <textarea 
                                value={passage}
                                onChange={e => setPassage(e.target.value)}
                                className="w-full bg-transparent text-slate-300 text-lg leading-relaxed outline-none min-h-[200px] resize-none"
                             />
                          </div>
                       )}
                       
                       {questions.map((q, i) => (
                          <div key={i} className="p-8 rounded-3xl bg-violet-600/5 border border-violet-500/20">
                             <h4 className="text-xs font-black text-violet-400 uppercase mb-4">Question {i + 1}</h4>
                             <input 
                                value={q.text}
                                onChange={e => {
                                   const newQ = [...questions];
                                   newQ[i].text = e.target.value;
                                   setQuestions(newQ);
                                }}
                                className="w-full bg-transparent text-white text-xl font-bold outline-none mb-4"
                             />
                             <div className="flex gap-4">
                                <input 
                                   value={q.options}
                                   onChange={e => {
                                      const newQ = [...questions];
                                      newQ[i].options = e.target.value;
                                      setQuestions(newQ);
                                   }}
                                   className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-slate-400 text-sm outline-none"
                                   placeholder="Options (comma separated)"
                                />
                                <input 
                                   value={q.correct}
                                   onChange={e => {
                                      const newQ = [...questions];
                                      newQ[i].correct = e.target.value;
                                      setQuestions(newQ);
                                   }}
                                   className="w-24 bg-white/5 border border-white/10 rounded-xl p-3 text-emerald-400 text-center font-bold outline-none"
                                   placeholder="Correct"
                                />
                             </div>
                          </div>
                       ))}
                       
                       <div className="flex justify-center pt-8">
                          <button onClick={addQuestion} className="text-violet-400 text-sm font-black uppercase tracking-widest hover:text-white transition-colors">+ Add Core Component</button>
                       </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                       <div className="w-20 h-20 rounded-[2rem] bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-4xl mb-6 animate-pulse">✨</div>
                       <h2 className="text-2xl font-black text-white mb-2">Start your new Mission</h2>
                       <p className="text-slate-500 max-w-sm mb-10">Select "Text Block" or "Quiz Question" from the Forge to start building your lesson.</p>
                    </div>
                 )}
              </div>
           </main>
        </div>
      </div>
    </div>
  );
}
