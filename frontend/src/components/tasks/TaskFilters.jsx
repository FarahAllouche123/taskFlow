import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui";

const TaskFilters = ({ filters, onFilter, onSort, onToggleDir, onNew }) => {
  const { t } = useTheme();

  const inputStyle = {
    padding: "9px 12px", borderRadius: 9,
    border: `1.5px solid ${t.inputBorder}`,
    fontSize: 13, outline: "none", fontFamily: "inherit",
    background: t.inputBg, color: t.text, boxSizing: "border-box",
    width: "100%",
  };

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
      <div style={{ flex: "2 1 160px", minWidth: 0 }}>
        <input
          style={inputStyle}
          placeholder="🔍 Search tasks…"
          value={filters.search}
          onChange={(e) => onFilter("search", e.target.value)}
        />
      </div>

      <div style={{ flex: "1 1 110px" }}>
        <select style={inputStyle} value={filters.status} onChange={(e) => onFilter("status", e.target.value)}>
          <option value="all">All statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div style={{ flex: "1 1 100px" }}>
        <select style={inputStyle} value={filters.priority} onChange={(e) => onFilter("priority", e.target.value)}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div style={{ flex: "1 1 110px" }}>
        <select style={inputStyle} value={filters.sortBy} onChange={(e) => onSort(e.target.value)}>
          <option value="createdAt">Created date</option>
          <option value="deadline">Deadline</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <Button variant="ghost" onClick={onToggleDir} style={{ padding: "10px 14px", fontSize: 16, borderColor: t.border, color: t.text }}>
        {filters.sortDir === "asc" ? "↑" : "↓"}
      </Button>

      <Button onClick={onNew}>+ New Task</Button>
    </div>
  );
};

export default TaskFilters;