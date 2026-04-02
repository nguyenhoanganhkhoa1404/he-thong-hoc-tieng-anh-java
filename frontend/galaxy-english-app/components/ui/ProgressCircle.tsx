"use client";
import React from "react";

interface ProgressCircleProps {
  value: number;
  label: string;
  icon: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

export default function ProgressCircle({ value, label, icon, color, size = "md" }: ProgressCircleProps) {
  const radius = size === "sm" ? 30 : size === "lg" ? 50 : 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const sizePx = radius * 2;

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="relative" style={{ width: sizePx, height: sizePx }}>
        {/* Background Circle */}
        <svg height={sizePx} width={sizePx} className="rotate-[-90deg]">
          <circle
            stroke="rgba(255,255,255,0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Circle with Glow */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset, transition: "stroke-dashoffset 1s ease-out" }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="drop-shadow-[0_0_8px_var(--tw-shadow-color)]"
            stroke-shadow-color={color}
          />
        </svg>
        {/* Icon in Center */}
        <div className="absolute inset-0 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</p>
        <p className="text-xs font-extrabold text-white">{value}%</p>
      </div>
    </div>
  );
}
