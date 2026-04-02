import { useState, useEffect } from "react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  dateUnlocked: string;
}

export default function Achievements({ userId }: { userId: string }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetch(`/api/achievements/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setAchievements(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [userId]);

  if (loading) return <div className="text-slate-500 text-xs animate-pulse font-mono tracking-widest uppercase py-4">Scanning Neural Rewards...</div>;
  if (achievements.length === 0) return (
    <div className="p-8 border border-white/5 bg-white/[0.02] rounded-3xl text-center">
       <div className="text-3xl opacity-20 mb-2">🏅</div>
       <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No achievements unlocked yet</p>
       <p className="text-slate-600 text-[10px] mt-1 italic">Begin your journey to earn rewards.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {achievements.map((a) => (
        <div key={a.id} className="glass p-4 rounded-3xl border border-white/10 flex items-start gap-4 group hover:border-violet-500/50 transition-all hover:bg-violet-600/5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-violet-900/40 shrink-0 group-hover:scale-110 transition-transform">
             ✨
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black text-white leading-tight">{a.name}</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{a.description}</p>
            <p className="text-[8px] text-violet-400/60 mt-2 font-mono uppercase">Unlocked: {new Date(a.dateUnlocked).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
