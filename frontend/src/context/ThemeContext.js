import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
    document.body.style.background = dark ? "rgba(15,23,42,0.92)" : "transparent";
    document.body.style.color      = dark ? "#f1f5f9" : "#111";
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  // Design tokens
  const t = dark ? {
    bg:          "#0f172a",
    surface:     "#1e293b",
    border:      "#334155",
    text:        "#f1f5f9",
    textMuted:   "#94a3b8",
    inputBg:     "#1e293b",
    inputBorder: "#334155",
    navBg:       "#1e293b",
    navBorder:   "#334155",
    cardBg:      "#1e293b",
    cardBorder:  "#334155",
    statBg:      "#273549",
    toggleBg:    "#334155",
    modalBg:     "#1e293b",
  } : {
    bg:          "transparent",
    surface:     "#ffffff",
    border:      "#e5e7eb",
    text:        "#111111",
    textMuted:   "#6b7280",
    inputBg:     "#ffffff",
    inputBorder: "#e5e7eb",
    navBg:       "#ffffff",
    navBorder:   "#f1f5f9",
    cardBg:      "#ffffff",
    cardBorder:  "#f1f5f9",
    statBg:      "#f9fafb",
    toggleBg:    "#f1f5f9",
    modalBg:     "#ffffff",
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};