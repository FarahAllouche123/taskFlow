import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/layout/Navbar";
import { Spinner } from "../components/ui";
import api from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

// ── Mini avatar ───────────────────────────────────────────────────────────────
const Avatar = ({ user, size = 38 }) => {
  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  if (user?.avatar) return <img src={user.avatar} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: "#6366f1",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.35, flexShrink: 0,
    }}>{initials}</div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color, t }) => (
  <div style={{
    flex: "1 1 130px", background: t.statBg, borderRadius: 12,
    padding: "16px 20px", border: `1px solid ${t.border}`, textAlign: "center",
  }}>
    <div style={{ fontSize: 30, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4, fontWeight: 600, letterSpacing: "0.05em" }}>
      {label.toUpperCase()}
    </div>
  </div>
);

// ── User detail modal ─────────────────────────────────────────────────────────
const UserModal = ({ userId, onClose, t }) => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/users/${userId}`)
      .then(r => setData(r.data))
      .catch(() => toast.error("Failed to load user details"))
      .finally(() => setLoading(false));
  }, [userId]);

  const statusColor = { todo: "#6b7280", in_progress: "#3b82f6", completed: "#10b981" };
  const priorityColor = { low: "#22c55e", medium: "#f59e0b", high: "#ef4444" };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16,
    }}>
      <div style={{
        background: t.modalBg, borderRadius: 20, padding: "28px 32px",
        width: 600, maxWidth: "100%", maxHeight: "85vh", overflowY: "auto",
        boxShadow: "0 8px 48px rgba(0,0,0,0.25)", border: `1px solid ${t.border}`,
      }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner size={32} /></div>
        ) : data ? (
          <>
            {/* User header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar user={data.user} size={52} />
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 2 }}>{data.user.name}</h2>
                  <p style={{ fontSize: 13, color: t.textMuted }}>{data.user.email}</p>
                  <p style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                    Joined {new Date(data.user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              <button onClick={onClose} style={{
                width: 32, height: 32, borderRadius: 8, border: "none",
                background: t.statBg, cursor: "pointer", fontSize: 18, color: t.textMuted,
              }}>✕</button>
            </div>

            {/* Tasks */}
            <h3 style={{ fontSize: 14, fontWeight: 600, color: t.textMuted, marginBottom: 12, letterSpacing: "0.04em" }}>
              TASKS ({data.tasks.length})
            </h3>

            {data.tasks.length === 0 ? (
              <p style={{ color: t.textMuted, fontSize: 14, textAlign: "center", padding: "20px 0" }}>No tasks yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.tasks.map(task => (
                  <div key={task._id} style={{
                    padding: "12px 16px", borderRadius: 10,
                    border: `1px solid ${t.border}`, background: t.statBg,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <span style={{
                        fontSize: 14, fontWeight: 500, color: t.text,
                        textDecoration: task.status === "completed" ? "line-through" : "none",
                        opacity: task.status === "completed" ? 0.6 : 1,
                      }}>{task.title}</span>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: statusColor[task.status] }}>
                          {task.status.replace("_", " ").toUpperCase()}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: priorityColor[task.priority] }}>
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {task.description && (
                      <p style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>
                        {task.description.slice(0, 80)}{task.description.length > 80 ? "…" : ""}
                      </p>
                    )}
                    {task.deadline && (
                      <p style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>
                        📅 {new Date(task.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

// ── Admin Page ────────────────────────────────────────────────────────────────
const AdminPage = () => {
  const { user }      = useAuth();
  const { t }         = useTheme();
  const navigate      = useNavigate();
  const [globalStats, setGlobalStats] = useState(null);
  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [selectedId,  setSelectedId]  = useState(null);
  const [deleteId,    setDeleteId]    = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/users"),
    ]).then(([statsRes, usersRes]) => {
      setGlobalStats(statsRes.data.stats);
      const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || "admin@taskflow.io";
      setUsers(usersRes.data.users.filter(u => u.email !== ADMIN_EMAIL));
    }).catch(() => {
      toast.error("Access denied or failed to load");
      navigate("/");
    }).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      setDeleteId(null);
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: t.bg }}>
      <Toaster position="top-right" />
      <Navbar />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 22 }}>🛡️</span>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text }}>Admin Dashboard</h1>
          </div>
          <p style={{ fontSize: 13, color: t.textMuted }}>Logged in as <strong>{user?.email}</strong></p>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner size={36} /></div>
        ) : (
          <>
            {/* Global stats */}
            {globalStats && (
              <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
                <StatCard label="Total Users" value={globalStats.totalUsers} color="#6366f1" t={t} />
                <StatCard label="Total Tasks" value={globalStats.totalTasks} color="#111"    t={t} />
                <StatCard label="To Do"       value={globalStats.todo}       color="#6b7280" t={t} />
                <StatCard label="In Progress" value={globalStats.inProgress} color="#3b82f6" t={t} />
                <StatCard label="Completed"   value={globalStats.completed}  color="#10b981" t={t} />
              </div>
            )}

            {/* Search */}
            <input
              placeholder="🔍 Search users by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10, marginBottom: 16,
                border: `1.5px solid ${t.inputBorder}`, fontSize: 14,
                background: t.inputBg, color: t.text, outline: "none",
                fontFamily: "inherit", boxSizing: "border-box",
              }}
            />

            {/* Users count */}
            <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 12 }}>
              <strong style={{ color: t.text }}>{filtered.length}</strong> user{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Users list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(u => (
                <div key={u.id} style={{
                  background: t.surface, borderRadius: 14, padding: "16px 20px",
                  border: `1px solid ${t.border}`,
                  display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                }}>
                  <Avatar user={u} size={44} />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{u.name}</p>
                    <p style={{ fontSize: 13, color: t.textMuted }}>{u.email}</p>
                    <p style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                      Joined {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  {/* Task mini stats */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[
                      { label: "Total",    value: u.stats.total,      color: "#6366f1" },
                      { label: "Done",     value: u.stats.completed,  color: "#10b981" },
                      { label: "Progress", value: u.stats.inProgress, color: "#3b82f6" },
                      { label: "Overdue",  value: u.stats.overdue,    color: "#ef4444" },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 17, fontWeight: 700, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600 }}>{s.label.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => setSelectedId(u.id)} style={{
                      padding: "7px 14px", borderRadius: 8, border: `1px solid ${t.border}`,
                      background: t.statBg, cursor: "pointer", fontSize: 13,
                      color: t.text, fontFamily: "inherit", fontWeight: 500,
                    }}>View Tasks</button>
                    <button onClick={() => setDeleteId(u.id)} style={{
                      padding: "7px 14px", borderRadius: 8, border: "1px solid #fecaca",
                      background: "#fef2f2", cursor: "pointer", fontSize: 13,
                      color: "#ef4444", fontFamily: "inherit", fontWeight: 500,
                    }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* User detail modal */}
      {selectedId && <UserModal userId={selectedId} onClose={() => setSelectedId(null)} t={t} />}

      {/* Delete confirm */}
      {deleteId && (
        <div onClick={e => e.target === e.currentTarget && setDeleteId(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{
            background: t.modalBg, borderRadius: 16, padding: "28px 32px", width: 360,
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)", border: `1px solid ${t.border}`,
          }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 8 }}>Delete User?</h3>
            <p style={{ fontSize: 14, color: t.textMuted, marginBottom: 22 }}>
              This will permanently delete the user and <strong>all their tasks</strong>.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setDeleteId(null)} style={{
                padding: "9px 18px", borderRadius: 10, border: `1px solid ${t.border}`,
                background: "transparent", cursor: "pointer", fontSize: 14,
                color: t.text, fontFamily: "inherit",
              }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{
                padding: "9px 18px", borderRadius: 10, border: "1px solid #fecaca",
                background: "#fef2f2", cursor: "pointer", fontSize: 14,
                color: "#ef4444", fontFamily: "inherit", fontWeight: 500,
              }}>Delete User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;