import React from "react";
import { labelCss } from "../utils/styles";

const LabeledInput: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}> = ({ label, value, onChange, disabled }) => (
  <div>
    <label style={labelCss}>{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "0.5rem 0.7rem",
        border: "1px solid #cbd5e1",
        borderRadius: 4,
        fontSize: "0.85rem",
        background: disabled ? "#f8fafc" : "#ffffff",
      }}
    />
  </div>
);

export default LabeledInput;
