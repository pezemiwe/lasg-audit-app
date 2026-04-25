import React from "react";
import { CheckCircle } from "lucide-react";
import { WORKFLOW_STEPS } from "../utils/reportHelpers";
import s from "../../../styles/pages.module.css";

interface Props {
  stepIdx: number;
}

const WorkflowProgressBar: React.FC<Props> = ({ stepIdx }) => (
  <div className={s.card} style={{ marginBottom: "1.5rem" }}>
    <div className={s.cardBody}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        {WORKFLOW_STEPS.map((step, i) => {
          const isComplete = stepIdx > i;
          const isCurrent = Math.floor(stepIdx) === i && stepIdx < 3;
          return (
            <div
              key={step.key}
              style={{
                flex: 1,
                textAlign: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  margin: "0 auto 0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: isComplete
                    ? "#064e3b"
                    : isCurrent
                      ? "#c8930a"
                      : "#e2e8f0",
                  color: isComplete || isCurrent ? "#fff" : "#64748b",
                  border: isCurrent ? "2px solid #c8930a" : "none",
                }}
              >
                {isComplete ? <CheckCircle size={16} /> : i + 1}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent
                    ? "#c8930a"
                    : isComplete
                      ? "#064e3b"
                      : "#64748b",
                }}
              >
                {step.label}
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  color: "#94a3b8",
                  marginTop: "0.15rem",
                }}
              >
                {step.desc}
              </div>
              {i < WORKFLOW_STEPS.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "-50%",
                    width: "100%",
                    height: "2px",
                    background: isComplete ? "#064e3b" : "#e2e8f0",
                    zIndex: 0,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default WorkflowProgressBar;
