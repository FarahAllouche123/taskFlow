import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { register, login, loading, error, clearError } = useAuth();
  const { dark, toggle, t } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    clearError();
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = mode === "register"
      ? await register(form.name, form.email, form.password)
      : await login(form.email, form.password);
    if (result.success) navigate(result.isAdmin ? "/admin" : "/");
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1.5px solid ${t.inputBorder}`, fontSize: 14,
    fontFamily: "inherit", background: t.inputBg, color: t.text,
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: dark ? "#0f172a" : "linear-gradient(135deg, #f8fafc, #e2e8f0)",
      transition: "background 0.3s",
    }}>
      {/* Dark mode toggle — centered top */}
      <button onClick={toggle} style={{
        position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
        width: 40, height: 22, borderRadius: 11,
        background: dark ? "#6366f1" : "#e5e7eb",
        border: "none", cursor: "pointer",
      }}>
        <span style={{
          position: "absolute", top: 3, left: dark ? 21 : 3,
          width: 16, height: 16, borderRadius: "50%", background: "#fff",
          transition: "left 0.25s", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 9,
        }}>{dark ? "🌙" : "☀️"}</span>
      </button>

      <div style={{
        background: t.modalBg, borderRadius: 20, padding: "40px 44px", width: 380,
        boxShadow: "0 4px 32px rgba(0,0,0,0.12)", border: `1px solid ${t.border}`,
        transition: "background 0.3s",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: "#111",
            display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text, letterSpacing: "-0.5px" }}>TaskFlow</h1>
          <p style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: "flex", background: t.toggleBg, borderRadius: 10, padding: 4, marginBottom: 24,
        }}>
          {["login", "register"].map((m) => (
            <button key={m} onClick={() => { setMode(m); clearError(); }} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
              cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
              background: mode === m ? t.modalBg : "transparent",
              color: mode === m ? t.text : t.textMuted,
              boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "register" && (
            <input style={inputStyle} name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          )}
          <input style={inputStyle} type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
          <input style={inputStyle} type="password" name="password" placeholder="Password (min 6 chars)" value={form.password} onChange={handleChange} required />

          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: 10, background: "#fef2f2",
              color: "#ef4444", fontSize: 13, border: "1px solid #fecaca",
            }}>{error}</div>
          )}

          <Button type="submit" disabled={loading} style={{ justifyContent: "center", padding: "12px 0", marginTop: 6 }}>
            {loading ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;