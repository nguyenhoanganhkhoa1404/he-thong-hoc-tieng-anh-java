// app/quiz/page.tsx — Nhóm 4: Interactive MCQ Quiz - fetches real questions from DB
"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

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
    level: "A1",
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

  useEffect(() => {
    fetch("/api/writing-quiz-progress/quiz/questions")
      .then(r => r.json())
      .then((data: ApiQuestion[]) => {
        // Filter only MCQ questions and map them
        const mcqs = data
          .filter(q => q.type === "MULTIPLE_CHOICE" && q.options && q.options.length >= 2)
          .map((q, i) => toQuizFormat(q, i));
        setQuestions(mcqs);
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, []);

  const current = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === current.correctAnswer) setCorrect(c => c + 1);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setTimeTaken(Math.round((Date.now() - startTime) / 1000));
      setIsFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setCurrentIdx(0); setSelected(null); setCorrect(0); setIsFinished(false); setTimeTaken(0);
    setStartTime(Date.now());
  };

  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  // Start screen
  if (!started) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
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
            <div className="flex gap-3 justify-center">
              <Button variant="neon" onClick={restart}>🔄 Try Again</Button>
              <Button variant="ghost" onClick={() => setStarted(false)}>← Back</Button>
            </div>
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
      <div className="max-w-2xl mx-auto">
        <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-6 text-center">✦ Quiz Challenge</p>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-xs text-slate-400 whitespace-nowrap">{currentIdx + 1} / {questions.length}</span>
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="progress-neon h-full rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-violet-400 font-bold whitespace-nowrap">{correct} correct</span>
        </div>

        {/* Question card */}
        <div className="glass border border-white/10 rounded-3xl p-8 mb-6">
          <p className="text-xl font-bold text-white leading-relaxed">{current.question}</p>
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
