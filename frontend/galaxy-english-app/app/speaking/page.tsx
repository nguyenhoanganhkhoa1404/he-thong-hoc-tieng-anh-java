// app/speaking/page.tsx — Nhóm 3: Speaking exercises with mic UI
"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";

const speakingExercises = [
  { id: "s1", title: "Introduce Yourself", level: "A1", prompt: "Talk about yourself: your name, where you're from, and what you do.", tips: ["Speak clearly and at a natural pace.", "Use simple sentences.", "Practice 2-3 times before recording."] },
  { id: "s2", title: "Describe Your Daily Routine", level: "A2", prompt: "Describe what you do on a typical weekday, from morning to night.", tips: ["Use present simple tense.", "Include time expressions.", "Aim for 60 seconds."] },
  { id: "s3", title: "Opinion: Social Media's Impact", level: "B1", prompt: "Does social media have a positive or negative impact on society? Give your opinion with reasons.", tips: ["Structure: Point → Reason → Example.", "Use discourse markers.", "Speak for 2 minutes."] },
];

export default function SpeakingPage() {
  const [selected, setSelected] = useState<typeof speakingExercises[0] | null>(null);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [waveActive, setWaveActive] = useState(false);

  const startRecording = () => {
    setRecording(true); setWaveActive(true); setRecorded(false);
    setTimeout(() => { setRecording(false); setWaveActive(false); setRecorded(true); }, 5000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">✦ Nhóm 3 — Speaking</p>
          <h1 className="text-4xl font-extrabold text-white mb-4">Speaking <span className="gradient-text">Studio</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto">Luyện phát âm và kỹ năng nói với các chủ đề thực tế hàng ngày.</p>
        </div>

        {!selected ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {speakingExercises.map(ex => (
              <div key={ex.id} onClick={() => setSelected(ex)}
                className="glass border border-white/10 rounded-2xl p-6 card-hover cursor-pointer text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600 to-violet-600 flex items-center justify-center text-2xl mx-auto mb-4">🎤</div>
                <span className="text-xs px-2 py-1 rounded-full bg-pink-600/20 border border-pink-500/30 text-pink-300 mb-3 inline-block">Level {ex.level}</span>
                <h3 className="font-bold text-white mb-2">{ex.title}</h3>
                <p className="text-slate-400 text-xs">{ex.prompt.substring(0, 80)}...</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => { setSelected(null); setRecording(false); setRecorded(false); }}
              className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-2">← Back</button>

            <div className="glass border border-pink-500/20 rounded-3xl p-8 bg-gradient-to-br from-pink-900/10 to-violet-900/10 mb-6">
              <span className="text-xs px-3 py-1 rounded-full bg-pink-600/20 border border-pink-500/30 text-pink-300 mb-4 inline-block">Level {selected.level}</span>
              <h2 className="text-2xl font-bold text-white mb-4">{selected.title}</h2>
              <div className="glass border border-white/10 rounded-2xl p-5 mb-6">
                <h3 className="text-sm font-bold text-violet-300 mb-2">📋 Your Task</h3>
                <p className="text-slate-300 leading-relaxed">{selected.prompt}</p>
              </div>

              {/* Tips */}
              <div className="glass border border-white/10 rounded-2xl p-5 mb-8">
                <h3 className="text-sm font-bold text-cyan-300 mb-3">💡 Tips</h3>
                <ul className="space-y-2">
                  {selected.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="text-violet-400 mt-0.5">✦</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mic / Waveform */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 h-16 mb-6">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i}
                      className={`w-1.5 rounded-full transition-all duration-150 ${waveActive ? "bg-pink-400" : "bg-slate-700"}`}
                      style={{
                        height: waveActive ? `${Math.random() * 60 + 20}%` : "15%",
                        animation: waveActive ? `pulse ${0.3 + Math.random() * 0.4}s ease-in-out infinite` : "none"
                      }}
                    />
                  ))}
                </div>

                {!recording && !recorded && (
                  <Button variant="neon" size="lg" onClick={startRecording}>🎤 Start Recording</Button>
                )}
                {recording && (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-400 font-medium">Recording... (5s demo)</span>
                  </div>
                )}
                {recorded && (
                  <div className="space-y-3">
                    <div className="glass border border-emerald-500/30 rounded-xl p-4 text-emerald-400 text-sm">
                      ✅ Recording complete! Great job.
                    </div>
                    <div className="flex justify-center gap-3">
                      <Button variant="ghost" onClick={startRecording}>🔄 Try Again</Button>
                      <Button variant="neon">📤 Submit for Review</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
