import React, { useState } from "react";
import { useAuditStore } from "../../../store/useAuditStore";
import { useAuth } from "../../../hooks/useAuth";
import StatusBadge from "../../../components/UI/StatusBadge";
import type { Finding } from "../../../types";
import { ChevronLeft, FileText, Plus, Trash2 } from "lucide-react";
import s from "../../../styles/pages.module.css";
import { severityVariant, uid } from "../utils/reportHelpers";

interface Props {
  onBack: () => void;
  getLgaForAudit: (auditId: string) => string;
}

const ReportCreateView: React.FC<Props> = ({ onBack, getLgaForAudit }) => {
  const { user } = useAuth();
  const audits = useAuditStore((st) => st.audits);
  const createReport = useAuditStore((st) => st.createReport);

  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<
    "Preliminary" | "Draft" | "Final" | "Consolidated"
  >("Draft");
  const [formAuditId, setFormAuditId] = useState("");
  const [findings, setFindings] = useState<Omit<Finding, "id">[]>([]);

  const [findTitle, setFindTitle] = useState("");
  const [findDesc, setFindDesc] = useState("");
  const [findSeverity, setFindSeverity] =
    useState<Finding["severity"]>("Medium");
  const [findRec, setFindRec] = useState("");

  const addFinding = () => {
    if (!findTitle.trim() || !findDesc.trim()) return;
    setFindings((prev) => [
      ...prev,
      {
        title: findTitle.trim(),
        description: findDesc.trim(),
        severity: findSeverity,
        recommendation: findRec.trim(),
        status: "Open" as const,
      },
    ]);
    setFindTitle("");
    setFindDesc("");
    setFindSeverity("Medium");
    setFindRec("");
  };

  const removeFinding = (idx: number) => {
    setFindings((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreate = () => {
    if (!formTitle.trim() || !formAuditId || !user) return;
    createReport({
      auditId: formAuditId,
      title: formTitle.trim(),
      type: formType,
      status: "Draft",
      preparedBy: user.id,
      findings: findings.map((f) => ({ ...f, id: `finding-${uid()}` })),
    });
    setFormTitle("");
    setFormType("Draft");
    setFormAuditId("");
    setFindings([]);
    onBack();
  };

  return (
    <div>
      <button
        className={s.btnSecondary}
        style={{ marginBottom: "1.5rem" }}
        onClick={onBack}
      >
        <ChevronLeft size={16} /> Back to Reports
      </button>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Create Audit Report</h1>
          <p className={s.pageSubtitle}>
            Compile findings and recommendations into a formal report
          </p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Report Information</h3>
        </div>
        <div className={s.cardBody}>
          <div className={s.formGrid}>
            <div className={s.formGroupFull}>
              <label className={s.formLabel} htmlFor="r-title">
                Report Title
              </label>
              <input
                id="r-title"
                className={s.formInput}
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Financial Audit Report — Ikeja FY 2025"
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel} htmlFor="r-type">
                Report Type
              </label>
              <select
                id="r-type"
                className={s.formSelect}
                value={formType}
                onChange={(e) =>
                  setFormType(
                    e.target.value as "Preliminary" | "Draft" | "Final",
                  )
                }
              >
                <option value="Preliminary">Preliminary</option>
                <option value="Draft">Draft</option>
                <option value="Final">Final</option>
                <option value="Consolidated">Consolidated</option>
              </select>
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel} htmlFor="r-audit">
                Audit
              </label>
              <select
                id="r-audit"
                className={s.formSelect}
                value={formAuditId}
                onChange={(e) => setFormAuditId(e.target.value)}
              >
                <option value="">Select audit...</option>
                {audits.map((a) => (
                  <option key={a.id} value={a.id}>
                    {getLgaForAudit(a.id)} — {a.type} ({a.year})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Findings ({findings.length})</h3>
        </div>
        <div className={s.cardBody}>
          {findings.map((f, idx) => (
            <div key={idx} className={s.findingCard}>
              <div className={s.findingHeader}>
                <div className={s.findingTitle}>{f.title}</div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.4rem",
                    alignItems: "center",
                  }}
                >
                  <StatusBadge
                    label={f.severity}
                    variant={severityVariant(f.severity)}
                  />
                  <button
                    className={s.btnIcon}
                    aria-label="Remove finding"
                    onClick={() => removeFinding(idx)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className={s.findingBody}>{f.description}</div>
              {f.recommendation && (
                <div className={s.findingRec}>
                  Recommendation: {f.recommendation}
                </div>
              )}
            </div>
          ))}

          <div
            style={{
              borderTop: "1px solid var(--border, #e2e8f0)",
              paddingTop: "1rem",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#334155",
              }}
            >
              Add Finding
            </div>
            <div className={s.formGrid}>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="f-title">
                  Finding Title
                </label>
                <input
                  id="f-title"
                  className={s.formInput}
                  value={findTitle}
                  onChange={(e) => setFindTitle(e.target.value)}
                  placeholder="e.g., Unreconciled Bank Balances"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="f-sev">
                  Severity
                </label>
                <select
                  id="f-sev"
                  className={s.formSelect}
                  value={findSeverity}
                  onChange={(e) =>
                    setFindSeverity(e.target.value as Finding["severity"])
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className={s.formGroupFull}>
                <label className={s.formLabel} htmlFor="f-desc">
                  Description
                </label>
                <textarea
                  id="f-desc"
                  className={s.formTextarea}
                  value={findDesc}
                  onChange={(e) => setFindDesc(e.target.value)}
                  placeholder="Describe the finding..."
                  rows={2}
                />
              </div>
              <div className={s.formGroupFull}>
                <label className={s.formLabel} htmlFor="f-rec">
                  Recommendation
                </label>
                <textarea
                  id="f-rec"
                  className={s.formTextarea}
                  value={findRec}
                  onChange={(e) => setFindRec(e.target.value)}
                  placeholder="Recommended corrective action..."
                  rows={2}
                />
              </div>
            </div>
            <button
              className={s.btnGold}
              style={{ marginTop: "0.75rem" }}
              onClick={addFinding}
              disabled={!findTitle.trim() || !findDesc.trim()}
            >
              <Plus size={14} /> Add Finding
            </button>
          </div>
        </div>
      </div>

      <div className={s.formActions} style={{ marginBottom: "2rem" }}>
        <button className={s.btnSecondary} onClick={onBack}>
          Cancel
        </button>
        <button
          className={s.btnPrimary}
          onClick={handleCreate}
          disabled={!formTitle.trim() || !formAuditId}
        >
          <FileText size={14} /> Save Report
        </button>
      </div>
    </div>
  );
};

export default ReportCreateView;
