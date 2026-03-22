// components/StudyTracker.tsx
"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export interface StudyStats {
  date: string; // YYYY-MM-DD
  vocabulary: number; // seconds
  grammar: number;
  listening: number;
  speaking: number;
  quiz: number;
  writing: number;
}

const getTodayString = () => new Date().toISOString().split("T")[0];

export const getStudyStats = (): StudyStats => {
  if (typeof window === "undefined") return { date: getTodayString(), vocabulary: 0, grammar: 0, listening: 0, speaking: 0, quiz: 0, writing: 0 };
  const raw = localStorage.getItem("galaxy_study_stats");
  const today = getTodayString();
  if (raw) {
    try {
      const stats = JSON.parse(raw) as StudyStats;
      if (stats.date === today) return stats;
    } catch (e) {}
  }
  // New day or missing
  return { date: today, vocabulary: 0, grammar: 0, listening: 0, speaking: 0, quiz: 0, writing: 0 };
};

export const saveStudyStats = (stats: StudyStats) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("galaxy_study_stats", JSON.stringify(stats));
};

export default function StudyTracker() {
  const pathname = usePathname();
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    // Determine category from pathname
    let category: keyof Omit<StudyStats, "date"> | null = null;
    if (pathname.startsWith("/vocabulary")) category = "vocabulary";
    else if (pathname.startsWith("/grammar")) category = "grammar";
    else if (pathname.startsWith("/listening")) category = "listening";
    else if (pathname.startsWith("/speaking")) category = "speaking";
    else if (pathname.startsWith("/quiz")) category = "quiz";
    else if (pathname.startsWith("/writing")) category = "writing";

    lastUpdateRef.current = Date.now();

    const interval = setInterval(() => {
      // Only track if document is visible (user is actively looking at the page)
      if (document.hidden) {
        lastUpdateRef.current = Date.now(); // reset timer so we don't jump ahead when unhidden
        return;
      }

      if (category) {
        const now = Date.now();
        const deltaSecs = Math.round((now - lastUpdateRef.current) / 1000);
        
        if (deltaSecs > 0) {
          const stats = getStudyStats();
          stats[category] += deltaSecs;
          saveStudyStats(stats);
          lastUpdateRef.current = now;
        }
      } else {
        lastUpdateRef.current = Date.now();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null; // Silent global component
}
