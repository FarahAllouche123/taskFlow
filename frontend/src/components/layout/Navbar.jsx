import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { user, isAdmin } = useAuth();
  const { dark, toggle, t } = useTheme();
  const navigate = useNavigate();

  return (
    <nav style={{
      background: t.navBg, borderBottom: `1px solid ${t.navBorder}`,
      padding: "0 24px", height: 60, display: "flex",
      alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>

      {/* Left — Logo */}
      <div onClick={() => navigate("/")}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: "#111",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.4px", color: t.text }}>
          TaskFlow
          {isAdmin && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: "#6366f1", background: "#ede9fe", padding: "2px 8px", borderRadius: 20 }}>ADMIN</span>}
        </span>
      </div>

      {/* Center — Dark mode toggle */}
      <button onClick={toggle} title={dark ? "Light mode" : "Dark mode"} style={{
        width: 40, height: 22, borderRadius: 11,
        background: dark ? "#6366f1" : "#e5e7eb",
        border: "none", cursor: "pointer", position: "relative", flexShrink: 0,
      }}>
        <span style={{
          position: "absolute", top: 3, left: dark ? 21 : 3,
          width: 16, height: 16, borderRadius: "50%", background: "#fff",
          transition: "left 0.25s", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 9,
        }}>{dark ? "🌙" : "☀️"}</span>
      </button>

      {/* Right — Admin + Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

        {isAdmin && (
          <button onClick={() => navigate("/admin")} style={{
            padding: "6px 14px", borderRadius: 9, border: "1.5px solid #6366f1",
            background: "transparent", cursor: "pointer", fontSize: 13,
            fontWeight: 600, color: "#6366f1", fontFamily: "inherit",
          }}>🛡️ Admin</button>
        )}

        <button onClick={() => navigate("/profile")} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "none", border: `1.5px solid ${t.border}`,
          borderRadius: 10, padding: "5px 12px 5px 6px",
          cursor: "pointer", fontFamily: "inherit",
        }}>
          {user?.avatar
            ? <img src={user.avatar} alt="avatar" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
            : <div style={{
                width: 28, height: 28, borderRadius: "50%", background: "#6366f1",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 12,
              }}>{user?.name?.[0]?.toUpperCase()}</div>
          }
          <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{user?.name}</span>
        </button>

      </div>
    </nav>
  );
};

export default Navbar;