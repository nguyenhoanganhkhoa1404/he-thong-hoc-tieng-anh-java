// app/dashboard/student/page.tsx — Student Dashboard — real API data
"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import { mockPlan } from "@/data/mockData";
import { getStudyStats, StudyStats } from "@/components/StudyTracker";

const PLAN_TASKS = [
  { id: "t1", title: "Learn 20 new words", type: "vocabulary" as const, durationMinutes: 15 },
  { id: "t2", title: "Grammar: Present Perfect", type: "grammar" as const, durationMinutes: 20 },
  { id: "t3", title: "Listening Exercise: A2 Level", type: "listening" as const, durationMinutes: 10 },
];

interface CourseFromApi {
  id: string;
  title: string;
  teacherName?: string;
  level?: string;
  description?: string;
  price?: number;
}

interface ProgressFromApi {
  userId: string;
  totalLessonsCompleted: number;
  averageScore: number;
  currentLevel: string;
}

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br ${color}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function StudentDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<CourseFromApi[]>([]);
  const [progress, setProgress] = useState<ProgressFromApi | null>(null);
  const [vocabCount, setVocabCount] = useState<number | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [studyStats, setStudyStats] = useState<StudyStats | null>(null);

  useEffect(() => {
    setStudyStats(getStudyStats());
    const id = setInterval(() => setStudyStats(getStudyStats()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (!loading && isAuthenticated && user) {
      // Force new learners to take the placement test
      const isTeacher = user?.role?.toUpperCase() === "TEACHER";
      const hasTakenTest = user?.placementTestScore !== undefined && user?.placementTestScore !== null;
      if (!isTeacher && !hasTakenTest) {
        router.push("/placement");
      }
    }
  }, [loading, isAuthenticated, router, user]);

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      // Fetch courses
      const [coursesRes, vocabRes] = await Promise.allSettled([
        fetch("/api/admin/courses"),
        fetch("/api/v1/vocab/items"),
      ]);

      if (coursesRes.status === "fulfilled" && coursesRes.value.ok) {
        const data = await coursesRes.value.json();
        setCourses(Array.isArray(data) ? data : []);
      }
      if (vocabRes.status === "fulfilled" && vocabRes.value.ok) {
        const data = await vocabRes.value.json();
        setVocabCount(Array.isArray(data) ? data.length : 0);
      }

      // Fetch user progress if authenticated
      if (user && ((user as any).uid || user.id)) {
        const uid = (user as any).uid || user.id;
        const progRes = await fetch(`/api/writing-quiz-progress/progress/user/${uid}`);
        if (progRes.ok) setProgress(await progRes.json());
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading) fetchData();
  }, [loading, fetchData]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-violet-400 animate-pulse text-lg">Loading Galaxy...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-slate-400 text-sm mb-1">Welcome back,</p>
            <h1 className="text-3xl font-extrabold text-white">
              {user?.displayName || "Learner"} <span className="gradient-text">✨</span>
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="glass border border-violet-500/30 px-3 py-1 rounded-full text-xs text-violet-300">
                Level {user?.level || progress?.currentLevel || "A1"}
              </span>
              <span className="glass border border-cyan-500/30 px-3 py-1 rounded-full text-xs text-cyan-300">
                🔥 {user?.streak ?? 0} day streak
              </span>
              <span className="glass border border-yellow-500/30 px-3 py-1 rounded-full text-xs text-yellow-300">
                ⚡ {user?.xp ?? 0} XP
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="📚" label="Available Courses" value={dataLoading ? "..." : courses.length} sub="In the system" color="from-violet-900/30 to-violet-800/10" />
            <StatCard icon="🎯" label="Avg Score" value={progress ? `${Math.round(progress.averageScore)}%` : "—"} sub="From quiz history" color="from-cyan-900/30 to-cyan-800/10" />
            <StatCard icon="🔤" label="Total Words" value={vocabCount ?? "..."} sub="In vocabulary DB" color="from-emerald-900/30 to-emerald-800/10" />
            <StatCard icon="📝" label="Completed" value={progress?.totalLessonsCompleted ?? "—"} sub="Quizzes + writing" color="from-amber-900/30 to-amber-800/10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Courses from DB */}
            <div className="lg:col-span-2 glass border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">Available Courses</h2>
                <Link href="/courses" className="text-xs text-violet-400 hover:text-violet-300">View all →</Link>
              </div>
              {dataLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-800/50 rounded-xl animate-pulse" />)}
                </div>
              ) : courses.length > 0 ? (
                <div className="space-y-3">
                  {courses.slice(0, 4).map(course => (
                    <Link key={course.id} href={`/courses/detail?id=${course.id}`}>
                      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-xl flex-shrink-0">
                          📚
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{course.title}</p>
                          <p className="text-xs text-slate-400">{course.teacherName || "Galaxy Teacher"} · Level {course.level || "A1"}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 flex-shrink-0">
                          {course.price === 0 ? "Free" : course.price ? `${course.price.toLocaleString()}đ` : "Free"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center py-8">No courses found. Add courses from the teacher dashboard.</p>
              )}
              <div className="mt-4">
                <Link href="/courses"><Button variant="ghost" size="sm" className="w-full">Browse More Courses</Button></Link>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Today's Plan (synchronized with real StudyTracker) */}
              <div className="glass border border-white/10 rounded-2xl p-5">
                <h2 className="text-sm font-bold text-white mb-4">📅 Today&apos;s Plan</h2>
                <div className="space-y-3">
                  {PLAN_TASKS.map(task => {
                    const spentSeconds = studyStats ? (studyStats[task.type] || 0) : 0;
                    const targetSeconds = task.durationMinutes * 60;
                    const isDone = spentSeconds >= targetSeconds;
                    return (
                      <div key={task.id} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${isDone ? "bg-emerald-500 border-emerald-500" : "border-slate-600"}`}>
                          {isDone && <span className="text-white text-xs">✓</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`block text-xs truncate ${isDone ? "line-through text-slate-500" : "text-slate-300"}`}>{task.title}</span>
                          {!isDone && (
                            <div className="w-full mt-1.5 h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="progress-neon h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min((spentSeconds / targetSeconds) * 100, 100)}%` }} 
                              />
                            </div>
                          )}
                        </div>
                        <span className="ml-auto text-xs text-slate-500 flex-shrink-0">{isDone ? `${task.durationMinutes}m` : `${Math.floor(spentSeconds / 60)}m / ${task.durationMinutes}m`}</span>
                      </div>
                    );
                  })}
                </div>
                <Link href="/plan"><Button variant="outline" size="sm" className="w-full mt-4">View Full Plan</Button></Link>
              </div>

              {/* Progress by skill */}
              <div className="glass border border-white/10 rounded-2xl p-5">
                <h2 className="text-sm font-bold text-white mb-4">📊 Your Progress</h2>
                {progress ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Avg Score</span>
                        <span className="text-violet-300">{Math.round(progress.averageScore)}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="progress-neon h-full rounded-full" style={{ width: `${progress.averageScore}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Lessons Done</span>
                        <span className="text-cyan-300">{progress.totalLessonsCompleted}</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">Level: <span className="text-emerald-400 font-bold">{user?.level || progress.currentLevel || "A1"}</span></div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs">Complete some quizzes or writing exercises to see your progress here.</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { href: "/vocabulary", icon: "🔤", label: "Vocabulary" },
              { href: "/grammar", icon: "📝", label: "Grammar" },
              { href: "/listening", icon: "🎧", label: "Listening" },
              { href: "/speaking", icon: "🎤", label: "Speaking" },
              { href: "/writing", icon: "✍️", label: "Writing" },
              { href: "/quiz", icon: "🎯", label: "Take Quiz" },
            ].map(a => (
              <Link key={a.href} href={a.href}>
                <div className="glass border border-white/10 rounded-xl p-4 text-center card-hover cursor-pointer h-full flex flex-col items-center justify-center">
                  <div className="text-2xl mb-2">{a.icon}</div>
                  <p className="text-xs font-semibold text-slate-300">{a.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
