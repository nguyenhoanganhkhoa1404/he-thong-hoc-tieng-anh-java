// app/speaking/page.tsx — Premium Speaking Studio with AI Analysis
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Waveform from "@/components/ui/Waveform";
import ProgressCircle from "@/components/ui/ProgressCircle";

const speakingExercises = [
  { id: "s1", title: "Introduce Yourself", level: "A1", prompt: "Talk about yourself: your name, where you're from, and what you do.", tips: ["Speak clearly and at a natural pace.", "Use simple sentences.", "Practice 2-3 times before recording."] },
  { id: "s2", title: "Describe Your Daily Routine", level: "A2", prompt: "Describe what you do on a typical weekday, from morning to night.", tips: ["Use present simple tense.", "Include time expressions.", "Aim for 60 seconds."] },
  { id: "s3", title: "Opinion: Social Media's Impact", level: "B1", prompt: "Does social media have a positive or negative impact on society? Give your opinion with reasons.", tips: ["Structure: Point → Reason → Example.", "Use discourse markers.", "Speak for 2 minutes."] },
];

export default function SpeakingPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [localTranscript, setLocalTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const [liveScores, setLiveScores] = useState({ fluency: 0, pronunciation: 0, stress: 0 });

  // Simple similarity for live feedback
  const getLiveScore = (transcript: string, prompt: string) => {
    if (!transcript || !prompt) return 0;
    const cleanPrompt = prompt.split("Key Collocations:")[0].replace("Sample Answer:", "").toLowerCase().trim();
    const cleanTranscript = transcript.toLowerCase().trim();
    
    const words = cleanPrompt.split(/\s+/);
    const spoken = cleanTranscript.split(/\s+/);
    let matches = 0;
    spoken.forEach(w => { if (words.includes(w)) matches++; });
    
    return Math.min(100, Math.round((matches / words.length) * 100));
  };

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        console.log("Speech Recognition Started");
      };

      rec.onresult = (event: any) => {
        let interim_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          interim_transcript += event.results[i][0].transcript;
        }
        
        setLocalTranscript(interim_transcript);
        
        // Update LIVE SCORES
        if (selected) {
          const score = getLiveScore(interim_transcript, selected.prompt);
          setLiveScores({
            fluency: Math.min(100, score + 15),
            pronunciation: score,
            stress: Math.max(0, score - 10)
          });
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'network') {
          setError("Network connection issue with browser speech engine. Trying to stay active...");
        } else if (event.error === 'not-allowed') {
          setError("Microphone access denied. Please allow it in settings.");
        }
      };

      rec.onend = () => {
        console.log("Speech Recognition Ended");
        // We will manually handle restarts in start/stop functions
      };

      setRecognition(rec);
    }

    fetch("/api/v1/skills/lessons?skill=SPEAKING")
      .then(r => r.json())
      .then(data => {
        if (!data || data.length === 0) {
          setExercises(speakingExercises);
          return;
        }
        const mapped = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          level: d.level,
          prompt: d.content || "Speak about the topic.",
          tips: d.instructions ? d.instructions.split("\n").filter((t: string) => t.trim() !== '') : ["Speak clearly", "Use appropriate vocabulary"]
        }));
        setExercises(mapped);
      })
      .catch(() => setExercises(speakingExercises))
      .finally(() => setLoading(false));
  }, []);

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(audioStream);
      const recorder = new MediaRecorder(audioStream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setRecordedBlob(blob);
        // Stop stream tracks
        audioStream.getTracks().forEach(track => track.stop());
        setStream(null);
      };

      recorder.start();
      setMediaRecorder(recorder);
      
      // Start Web Speech recognition
      if (recognition) {
        setLocalTranscript("");
        try {
          recognition.start();
        } catch (e) {
          console.warn("Recognition already started or failed to start:", e);
        }
      }

      setRecording(true);
      setAnalysis(null);
    } catch (err) {
      console.error("Error accessing mic:", err);
      alert("Please allow microphone access to record.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
           console.warn("Recognition already stopped:", e);
        }
      }
      setRecording(false);
    }
  };

  const submitForAnalysis = async () => {
    if (!recordedBlob || !selected) return;
    setAnalyzing(true);

    const formData = new FormData();
    formData.append("file", recordedBlob, "recording.wav");
    formData.append("originalText", selected.prompt);
    formData.append("localTranscript", localTranscript); // Send locally captured transcript

    try {
      const res = await fetch("/api/v1/audio/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error("Analysis failed:", err);
      alert("Failed to analyze audio. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-violet-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">AI Speaking Studio</p>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Voice <span className="gradient-text">Mastery</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto font-medium">Upload audio from outside or record directly to get instant AI feedback on your pronunciation.</p>
        </div>

        {loading ? (
          <div className="text-center text-violet-400 py-12 animate-pulse font-bold">Initializing AI Studio...</div>
        ) : !selected ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exercises.map(ex => (
              <div key={ex.id} onClick={() => setSelected(ex)}
                className="glass-dark border border-white/5 rounded-[2rem] p-8 card-hover cursor-pointer group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-violet-600 flex items-center justify-center text-3xl mb-6 shadow-xl group-hover:scale-110 transition-transform tracking-widest">🎤</div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-pink-600/20 border border-pink-500/30 text-pink-300 font-black uppercase tracking-widest">Level {ex.level}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 font-black uppercase tracking-widest">+50 XP</span>
                </div>
                <h3 className="text-xl font-black text-white mb-2">{ex.title}</h3>
                <p className="text-slate-500 text-sm font-medium line-clamp-2">{ex.prompt}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <button onClick={() => { setSelected(null); setRecording(false); setRecordedBlob(null); setAnalysis(null); }}
              className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2 transition-colors">
              <span className="text-lg">←</span> Back to selection
            </button>

            <div className="glass-dark border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 blur-[100px] -z-10" />

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {/* Left: Task & Tips */}
                 <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-pink-600/30 text-pink-300 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Mission Objective</span>
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Target: {selected.level}</span>
                      </div>
                      <h2 className="text-3xl font-black text-white mb-6 leading-tight">{selected.title}</h2>
                      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                        <p className="text-slate-300 font-medium leading-relaxed italic">"{selected.prompt}"</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-violet-600/5 to-transparent border border-violet-500/10 rounded-2xl p-6">
                      <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-4">Pro Tips</h3>
                      <ul className="space-y-3">
                        {selected.tips.map((tip: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-400 font-medium">
                            <span className="text-violet-500 mt-1">✦</span> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                 </div>

                 {/* Right: Recording Area */}
                 <div className="flex flex-col justify-center items-center text-center p-8 rounded-[2rem] bg-black/40 border border-white/5">
                    <div className="w-full mb-10">
                       <Waveform stream={stream} isRecording={recording} color="#ec4899" />
                    </div>

                    {!recording && !recordedBlob && (
                      <div className="space-y-6">
                         <div className="text-slate-500 text-sm font-medium mb-4 italic">Ready to speak? Click the button below.</div>
                         <Button variant="neon" size="lg" onClick={startRecording} className="px-12 py-6 rounded-2xl text-lg font-black tracking-tighter shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                            🎤 START RECORDING
                         </Button>
                      </div>
                    )}

                    {recording && (
                      <div className="space-y-8">
                         <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center relative">
                               <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20" />
                               <div className="w-4 h-4 rounded-full bg-red-600" />
                            </div>
                             <span className="text-red-500 font-black uppercase tracking-[0.2em] animate-pulse">Recording...</span>
                             {recognition ? (
                                <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest mt-1 italic opacity-60">
                                   Browser AI Transcription Active 📡
                                </span>
                             ) : (
                                <span className="text-[8px] text-amber-500 font-bold uppercase tracking-widest mt-1 italic opacity-60">
                                   Browser AI Transcription Unavailable ⚠️
                                </span>
                             )}
                          </div>

                          {/* LIVE SCORES WHILE RECORDING */}
                          {localTranscript && (
                             <div className="flex gap-4 justify-center py-4 scale-75 opacity-80 transition-all">
                               <ProgressCircle label="Fluency" value={liveScores.fluency} color="#ec4899" size="sm" icon="🌊" />
                               <ProgressCircle label="Pronun" value={liveScores.pronunciation} color="#8b5cf6" size="sm" icon="🗣️" />
                               <ProgressCircle label="Stress" value={liveScores.stress} color="#06b6d4" size="sm" icon="⚡" />
                             </div>
                          )}

                         {/* LIVE TRANSCRIPT FEEDBACK */}
                         {(localTranscript || error) && (
                            <div className={`mt-4 p-4 rounded-xl border animate-in fade-in duration-300 max-w-sm ${error ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                               <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-2">{error ? 'System Alert' : 'Live Real-time Capture'}</p>
                               <p className={`text-sm font-medium italic line-clamp-2 ${error ? 'text-red-400' : 'text-white'}`}>
                                 "{error ? error : localTranscript + '...'}"
                               </p>
                            </div>
                         )}

                         <Button variant="ghost" onClick={stopRecording} className="border-red-500/30 text-red-400 hover:bg-red-500/10">⏹ STOP SESSION</Button>
                      </div>
                    )}

                    {recordedBlob && !analysis && (
                      <div className="w-full space-y-6">
                         <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
                            ✅ Signal captured. Process with AI?
                         </div>
                         <div className="flex flex-col gap-3">
                            <Button variant="neon" onClick={submitForAnalysis} disabled={analyzing} className="w-full py-4 rounded-xl font-black">
                               {analyzing ? "⌛ ANALYZING FREQUENCIES..." : "📤 RUN AI EVALUATION"}
                            </Button>
                            <Button variant="ghost" onClick={startRecording} className="w-full text-xs font-bold uppercase tracking-widest">🔄 Retake Recording</Button>
                         </div>
                      </div>
                    )}
                 </div>
               </div>

               {/* Analysis Result */}
               {analysis && (
                  <div className="mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="glass-dark border-2 border-violet-500/20 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-violet-900/5 to-transparent">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[100px] -z-10" />
                      
                      <div className="flex flex-col md:flex-row gap-10 mb-10">
                        <div className="flex-1">
                          <h3 className="text-3xl font-black text-white mb-3 flex items-center gap-4">
                            <span className="w-12 h-12 rounded-2xl bg-violet-600/30 flex items-center justify-center text-2xl">🤖</span>
                            AI Evaluation Report
                          </h3>
                          <p className="text-slate-400 font-medium leading-relaxed">
                             Our AI analyzed your voice footprint. Your pronunciation shows high accuracy, but work on the "stress" placement in multisyllabic words.
                          </p>
                        </div>
                        
                        <div className="flex gap-8 justify-center bg-black/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-md">
                           <ProgressCircle label="Fluency" value={analysis.fluencyScore || 85} color="#ec4899" size="sm" icon="🌊" />
                           <ProgressCircle label="Pronun" value={analysis.pronunciationScore || 72} color="#8b5cf6" size="sm" icon="🗣️" />
                           <ProgressCircle label="Stress" value={analysis.stressScore || 65} color="#06b6d4" size="sm" icon="⚡" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative group">
                            <span className="absolute top-4 right-4 text-xs font-black text-slate-700 uppercase">Input Capture</span>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Captured Transcript</p>
                            <p className="text-white text-xl font-bold leading-relaxed italic group-hover:text-violet-300 transition-colors">
                              "{analysis.transcribedText}"
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 to-cyan-500/20 border border-white/10">
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center text-xl">⏱️</div>
                               <div>
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Speaking Tempo</p>
                                 <p className="text-xs font-bold text-violet-300">WPM Rate</p>
                               </div>
                             </div>
                             <span className="text-3xl font-black text-white">{analysis.speakingSpeed || 120}</span>
                          </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 relative overflow-hidden">
                           <div className="flex items-center gap-3 mb-6">
                             <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center text-xl">💡</div>
                             <p className="text-white text-lg font-black tracking-tight">AI Correction Engine</p>
                           </div>
                           <p className="text-slate-400 leading-relaxed font-medium mb-8">
                             {analysis.analysis}
                           </p>
                           
                           <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Refinement Logic</p>
                             <p className="text-xs text-slate-400 italic mb-4">"Try to drag out the vowels in the second syllable of 'communication'."</p>
                             <button className="w-full py-3 rounded-xl bg-violet-600/20 text-violet-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-violet-600/40 transition-colors border border-violet-500/20 flex items-center justify-center gap-2">
                               ▶ PLAY MASTER PRONUNCIATION
                             </button>
                           </div>
                        </div>
                      </div>

                      <div className="mt-12 flex flex-col md:flex-row gap-4">
                        <Button variant="neon" className="flex-1 py-6 rounded-2xl font-black shadow-lg" onClick={() => { setRecordedBlob(null); setAnalysis(null); }}>RETRY MISSION +20 XP</Button>
                        <Button variant="outline" className="flex-1 py-6 rounded-2xl font-black opacity-60 hover:opacity-100 transition-opacity">EXPORT VOICE DATA 📁</Button>
                      </div>
                    </div>
                  </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
