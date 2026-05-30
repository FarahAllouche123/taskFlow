import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/ui";
import Navbar from "../components/layout/Navbar";
import api from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

// ── Avatar with initials fallback ─────────────────────────────────────────────
const Avatar = ({ user, size = 90 }) => {
  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  if (user?.avatar) {
    return (
      <img src={user.avatar} alt="avatar"
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "3px solid #6366f1" }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: "#6366f1",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.33, border: "3px solid #6366f1",
    }}>{initials}</div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color, t }) => (
  <div style={{
    flex: "1 1 100px", background: t.statBg, borderRadius: 12,
    padding: "14px 16px", border: `1px solid ${t.border}`, textAlign: "center",
  }}>
    <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: 11, color: t.textMuted, marginTop: 3, fontWeight: 600, letterSpacing: "0.05em" }}>
      {label.toUpperCase()}
    </div>
  </div>
);

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { t, dark } = useTheme();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [stats, setStats]         = useState(null);
  const [tab, setTab]             = useState("info"); // "info" | "password"
  const [saving, setSaving]       = useState(false);

  // Profile form
  const [name,  setName]  = useState(user?.name  || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  // Password form
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");

  useEffect(() => {
    api.get("/auth/me").then(({ data }) => {
      setStats(data.stats);
    }).catch(() => {});
  }, []);

  // ── Avatar upload (base64) ──────────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  // ── Save profile ────────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const { data } = await api.put("/auth/me", { name, email, avatar });
      updateUser(data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally { setSaving(false); }
  };

  // ── Change password ─────────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) { toast.error("All fields are required"); return; }
    if (newPw !== confirmPw) { toast.error("New passwords do not match"); return; }
    if (newPw.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSaving(true);
    try {
      await api.put("/auth/password", { currentPassword: currentPw, newPassword: newPw });
      toast.success("Password changed!");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally { setSaving(false); }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1.5px solid ${t.inputBorder}`, fontSize: 14,
    fontFamily: "inherit", background: t.inputBg, color: t.text,
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: t.textMuted, display: "block", marginBottom: 5 };

  return (
    <div style={{ minHeight: "100vh", background: t.bg }}>
      <Toaster position="top-right" />
      <Navbar />

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>

        {/* Back button */}
        <button onClick={() => navigate("/")} style={{
          display: "flex", alignItems: "center", gap: 6, marginBottom: 24,
          border: "none", background: "none", cursor: "pointer",
          fontSize: 13, color: t.textMuted, fontFamily: "inherit",
        }}>← Back to Dashboard</button>

        {/* Profile header card */}
        <div style={{
          background: t.surface, borderRadius: 16, padding: "28px 32px",
          border: `1px solid ${t.border}`, marginBottom: 20,
          display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
        }}>
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <Avatar user={{ ...user, avatar }} size={90} />
            <button
              onClick={() => fileRef.current.click()}
              style={{
                position: "absolute", bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: "50%",
                background: "#6366f1", border: "2px solid " + t.surface,
                cursor: "pointer", color: "#fff", fontSize: 13,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✎</button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
          </div>

          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 4 }}>{user?.name}</h2>
            <p style={{ fontSize: 14, color: t.textMuted, marginBottom: 8 }}>{user?.email}</p>
           
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <StatCard label="Total"       value={stats.total}      color="#6366f1" t={t} />
            <StatCard label="To Do"       value={stats.todo}       color="#6b7280" t={t} />
            <StatCard label="In Progress" value={stats.inProgress} color="#3b82f6" t={t} />
            <StatCard label="Completed"   value={stats.completed}  color="#10b981" t={t} />
            <StatCard label="Overdue"     value={stats.overdue}    color="#ef4444" t={t} />
          </div>
        )}

        {/* Tab card */}
        <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${t.border}` }}>
            {[["info", "👤 Edit Profile"], ["password", "🔒 Change Password"]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                flex: 1, padding: "14px 0", border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                background: tab === key ? t.bg : t.surface,
                color: tab === key ? "#6366f1" : t.textMuted,
                borderBottom: tab === key ? "2px solid #6366f1" : "2px solid transparent",
              }}>{label}</button>
            ))}
          </div>

          <div style={{ padding: "28px 32px" }}>

            {/* ── Edit Profile tab ── */}
            {tab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>FULL NAME</label>
                  <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label style={labelStyle}>EMAIL</label>
                  <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>
                <div>
                  <label style={labelStyle}>PROFILE PHOTO</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Avatar user={{ ...user, avatar }} size={52} />
                    <Button variant="ghost" onClick={() => fileRef.current.click()} style={{ borderColor: t.border, color: t.text }}>
                      Upload Photo
                    </Button>
                    {avatar && (
                      <button onClick={() => setAvatar("")} style={{
                        border: "none", background: "none", cursor: "pointer",
                        color: "#ef4444", fontSize: 13, fontFamily: "inherit",
                      }}>Remove</button>
                    )}
                  </div>
                  </div>
                <Button onClick={handleSaveProfile} disabled={saving} style={{ alignSelf: "flex-start", marginTop: 6 }}>
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            )}

            {/* ── Change Password tab ── */}
            {tab === "password" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>CURRENT PASSWORD</label>
                  <input style={inputStyle} type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Enter current password" />
                </div>
                <div>
                  <label style={labelStyle}>NEW PASSWORD</label>
                  <input style={inputStyle} type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min 6 characters" />
                </div>
                <div>
                  <label style={labelStyle}>CONFIRM NEW PASSWORD</label>
                  <input style={inputStyle} type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat new password" />
                </div>
                <Button onClick={handleChangePassword} disabled={saving} style={{ alignSelf: "flex-start", marginTop: 6 }}>
                  {saving ? "Saving…" : "Change Password"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div style={{
          marginTop: 20, background: t.surface, borderRadius: 16,
          border: "1.5px solid #fecaca", padding: "20px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#ef4444", marginBottom: 2 }}>Sign Out</p>
            <p style={{ fontSize: 12, color: t.textMuted }}>You will be redirected to the login page</p>
          </div>
          <Button variant="danger" onClick={logout}>Sign Out</Button>
        </div>

      </main>
    </div>
  );
};

export default ProfilePage;