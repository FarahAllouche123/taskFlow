import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui";

const DeleteConfirmModal = ({ onConfirm, onClose }) => {
  const { t } = useTheme();
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      }}
    >
      <div style={{
        background: t.modalBg, borderRadius: 16, padding: "28px 32px", width: 360,
        boxShadow: "0 8px 40px rgba(0,0,0,0.2)", border: `1px solid ${t.border}`,
      }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 8 }}>Delete Task?</h3>
        <p style={{ fontSize: 14, color: t.textMuted, marginBottom: 22 }}>
          This action is permanent and cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose} style={{ borderColor: t.border, color: t.text }}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete Task</Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;