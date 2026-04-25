import React from "react";
import { X } from "lucide-react";
import s from "../../../styles/pages.module.css";
import MandateLetter from "../../../components/Content/MandateLetter";

const EngagementLetterModal: React.FC<{
  mandateId: string;
  onClose: () => void;
}> = ({ mandateId, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
    onClick={onClose}
  >
    <div
      className={s.card}
      style={{
        width: "100%",
        maxWidth: "850px",
        maxHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        backgroundColor: "#fff",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={s.cardHeader}
        style={{
          justifyContent: "space-between",
          borderBottom: "1px solid #e2e8f0",
          padding: "1rem 1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <h3 className={s.cardTitle}>Letter of Engagement</h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          <X size={20} />
        </button>
      </div>
      <div style={{ overflowY: "auto", padding: "1.5rem" }}>
        <MandateLetter mandateId={mandateId} />
      </div>
      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.75rem",
          backgroundColor: "#f8fafc",
        }}
      >
        <button className={s.btnSecondary} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);

export default EngagementLetterModal;
