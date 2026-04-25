import type React from "react";

export const labelCss: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 700,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: 4,
};

export const cellInput: React.CSSProperties = {
  width: "100%",
  padding: "0.3rem 0.5rem",
  border: "1px solid transparent",
  background: "transparent",
  fontSize: "0.82rem",
  color: "inherit",
  fontFamily: "inherit",
};

export const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "0.55rem 1rem",
  background: "#064e3b",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  fontSize: "0.82rem",
  fontWeight: 600,
  cursor: "pointer",
};

export const smallGhostBtn: React.CSSProperties = {
  padding: "0.35rem 0.65rem",
  fontSize: "0.72rem",
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: 4,
  color: "#475569",
  cursor: "pointer",
};

export const th: React.CSSProperties = {
  padding: "0.5rem 0.6rem",
  textAlign: "left",
  fontSize: "0.72rem",
  fontWeight: 600,
  color: "#334155",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
};

export const td: React.CSSProperties = {
  padding: "0.45rem 0.6rem",
  fontSize: "0.8rem",
  borderBottom: "1px solid #f1f5f9",
};
