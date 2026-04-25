import React from "react";
import { labelCss } from "../utils/styles";

const LabeledTextarea: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  rows?: number;
}> = ({ label, value, onChange, disabled, rows = 4 }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={labelCss}>{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      rows={rows}
      style={{
        width: "100%",
        padding: "0.55rem 0.75rem",
        border: "1px solid #cbd5e1",
        borderRadius: 4,
        fontSize: "0.85rem",
        resize: "vertical",
        fontFamily: "inherit",
        background: disabled ? "#f8fafc" : "#ffffff",
        lineHeight: 1.55,
      }}
    />
  </div>
);

export default LabeledTextarea;
