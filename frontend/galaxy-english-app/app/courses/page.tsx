// app/courses/page.tsx — Course list with search and filter
"use client";
import { useState } from "react";
import { mockCourses } from "@/data/mockData";
import CourseCard from "@/components/ui/CourseCard";
import Input from "@/components/ui/Input";

const levels = ["All", "A1", "A2", "B1", "B2", "C1", "C2"];
const categories = ["All", "General English", "Business English", "IELTS", "Grammar"];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [cat, setCat] = useState("All");

  const filtered = mockCourses.filter(c =>
    (level === "All" || c.level === level) &&
    (cat === "All" || c.category === cat) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Courses</p>
          <h1 className="text-4xl font-extrabold text-white mb-4">Explore <span className="gradient-text">All Courses</span></h1>
          <p className="text-slate-400">Tìm khóa học phù hợp với trình độ và mục tiêu của bạn.</p>
        </div>

        {/* Filters */}
        <div className="glass border border-white/10 rounded-2xl p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Search courses..." icon="🔍" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {levels.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${level === l ? "bg-violet-600/30 border-violet-500 text-violet-200" : "border-white/10 text-slate-400 hover:text-white hover:border-white/30"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-slate-400 text-sm mb-5">{filtered.length} courses found</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>No courses found for your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
