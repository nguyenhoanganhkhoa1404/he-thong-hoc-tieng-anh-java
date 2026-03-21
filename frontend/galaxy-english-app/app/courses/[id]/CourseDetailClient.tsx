// CourseDetailClient.tsx — Client component for course detail UI
"use client";
import Link from "next/link";
import { mockCourses } from "@/data/mockData";
import Button from "@/components/ui/Button";

export default function CourseDetailClient({ id }: { id: string }) {
  const course = mockCourses.find(c => c.id === id) || mockCourses[0];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/courses" className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors">
          ← Back to Courses
        </Link>

        {/* Banner */}
        <div className="relative h-52 rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-violet-900/60 via-slate-900 to-cyan-900/40 border border-white/10">
          <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-40">📚</div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-8 right-8">
            <div className="flex gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-lg bg-violet-600/30 border border-violet-500/30 text-violet-300">{course.level}</span>
              <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-700 text-slate-300">{course.category}</span>
              {course.price === 0 && <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">FREE</span>}
            </div>
            <h1 className="text-2xl font-extrabold text-white">{course.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold text-white mb-3">About this Course</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{course.description}</p>
              <div className="flex gap-4 mt-4 flex-wrap text-xs text-slate-400">
                <span>📖 {course.totalLessons} lessons</span>
                <span>⏱️ {course.duration}</span>
                <span>👥 {course.totalStudents.toLocaleString()} students</span>
                <span>⭐ {course.rating} / 5.0</span>
              </div>
            </div>

            <div className="glass border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold text-white mb-4">📋 Course Content</h2>
              {course.lessons.length > 0 ? (
                <div className="space-y-2">
                  {course.lessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${lesson.completed ? "bg-emerald-500" : "border border-slate-600 text-slate-400"}`}>
                        {lesson.completed ? "✓" : lesson.order}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{lesson.title}</p>
                        <p className="text-xs text-slate-400">{lesson.description}</p>
                      </div>
                      <span className="text-xs text-slate-500">{lesson.duration} min</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">Lesson content is being prepared...</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass border border-violet-500/30 rounded-2xl p-6 sticky top-24 bg-gradient-to-br from-violet-900/20 to-transparent">
              <div className="text-center mb-5">
                <p className="text-slate-400 text-sm mb-1">Course Price</p>
                <p className={`text-3xl font-extrabold ${course.price === 0 ? "text-emerald-400" : "gradient-text"}`}>
                  {course.price === 0 ? "FREE" : `${course.price.toLocaleString()} VND`}
                </p>
              </div>
              <Button variant="neon" size="lg" className="w-full mb-3">
                {course.price === 0 ? "🚀 Enroll Free" : "💳 Enroll Now"}
              </Button>
              <Button variant="ghost" className="w-full">📌 Save for Later</Button>
              <div className="mt-5 pt-5 border-t border-white/10 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2"><span>✅</span> Lifetime access</div>
                <div className="flex items-center gap-2"><span>📱</span> Mobile &amp; desktop</div>
                <div className="flex items-center gap-2"><span>🏆</span> Certificate on completion</div>
              </div>
            </div>
            <div className="glass border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">Your Instructor</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold">
                  {course.teacher.displayName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{course.teacher.displayName}</p>
                  <p className="text-xs text-slate-400">English Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
