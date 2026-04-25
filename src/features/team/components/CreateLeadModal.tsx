import React from "react";
import { X } from "lucide-react";
import s from "../../../styles/pages.module.css";

type Props = {
  value: { name: string; email: string; phone: string };
  onChange: (v: { name: string; email: string; phone: string }) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const CreateLeadModal: React.FC<Props> = ({
  value,
  onChange,
  onClose,
  onSubmit,
}) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 9999,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "2rem 1rem",
      overflowY: "auto",
    }}
  >
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "600px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        overflow: "hidden",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2
            style={{
              color: "white",
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 700,
            }}
          >
            Register New Audit Lead
          </h2>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={20} />
        </button>
      </div>
      <div
        style={{
          padding: "1.5rem 2rem",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label className={s.label}>Full Name</label>
          <input
            className={s.input}
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="e.g. Adewale Baku"
            style={{
              width: "100%",
              padding: "0.6rem",
              border: "1px solid var(--border)",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label className={s.label}>Email Address</label>
          <input
            className={s.input}
            value={value.email}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
            placeholder="e.g. adewale@lasg.gov.ng"
            style={{
              width: "100%",
              padding: "0.6rem",
              border: "1px solid var(--border)",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label className={s.label}>Phone Number</label>
          <input
            className={s.input}
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            placeholder="e.g. 08012345678"
            style={{
              width: "100%",
              padding: "0.6rem",
              border: "1px solid var(--border)",
              borderRadius: "4px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <button className={s.btnSecondary} onClick={onClose}>
            Cancel
          </button>
          <button className={s.btnPrimary} onClick={onSubmit}>
            Create Lead
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default CreateLeadModal;
