// components/ui/CourseCard.tsx — Glass card with hover glow
import Link from "next/link";
import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
  compact?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-xs ${i <= Math.round(rating) ? "text-yellow-400" : "text-slate-600"}`}>★</span>
      ))}
      <span className="text-xs text-slate-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

const levelColors: Record<string, string> = {
  A1: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  A2: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  B1: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  B2: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  C1: "text-red-400 bg-red-400/10 border-red-400/30",
  C2: "text-pink-400 bg-pink-400/10 border-pink-400/30",
};

export default function CourseCard({ course, compact = false }: CourseCardProps) {
  const levelColor = levelColors[course.level] || "text-violet-400 bg-violet-400/10 border-violet-400/30";

  return (
    <Link href={`/courses/detail?id=${course.id}`}>
      <div className="glass border border-white/10 rounded-2xl overflow-hidden card-hover cursor-pointer group h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-40 bg-gradient-to-br from-violet-900/60 to-cyan-900/40 flex items-center justify-center overflow-hidden">
          <div className="text-5xl opacity-60 group-hover:scale-110 transition-all duration-500">
            {course.category === "Listening" ? "🎧" :
             course.category === "Business English" ? "💼" :
             course.category === "IELTS" ? "🎓" :
             course.category === "Grammar" ? "📝" : "📚"}
          </div>
          {/* Glow overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/10 transition-all duration-300" />
          {/* Level badge */}
          <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-lg text-xs font-bold border ${levelColor}`}>
            {course.level}
          </span>
          {course.price === 0 && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              FREE
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-violet-300 transition-colors line-clamp-2">
            {course.title}
          </h3>
          {!compact && (
            <p className="text-xs text-slate-400 mb-3 line-clamp-2 flex-1">{course.description}</p>
          )}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {(course.teacher?.displayName || "U").charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-slate-400 truncate">{course.teacher?.displayName || "Unknown"}</span>
          </div>
          <StarRating rating={course.rating} />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>📖 {course.totalLessons} lessons</span>
              <span>👥 {course.totalStudents.toLocaleString()}</span>
            </div>
            <span className={`text-sm font-bold ${course.price === 0 ? "text-emerald-400" : "text-violet-300"}`}>
              {course.price === 0 ? "Free" : `${course.price.toLocaleString()}đ`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
