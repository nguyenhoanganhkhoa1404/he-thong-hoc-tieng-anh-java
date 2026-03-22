// app/plan/page.tsx — Learning Plan: Based on ACTUAL time spent studying
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getStudyStats, StudyStats } from "@/components/StudyTracker";

const PLAN_TITLE = "B1 → B2 in 90 Days";
const TARGET_LEVEL = "B2";

interface PlanTask {
  id: string;
  title: string;
  type: keyof Omit<StudyStats, "date">;
  durationMinutes: number;
}

const typeIcons: Record<string, string> = {
  vocabulary: "🔤", grammar: "📝", listening: "🎧", speaking: "🎤", quiz: "🎯", writing: "✍️"
};

const PLAN_TASKS: PlanTask[] = [
  { id: "t1", title: "Learn 20 new words", type: "vocabulary", durationMinutes: 15 },
  { id: "t2", title: "Grammar: Present Perfect", type: "grammar", durationMinutes: 20 },
  { id: "t3", title: "Listening Exercise: A2 Level", type: "listening", durationMinutes: 10 },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PlanPage() {
  const [stats, setStats] = useState<StudyStats | null>(null);

  // Poll local storage to update actively while user might be jumping back and forth
  useEffect(() => {
    setStats(getStudyStats());
    const id = setInterval(() => setStats(getStudyStats()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!stats) return null;

  // Process tasks based on exactly how many seconds the user spent IN THOSE CATEGORIES
  const tasksWithProgress = PLAN_TASKS.map(task => {
    const targetSeconds = task.durationMinutes * 60;
    const spentSeconds = stats[task.type] || 0;
    const progressPct = Math.min((spentSeconds / targetSeconds) * 100, 100);
    const isDone = spentSeconds >= targetSeconds;

    return { ...task, targetSeconds, spentSeconds, progressPct, isDone };
  });

  const doneCount = tasksWithProgress.filter(t => t.isDone).length;
  const totalTargetMinutes = PLAN_TASKS.reduce((sum, t) => sum + t.durationMinutes, 0);

  // Total studied minutes TODAY across all tracked groups (even outside the plan ones)
  const totalStudiedSeconds = Object.entries(stats).reduce((sum, [key, val]) => {
    return key !== "date" ? sum + (val as number) : sum;
  }, 0);
  const totalStudiedMinutes = Math.floor(totalStudiedSeconds / 60);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Nhóm 5 — Learning Plan</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Study <span className="gradient-text">Planner</span></h1>
          <p className="text-slate-400">Tiến độ tính tự động dựa trên thời gian THỰC TẾ bạn học trên website.</p>
        </div>

        {/* Plan summary card */}
        <div className="glass border border-violet-500/30 rounded-3xl p-6 mb-8 bg-gradient-to-br from-violet-900/20 to-cyan-900/10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{PLAN_TITLE}</h2>
              <p className="text-slate-400 text-sm">Target: Level <strong className="text-violet-300">{TARGET_LEVEL}</strong></p>
            </div>
            <div className="glass border border-white/10 rounded-xl px-4 py-2 text-sm">
              <span className="text-slate-400">Total studied today: </span>
              <span className="text-violet-300 font-bold">{totalStudiedMinutes} / {totalTargetMinutes} min</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
            <span>{doneCount}/{PLAN_TASKS.length} tasks completed today</span>
            <span>{Math.floor(totalStudiedMinutes)} min</span>
          </div>
          <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="progress-neon h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((totalStudiedMinutes / totalTargetMinutes) * 100, 100)}%` }} />
          </div>
        </div>

        {/* Task list */}
        <h3 className="text-lg font-bold text-white mb-4">📅 Today&apos;s Goal — Task List</h3>
        <div className="space-y-4">
          {tasksWithProgress.map(task => (
            <div key={task.id} className={`glass border rounded-2xl p-5 transition-all duration-500 ${
              task.isDone ? "border-emerald-500/30 bg-emerald-900/10" : "border-white/10"
            }`}>
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                  task.isDone ? "bg-emerald-600/20" : "bg-slate-800"
                }`}>
                  {typeIcons[task.type] || "📖"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${task.isDone ? "line-through text-slate-500" : "text-white"}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">
                    {task.type} · Goal: {task.durationMinutes} min
                  </p>

                  {/* Real progress bar */}
                  <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden flex-1 max-w-xs">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${task.isDone ? "bg-emerald-400" : "progress-neon"}`} 
                      style={{ width: `${task.progressPct}%` }} 
                    />
                  </div>
                </div>

                {/* Status & CTA */}
                <div className="flex flex-col items-end flex-shrink-0 gap-2">
                  {task.isDone ? (
                    <span className="text-xs px-3 py-1.5 rounded-xl border bg-emerald-500/20 border-emerald-500/30 text-emerald-400 font-semibold">
                      ✓ Done ({Math.floor(task.spentSeconds / 60)}m)
                    </span>
                  ) : (
                    <>
                      <div className="text-right">
                        <span className="text-xs text-violet-300 font-bold font-mono">
                          {formatTime(task.spentSeconds)} / {formatTime(task.targetSeconds)}
                        </span>
                      </div>
                      <Link href={`/${task.type}`}>
                        <button className="text-xs px-4 py-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 transition-all">
                          Go to {task.type} →
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All done celebration */}
        {doneCount === PLAN_TASKS.length && (
          <div className="mt-8 glass border border-emerald-500/30 rounded-3xl p-8 text-center bg-gradient-to-br from-emerald-900/20 to-cyan-900/10">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-2xl font-extrabold text-white mb-2">Hoàn thành xuất sắc!</h3>
            <p className="text-slate-400">Bạn đã hoàn thành đủ số phút yêu cầu cho tất cả các kỹ năng hôm nay.</p>
          </div>
        )}

        {/* Tips info */}
        <div className="glass border border-cyan-500/20 rounded-2xl p-5 mt-8 bg-gradient-to-br from-cyan-900/10 to-violet-900/10">
          <h3 className="text-sm font-bold text-cyan-300 mb-2">💡 Cách hệ thống tracking thời gian hoạt động:</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hệ thống tự động theo dõi việc bạn học trên các trang tương ứng. Ví dụ, để hoàn thành task <strong>Vocabulary (15 phút)</strong>, bạn chỉ cần mở trang <strong>Từ vựng</strong> và học thật trong vòng 15 phút. Tiến độ sẽ liên tục được lấp đầy và task tự đánh dấu ✓ Done. Dữ liệu tính theo ngày.
          </p>
        </div>
      </div>
    </div>
  );
}
