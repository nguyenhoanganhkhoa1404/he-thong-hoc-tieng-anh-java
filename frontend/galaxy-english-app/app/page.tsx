// app/page.tsx — Galaxy Landing Page (Home)
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import CourseCard from "@/components/ui/CourseCard";
import Button from "@/components/ui/Button";
import { mockCourses, mockUsers } from "@/data/mockData";

const StarField = dynamic(() => import("@/components/background/StarField"), { ssr: false });

const features = [
  { icon: "📚", title: "Vocabulary A1–C2", desc: "5,000+ words with phonetics, examples, and spaced repetition.", href: "/vocabulary", color: "from-violet-600/20 to-violet-800/10" },
  { icon: "📝", title: "Grammar Lessons", desc: "Complete grammar from beginner to advanced with interactive exercises.", href: "/grammar", color: "from-cyan-600/20 to-cyan-800/10" },
  { icon: "🎧", title: "Listening & Speaking", desc: "Real-world audio exercises and AI-powered pronunciation feedback.", href: "/listening", color: "from-pink-600/20 to-pink-800/10" },
  { icon: "🎯", title: "Quiz & Tests", desc: "2,000+ MCQ questions with instant feedback and score tracking.", href: "/quiz", color: "from-amber-600/20 to-amber-800/10" },
  { icon: "✍️", title: "Writing Practice", desc: "Guided writing tasks from paragraphs to IELTS essays.", href: "/writing", color: "from-emerald-600/20 to-emerald-800/10" },
  { icon: "💬", title: "Community Forum", desc: "Ask questions, share tips, practice with other learners.", href: "/forum", color: "from-indigo-600/20 to-indigo-800/10" },
];

const testimonials = [
  { name: "Nguyễn Văn An", level: "B2", text: "Platform này thay đổi hoàn toàn cách tôi học tiếng Anh. Giao diện đẹp, nội dung chất lượng!", avatar: "N" },
  { name: "Trần Thị Bình", level: "C1", text: "Tôi đã cải thiện IELTS từ 6.0 lên 7.5 nhờ luyện tập mỗi ngày trên đây.", avatar: "T" },
  { name: "Lê Minh Châu", level: "A2→B1", text: "Bắt đầu từ A2, sau 3 tháng tôi đã vượt lên B1. Quiz và từ vựng rất hiệu quả!", avatar: "L" },
];

export default function HomePage() {
  const [heroWord, setHeroWord] = useState("Smarter");
  const words = ["Smarter", "Faster", "Better", "Together"];
  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => { idx = (idx + 1) % words.length; setHeroWord(words[idx]); }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <StarField />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="gradient-bg-hero absolute inset-0 z-0" />
        <div className="relative z-10 text-center max-w-5xl mx-auto py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass neon-border-purple mb-8 text-sm text-violet-300">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span>✦ Next-Generation English Learning Platform</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-glow">
            <span className="text-white">Learn English </span>
            <span className="gradient-text">{heroWord}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Từ vựng, ngữ pháp, nghe nói, kiểm tra — tất cả trong một nền tảng. 
            Được cá nhân hóa theo trình độ và mục tiêu của bạn.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <Link href="/register">
              <Button variant="neon" size="lg">🚀 Start Learning Free</Button>
            </Link>
            <Link href="/courses">
              <Button variant="ghost" size="lg">📚 Browse Courses</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
            {[
              { num: "5,000+", label: "Vocabulary Words" },
              { num: "2,000+", label: "Quiz Questions" },
              { num: "A1→C2", label: "All CEFR Levels" },
            ].map(stat => (
              <div key={stat.num} className="glass rounded-2xl p-4 border border-white/10 text-center">
                <p className="text-2xl font-extrabold gradient-text">{stat.num}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 hidden xl:block animate-float">
          <div className="glass rounded-2xl p-4 border border-violet-500/20 text-sm max-w-[160px]">
            <div className="text-2xl mb-1">🔥</div>
            <div className="font-bold text-white text-xs">7-day streak!</div>
            <div className="text-slate-400 text-xs">Keep it up</div>
          </div>
        </div>
        <div className="absolute top-1/3 right-10 hidden xl:block animate-float" style={{ animationDelay: "2s" }}>
          <div className="glass rounded-2xl p-4 border border-cyan-500/20 text-sm">
            <div className="text-xs text-slate-400">Level Up!</div>
            <div className="text-white font-bold text-sm">A2 → B1 🎉</div>
            <div className="mt-2 h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
              <div className="progress-neon h-full rounded-full" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Features</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Everything You Need</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Một nền tảng học tiếng Anh toàn diện từ cơ bản đến nâng cao.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <Link key={f.href} href={f.href}>
              <div className={`glass border border-white/10 rounded-2xl p-6 card-hover cursor-pointer h-full bg-gradient-to-br ${f.color}`}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 text-violet-400 text-xs font-semibold flex items-center gap-1">
                  Explore <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURED COURSES ===== */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-white/5">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-2">✦ Courses</p>
            <h2 className="text-3xl font-extrabold text-white">Featured Courses</h2>
          </div>
          <Link href="/courses" className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {mockCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* ===== TEACHERS ===== */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-white/5">
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Teachers</p>
          <h2 className="text-3xl font-extrabold text-white">Expert Instructors</h2>
        </div>
        <div className="flex justify-center gap-6 flex-wrap">
          {[
            { name: "Trần Thị Mai", spec: "Grammar & Writing", rating: 4.9, students: 2400, emoji: "T" },
            { name: "Lê Văn Hùng", spec: "IELTS Speaking", rating: 4.8, students: 1800, emoji: "L" },
            { name: "Ngô Thị Lan", spec: "Listening & Pronunciation", rating: 4.7, students: 1200, emoji: "N" },
          ].map(t => (
            <div key={t.name} className="glass border border-white/10 rounded-2xl p-6 text-center card-hover w-56">
              <div className="w-16 h-16 rounded-full border-2 border-violet-500 glow-purple mx-auto mb-4 bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-2xl font-bold text-white">
                {t.emoji}
              </div>
              <h3 className="font-bold text-white mb-1">{t.name}</h3>
              <p className="text-xs text-slate-400 mb-2">{t.spec}</p>
              <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs mb-1">
                ★★★★★ <span className="text-slate-400">{t.rating}</span>
              </div>
              <p className="text-xs text-violet-400">{t.students.toLocaleString()} students</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-white/5">
        <div className="text-center mb-12">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Testimonials</p>
          <h2 className="text-3xl font-extrabold text-white">What Our Students Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(t => (
            <div key={t.name} className="glass border border-white/10 rounded-2xl p-6 card-hover">
              <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-violet-400">Level {t.level}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="glass border border-violet-500/20 rounded-3xl p-12 text-center bg-gradient-to-br from-violet-900/20 to-cyan-900/10 glow-purple">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-glow">
            Ready to Start Your Journey? 🚀
          </h2>
          <p className="text-slate-400 mb-8 text-lg">Join thousands of learners on the galaxy&apos;s most advanced English platform.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/register"><Button variant="neon" size="lg">Create Free Account</Button></Link>
            <Link href="/login"><Button variant="ghost" size="lg">Sign In</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center text-slate-500 text-sm">
        <p className="gradient-text font-bold text-base mb-2">🌟 LearnEnglish</p>
        <p>Nền tảng học tiếng Anh toàn diện · Nhóm 1–6 · 2026</p>
        <div className="flex justify-center gap-6 mt-4">
          {["Vocabulary", "Grammar", "Listening", "Quiz", "Forum", "Dashboard"].map(l => (
            <Link key={l} href={`/${l.toLowerCase()}`} className="hover:text-violet-400 transition-colors">{l}</Link>
          ))}
        </div>
      </footer>
    </>
  );
}
