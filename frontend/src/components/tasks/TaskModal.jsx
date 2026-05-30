import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui";

const EMPTY_FORM = { title: "", description: "", deadline: "", priority: "medium", status: "todo" };

const TaskModal = ({ task, onSave, onClose }) => {
  const { t } = useTheme();
  const isEdit = !!task;
  const [form, setForm] = useState(
    isEdit
      ? {
          title:       task.title,
          description: task.description || "",
          deadline:    task.deadline ? task.deadline.slice(0, 10) : "",
          priority:    task.priority,
          status:      task.status,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, title: form.title.trim() });
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1.5px solid ${t.inputBorder}`, fontSize: 14,
    fontFamily: "inherit", background: t.inputBg, color: t.text,
    outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 11, fontWeight: 600, color: t.textMuted,
    display: "block", marginBottom: 5, letterSpacing: "0.04em",
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 16,
      }}
    >
      <div style={{
        background: t.modalBg, borderRadius: 20, padding: "32px 36px",
        width: 480, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 8px 48px rgba(0,0,0,0.25)",
        border: `1px solid ${t.border}`, transition: "background 0.3s",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{isEdit ? "Edit Task" : "New Task"}</h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: "none",
            background: t.statBg, cursor: "pointer", fontSize: 18, color: t.textMuted,
          }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>TITLE *</label>
            <input style={{ ...inputStyle, borderColor: errors.title ? "#fecaca" : t.inputBorder }}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={set("title")}
            />
            {errors.title && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>DESCRIPTION</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
              placeholder="Add details about this task…"
              value={form.description}
              onChange={set("description")}
              rows={3}
            />
          </div>

          {/* Deadline + Priority */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>DEADLINE</label>
              <input type="date" style={inputStyle} value={form.deadline} onChange={set("deadline")} />
            </div>
            <div>
              <label style={labelStyle}>PRIORITY</label>
              <select style={inputStyle} value={form.priority} onChange={set("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Status (edit only) */}
          {isEdit && (
            <div>
              <label style={labelStyle}>STATUS</label>
              <select style={inputStyle} value={form.status} onChange={set("status")}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
          <Button variant="ghost" onClick={onClose} style={{ borderColor: t.border, color: t.text }}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Create Task"}</Button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;