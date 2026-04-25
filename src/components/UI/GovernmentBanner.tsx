import React from "react";
import { ShieldCheck } from "lucide-react";

const GovernmentBanner: React.FC = () => (
  <div
    role="note"
    aria-label="Official government notice"
    style={{
      width: "100%",
      backgroundColor: "#064e3b",
      color: "#ecfdf5",
      fontSize: "0.75rem",
      padding: "0.4rem 1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      textAlign: "center",
      lineHeight: 1.4,
      borderBottom: "1px solid #022c22",
    }}
  >
    <ShieldCheck size={14} aria-hidden="true" />
    <span>
      <strong>Official Lagos State Government System.</strong> For authorized
      users only. Activity on this platform is monitored and logged.
    </span>
  </div>
);

export default GovernmentBanner;
