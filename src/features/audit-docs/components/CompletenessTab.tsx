import React from "react";
import Badge from "./Badge";
import Card from "./Card";
import { WORKPAPER_CHECKLIST } from "../utils/auditDocsData";

const CompletenessTab: React.FC<{ complete: number; completePct: number }> = ({
  complete,
  completePct,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
    }}
  >
    <Card
      title="File Completeness Checklist"
      subtitle={`${complete} of ${WORKPAPER_CHECKLIST.length} items complete`}
    >
      <div
        style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {WORKPAPER_CHECKLIST.map((item) => (
          <div
            key={item.ref}
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              padding: "0.6rem 0.75rem",
              background: "var(--bg)",
              borderRadius: "3px",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "2px",
                background:
                  item.status === "Complete"
                    ? "#064e3b"
                    : item.status === "In Progress"
                      ? "#c8930a"
                      : "transparent",
                border: `2px solid ${item.status === "Complete" ? "#064e3b" : item.status === "In Progress" ? "#c8930a" : "var(--border)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {item.status === "Complete" && (
                <span style={{ color: "#fff", fontSize: "0.65rem" }}>✓</span>
              )}
              {item.status === "In Progress" && (
                <span style={{ color: "#fff", fontSize: "0.65rem" }}>…</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.72rem",
                  color: "var(--text-3)",
                  marginRight: "0.5rem",
                }}
              >
                {item.ref}
              </span>
              <span style={{ fontSize: "0.83rem", color: "var(--text)" }}>
                {item.title}
              </span>
            </div>
            <Badge status={item.status} />
          </div>
        ))}
      </div>
    </Card>

    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Card title="Overall Completion">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <div
            style={{
              position: "relative",
              width: "140px",
              height: "140px",
              margin: "0 auto 1.5rem",
            }}
          >
            <svg
              viewBox="0 0 140 140"
              style={{
                width: "100%",
                height: "100%",
                transform: "rotate(-90deg)",
              }}
            >
              <circle
                cx="70"
                cy="70"
                r="58"
                fill="none"
                stroke="var(--border)"
                strokeWidth="12"
              />
              <circle
                cx="70"
                cy="70"
                r="58"
                fill="none"
                stroke="#064e3b"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 58}`}
                strokeDashoffset={`${2 * Math.PI * 58 * (1 - completePct / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--primary)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  lineHeight: 1,
                }}
              >
                {completePct}%
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-3)",
                  marginTop: "0.25rem",
                }}
              >
                Complete
              </div>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0.75rem",
              textAlign: "center",
            }}
          >
            {[
              { label: "Complete", value: complete, color: "#064e3b" },
              {
                label: "In Progress",
                value: WORKPAPER_CHECKLIST.filter(
                  (w) => w.status === "In Progress",
                ).length,
                color: "#c8930a",
              },
              {
                label: "Pending",
                value: WORKPAPER_CHECKLIST.filter((w) => w.status === "Pending")
                  .length,
                color: "#6b7280",
              },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: s.color,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginTop: "0.25rem",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Quality Control Sign-off">
        <div
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {[
            {
              role: "Audit Lead",
              name: "Mr. Femi Adeyemi (Ikeja)",
              status: "Signed",
              date: "24 Jan 2025",
            },
            {
              role: "Supervisor Review",
              name: "Mrs. Ngozi Okafor (Ikeja Zone)",
              status: "Signed",
              date: "28 Jan 2025",
            },
            {
              role: "Quality Reviewer",
              name: "Mr. Babatunde Adesanya",
              status: "In Progress",
              date: "—",
            },
            {
              role: "Auditor-General",
              name: "Hon. Adebayo Oluwaseun",
              status: "Pending",
              date: "—",
            },
          ].map((qc) => (
            <div
              key={qc.role}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "3px",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "var(--text)",
                  }}
                >
                  {qc.role}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                  {qc.name}
                  {qc.date !== "—" ? ` · ${qc.date}` : ""}
                </div>
              </div>
              <Badge
                status={
                  qc.status === "Signed"
                    ? "Approved"
                    : qc.status === "In Progress"
                      ? "In Progress"
                      : "Pending"
                }
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

export default CompletenessTab;
