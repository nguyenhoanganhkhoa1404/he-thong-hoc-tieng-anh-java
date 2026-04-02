"use client";
import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

type GameMode = "scramble" | "listening" | "match" | "grammar" | "bubble";

export default function GameHub() {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState<GameMode | null>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "result">("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [userInp, setUserInp] = useState("");
  const [feedback, setFeedback] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [errorShake, setErrorShake] = useState(false);

  // Send score to backend when game over
  useEffect(() => {
    if (gameState === "result" && score > 0 && user) {
      const uid = (user as any).uid || user.id;
      fetch("/api/v1/games/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, score: score })
      }).catch(err => console.error("Failed to save score:", err));
    }
  }, [gameState, score, user]);

  // Timer logic
  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) {
      setGameState("result");
      return;
    }
    const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [gameState, timeLeft]);

  const speakWord = useCallback((word: string) => {
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = "en-US";
    utter.rate = 0.8;
    window.speechSynthesis.speak(utter);
  }, []);

  const generateChallenge = useCallback(async (mode: GameMode) => {
    setFeedback(null);
    setUserInp("");
    
    try {
      const res = await fetch(`/api/v1/games/challenge?mode=${mode}`);
      const data = await res.json();
      setCurrentChallenge(data);
      
      // Set time based on mode
      if (mode === "scramble") setTimeLeft(30);
      else if (mode === "listening") {
        setTimeLeft(15);
        speakWord(data.word);
      }
      else if (mode === "grammar") setTimeLeft(25);
      else if (mode === "match") setTimeLeft(20);
      else if (mode === "bubble") setTimeLeft(12);
      
      setGameState("playing");
    } catch (error) {
      console.error("Failed to fetch challenge:", error);
    }
  }, [speakWord]);

  const checkAnswer = () => {
    const isCorrect = userInp.trim().toLowerCase() === (currentChallenge.word || currentChallenge.a).toLowerCase();
    
    if (isCorrect) {
      setFeedback({ msg: "✨ PERFECT!", type: "success" });
      setScore(prev => prev + 10 + (combo * 2));
      setCombo(prev => prev + 1);
      setTimeout(() => generateChallenge(selectedGame!), 600);
    } else {
      setFeedback({ msg: "❌ TRY AGAIN!", type: "error" });
      setCombo(0);
      setErrorShake(true);
      setTimeout(() => {
        setErrorShake(false);
        setFeedback(null);
      }, 800);
    }
  };

  if (selectedGame && gameState === "playing") {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4">
         {/* HUD */}
         <div className="w-full max-w-md flex justify-between items-center mb-10">
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Score</span>
               <span className="text-3xl font-black text-white">{score}</span>
            </div>
            <div className="relative group">
               <div className="absolute -inset-4 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
               <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-black text-xl transition-colors ${timeLeft < 10 ? "border-red-500 text-red-500" : "border-cyan-500 text-cyan-400"}`}>
                  {timeLeft}
               </div>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Combo</span>
               <span className="text-3xl font-black text-orange-400">x{combo}</span>
            </div>
         </div>

         {/* Game Area */}
         <div className={`w-full max-w-md glass-dark border-2 rounded-[2.5rem] p-10 text-center transition-all duration-300 ${errorShake ? "animate-shake border-red-500/50" : feedback?.type === 'success' ? "border-emerald-500/50 scale-105" : "border-white/10"}`}>
            
            {/* Feedback Overlay */}
            {feedback && (
               <div className={`text-sm font-black uppercase tracking-[0.2em] mb-4 p-2 rounded-lg ${feedback.type === 'success' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                  {feedback.msg}
               </div>
            )}

            {selectedGame === "scramble" && (
               <>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Unscramble the Logic</p>
                  <div className="text-4xl font-black text-white tracking-[0.3em] mb-10 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                     {currentChallenge?.scrambled}
                  </div>
                  <div className="text-xs text-violet-400 font-bold mb-6 italic">Hint: {currentChallenge?.hint}</div>
               </>
            )}

            {selectedGame === "listening" && (
               <>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Sonic Echo</p>
                  <button onClick={() => speakWord(currentChallenge?.word)} className="w-24 h-24 rounded-full bg-violet-600/20 border-2 border-violet-500/50 flex items-center justify-center text-4xl mb-10 hover:scale-110 active:scale-95 transition-transform shadow-lg shadow-violet-900/20 mx-auto">
                     🔊
                  </button>
                  <p className="text-slate-400 text-xs mb-10 font-medium tracking-tight">Listen carefully and type the word.</p>
               </>
            )}

            {["grammar", "match", "bubble"].includes(selectedGame) && (
               <>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">{selectedGame.toUpperCase()} CHALLENGE</p>
                  <div className="text-2xl font-black text-white mb-10 leading-relaxed">
                     {currentChallenge?.q}
                  </div>
                  <div className="text-xs text-violet-400 font-bold mb-6 italic">Hint: {currentChallenge?.hint}</div>
               </>
            )}

            <input 
               autoFocus
               type="text"
               value={userInp}
               onChange={(e) => setUserInp(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
               placeholder="TYPE ANSWER..."
               className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-xl font-black text-white focus:outline-none focus:border-cyan-500/50 transition-all text-center tracking-[0.2em] mb-6"
            />
            <Button variant="neon" className="w-full py-5 rounded-2xl" onClick={checkAnswer}>CONFIRM</Button>
         </div>
      </div>
    );
  }

  if (gameState === "result") {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
         <div className="max-w-md w-full glass-dark border border-white/10 rounded-[3rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl" />
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-4xl font-black text-white mb-2">TRIAL OVER</h2>
            <p className="text-slate-400 font-medium mb-10">You've mastered the challenge with honor.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
               <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Final Score</p>
                  <p className="text-3xl font-black text-white">{score}</p>
               </div>
               <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">XP Bonus</p>
                  <p className="text-3xl font-black text-yellow-500">+{Math.floor(score/2)}</p>
               </div>
            </div>

            <div className="flex flex-col gap-3">
               <Button variant="neon" className="w-full py-5 rounded-xl font-black" onClick={() => { setGameState("idle"); setScore(0); setCombo(0); }}>PLAY AGAIN</Button>
               <Button variant="ghost" className="w-full text-slate-500" onClick={() => { setSelectedGame(null); setGameState("idle"); }}>EXIT HUB</Button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#020617]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">The Arena</p>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Galaxy <span className="gradient-text">Games</span></h1>
          <p className="text-slate-500 font-medium font-bold italic">Chinh phục 5 thử thách để trở thành Guardian of Language!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { id: "scramble", icon: "🔠", title: "Word Scramble", desc: "Unscramble the cosmic logic.", color: "from-violet-600 to-indigo-600", lvl: "A1" },
             { id: "listening", icon: "🔊", title: "Sonic Echo", desc: "Listen carefully & type the echo.", color: "from-cyan-600 to-blue-600", lvl: "A2" },
             { id: "match", icon: "🧩", title: "Synapse Link", desc: "Match meanings to link nodes.", color: "from-emerald-600 to-teal-600", lvl: "B1" },
             { id: "grammar", icon: "📝", title: "Grammar Dash", desc: "Correct the syntax flux.", color: "from-pink-600 to-rose-600", lvl: "B2" },
             { id: "bubble", icon: "🫧", title: "Vocab Bubble", desc: "Quick-fire vocabulary matching.", color: "from-yellow-600 to-orange-600", lvl: "C1" },
           ].map((game) => (
             <div key={game.id} 
               onClick={() => { setSelectedGame(game.id as any); generateChallenge(game.id as any); }}
               className={`relative glass-dark border border-white/10 rounded-[2.5rem] p-10 card-hover cursor-pointer group overflow-hidden`}>
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${game.color} opacity-10 blur-3xl group-hover:opacity-30 transition-opacity`} />
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${game.color} flex items-center justify-center text-4xl mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform`}>
                   {game.icon}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{game.lvl} MISSION</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{game.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{game.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
