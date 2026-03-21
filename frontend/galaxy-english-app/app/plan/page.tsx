// app/plan/page.tsx — Nhóm 5: Learning Plan with calendar-style UI
"use client";
import { useState } from "react";
import { mockPlan } from "@/data/mockData";
import Button from "@/components/ui/Button";

const typeIcons: Record<string, string> = {
  vocabulary: "🔤", grammar: "📝", listening: "🎧", speaking: "🎤", quiz: "🎯", writing: "✍️"
};

export default function PlanPage() {
  const [tasks, setTasks] = useState(mockPlan.tasks);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t));
  };

  const completed = tasks.filter(t => t.completed).length;
  const totalMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const doneMinutes = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.durationMinutes, 0);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Nhóm 5 — Learning Plan</p>
          <h1 className="text-4xl font-extrabold text-white mb-4">Study <span className="gradient-text">Planner</span></h1>
          <p className="text-slate-400">Lên kế hoạch học tập có hệ thống để đạt mục tiêu nhanh hơn.</p>
        </div>

        {/* Plan header */}
        <div className="glass border border-violet-500/30 rounded-3xl p-6 mb-8 bg-gradient-to-br from-violet-900/20 to-cyan-900/10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{mockPlan.title}</h2>
              <p className="text-slate-400 text-sm">Target: Level <strong className="text-violet-300">{mockPlan.targetLevel}</strong></p>
            </div>
            <div className="glass border border-white/10 rounded-xl px-4 py-2 text-sm">
              <span className="text-slate-400">Daily goal: </span>
              <span className="text-violet-300 font-bold">{mockPlan.dailyGoalMinutes} min</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
            <span>{completed}/{tasks.length} tasks done today</span>
            <span>{doneMinutes}/{totalMinutes} min</span>
          </div>
          <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="progress-neon h-full rounded-full" style={{ width: `${(completed / tasks.length) * 100}%` }} />
          </div>
        </div>

        {/* Today's tasks */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4">📅 Today — March 22</h3>
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`glass border rounded-2xl p-5 cursor-pointer transition-all duration-200 ${
                  task.completed ? "border-emerald-500/30 bg-emerald-900/10" : "border-white/10 hover:border-violet-500/30"
                }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    task.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-500"
                  }`}>
                    {task.completed && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <div className="text-xl">{typeIcons[task.type] || "📖"}</div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${task.completed ? "line-through text-slate-500" : "text-white"}`}>{task.title}</p>
                    <p className="text-xs text-slate-400 capitalize">{task.type} · {task.durationMinutes} min</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border ${
                    task.completed ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "border-white/10 text-slate-400"
                  }`}>
                    {task.completed ? "Done" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="glass border border-cyan-500/20 rounded-2xl p-6 bg-gradient-to-br from-cyan-900/10 to-violet-900/10">
          <h3 className="text-sm font-bold text-cyan-300 mb-4">💡 Study Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["Study at the same time every day to build a habit.", "Mix different skills: vocab + listening + quiz.", "Take short breaks every 25 minutes (Pomodoro technique).", "Review yesterday's material before starting new content."].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="text-violet-400 mt-0.5">✦</span> {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
