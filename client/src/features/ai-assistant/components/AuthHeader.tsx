import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import type { User } from "../../../types";

interface Props {
  user: User;
}

const AuthHeader: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  return (
    <header
      style={{
        height: "60px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        padding: "0 1.5rem",
        background: "#fff",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            border: "none",
            background: "transparent",
            color: "#4b5563",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
          onClick={() => navigate("/regulations")}
        >
          <ChevronLeft size={18} />
          Back to Dashboard
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
          {user.name}
        </span>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#064e3b",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "0.85rem",
          }}
        >
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
