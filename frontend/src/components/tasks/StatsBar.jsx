import React from "react";
import { useTheme } from "../../context/ThemeContext";

const StatCard = ({ label, value, color }) => {
  const { t } = useTheme();
  return (
    <div style={{
      flex: "1 1 80px", background: t.statBg, borderRadius: 12,
      padding: "12px 16px", border: `1px solid ${t.border}`, textAlign: "center",
      transition: "background 0.3s, border 0.3s",
    }}>
      <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2, fontWeight: 600, letterSpacing: "0.06em" }}>
        {label.toUpperCase()}
      </div>
    </div>
  );
};

const StatsBar = ({ stats }) => (
  <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
    <StatCard label="Total"       value={stats.total}      color="#6366f1" />
    <StatCard label="To Do"       value={stats.todo}       color="#6b7280" />
    <StatCard label="In Progress" value={stats.inProgress} color="#3b82f6" />
    <StatCard label="Completed"   value={stats.completed}  color="#10b981" />
    <StatCard label="Overdue"     value={stats.overdue}    color="#ef4444" />
  </div>
);

export default StatsBar;