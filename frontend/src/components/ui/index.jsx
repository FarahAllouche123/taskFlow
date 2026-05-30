import React from "react";

// ── Button ────────────────────────────────────────────────────────────────────
export const Button = ({ children, variant = "primary", size = "md", style, ...props }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    borderRadius: 10, fontFamily: "inherit", fontWeight: 500,
    cursor: "pointer", border: "1.5px solid transparent",
    transition: "all 0.15s", whiteSpace: "nowrap",
  };
  const sizes = {
    sm: { padding: "5px 12px", fontSize: 12 },
    md: { padding: "9px 18px", fontSize: 14 },
    lg: { padding: "12px 24px", fontSize: 15 },
  };
  const variants = {
    primary: { background: "#111",    color: "#fff",     borderColor: "#111" },
    ghost:   { background: "transparent", color: "#374151", borderColor: "#e5e7eb" },
    danger:  { background: "#fef2f2", color: "#ef4444",  borderColor: "#fecaca" },
    success: { background: "#ecfdf5", color: "#10b981",  borderColor: "#a7f3d0" },
    ai:      { background: "#eff6ff", color: "#1d4ed8",  borderColor: "#bfdbfe" },
  };
  return (
    <button {...props} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

// ── Input ─────────────────────────────────────────────────────────────────────
export const Input = ({ label, error, style, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", letterSpacing: "0.04em" }}>{label}</label>}
    <input
      {...props}
      style={{
        width: "100%", padding: "10px 14px", borderRadius: 10,
        border: `1.5px solid ${error ? "#fecaca" : "#e5e7eb"}`,
        fontSize: 14, outline: "none", fontFamily: "inherit",
        background: "#fff", color: "#111", boxSizing: "border-box",
        ...style
      }}
    />
    {error && <p style={{ fontSize: 12, color: "#ef4444" }}>{error}</p>}
  </div>
);

// ── Textarea ──────────────────────────────────────────────────────────────────
export const Textarea = ({ label, style, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", letterSpacing: "0.04em" }}>{label}</label>}
    <textarea
      {...props}
      style={{
        width: "100%", padding: "10px 14px", borderRadius: 10,
        border: "1.5px solid #e5e7eb", fontSize: 14, fontFamily: "inherit",
        resize: "vertical", outline: "none", color: "#111",
        boxSizing: "border-box", lineHeight: 1.5, ...style
      }}
    />
  </div>
);

// ── Select ────────────────────────────────────────────────────────────────────
export const Select = ({ label, children, style, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", letterSpacing: "0.04em" }}>{label}</label>}
    <select
      {...props}
      style={{
        width: "100%", padding: "10px 14px", borderRadius: 10,
        border: "1.5px solid #e5e7eb", fontSize: 14, fontFamily: "inherit",
        background: "#fff", color: "#111", outline: "none",
        appearance: "none", cursor: "pointer", boxSizing: "border-box", ...style
      }}
    >{children}</select>
  </div>
);

// ── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  todo:        { color: "#6b7280", bg: "#f9fafb",  border: "#e5e7eb",  label: "To Do" },
  in_progress: { color: "#3b82f6", bg: "#eff6ff",  border: "#bfdbfe",  label: "In Progress" },
  completed:   { color: "#10b981", bg: "#ecfdf5",  border: "#a7f3d0",  label: "Completed" },
  low:         { color: "#22c55e", bg: "#f0fdf4",  border: "#bbf7d0",  label: "Low" },
  medium:      { color: "#f59e0b", bg: "#fffbeb",  border: "#fde68a",  label: "Medium" },
  high:        { color: "#ef4444", bg: "#fef2f2",  border: "#fecaca",  label: "High" },
  overdue:     { color: "#ef4444", bg: "#fef2f2",  border: "#fecaca",  label: "Overdue" },
};

export const Badge = ({ type, label, style }) => {
  const cfg = BADGE_STYLES[type] || { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", label: type };
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      ...style
    }}>{label || cfg.label}</span>
  );
};

// ── Modal ─────────────────────────────────────────────────────────────────────
export const Modal = ({ title, onClose, children, width = 480 }) => (
  <div
    onClick={(e) => e.target === e.currentTarget && onClose()}
    style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 16,
    }}
  >
    <div style={{
      background: "#fff", borderRadius: 20, padding: "32px 36px",
      width, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto",
      boxShadow: "0 8px 48px rgba(0,0,0,0.18)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>{title}</h2>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: 8, border: "none",
          background: "#f1f5f9", cursor: "pointer", fontSize: 18, color: "#6b7280",
        }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 24 }) => (
  <div style={{
    width: size, height: size, border: `2px solid #e5e7eb`,
    borderTop: `2px solid #111`, borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ── Empty State ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, message, action }) => (
  <div style={{
    textAlign: "center", padding: "60px 24px", background: "#fff",
    borderRadius: 16, border: "1.5px dashed #e5e7eb",
  }}>
    <div style={{ fontSize: 44, marginBottom: 14 }}>{icon}</div>
    <h3 style={{ fontSize: 17, fontWeight: 600, color: "#374151", marginBottom: 8 }}>{title}</h3>
    <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 20 }}>{message}</p>
    {action}
  </div>
);