"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

interface ApiQuestion {
  id: string;
  lessonId: string;
  type: string;
  questionText: string;
  options: string[] | null;
  correctAnswer: string | null;
  correctAnswers: string[] | null;
  order: number;
  explanation?: string;
  difficultyLevel?: string;
}

// Convert API question to quiz format
function toQuizFormat(q: ApiQuestion, idx: number) {
  const opts = q.options && q.options.length > 0 ? q.options : ["True", "False", "Not Given", "None"];
  const correctIdx = q.correctAnswer ? opts.indexOf(q.correctAnswer) : 0;
  return {
    id: q.id,
    question: q.questionText,
    options: opts,
    correctAnswer: Math.max(0, correctIdx),
    category: q.lessonId ? "Grammar" : "General",
    level: q.difficultyLevel || "A1",
    idx,
    explanation: q.explanation || "✅ Great deductive logic! Remember to practice this pattern."
  };
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<ReturnType<typeof toQuizFormat>[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const [userLevel, setUserLevel] = useState<string>("A1");
  const [userStreak, setUserStreak] = useState<number>(0);
  const [levelChangeMsg, setLevelChangeMsg] = useState<string | null>(null);

  const { user } = useAuth();
  const userId = (user as any)?.uid || (user as any)?.id || "user-demo";

  // Synchronize local state with auth user level
  useEffect(() => {
    if (user?.level) setUserLevel(user.level);
    if (user?.streak) setUserStreak(user.streak);
  }, [user]);

  useEffect(() => {
    fetch("/api/writing-quiz-progress/quiz/questions")
      .then(r => r.json())
      .then((data: ApiQuestion[]) => {
        const mcqs = data
          .filter(q => q.type === "MULTIPLE_CHOICE" && q.options && q.options.length >= 2)
          .map((q, i) => toQuizFormat(q, i));
        setQuestions(mcqs);
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, []);

  const current = questions[currentIdx];

  const handleSelect = async (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === current.correctAnswer;
    setUserAnswers(prev => ({ ...prev, [currentIdx]: idx }));
    if (isCorrect) setCorrect(c => c + 1);

    if (isCorrect) setCorrect(c => c + 1);
  };

  const handleNext = async () => {
    if (currentIdx + 1 >= questions.length) {
      const time = Math.round((Date.now() - startTime) / 1000);
      setTimeTaken(time);
      setIsFinished(true);

      // Submit results to trigger adaptive level-up (score > 5)
      try {
        const res = await fetch("/api/v1/writing-quiz-progress/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: "grammar",
            userId: userId,
            score: correct,
            answers: userAnswers,
            timeSpentSeconds: time
          })
        });
        if (res.ok) {
           const resultData = await res.json();
           if (resultData.currentLevel) {
               setUserLevel(resultData.currentLevel);
               if (resultData.currentStreak !== undefined) setUserStreak(resultData.currentStreak);
               
               if (resultData.currentLevel !== userLevel) {
                   setLevelChangeMsg(`🚀 LEVEL ADAPTED TO ${resultData.currentLevel}!`);
                   setTimeout(() => setLevelChangeMsg(null), 5000);
               }
           }
        }
      } catch (err) {
        console.warn("Quiz submission failed", err);
      }
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
    }
  };

  const handleLevelChange = async (direction: "promote" | "demote") => {
    try {
      const res = await fetch(`/api/auth/level/${direction}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("galaxy_token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUserLevel(data.level);
        setLevelChangeMsg(`🚀 LEVEL ${direction === "promote" ? "UPGRADED" : "ADJUSTED"} TO ${data.level}!`);
        setTimeout(() => setLevelChangeMsg(null), 5000);
      }
    } catch (err) {
      console.warn("Level change failed", err);
    }
  };

  const restart = () => {
    setCurrentIdx(0); setSelected(null); setCorrect(0); setIsFinished(false); setTimeTaken(0);
    setShowReview(false); setUserAnswers({});
    setStartTime(Date.now());
  };

  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  // Start screen
  if (!started) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        {/* Animated Level Change Notification */}
        {levelChangeMsg && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
             <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-1 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                <div className="bg-black/80 backdrop-blur-xl px-8 py-4 rounded-xl text-white font-black text-xl tracking-tighter flex items-center gap-4">
                   <span className="text-3xl animate-bounce">✨</span>
                   {levelChangeMsg}
                   <span className="text-3xl animate-bounce" style={{ animationDelay: '200ms' }}>✨</span>
                </div>
             </div>
          </div>
        )}
        <div className="max-w-2xl w-full text-center">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Nhóm 4 — Quiz</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            English <span className="gradient-text">Challenge</span>
          </h1>
          <p className="text-slate-400 mb-8">Câu hỏi trực tiếp từ database. Kiểm tra kiến thức ngay bây giờ.</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { num: loading ? "..." : questions.length, label: "Questions", icon: "❓" },
              { num: "∞", label: "Attempts", icon: "🔄" },
              { num: "Instant", label: "Feedback", icon: "⚡" },
            ].map(s => (
              <div key={s.label} className="glass border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-xl font-extrabold text-white">{s.num}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="text-violet-400 animate-pulse">Loading questions from database...</div>
          ) : questions.length === 0 ? (
            <div className="glass border border-amber-500/30 rounded-2xl p-5 text-amber-400 text-sm">
              ⚠️ No multiple-choice questions found in the database yet. Add questions to get started.
            </div>
          ) : (
            <Button variant="neon" size="lg" onClick={() => { setStarted(true); setStartTime(Date.now()); }}>
              🎯 Start Quiz
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Result screen
  if (isFinished) {
    const emoji = score >= 80 ? "🏆" : score >= 60 ? "🎯" : "📚";
    const title = score >= 80 ? "Outstanding!" : score >= 60 ? "Good Job!" : "Keep Practicing!";
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="glass border border-violet-500/30 rounded-3xl p-8 text-center glow-purple">
            <div className="text-6xl mb-4">{emoji}</div>
            <h2 className="text-3xl font-extrabold text-white mb-2">{title}</h2>
            <p className="text-slate-400 mb-8">You answered {correct} out of {questions.length} correctly.</p>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
              <div className="progress-neon h-full rounded-full" style={{ width: `${score}%` }} />
            </div>
            <p className="text-2xl font-extrabold gradient-text mb-8">{score}%</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "Correct", value: correct, color: "text-emerald-400" },
                { label: "Incorrect", value: questions.length - correct, color: "text-red-400" },
                { label: "Score", value: `${score}%`, color: "text-violet-300" },
                { label: "Time", value: `${timeTaken}s`, color: "text-cyan-400" },
              ].map(s => (
                <div key={s.label} className="glass rounded-xl p-3 text-center">
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Adaptive Difficulty Suggestion */}
            {score >= 80 && (
              <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-bounce">
                <p className="text-emerald-400 text-sm font-bold">🚀 Incredible! You should try Level {questions[0]?.level === "A1" ? "A2" : "B1"} next.</p>
              </div>
            )}
            {score < 40 && (
              <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                <p className="text-amber-400 text-sm font-bold">📚 No worries! Maybe review the previous level to solidy your basics?</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <Button variant="neon" onClick={restart}>🔄 Try Again</Button>
              <Button variant="ghost" onClick={() => setShowReview(!showReview)}>
                 {showReview ? "Hide Review" : "🔍 Review All Answers"}
              </Button>
              <Button variant="ghost" onClick={() => setStarted(false)}>← Back</Button>
            </div>

            <div className="flex flex-col gap-3 items-center pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Manual Level Control</p>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={() => handleLevelChange("demote")} disabled={userLevel === "A1"}>
                        📉 Previous Level
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleLevelChange("promote")} disabled={userLevel === "C2"}>
                        📈 Next Level
                    </Button>
                </div>
            </div>

            {showReview && (
              <div className="space-y-6 text-left max-w-2xl mx-auto animate-in fade-in duration-500 mt-8">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Detailed Review</h3>
                {questions.map((q, i) => {
                   const uAns = userAnswers[i];
                   const isCorrect = uAns === q.correctAnswer;
                   return (
                     <div key={q.id} className={`glass border rounded-3xl p-6 ${isCorrect ? "border-emerald-500/30" : "border-red-500/30"} mb-4`}>
                        <p className="text-sm font-bold text-slate-400 mb-2">Question {i + 1}</p>
                        <p className="text-white font-medium mb-4">{q.question}</p>
                        <div className="grid grid-cols-1 gap-2 mb-4">
                           {q.options.map((opt, optIdx) => (
                             <div key={optIdx} className={`text-xs p-3 rounded-xl border ${
                               optIdx === q.correctAnswer ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" :
                               optIdx === uAns ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-white/5 border-white/10 text-slate-400"
                             }`}>
                                {opt} {optIdx === q.correctAnswer && "✓"} {optIdx === uAns && !isCorrect && "✗"}
                             </div>
                           ))}
                        </div>
                        <div className="p-4 bg-violet-900/10 rounded-2xl border border-violet-500/20">
                           <p className="text-xs font-bold text-violet-400 uppercase mb-1">Explanation:</p>
                           <p className="text-xs text-slate-300 leading-relaxed">{q.explanation}</p>
                        </div>
                     </div>
                   );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  if (!current) return null;
  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Animated Level Change Notification */}
      {levelChangeMsg && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
             <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-1 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                <div className="bg-black/80 backdrop-blur-xl px-8 py-4 rounded-xl text-white font-black text-xl tracking-tighter flex items-center gap-4">
                   <span className="text-3xl animate-bounce">✨</span>
                   {levelChangeMsg}
                   <span className="text-3xl animate-bounce" style={{ animationDelay: '200ms' }}>✨</span>
                </div>
             </div>
          </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">CEFR Level</p>
                <p className="text-2xl font-black text-white">{userLevel}</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Performance Streak</p>
                <p className={`text-2xl font-black ${userStreak >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {userStreak > 0 ? `+${userStreak}` : userStreak}
                </p>
            </div>
        </div>

        <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-6 text-center">✦ Quiz Challenge</p>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-xs text-slate-400 whitespace-nowrap">{currentIdx + 1} / {questions.length}</span>
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="progress-neon h-full rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-violet-400 font-bold whitespace-nowrap">{correct} correct</span>
        </div>

        {/* Question card - Smart Card Style */}
        <div className="glass-dark border border-white/10 rounded-[2.5rem] p-10 mb-8 relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
              <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                current.level === "A1" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                current.level === "A2" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" :
                "bg-orange-500/10 border-orange-500/30 text-orange-400"
              }`}>
                {current.level} · {current.level === "A1" ? "EASY" : current.level === "A2" ? "MEDIUM" : "HARD"}
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Adaptive Card #{currentIdx + 1}</span>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-violet-600/20 flex items-center justify-center text-xl mb-6 border border-violet-500/20 group-hover:scale-110 transition-transform">
              💡
           </div>
           <p className="text-2xl font-black text-white leading-tight tracking-tight pr-20">{current.question}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {current.options.map((option, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === current.correctAnswer;
            const answered = selected !== null;
            let cls = "glass border border-white/10 text-slate-300 hover:border-violet-500/50 hover:text-white";
            if (answered) {
              if (isCorrect) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
              else if (isSelected && !isCorrect) cls = "border-red-500 bg-red-500/10 text-red-300";
            }
            return (
              <button key={idx} onClick={() => handleSelect(idx)} disabled={answered}
                className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all duration-200 ${cls}`}>
                <span className="inline-flex w-7 h-7 rounded-lg border border-current/30 items-center justify-center text-xs font-bold mr-3">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation Block */}
        {selected !== null && current.explanation && (
          <div className="mt-4 p-5 rounded-2xl glass border border-violet-500/30 text-sm text-slate-300 animate-fade-in shadow-xl shadow-purple-900/20">
            <div className="flex items-center gap-2 font-bold text-violet-400 mb-2">
              <span className="text-xl">💡</span>
              <span className="uppercase tracking-widest text-xs">Explanation & Strategy</span>
            </div>
            <p className="leading-relaxed">{current.explanation}</p>
          </div>
        )}

        {/* Next button */}
        {selected !== null && (
          <div className="mt-8 text-center animate-fade-in">
            <Button variant="neon" size="lg" onClick={handleNext}>
              {currentIdx + 1 >= questions.length ? "🏁 Finish Quiz & View Results" : "Next Question →"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
