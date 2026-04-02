"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ExamContent() {
  const searchParams = useSearchParams();
  const testId = searchParams.get("id") || "mission_demo";

  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const [questions, setQuestions] = useState<any[]>([
    { id: "q1", text: "Loading question...", options: ["A", "B", "C", "D"], correct: "A" }
  ]);
  const [passage, setPassage] = useState("Loading assessment content...");

  useEffect(() => {
    fetch(`/api/tests/${testId}/details`)
      .then(res => res.json())
      .then(data => {
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions.map((q: any) => ({
            id: q.id,
            text: q.questionText,
            options: q.optionsJson.split(","),
            correct: q.correctAnswer
          })));
        }
        if (data.passage) {
          setPassage(data.passage.content);
        }
      })
      .catch(err => console.error(err));
  }, [testId]);

  const sections = [
    { name: "Reading", questions: questions.length },
    { name: "Writing", questions: 0 },
    { name: "Speaking", questions: 0 },
  ];

  const currentQuestion = questions[currentQuestionIdx];

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectAnswer = (optIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optIdx.toString() }));
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#020617] p-8 flex items-center justify-center">
         <div className="max-w-4xl w-full glass-dark border border-violet-500/20 rounded-[3rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 blur-[100px] -z-10" />
            
            <div className="mb-8">
               <span className="text-xl">🏆</span>
               <h2 className="text-4xl font-black text-white mt-4 tracking-tight">Mission Accomplished!</h2>
               <p className="text-slate-400 font-medium">Your assessment report is being compiled by AI...</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Estimated Band</p>
                  <p className="text-4xl font-black text-violet-400">7.5</p>
               </div>
               <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Accuracy</p>
                  <p className="text-4xl font-black text-cyan-400">82%</p>
               </div>
               <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">XP Earned</p>
                  <p className="text-4xl font-black text-yellow-500">+450</p>
               </div>
            </div>

            <div className="text-left p-8 bg-black/40 rounded-3xl border border-white/10 mb-10">
               <h3 className="text-lg font-black text-white mb-4">AI Skill Diagnostic:</h3>
               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                       <span className="text-slate-500">Reading Speed</span>
                       <span className="text-emerald-400 text-sm">Advanced</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[90%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                       <span className="text-slate-500">Grammar Precision</span>
                       <span className="text-orange-400 text-sm">Target focus needed</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-orange-500 w-[45%]" />
                    </div>
                  </div>
               </div>
            </div>

            <Link href="/dashboard/student">
               <Button variant="neon" size="lg" className="w-full py-6 rounded-2xl text-lg font-black tracking-widest">RETURN TO DASHBOARD</Button>
            </Link>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-violet-500/30">
        <header className="h-20 border-b border-white/10 bg-black/40 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-6">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center font-black">X</div>
               <div>
                  <h2 className="text-sm font-black uppercase tracking-widest leading-none">Assessment Suite</h2>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">IELTS MOCK TEST #1 - LEVEL B2</p>
               </div>
            </div>

            <div className={`flex items-center gap-4 px-6 py-2 rounded-2xl border font-mono text-xl font-black ${timeLeft < 300 ? "bg-red-500/10 border-red-500 text-red-500 animate-pulse" : "bg-white/5 border-white/10 text-white"}`}>
               <span className="text-xs opacity-50">TIME:</span> {formatTime(timeLeft)}
            </div>

            <div className="flex items-center gap-3">
               <Button variant="ghost" onClick={() => setShowExitConfirm(true)} className="text-xs font-black uppercase tracking-widest">Abandon Mission</Button>
               <Button variant="neon" onClick={handleFinish} className="bg-emerald-600 hover:bg-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(5,150,105,0.3)] px-6">SUBMIT MISSION</Button>
            </div>
        </header>

        <div className="flex h-[calc(100vh-5rem)]">
           <aside className="w-72 border-r border-white/10 bg-black/20 p-6 flex flex-col gap-2 overflow-y-auto">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 p-2">Mission Sections</p>
              {sections.map((sec: any, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentSection(idx)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center justify-between border ${currentSection === idx ? "bg-violet-600/20 border-violet-500/50 text-white" : "hover:bg-white/5 border-transparent text-slate-500"}`}
                >
                   <span className="text-sm font-black uppercase tracking-widest">{sec.name}</span>
                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${currentSection === idx ? "bg-violet-500 text-white" : "bg-slate-800"}`}>{sec.questions}</span>
                </button>
              ))}
              
              <div className="mt-10 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                 <p className="text-[10px] font-black text-slate-600 uppercase mb-4">Question Map</p>
                 <div className="grid grid-cols-5 gap-2">
                    {questions.map((_, i) => (
                       <button 
                          key={i} 
                          onClick={() => setCurrentQuestionIdx(i)}
                          className={`w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${i === currentQuestionIdx ? "bg-violet-600 text-white shadow-lg" : answers[questions[i].id] !== undefined ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400" : "bg-white/5 text-slate-500 hover:bg-white/10"}`}
                       >
                          {i + 1}
                       </button>
                    ))}
                 </div>
              </div>
           </aside>

           <main className="flex-1 overflow-y-auto p-12 bg-gradient-to-b from-black/20 to-transparent">
              <div className="max-w-4xl mx-auto">
                 <div className="flex items-center gap-4 mb-10">
                    <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl border border-white/10">{currentQuestionIdx + 1 < 10 ? `0${currentQuestionIdx + 1}` : currentQuestionIdx + 1}</span>
                    <h3 className="text-2xl font-black text-white tracking-tight">{currentQuestion.text}</h3>
                 </div>

                 <div className="glass-dark border border-white/10 rounded-[2rem] p-10 mb-10 leading-relaxed text-slate-300 font-medium">
                    <h4 className="text-white font-black uppercase tracking-widest mb-6">Mission Briefing</h4>
                    <p className="mb-4 text-lg">
                       {passage}
                    </p>
                 </div>

                 <div className="space-y-6">
                    <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-violet-500/30 transition-colors">
                       <p className="text-lg font-bold text-white mb-6">{currentQuestion.text}</p>
                       <div className="grid grid-cols-1 gap-3">
                          {currentQuestion.options.map((opt: string, i: number) => (
                             <button 
                               key={i} 
                               onClick={() => handleSelectAnswer(i)}
                               className={`w-full text-left p-4 rounded-xl border transition-all font-medium flex items-center gap-4 group ${answers[currentQuestion.id] === i.toString() ? "border-violet-500 bg-violet-600/20" : "border-white/10 hover:border-violet-500/50 hover:bg-violet-600/5"}`}
                             >
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${answers[currentQuestion.id] === i.toString() ? "bg-violet-500 text-white" : "bg-white/5 group-hover:bg-violet-600 group-hover:text-white"}`}>{String.fromCharCode(65 + i)}</span>
                                {opt}
                                {answers[currentQuestion.id] === i.toString() && <span className="ml-auto text-violet-400">✓</span>}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 flex justify-between">
                    <Button variant="ghost" disabled={currentQuestionIdx === 0} onClick={handlePrev} className={currentQuestionIdx === 0 ? "opacity-50" : ""}>← Previous Question</Button>
                    <Button variant="neon" className="px-10" onClick={handleNext}>{currentQuestionIdx === questions.length - 1 ? "Finish Exam" : "Next Question →"}</Button>
                 </div>
              </div>
           </main>
        </div>

        {showExitConfirm && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)} />
              <div className="relative glass border border-red-500/30 rounded-[2rem] p-10 max-w-md w-full text-center">
                 <div className="text-4xl mb-4">⚠️</div>
                 <h3 className="text-2xl font-black text-white mb-2">Abandon Mission?</h3>
                 <p className="text-slate-400 text-sm mb-8 font-medium">Your progress will be lost and your rank may be affected. This action cannot be undone.</p>
                 <div className="flex gap-4">
                    <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-colors">Abort Exit</button>
                    <Link href="/dashboard/student" className="flex-1">
                       <button className="w-full py-4 rounded-xl bg-red-600 text-white font-black uppercase text-xs tracking-widest hover:bg-red-500 transition-colors shadow-lg shadow-red-900/40">Surrender</button>
                    </Link>
                 </div>
              </div>
           </div>
        )}
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black uppercase tracking-[0.3em] animate-pulse">Initializing Assessment...</div>}>
      <ExamContent />
    </Suspense>
  );
}
