// app/admin/page.tsx — Nhóm 6: Admin Dashboard
"use client";
import React from 'react';
import Button from "@/components/ui/Button";

const stats = [
  { label: "Total Users", value: "12,845", growth: "+14%", color: "text-violet-400" },
  { label: "Active Subs", value: "3,402", growth: "+8%", color: "text-cyan-400" },
  { label: "Total Courses", value: "156", growth: "+2", color: "text-pink-400" },
  { label: "Monthly Revenue", value: "$45,210", growth: "+24%", color: "text-emerald-400" }
];

export default function AdminPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-1">✦ Nhóm 6 — Admin</p>
            <h1 className="text-3xl font-extrabold text-white">System <span className="gradient-text">Overview</span></h1>
          </div>
          <Button variant="neon" size="sm">⚙️ System Settings</Button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="glass border border-white/10 rounded-2xl p-6">
              <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
              <div className="flex items-end gap-3">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <span className="text-emerald-400 text-sm font-medium mb-1">{stat.growth}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 glass border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">User Growth & Engagement</h2>
            {/* Placeholder for a chart (e.g. Recharts or Chart.js) */}
            <div className="h-64 flex items-end justify-between gap-2 px-2 border-b border-l border-white/10 pb-2">
              {[40, 55, 45, 70, 65, 85, 80, 100, 95, 110, 105, 120].map((h, i) => (
                <div key={i} className="w-full flex justify-center group relative">
                  <div className="w-full bg-gradient-to-t from-violet-600/50 to-cyan-400/80 rounded-t-sm transition-all duration-300 group-hover:from-violet-500 group-hover:to-cyan-300" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-slate-500 px-2">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>

          {/* Quick Actions & Audit Log */}
          <div className="space-y-6">
            <div className="glass border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start text-sm">👥 Manage Users</Button>
                <Button variant="ghost" className="w-full justify-start text-sm">📚 Approve Courses</Button>
                <Button variant="ghost" className="w-full justify-start text-sm">💬 Moderate Forum</Button>
                <Button variant="ghost" className="w-full justify-start text-sm">💳 Billing & Payouts</Button>
              </div>
            </div>

            <div className="glass border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">Recent Alerts</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  <div>
                    <p className="text-sm text-slate-300">High CPU Load</p>
                    <p className="text-xs text-slate-500">Database server hit 92% util.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <div>
                    <p className="text-sm text-slate-300">Backup Completed</p>
                    <p className="text-xs text-slate-500">Daily auto-backup finished.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <div>
                    <p className="text-sm text-slate-300">5 New Teacher Apps</p>
                    <p className="text-xs text-slate-500">Pending review in queue.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
