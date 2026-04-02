"use client";
import React, { useEffect, useRef } from "react";

interface WaveformProps {
  stream: MediaStream | null;
  isRecording: boolean;
  color?: string;
}

export default function Waveform({ stream, isRecording, color = "#8b5cf6" }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const analyzerRef = useRef<AnalyserNode>(null);

  useEffect(() => {
    if (!stream || !isRecording) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    source.connect(analyzer);
    analyzerRef.current = analyzer;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      animationRef.current = requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        ctx.fillStyle = color;
        // Draw mirrored vertical bars
        const y = (canvas.height - barHeight) / 2;
        ctx.fillRect(x, y, barWidth - 1, barHeight);

        x += barWidth;
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      audioContext.close();
    };
  }, [stream, isRecording, color]);

  return (
    <div className="w-full h-16 bg-black/20 rounded-xl overflow-hidden border border-white/5 relative">
      <canvas ref={canvasRef} width={600} height={64} className="w-full h-full" />
      {!isRecording && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase font-bold text-slate-600 tracking-[0.2em]">
          Waiting for signal...
        </div>
      )}
    </div>
  );
}
