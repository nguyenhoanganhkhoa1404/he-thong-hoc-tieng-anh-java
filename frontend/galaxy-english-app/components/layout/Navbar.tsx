"use client";
// Navbar — Transparent glassmorphism navbar with glow effects
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/vocabulary", label: "Vocabulary" },
  { href: "/grammar", label: "Grammar" },
  { href: "/quiz", label: "Quiz" },
  { href: "/forum", label: "Forum" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  const initials = user?.displayName?.charAt(0).toUpperCase() || "U";
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (isDashboard) return null; // Dashboard has its own sidebar

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "glass-dark shadow-lg shadow-purple-900/20" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-lg font-bold group-hover:animate-pulse-glow transition-all">
              🌟
            </div>
            <span className="font-bold text-lg gradient-text">LearnEnglish</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-violet-600/20 text-violet-300 neon-border-purple"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass neon-border-purple hover:glow-purple transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
                    {initials}
                  </div>
                  <span className="text-sm text-slate-300 max-w-[120px] truncate">{user?.displayName}</span>
                  <span className="text-xs text-slate-500">▾</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 glass-dark rounded-xl border border-violet-500/20 overflow-hidden z-50 shadow-xl shadow-purple-900/30">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                    </div>
                    <Link href={user?.role === "TEACHER" ? "/dashboard/teacher" : "/dashboard/student"}
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-violet-600/20 transition-colors">
                      📊 Dashboard
                    </Link>
                    <Link href="/plan" onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-violet-600/20 transition-colors">
                      📅 Learning Plan
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors">
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">
                  Sign In
                </Link>
                <Link href="/register" className="btn-neon text-sm font-semibold text-white px-5 py-2 rounded-full">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="md:hidden text-slate-400 hover:text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden glass-dark border-t border-white/10 py-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-violet-600/20 rounded-lg transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-3 mt-3 flex flex-col gap-2 px-4">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="text-red-400 text-sm text-left">Sign Out</button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="text-slate-300 text-sm">Sign In</Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-neon text-center text-sm font-semibold text-white px-5 py-2 rounded-full">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
