// app/profile/page.tsx
"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function ProfileContent() {
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get("id");
  const readonly = searchParams.get("readonly") === "true";
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  
  // Editable fields
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // We load the profile corresponding to idFromUrl, or falls back to current logged-in user if no id provided
  const targetId = idFromUrl || user?.id;

  useEffect(() => {
    if (!loading && !isAuthenticated && !idFromUrl) {
      router.push("/login");
      return;
    }

    if (targetId) {
      fetch(`/api/admin/users/${targetId}`)
        .then(r => r.json())
        .then(data => {
          setProfile(data);
          setDisplayName(data.displayName || "");
          setPhone(data.phoneNumber || "");
        })
        .catch(e => console.error("Error fetching profile:", e))
        .finally(() => setFetching(false));
    }
  }, [loading, isAuthenticated, targetId, router, idFromUrl]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readonly || !targetId) return;
    
    setSaving(true);
    setSuccess(false);
    try {
      const payload: any = { displayName, phoneNumber: phone };
      if (password.trim() !== "") {
        payload.password = password;
      }
      const res = await fetch(`/api/admin/users/${targetId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccess(true);
        // Update local session if editing self
        if (targetId === user?.id) {
          const updatedUser = { ...user, displayName, phoneNumber: phone };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("storage"));
        }
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading || fetching) return <div className="min-h-screen pt-24 text-center text-white">Loading Profile...</div>;
  if (!profile) return <div className="min-h-screen pt-24 text-center text-white">Profile not found.</div>;

  const isTeacher = profile.role === "TEACHER" || profile.role === "ADMIN";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors">
          ← Back
        </button>

        <div className="glass border border-white/10 rounded-3xl overflow-hidden p-8 relative">
          {readonly && (
            <div className="absolute top-4 right-4 bg-violet-600/20 text-violet-300 text-xs px-3 py-1 rounded-full border border-violet-500/30 font-semibold tracking-widest uppercase">
              READ ONLY
            </div>
          )}
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white mb-4 border-4 border-slate-900 shadow-xl">
              {profile.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
            <h1 className="text-2xl font-extrabold text-white">{profile.displayName}</h1>
            <p className="text-slate-400 text-sm">{profile.email}</p>
            
            <div className="flex gap-2 mt-4">
              {!isTeacher && (
                <>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Level {profile.level || "A1"}</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">⚡ {profile.xp || 0} XP</span>
                </>
              )}
              {isTeacher && (
                <span className="text-xs px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 uppercase tracking-wider font-semibold">{profile.specialization || "Teacher"}</span>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Email Address (Read-Only)</label>
              <div className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl opacity-70 cursor-not-allowed text-sm">
                {profile.email}
              </div>
              <p className="text-xs text-slate-500 mt-2 ml-1">The bound email descriptor cannot be modified.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Display Name</label>
              {readonly ? (
                <div className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm">
                  {profile.displayName || "Not specified"}
                </div>
              ) : (
                <Input placeholder="Enter your display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Phone Number</label>
              {readonly ? (
                <div className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm">
                  {profile.phoneNumber || "Not specified"}
                </div>
              ) : (
                <Input placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">New Password</label>
              {readonly ? (
                <div className="w-full bg-white/5 border border-white/10 text-slate-500 px-4 py-3 rounded-xl opacity-70 cursor-not-allowed text-sm italic">
                  Hidden for security
                </div>
              ) : (
                <Input type="password" placeholder="Leave blank to keep current password" value={password} onChange={(e) => setPassword(e.target.value)} />
              )}
            </div>

            {!readonly && (
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  {success && <span className="text-emerald-400 text-sm font-medium animate-pulse">✨ Profile successfully updated!</span>}
                </div>
                <Button variant="neon" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center text-white">Loading Profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
