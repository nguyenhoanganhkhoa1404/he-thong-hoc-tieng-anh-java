// app/placement/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";

import { QUESTION_BANK } from "@/data/placementQuestions";

export default function PlacementTest() {
  const { user, token, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(-1);
  const [questions, setQuestions] = useState<typeof QUESTION_BANK>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{level: string, score: number} | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/placement");
    }
  }, [loading, isAuthenticated, router]);

  const handleStart = () => {
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    setStep(0);
  };

  const calculateAndSubmit = async (finalAnswers: number[]) => {
    setSubmitting(true);
    const score = finalAnswers.reduce((acc, ans, i) => acc + (ans === questions[i].answer ? 1 : 0), 0);
    
    let level = "A1";
    if (score === 2) level = "A2";
    if (score === 3) level = "B1";
    if (score === 4) level = "B2";
    if (score === 5) level = "C1";

    if (user && ((user as any).uid || user.id)) {
      const targetId = (user as any).uid || user.id;
      try {
        await fetch(`/api/admin/students/${targetId}/level?level=${level}&score=${score * 20}`, {
          method: "PUT",
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        
        // Update local storage so the UI updates immediately
        const updatedUser = { ...user, level, placementTestScore: score * 20 };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("storage"));
        
        setResult({ level, score: score * 20 });
      } catch (e) {
        console.error("Failed to update level", e);
        setSubmitting(false);
      }
    } else {
      setResult({ level, score: score * 20 });
    }
  };

  const handleNext = () => {
    if (selected !== null) {
      const newAnswers = [...answers, selected];
      setAnswers(newAnswers);
      setSelected(null);
      const nextStep = step + 1;
      setStep(nextStep);

      if (nextStep === questions.length) {
        calculateAndSubmit(newAnswers);
      }
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  if (step === -1) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center justify-center">
        <div className="glass border border-white/10 p-8 py-12 rounded-3xl max-w-xl text-center">
          <div className="text-6xl mb-6">🎓</div>
          <h1 className="text-3xl font-extrabold text-white mb-4">English Placement Test</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Welcome to Galaxy English! Before you begin your journey, take this quick 5-question test to determine your starting level (A1 to C1).
          </p>
          <Button variant="neon" size="lg" onClick={handleStart} className="w-full md:w-auto">
            Start Test 🚀
          </Button>
        </div>
      </div>
    );
  }

  if (result !== null) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="glass border border-white/10 p-8 py-12 rounded-3xl max-w-xl text-center">
          <div className="text-7xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Test Completed!</h2>
          <p className="text-slate-400 mb-8">You have successfully completed the placement test.</p>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Your English Level</p>
            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-3">{result.level}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
              <span>🎯 Score: {result.score}/100</span>
            </div>
          </div>

          <Button variant="neon" size="lg" onClick={() => router.push("/dashboard/student")} className="w-full">
            Go to your Dashboard 🚀
          </Button>
        </div>
      </div>
    );
  }

  if (step === questions.length) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center justify-center">
        <div className="glass border border-white/10 p-8 rounded-3xl max-w-md text-center">
          <div className="text-6xl mb-4 animate-spin">✨</div>
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing your skills...</h2>
          <p className="text-slate-400">Please wait while we calculate your English level.</p>
        </div>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between text-sm text-slate-400 mb-2 font-medium">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round((step / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="progress-neon h-full rounded-full transition-all duration-500" style={{ width: `${(step / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="glass border border-white/10 p-8 rounded-3xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-8">{step + 1}. {q.q}</h2>
        <div className="space-y-3 mb-8">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${selected === i ? "bg-violet-600/30 border-violet-500 ring-2 ring-violet-500/50" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30"} text-white font-medium`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full border flex flex-shrink-0 items-center justify-center text-xs ${selected === i ? "border-violet-400 bg-violet-500" : "border-slate-500"}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span>{opt}</span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="flex justify-end pt-5 border-t border-white/10">
          <Button variant="neon" disabled={selected === null || submitting} onClick={handleNext}>
            {step === questions.length - 1 ? "Finish Test" : "Next Question →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
