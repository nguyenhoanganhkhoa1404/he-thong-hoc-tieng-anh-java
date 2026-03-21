// app/quiz/page.tsx — Nhóm 4: Interactive MCQ Quiz with timer and result
"use client";
import { useState } from "react";
import { mockQuizQuestions } from "@/data/mockData";
import { useQuiz } from "@/hooks/useQuiz";
import Button from "@/components/ui/Button";

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [category, setCategory] = useState<"All" | "Grammar" | "Vocabulary">("All");

  const filtered = mockQuizQuestions.filter(q => category === "All" || q.category === category);
  const quiz = useQuiz(filtered);

  if (!started) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Nhóm 4 — Quiz</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            English <span className="gradient-text">Challenge</span>
          </h1>
          <p className="text-slate-400 mb-8">2,000+ questions across Grammar, Vocabulary, and more. Test your knowledge now.</p>

          <div className="flex gap-3 justify-center mb-8">
            {(["All", "Grammar", "Vocabulary"] as const).map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${category === c ? "bg-violet-600/30 border-violet-500 text-violet-200" : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Quiz info */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { num: filtered.length, label: "Questions", icon: "❓" },
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

          <Button variant="neon" size="lg" onClick={() => setStarted(true)}>🎯 Start Quiz</Button>
        </div>
      </div>
    );
  }

  if (quiz.isFinished) {
    const pct = quiz.result.score;
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "🎯" : "📚";
    const title = pct >= 80 ? "Outstanding!" : pct >= 60 ? "Good Job!" : "Keep Practicing!";
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="glass border border-violet-500/30 rounded-3xl p-8 text-center glow-purple">
            <div className="text-6xl mb-4">{emoji}</div>
            <h2 className="text-3xl font-extrabold text-white mb-2">{title}</h2>
            <p className="text-slate-400 mb-8">You answered {quiz.result.correct} out of {quiz.result.totalQuestions} correctly.</p>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
              <div className="progress-neon h-full rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-2xl font-extrabold gradient-text mb-8">{pct}%</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "Correct", value: quiz.result.correct, color: "text-emerald-400" },
                { label: "Incorrect", value: quiz.result.totalQuestions - quiz.result.correct, color: "text-red-400" },
                { label: "Score", value: `${pct}%`, color: "text-violet-300" },
                { label: "Time", value: `${quiz.result.timeTaken}s`, color: "text-cyan-400" },
              ].map(s => (
                <div key={s.label} className="glass rounded-xl p-3 text-center">
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="neon" onClick={quiz.restart}>🔄 Try Again</Button>
              <Button variant="ghost" onClick={() => setStarted(false)}>← Back</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = quiz.currentQuestion;
  if (!q) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-6 text-center">✦ Quiz Challenge</p>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {quiz.currentIndex + 1} / {filtered.length}
          </span>
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="progress-neon h-full rounded-full" style={{ width: `${quiz.progress}%` }} />
          </div>
          <span className="text-xs text-violet-400 font-bold whitespace-nowrap">
            {quiz.result.correct} correct
          </span>
        </div>

        {/* Question card */}
        <div className="glass border border-white/10 rounded-3xl p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300">
              {q.category}
            </span>
            {q.level && (
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-300">
                {q.level}
              </span>
            )}
          </div>
          <p className="text-xl font-bold text-white leading-relaxed">{q.question}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {q.options.map((option, idx) => {
            const isSelected = quiz.selectedOption === idx;
            const isCorrect = idx === q.correctAnswer;
            const answered = quiz.selectedOption !== null;
            let cls = "glass border border-white/10 text-slate-300 hover:border-violet-500/50 hover:text-white";
            if (answered) {
              if (isCorrect) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
              else if (isSelected && !isCorrect) cls = "border-red-500 bg-red-500/10 text-red-300";
            }
            return (
              <button
                key={idx}
                onClick={() => quiz.selectAnswer(idx)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all duration-200 ${cls}`}
              >
                <span className="inline-flex w-7 h-7 rounded-lg border border-current/30 items-center justify-center text-xs font-bold mr-3">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
