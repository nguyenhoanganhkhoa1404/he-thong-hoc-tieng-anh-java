// app/layout.tsx — Root layout with galaxy theme and providers
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LearnEnglish — Galaxy English Learning Platform",
  description: "Nền tảng học tiếng Anh thế hệ mới. Từ vựng, ngữ pháp, nghe nói, viết — tất cả trong một.",
  keywords: "learn english, vocabulary, grammar, IELTS, TOEIC, english platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#030712] text-slate-200 min-h-screen`}>
        {/* Galaxy background gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-nebula" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/8 rounded-full blur-3xl animate-nebula" style={{ animationDelay: "7s" }} />
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-pink-600/6 rounded-full blur-3xl animate-nebula" style={{ animationDelay: "14s" }} />
        </div>
        <Navbar />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
