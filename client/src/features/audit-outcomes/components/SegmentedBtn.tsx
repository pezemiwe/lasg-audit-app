import React from "react";

const SegmentedBtn: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: "0.5rem 0.85rem",
      fontSize: "0.8rem",
      fontWeight: active ? 700 : 500,
      background: active ? "#064e3b" : "#ffffff",
      color: active ? "#ffffff" : "#475569",
      border: active ? "1px solid #064e3b" : "1px solid #cbd5e1",
      borderRadius: 4,
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);

export default SegmentedBtn;
