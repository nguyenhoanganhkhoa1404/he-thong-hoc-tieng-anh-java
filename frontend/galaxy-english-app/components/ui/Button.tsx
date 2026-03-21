// components/ui/Button.tsx — Neon glow button variants
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "neon" | "ghost" | "outline" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
}

const variantClasses = {
  neon: "btn-neon text-white font-semibold",
  ghost: "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-white/20",
  outline: "bg-transparent border border-violet-500/50 text-violet-300 hover:bg-violet-600/20 hover:border-violet-400 hover:text-violet-200",
  danger: "bg-red-600/20 border border-red-500/50 text-red-300 hover:bg-red-600/30 hover:text-red-200",
  success: "bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/30",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-8 py-3.5 text-base rounded-2xl",
};

export default function Button({
  variant = "neon",
  size = "md",
  children,
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
}
