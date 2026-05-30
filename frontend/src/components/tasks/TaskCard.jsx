import React from "react";
import { format } from "date-fns";
import { Badge } from "../ui";
import { useTheme } from "../../context/ThemeContext";

const STATUS_OPTIONS = [
  { key: "todo",        label: "To Do",       color: "#6b7280", bg: "#f9fafb", bgDark: "#273549", border: "#e5e7eb" },
  { key: "in_progress", label: "In Progress",  color: "#3b82f6", bg: "#eff6ff", bgDark: "#1e3a5f", border: "#bfdbfe" },
  { key: "completed",   label: "Completed",    color: "#10b981", bg: "#ecfdf5", bgDark: "#064e3b", border: "#a7f3d0" },
];

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { dark, t } = useTheme();
  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== "completed";

  const deadlineText = task.deadline
    ? format(new Date(task.deadline), "d MMM yyyy")
    : null;

  return (
    <div style={{
      background: t.cardBg,
      borderRadius: 14, padding: "16px 18px",
      border: `1.5px solid ${isOverdue ? "#fecaca" : t.cardBorder}`,
      boxShadow: isOverdue ? "0 2px 12px rgba(239,68,68,0.08)" : "0 1px 6px rgba(0,0,0,0.04)",
      transition: "background 0.3s, border 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
            <Badge type={task.status} />
            <Badge type={task.priority} />
            {isOverdue && <Badge type="overdue" />}
          </div>
          <h3 style={{
            fontSize: 15, fontWeight: 600, marginBottom: 4, color: t.text,
            textDecoration: task.status === "completed" ? "line-through" : "none",
            opacity: task.status === "completed" ? 0.6 : 1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{task.title}</h3>
          {task.description && (
            <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.5, marginBottom: 8 }}>
              {task.description.length > 100 ? `${task.description.slice(0, 100)}…` : task.description}
            </p>
          )}
          {deadlineText && (
            <p style={{ fontSize: 12, color: isOverdue ? "#ef4444" : t.textMuted, fontWeight: isOverdue ? 600 : 400 }}>
              📅 {deadlineText}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          <button onClick={() => onEdit(task)} title="Edit" style={{
            width: 32, height: 32, borderRadius: 8,
            border: `1px solid ${t.border}`, background: t.statBg,
            cursor: "pointer", fontSize: 14, color: t.text,
          }}>✎</button>
          <button onClick={() => onDelete(task._id)} title="Delete" style={{
            width: 32, height: 32, borderRadius: 8,
            border: "1px solid #fecaca", background: "#fef2f2",
            cursor: "pointer", fontSize: 14, color: "#ef4444",
          }}>✕</button>
        </div>
      </div>

      {/* Quick status switcher */}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${t.border}`, display: "flex", gap: 5 }}>
        {STATUS_OPTIONS.map(({ key, label, color, bg, bgDark, border }) => (
          <button
            key={key}
            onClick={() => onStatusChange(task._id, key)}
            style={{
              flex: 1, padding: "5px 0", borderRadius: 7, fontSize: 11,
              cursor: "pointer", fontFamily: "inherit",
              border: `1px solid ${task.status === key ? border : t.border}`,
              background: task.status === key ? (dark ? bgDark : bg) : "transparent",
              color: task.status === key ? color : t.textMuted,
              fontWeight: task.status === key ? 600 : 400,
            }}
          >{label}</button>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;