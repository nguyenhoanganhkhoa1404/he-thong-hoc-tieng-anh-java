"use client";
// DashboardSidebar — Futuristic sidebar with glow icons
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface SidebarItem {
  href: string;
  icon: string;
  label: string;
}

const studentLinks: SidebarItem[] = [
  { href: "/dashboard/student", icon: "🏠", label: "Overview" },
  { href: "/courses", icon: "📚", label: "My Courses" },
  { href: "/vocabulary", icon: "🔤", label: "Vocabulary" },
  { href: "/grammar", icon: "📝", label: "Grammar" },
  { href: "/listening", icon: "🎧", label: "Listening" },
  { href: "/speaking", icon: "🎤", label: "Speaking" },
  { href: "/quiz", icon: "🎯", label: "Quiz" },
  { href: "/writing", icon: "✍️", label: "Writing" },
  { href: "/plan", icon: "📅", label: "Learning Plan" },
  { href: "/forum", icon: "💬", label: "Forum" },
];

const teacherLinks: SidebarItem[] = [
  { href: "/dashboard/teacher", icon: "🏠", label: "Overview" },
  { href: "/dashboard/teacher/courses", icon: "📚", label: "My Courses" },
  { href: "/dashboard/teacher/students", icon: "👥", label: "Students" },
  { href: "/dashboard/teacher/create", icon: "➕", label: "Create Course" },
  { href: "/dashboard/teacher/analytics", icon: "📊", label: "Analytics" },
  { href: "/forum", icon: "💬", label: "Forum" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isTeacher = user?.role === "TEACHER";
  const links = isTeacher ? teacherLinks : studentLinks;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass-dark border-r border-white/10 z-40 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xl">
          🌟
        </div>
        <div>
          <span className="font-bold text-base gradient-text">LearnEnglish</span>
          <p className="text-xs text-slate-500 capitalize">{user?.role?.toLowerCase()} portal</p>
        </div>
      </div>

      {/* User Card */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-900/20 to-cyan-900/20 border border-violet-500/20">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-sm">
            {user?.displayName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.displayName || "User"}</p>
            <p className="text-xs text-violet-400">
              {user?.level || "A1"} · {user?.xp || 0} XP
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? "sidebar-item-active text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <span className={`text-base transition-transform group-hover:scale-110 ${isActive ? "drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" : ""}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm transition-colors">
          🌐 <span>Back to Home</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/20 text-sm transition-colors"
        >
          🚪 <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
