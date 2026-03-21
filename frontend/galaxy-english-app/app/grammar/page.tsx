// app/grammar/page.tsx — Nhóm 2: Grammar lessons with interactive exercises
"use client";
import { useState } from "react";
import { mockGrammar } from "@/data/mockData";
import type { GrammarLesson } from "@/types";
import Button from "@/components/ui/Button";

export default function GrammarPage() {
  const [selected, setSelected] = useState<GrammarLesson | null>(null);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  if (selected) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => { setSelected(null); setExerciseAnswers({}); setShowResult(false); }}
            className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors">
            ← Back to Grammar
          </button>
          <div className="glass border border-white/10 rounded-3xl p-8">
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 mb-4 inline-block">
              Level {selected.level}
            </span>
            <h1 className="text-2xl font-extrabold text-white mb-3">{selected.title}</h1>
            <p className="text-slate-400 mb-6">{selected.description}</p>

            {/* Content */}
            <div className="glass border border-white/10 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-bold text-violet-300 mb-3">📖 Explanation</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{selected.content}</p>
            </div>

            {/* Examples */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-cyan-300 mb-3">💡 Examples</h3>
              <div className="space-y-2">
                {selected.examples.map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
                    <span className="text-violet-400 text-xs font-bold">{i + 1}</span>
                    <p className="text-slate-300 text-sm italic">{ex}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercises */}
            <div>
              <h3 className="text-sm font-bold text-amber-300 mb-4">🎯 Practice Exercises</h3>
              <div className="space-y-4">
                {selected.exercises.map((ex, ei) => (
                  <div key={ex.id} className="glass border border-white/10 rounded-2xl p-5">
                    <p className="text-white font-semibold mb-4 text-sm">{ei + 1}. {ex.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {ex.options.map((opt, oi) => {
                        const answered = showResult || exerciseAnswers[ex.id] !== undefined;
                        const isSelected = exerciseAnswers[ex.id] === oi;
                        const isCorrect = oi === ex.correctAnswer;
                        let cls = "border-white/10 text-slate-300 hover:border-violet-500/50 hover:text-white";
                        if (answered) {
                          if (isCorrect) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                          else if (isSelected) cls = "border-red-500 bg-red-500/10 text-red-300";
                        }
                        return (
                          <button key={oi} disabled={answered}
                            onClick={() => setExerciseAnswers(prev => ({...prev, [ex.id]: oi}))}
                            className={`p-3 rounded-xl border text-xs text-left transition-all ${cls}`}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {exerciseAnswers[ex.id] !== undefined && ex.explanation && (
                      <p className="mt-3 text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2">
                        💡 {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Nhóm 2 — Grammar</p>
          <h1 className="text-4xl font-extrabold text-white mb-4">Grammar <span className="gradient-text">Mastery</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto">Toàn bộ ngữ pháp tiếng Anh từ cơ bản đến nâng cao với bài tập thực hành.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockGrammar.map(lesson => (
            <div key={lesson.id} onClick={() => setSelected(lesson)}
              className="glass border border-white/10 rounded-2xl p-6 card-hover cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">📝</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300">
                  {lesson.level}
                </span>
              </div>
              <h3 className="font-bold text-white text-base mb-2">{lesson.title}</h3>
              <p className="text-slate-400 text-xs mb-4 line-clamp-2">{lesson.description}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>💡 {lesson.examples.length} examples</span>
                <span>🎯 {lesson.exercises.length} exercises</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
