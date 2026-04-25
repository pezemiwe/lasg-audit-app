import React from "react";
import {
  CheckCircle,
  Shield,
  FileText,
  BarChart3,
  Star,
  Users,
  Target,
  BookOpen,
} from "lucide-react";
import StatusBadge from "../../../components/UI/StatusBadge";
import s from "../../../styles/pages.module.css";
import type {
  Audit,
  LGA,
  AuditReport,
  Finding,
  ExitConference,
  QualityReview,
  LessonLearned,
  User,
} from "../../../types";
import { userName } from "../utils/helpers";

interface Props {
  selectedAudit: Audit | undefined;
  selectedLga: LGA | undefined;
  auditReports: AuditReport[];
  allFindings: Finding[];
  auditExitConf: ExitConference | undefined;
  auditQualityReview: QualityReview | undefined;
  auditLessons: LessonLearned[];
  totalFollowUps: number;
  verifiedCount: number;
  implementationRate: number;
  users: User[];
  addToast: (toast: {
    type: "success" | "error" | "info" | "warning";
    title: string;
    message?: string;
  }) => void;
}

const SummaryTab: React.FC<Props> = ({
  selectedAudit,
  selectedLga,
  auditReports,
  allFindings,
  auditExitConf,
  auditQualityReview,
  auditLessons,
  totalFollowUps,
  verifiedCount,
  implementationRate,
  users,
  addToast,
}) => (
  <>
    {/* ════════════ TAB: Audit Summary ════════════ */}
    <>
      {selectedAudit?.status === "Completed" && (
        <div
          style={{
            background: "linear-gradient(to right, #ecfdf5, #f0fdf9)",
            border: "1px solid #a7f3d0",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "1rem",
              borderRadius: "50%",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Shield size={32} color="#059669" fill="#d1fae5" />
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#064e3b",
                marginBottom: "0.25rem",
              }}
            >
              Audit Successfully Completed
            </h2>
            <p style={{ color: "#065f46", fontSize: "0.95rem" }}>
              This audit cycle has been finalized. The final report has been
              issued and all major findings have been addressed or transferred
              to the follow-up tracker.
            </p>
          </div>
          <div>
            <button
              className={s.btnPrimary}
              onClick={() =>
                addToast({
                  type: "success",
                  title: "Downloading",
                  message: "Downloading Final Report PDF...",
                })
              }
            >
              <FileText size={16} /> Download Final Report
            </button>
          </div>
        </div>
      )}

      <div className={s.gridTwoCols}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Executive Summary</h3>
          </div>
          <div className={s.cardBody}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
              }}
            >
              <div className={s.infoItem}>
                <div className={s.infoLabel}>Audit Entity (LGA)</div>
                <div className={s.infoValue}>{selectedLga?.name}</div>
              </div>
              <div className={s.infoItem}>
                <div className={s.infoLabel}>Audit Year</div>
                <div className={s.infoValue}>{selectedAudit?.year}</div>
              </div>
              <div className={s.infoItem}>
                <div className={s.infoLabel}>Audit Type</div>
                <div className={s.infoValue}>{selectedAudit?.type}</div>
              </div>
              <div className={s.infoItem}>
                <div className={s.infoLabel}>Audit Opinion</div>
                <div
                  className={s.infoValue}
                  style={{ color: "#16a34a", fontWeight: 600 }}
                >
                  Unqualified (Clean)
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--border)",
              }}
            >
              <h4
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                  color: "var(--text-1)",
                }}
              >
                Objective Achievement
              </h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "8px",
                    background: "#e2e8f0",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#16a34a",
                    }}
                  ></div>
                </div>
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  100%
                </span>
              </div>
              <p
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.85rem",
                  color: "var(--text-2)",
                }}
              >
                All audit objectives as defined in the planning phase were
                successfully met.
              </p>
            </div>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Findings Impact Analysis</h3>
          </div>
          <div className={s.cardBody}>
            {allFindings.length === 0 ? (
              <div className={s.emptyState}>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <CheckCircle
                    size={48}
                    style={{ color: "#16a34a", marginBottom: "1rem" }}
                  />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    Clean Audit!
                  </h3>
                  <p style={{ color: "var(--text-2)" }}>
                    No findings were recorded for this audit.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={s.kpiGrid}
                  style={{
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div
                    className={s.kpiBox}
                    style={{
                      background: "#fef2f2",
                      borderColor: "#fecaca",
                      padding: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: "#dc2626",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {
                        allFindings.filter((f) => f.severity === "Critical")
                          .length
                      }
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#991b1b",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Critical
                    </div>
                  </div>
                  <div
                    className={s.kpiBox}
                    style={{
                      background: "#fff7ed",
                      borderColor: "#fed7aa",
                      padding: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: "#ea580c",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {allFindings.filter((f) => f.severity === "High").length}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#9a3412",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      High
                    </div>
                  </div>
                  <div
                    className={s.kpiBox}
                    style={{
                      background: "#fefce8",
                      borderColor: "#fde047",
                      padding: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: "#d97706",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {
                        allFindings.filter((f) => f.severity === "Medium")
                          .length
                      }
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#854d0e",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Medium
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "1.5rem" }}>
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      marginBottom: "0.75rem",
                    }}
                  >
                    Top Risk Areas Identified
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      "Procurement",
                      "Financial Controls",
                      "Asset Management",
                    ].map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: "#f1f5f9",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "2rem",
                          fontSize: "0.8rem",
                          color: "#475569",
                          fontWeight: 500,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>

    {/* ════════════ TAB: Audit Summary ════════════ */}
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h3 className={s.cardTitle}>
          <BarChart3 size={18} /> Audit Engagement Summary
        </h3>
      </div>
      <div className={s.cardBody}>
        <div className={s.gridTwoCols}>
          {/* Left: General Info */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
              General Information
            </h4>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>LGA</span>
              <span className={s.detailValue}>{selectedLga?.name || "-"}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Audit Type</span>
              <span className={s.detailValue}>
                {selectedAudit?.type || "-"}
              </span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Year</span>
              <span className={s.detailValue}>
                {selectedAudit?.year || "-"}
              </span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Lead Auditor</span>
              <span className={s.detailValue}>
                {selectedAudit?.leadId
                  ? userName(selectedAudit.leadId, users)
                  : "Unassigned"}
              </span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Status</span>
              <span className={s.detailValue}>
                <StatusBadge
                  label={selectedAudit?.status || "-"}
                  variant={
                    selectedAudit?.status === "Completed"
                      ? "success"
                      : "warning"
                  }
                />
              </span>
            </div>
          </div>

          {/* Right: Statistics */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
              Engagement Statistics
            </h4>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Reports</span>
              <span className={s.detailValue}>
                {auditReports.length} report(s)
              </span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Total Findings</span>
              <span className={s.detailValue}>{allFindings.length}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Critical Findings</span>
              <span className={s.detailValue}>
                <span style={{ color: "#dc2626", fontWeight: 600 }}>
                  {allFindings.filter((f) => f.severity === "Critical").length}
                </span>
              </span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Follow-Up Items</span>
              <span className={s.detailValue}>{totalFollowUps}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Implementation Rate</span>
              <span className={s.detailValue}>
                <span
                  style={{
                    color:
                      implementationRate >= 80
                        ? "#059669"
                        : implementationRate >= 50
                          ? "#d97706"
                          : "#dc2626",
                    fontWeight: 600,
                  }}
                >
                  {implementationRate}%
                </span>
              </span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Exit Conference</span>
              <span className={s.detailValue}>
                <StatusBadge
                  label={auditExitConf ? "Completed" : "Pending"}
                  variant={auditExitConf ? "success" : "default"}
                />
              </span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Quality Review</span>
              <span className={s.detailValue}>
                {auditQualityReview ? (
                  <span>
                    {auditQualityReview.overallRating}/5{" "}
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={12}
                        fill={
                          n <= auditQualityReview.overallRating
                            ? "#f59e0b"
                            : "none"
                        }
                        color={
                          n <= auditQualityReview.overallRating
                            ? "#f59e0b"
                            : "#d1d5db"
                        }
                      />
                    ))}
                  </span>
                ) : (
                  <StatusBadge label="Pending" variant="default" />
                )}
              </span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Lessons Learned</span>
              <span className={s.detailValue}>
                {auditLessons.length} recorded
              </span>
            </div>
          </div>
        </div>

        {/* Post-Audit Completion Status */}
        <div className={s.sectionDivider} />
        <h4 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
          Post-Audit Completion Checklist
        </h4>
        <div className={s.gridThreeCols}>
          {[
            {
              label: "Exit Conference",
              done: !!auditExitConf,
              icon: Users,
            },
            {
              label: "Follow-Ups Created",
              done: totalFollowUps > 0,
              icon: Target,
            },
            {
              label: "Quality Review",
              done: !!auditQualityReview,
              icon: Star,
            },
            {
              label: "Lessons Documented",
              done: auditLessons.length > 0,
              icon: BookOpen,
            },
            {
              label: "All Verified",
              done: totalFollowUps > 0 && verifiedCount === totalFollowUps,
              icon: Shield,
            },
            {
              label: "Audit Closed",
              done: selectedAudit?.status === "Completed",
              icon: CheckCircle,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.75rem",
                background: item.done ? "#f0fdf4" : "#f9fafb",
                borderRadius: "6px",
                border: item.done ? "1px solid #bbf7d0" : "1px solid #e5e7eb",
              }}
            >
              <item.icon size={18} color={item.done ? "#059669" : "#9ca3af"} />
              <span
                style={{
                  fontSize: "0.85rem",
                  color: item.done ? "#059669" : "#6b7280",
                  fontWeight: item.done ? 600 : 400,
                }}
              >
                {item.label}
              </span>
              {item.done && (
                <CheckCircle
                  size={14}
                  style={{ marginLeft: "auto", color: "#059669" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default SummaryTab;
