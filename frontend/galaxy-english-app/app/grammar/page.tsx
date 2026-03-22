// app/grammar/page.tsx — Nhóm 2: Grammar lessons categorized and fetched from DB
"use client";
import { useState, useEffect } from "react";
import { mockGrammar } from "@/data/mockData";
import Button from "@/components/ui/Button";

// The shape of data from our new API /api/v1/grammar/lessons
interface ApiGrammarLesson {
  id: string;
  title: string;
  description: string;
  topic: string;
  level: string;
  completed: boolean;
}

// We merge API basic data with local rich content (exercises/examples)
type RichGrammarLesson = ApiGrammarLesson & {
  content: string;
  examples: string[];
  exercises: { id: string; question: string; options: string[]; correctAnswer: number; explanation?: string }[];
};

export default function GrammarPage() {
  const [lessons, setLessons] = useState<RichGrammarLesson[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selected, setSelected] = useState<RichGrammarLesson | null>(null);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetch("/api/v1/grammar/questions")
      .then(r => r.json())
      .then((data: any[]) => {
        if (!data || data.length === 0) {
          setLessons([]);
          return;
        }

        // Group by explanation to create highly targeted lessons
        const lessonMap = new Map<string, RichGrammarLesson>();
        
        data.forEach(q => {
          const key = q.explanation || "General Grammar Rules";
          if (!lessonMap.has(key)) {
            // Give it a readable title based on the category or explanation
            let title = "Grammar Rule";
            let topic = "Grammar";
            if (q.categoryId === 1) { 
               topic = "Relative Clauses"; 
               title = key.substring(0, 30) + "..."; 
            }
            if (q.categoryId === 2) { 
               topic = "Tenses"; 
               title = key.startsWith("Thì") ? key.split("(")[0].split(".").join("").trim() : "Tenses Practice"; 
            }
            
            lessonMap.set(key, {
              id: "dyn-" + q.id,
              title: title,
              description: key,
              topic: topic,
              level: "All Levels",
              completed: false,
              content: "Lý thuyết ngữ pháp:\n\n" + key,
              examples: [],
              exercises: []
            });
          }
          
          const lesson = lessonMap.get(key)!;
          // Cap at 15 exercises per lesson to keep the UI smooth
          if (lesson.exercises.length < 15 && q.optionA && q.optionB) {
            lesson.exercises.push({
              id: q.id.toString(),
              question: q.content,
              options: [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
              correctAnswer: q.correctAnswer === 'A' ? 0 : q.correctAnswer === 'B' ? 1 : q.correctAnswer === 'C' ? 2 : 3,
              explanation: q.explanation
            });
          }
        });
        
        setLessons(Array.from(lessonMap.values()));
      })
      .catch((e) => {
        console.error("Failed to load DB questions", e);
        setLessons([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Group lessons by topic
  const groupedLessons = lessons.reduce((acc, lesson) => {
    const t = lesson.topic || "Other";
    if (!acc[t]) acc[t] = [];
    acc[t].push(lesson);
    return acc;
  }, {} as Record<string, RichGrammarLesson[]>);

  if (selected) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => { setSelected(null); setExerciseAnswers({}); setShowResult(false); }}
            className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors">
            ← Back to Grammar Curriculum
          </button>
          <div className="glass border border-white/10 rounded-3xl p-8 shadow-[0_0_30px_rgba(124,58,237,0.1)]">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300">
                {selected.topic}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-300">
                Level {selected.level}
              </span>
            </div>
            
            <h1 className="text-3xl font-extrabold text-white mb-3">{selected.title}</h1>
            <p className="text-slate-400 mb-8">{selected.description}</p>

            {/* Content */}
            <div className="glass border border-white/10 rounded-2xl p-6 mb-8 bg-slate-900/50">
              <h3 className="text-sm font-bold text-violet-300 mb-4 uppercase tracking-widest">📖 Explanation</h3>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{selected.content}</div>
            </div>

            {/* Examples */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-cyan-300 mb-4 uppercase tracking-widest">💡 Examples</h3>
              <div className="space-y-3">
                {selected.examples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-white/5 hover:bg-slate-800/60 transition-colors">
                    <span className="text-violet-400 text-sm font-bold mt-0.5">{i + 1}</span>
                    <p className="text-slate-300 text-sm italic">{ex}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercises */}
            <div>
              <h3 className="text-sm font-bold text-amber-300 mb-4 uppercase tracking-widest">🎯 Practice Exercises</h3>
              <div className="space-y-4">
                {selected.exercises.map((ex, ei) => (
                  <div key={ex.id} className="glass border border-white/10 rounded-2xl p-6 bg-slate-900/30">
                    <p className="text-white font-semibold mb-5 text-sm">{ei + 1}. {ex.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ex.options.map((opt, oi) => {
                        const answered = showResult || exerciseAnswers[ex.id] !== undefined;
                        const isSelected = exerciseAnswers[ex.id] === oi;
                        const isCorrect = oi === ex.correctAnswer;
                        let cls = "border-white/10 text-slate-300 hover:border-violet-500/50 hover:text-white bg-slate-800/50";
                        if (answered) {
                          if (isCorrect) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                          else if (isSelected) cls = "border-red-500 bg-red-500/10 text-red-300";
                        }
                        return (
                          <button key={oi} disabled={answered}
                            onClick={() => setExerciseAnswers(prev => ({...prev, [ex.id]: oi}))}
                            className={`p-4 rounded-xl border text-sm text-left transition-all ${cls}`}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {exerciseAnswers[ex.id] !== undefined && ex.explanation && (
                      <div className="mt-4 flex items-start gap-3 text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3">
                        <span className="text-base">💡</span>
                        <p className="mt-0.5">{ex.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {(selected.exercises.every(e => exerciseAnswers[e.id] !== undefined)) && (
               <div className="mt-8 text-center p-6 border border-emerald-500/30 rounded-2xl bg-emerald-500/10">
                 <h3 className="text-emerald-400 font-bold mb-2">Lesson Completed!</h3>
                 <p className="text-slate-400 text-sm mb-4">You have finished all exercises in this lesson.</p>
                 <Button variant="neon" onClick={() => setSelected(null)}>Return to curriculum</Button>
               </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Nhóm 2 — Grammar Curriculum</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Grammar <span className="gradient-text">Mastery</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Hệ thống ngữ pháp tiếng Anh toàn diện. Được phân chia rõ ràng theo từng chủ đề giúp bạn dễ dàng theo dõi tiến độ.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-violet-400 animate-pulse">Loading grammar curriculum from database...</div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedLessons).map(([topic, topicLessons]) => (
              <div key={topic} className="relative">
                {/* Topic Header */}
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white capitalize">{topic}</h2>
                  <div className="h-px bg-gradient-to-r from-white/20 to-transparent flex-1" />
                  <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">{topicLessons.length} lessons</span>
                </div>

                {/* Grid of lessons for this topic */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {topicLessons.map(lesson => (
                    <div key={lesson.id} onClick={() => setSelected(lesson)}
                      className="glass border border-white/10 rounded-2xl p-6 card-hover cursor-pointer group flex flex-col h-full bg-gradient-to-b from-slate-900/80 to-slate-900/40 hover:from-violet-900/20 hover:to-cyan-900/10">
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xl group-hover:bg-violet-500/20 transition-colors">
                          📝
                        </div>
                        <span className="text-xs px-2 py-1 rounded-lg bg-cyan-600/10 border border-cyan-500/20 text-cyan-300 font-medium">
                          {lesson.level}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-white text-lg mb-2 group-hover:text-violet-300 transition-colors">{lesson.title}</h3>
                      <p className="text-slate-400 text-xs mb-6 line-clamp-2 leading-relaxed flex-1">{lesson.description}</p>
                      
                      <div className="mt-auto flex items-center gap-4 text-xs font-medium text-slate-500 pt-4 border-t border-white/5">
                        <span className="flex items-center gap-1">💡 {lesson.examples.length} examples</span>
                        <span className="flex items-center gap-1">🎯 {lesson.exercises.length} exercises</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
