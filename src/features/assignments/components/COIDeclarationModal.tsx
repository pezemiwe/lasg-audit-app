import React from "react";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { COI_DECLARATIONS } from "../utils/assignmentsData";

type Props = {
  coiChecks: boolean[];
  setCoiChecks: (checks: boolean[]) => void;
  allCOIChecked: boolean;
  isAcceptedTarget: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const COIDeclarationModal: React.FC<Props> = ({
  coiChecks,
  setCoiChecks,
  allCOIChecked,
  isAcceptedTarget,
  onCancel,
  onConfirm,
}) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
      padding: "1rem",
    }}
  >
    <div
      style={{
        background: "var(--bg-card, #fff)",
        borderRadius: "10px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        width: "100%",
        maxWidth: "540px",
        border: "1px solid var(--border, #e2e8f0)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "1.5rem 1.75rem 1.25rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "8px",
            background: "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={22} style={{ color: "#d97706" }} />
        </div>
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.05rem",
              lineHeight: 1.3,
            }}
          >
            Independence & Conflict of Interest Declaration
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-3)",
              marginTop: "0.25rem",
            }}
          >
            LASG Office of the Auditor-General — Mandatory Pre-Engagement
            Requirement
          </div>
        </div>
      </div>

      <div style={{ padding: "1.5rem 1.75rem" }}>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-2)",
            marginBottom: "1.25rem",
            lineHeight: 1.6,
          }}
        >
          As required by the Lagos State Audit Service Standing Instructions,
          you must declare your independence and confirm the absence of any
          conflict of interest before commencing this engagement. Please read
          and check each statement carefully.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
          }}
        >
          {COI_DECLARATIONS.map((text, idx) => (
            <label
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                padding: "0.85rem 1rem",
                border: "1px solid",
                borderColor: coiChecks[idx]
                  ? "#86efac"
                  : "var(--border, #e2e8f0)",
                borderRadius: "6px",
                background: coiChecks[idx] ? "#f0fdf4" : "var(--bg, #f8fafc)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <input
                type="checkbox"
                checked={coiChecks[idx]}
                onChange={(e) => {
                  const next = [...coiChecks];
                  next[idx] = e.target.checked;
                  setCoiChecks(next);
                }}
                style={{
                  marginTop: "0.15rem",
                  flexShrink: 0,
                  accentColor: "#16a34a",
                }}
              />
              <span
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.55,
                  color: coiChecks[idx] ? "#166534" : "var(--text, #0f172a)",
                  fontWeight: coiChecks[idx] ? 500 : 400,
                }}
              >
                {text}
              </span>
            </label>
          ))}
        </div>

        {!allCOIChecked && (
          <div
            style={{
              marginTop: "1rem",
              fontSize: "0.8rem",
              color: "#b45309",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <AlertTriangle size={14} />
            All four declarations must be confirmed to proceed.
          </div>
        )}
      </div>

      <div
        style={{
          padding: "1.25rem 1.75rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.75rem",
          background: "var(--bg, #f8fafc)",
        }}
      >
        <button
          onClick={onCancel}
          style={{
            padding: "0.65rem 1.25rem",
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={!allCOIChecked}
          style={{
            padding: "0.65rem 1.5rem",
            background: allCOIChecked ? "#16a34a" : "#e5e7eb",
            color: allCOIChecked ? "white" : "#9ca3af",
            border: "none",
            borderRadius: "6px",
            cursor: allCOIChecked ? "pointer" : "not-allowed",
            fontSize: "0.875rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "background 0.2s",
          }}
        >
          <ShieldCheck size={15} />
          {isAcceptedTarget
            ? "Submit Declaration"
            : "Declare & Accept Assignment"}
        </button>
      </div>
    </div>
  </div>
);

export default COIDeclarationModal;
