import React from "react";
import { Star } from "lucide-react";
import s from "../../../styles/pages.module.css";

const StarRating: React.FC<{
  value: number;
  onChange: (v: number) => void;
  label: string;
}> = ({ value, onChange, label }) => (
  <div style={{ marginBottom: "0.75rem" }}>
    <label className={s.formLabel}>{label}</label>
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
          }}
        >
          <Star
            size={22}
            fill={n <= value ? "#f59e0b" : "none"}
            color={n <= value ? "#f59e0b" : "#d1d5db"}
          />
        </button>
      ))}
      <span
        style={{ marginLeft: "8px", fontSize: "0.85rem", color: "#6b7280" }}
      >
        {value}/5
      </span>
    </div>
  </div>
);

export default StarRating;
