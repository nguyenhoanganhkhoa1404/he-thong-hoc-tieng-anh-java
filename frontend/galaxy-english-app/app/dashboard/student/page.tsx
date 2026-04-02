// app/dashboard/student/page.tsx — Student Dashboard — real API data
"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import { mockPlan } from "@/data/mockData";
import { getStudyStats, StudyStats } from "@/components/StudyTracker";
import ProgressCircle from "@/components/ui/ProgressCircle";

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

interface SkillProgress {
  completedLessons: number;
  averageScore: number;
  level: string;
}

interface ProgressFromApi {
  userId: string;
  totalLessonsCompleted: number;
  averageScore: number;
  currentLevel: string;
  bySkill: Record<string, SkillProgress>;
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
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    if (progress?.bySkill) {
      const skills = Object.entries(progress.bySkill);
      const lowest = skills.sort((a: any, b: any) => a[1].averageScore - b[1].averageScore)[0];
      
      const recs: Record<string, any> = {
        reading: { title: "Speed Reading Mastery", desc: "Your reading score is a bit low. This lesson will help you scan text faster.", icon: "📖", link: "/reading", xp: 50 },
        writing: { title: "Grammar & Structure", desc: "Based on your last essay, auxiliary verbs need work. This will boost your score by ~15%.", icon: "✍️", link: "/writing", xp: 50 },
        speaking: { title: "Pronunciation Workshop", desc: "Practice key vowel sounds to improve your fluency and accuracy scores.", icon: "🎤", link: "/speaking", xp: 50 },
        listening: { title: "Audio Immersion", desc: "Try this A2 level listening task to improve your comprehension speed.", icon: "🎧", link: "/listening", xp: 50 },
      };
      
      setRecommendation(lowest ? recs[lowest[0]] : recs.writing);
    } else {
      setRecommendation({ title: "Grammar: Present Perfect", desc: "Start your journey with a core grammar lesson to boost your foundations.", icon: "📝", link: "/grammar", xp: 50 });
    }
  }, [progress]);

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
          {/* Premium Header */}
          <div className="relative mb-10 p-8 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/20 blur-[100px] -z-10" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-violet-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Welcome Back, Cadet</p>
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                  {user?.displayName || "Learner"} <span className="text-3xl">🚀</span>
                </h1>
                <div className="flex items-center gap-6 mt-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active Streak</span>
                      <span className="text-xl font-black text-orange-400">🔥 {user?.streak ?? 0} DAYS</span>
                   </div>
                   <div className="w-px h-8 bg-white/10" />
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total Mastery</span>
                      <span className="text-xl font-black text-yellow-500">⚡ {user?.xp ?? 0} XP</span>
                   </div>
                </div>
              </div>

              {/* Skill Progress Overview */}
              <div className="flex gap-4 md:gap-8 bg-black/20 p-6 rounded-3xl backdrop-blur-sm border border-white/5">
                <ProgressCircle icon="📖" label="Reading" value={progress?.bySkill?.reading?.averageScore || 0} color="#8b5cf6" size="sm" />
                <ProgressCircle icon="🎧" label="Listen" value={progress?.bySkill?.listening?.averageScore || 0} color="#06b6d4" size="sm" />
                <ProgressCircle icon="🎤" label="Speak" value={progress?.bySkill?.speaking?.averageScore || 0} color="#ec4899" size="sm" />
                <ProgressCircle icon="✍️" label="Write" value={progress?.bySkill?.writing?.averageScore || 0} color="#f59e0b" size="sm" />
              </div>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* AI Suggested Lesson */}
            <div className="glass-dark border-2 border-violet-500/20 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/20 blur-3xl group-hover:bg-violet-600/40 transition-colors" />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="bg-violet-600/30 text-violet-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">AI Recommendation</span>
                  <h3 className="text-xl font-black text-white mt-2">{recommendation?.title}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-2xl shadow-lg">
                  {recommendation?.icon || "🎯"}
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">
                {recommendation?.desc}
              </p>
              <Link href={recommendation?.link || "/courses"}>
                <Button variant="neon" className="w-full">START LESSON +{recommendation?.xp} XP</Button>
              </Link>
            </div>

            {/* Daily Mission */}
            <div className="glass-dark border-2 border-orange-500/20 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-600/20 blur-3xl group-hover:bg-orange-600/40 transition-colors" />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="bg-orange-600/30 text-orange-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Daily Mission</span>
                  <h3 className="text-xl font-black text-white mt-2">The Polyglot Sprint</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center text-2xl shadow-lg">
                  🏆
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                  <span className="text-slate-500">Completed 2/3 Tasks</span>
                  <span className="text-orange-400">Next: 15min Speaking</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-600 to-amber-400 w-[66%] shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
                </div>
              </div>
              <Button variant="outline" className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300">VIEW ALL MISSIONS</Button>
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
              { href: "/quiz", icon: "🎯", label: "Quiz" },
              { href: "/games", icon: "🎮", label: "Games" },
              { href: "/tests", icon: "📄", label: "Tests" },
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
