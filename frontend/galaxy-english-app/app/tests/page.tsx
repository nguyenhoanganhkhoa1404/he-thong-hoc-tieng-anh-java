"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";

const mockTestSets = [
  { id: "t1", name: "IELTS Mock Test 1", type: "FULL_TEST", duration: 160, level: "B2", questions: 40 },
  { id: "t2", name: "TOEIC Practice Set A", type: "READING", duration: 45, level: "B1", questions: 100 },
  { id: "t3", name: "Advanced Grammar Master", type: "WRITING", duration: 60, level: "C1", questions: 20 },
];

export default function TestPage() {
  const [testSets, setTestSets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tests")
      .then(res => res.json())
      .then(data => {
        setTestSets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Assessment Center</p>
          <h1 className="text-4xl font-extrabold text-white mb-4">Real <span className="gradient-text">Practice Tests</span></h1>
          <p className="text-slate-400">Đánh giá chính xác trình độ tiếng Anh của bạn qua các bộ đề thi chuẩn.</p>
        </div>

        {!selected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testSets.map(test => (
              <div key={test.id} className="glass border border-white/10 rounded-3xl p-6 card-hover relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 font-bold uppercase">
                    {test.level}
                  </span>
                </div>
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">📄</div>
                <h3 className="text-xl font-bold text-white mb-2">{test.name}</h3>
                <div className="space-y-2 mb-6">
                   <p className="text-xs text-slate-400 flex items-center gap-2">
                     <span className="text-emerald-400">⏱</span> {test.duration} minutes
                   </p>
                   <p className="text-xs text-slate-400 flex items-center gap-2">
                     <span className="text-emerald-400">❓</span> {test.questions} questions
                   </p>
                   <p className="text-xs text-slate-400 flex items-center gap-2">
                     <span className="text-emerald-400">📂</span> Type: {test.type}
                   </p>
                </div>
                <Button variant="neon" className="w-full" onClick={() => setSelected(test)}>Start Test</Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center">
             <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white mb-8">← Back to Test List</button>
             <div className="glass border border-emerald-500/30 rounded-3xl p-12 text-center bg-emerald-950/20">
                <div className="text-6xl mb-6 animate-pulse">⏳</div>
                <h2 className="text-3xl font-bold text-white mb-4">{selected.name}</h2>
                <p className="text-slate-300 mb-8 italic">Chuẩn bị bắt đầu bài thi... Vui lòng đảm bảo kết nối internet ổn định.</p>
                <div className="p-6 bg-black/20 rounded-2xl text-left border border-white/5 mb-8">
                   <p className="text-xs font-bold text-emerald-400 uppercase mb-2">Instructions:</p>
                   <ul className="text-xs text-slate-400 space-y-2">
                      <li>• You have {selected.duration} minutes to complete all questions.</li>
                      <li>• Do not refresh the page during the test.</li>
                      <li>• Your progress is saved automatically.</li>
                   </ul>
                </div>
                <Link href={`/tests/exam?id=${selected.id}`} className="block w-full">
                  <Button variant="neon" size="lg" className="w-full">Let&apos;s Go!</Button>
                </Link>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
