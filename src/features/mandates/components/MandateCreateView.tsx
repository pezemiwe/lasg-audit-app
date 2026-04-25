import React, { useState } from "react";
import { ChevronLeft, FileText, Plus } from "lucide-react";
import s from "../../../styles/pages.module.css";
import { useAuditStore } from "../../../store/useAuditStore";
import { useAuth } from "../../../hooks/useAuth";
import type { AuditType } from "../../../types";

const MandateCreateView: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { user } = useAuth();
  const createMandate = useAuditStore((st) => st.createMandate);

  const [formTitle, setFormTitle] = useState("");
  const [formYear, setFormYear] = useState(new Date().getFullYear());
  const [formScope, setFormScope] = useState("");
  const [formObjectives, setFormObjectives] = useState("");
  const [formTimelines, setFormTimelines] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formTypes, setFormTypes] = useState<AuditType[]>([]);
  const [formSignature, setFormSignature] = useState<string>("");

  const resetForm = () => {
    setFormTitle("");
    setFormYear(new Date().getFullYear());
    setFormScope("");
    setFormObjectives("");
    setFormTimelines("");
    setFormStartDate("");
    setFormEndDate("");
    setFormTypes([]);
    setFormSignature("");
  };

  const handleCreate = () => {
    if (!formTitle.trim() || !formScope.trim() || !user) return;
    createMandate({
      title: formTitle.trim(),
      auditYear: formYear,
      scope: formScope.trim(),
      objectives: formObjectives.trim(),
      timelines: formTimelines.trim(),
      startDate: formStartDate,
      endDate: formEndDate,
      auditTypes: formTypes.length > 0 ? formTypes : ["Financial"],
      auditorGeneralSignature: formSignature,
      createdBy: user.id,
    });
    resetForm();
    onDone();
  };

  const toggleType = (t: AuditType) => {
    setFormTypes((prev) => {
      if (t === "Combined") {
        const isCombinedAlready = prev.includes("Combined");
        if (isCombinedAlready) {
          return [];
        } else {
          return ["Financial", "Performance", "Compliance", "Combined"];
        }
      }

      const isSelected = prev.includes(t);
      let nextState: AuditType[] = [];

      if (isSelected) {
        nextState = prev.filter((x) => x !== t);
        nextState = nextState.filter((x) => x !== "Combined");
      } else {
        nextState = [...prev, t];
        const hasFinancial = nextState.includes("Financial");
        const hasPerformance = nextState.includes("Performance");
        const hasCompliance = nextState.includes("Compliance");

        if (hasFinancial && hasPerformance && hasCompliance) {
          if (!nextState.includes("Combined")) {
            nextState.push("Combined");
          }
        }
      }

      return nextState;
    });
  };

  return (
    <div>
      <button
        className={s.btnSecondary}
        style={{ marginBottom: "1.5rem" }}
        onClick={() => {
          resetForm();
          onDone();
        }}
      >
        <ChevronLeft size={16} /> Back to Mandates
      </button>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Create Audit Mandate</h1>
          <p className={s.pageSubtitle}>
            Define the scope, objectives, and parameters for the new audit cycle
          </p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Mandate Information</h3>
        </div>
        <div className={s.cardBody}>
          <div className={s.formGrid}>
            <div className={s.formGroupFull}>
              <label className={s.formLabel} htmlFor="m-title">
                Mandate Title
              </label>
              <input
                id="m-title"
                className={s.formInput}
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Annual Audit of Local Government Accounts — FY 2026"
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel} htmlFor="m-year">
                Audit Year
              </label>
              <input
                id="m-year"
                type="number"
                className={s.formInput}
                value={formYear}
                onChange={(e) => setFormYear(Number(e.target.value))}
                min={2020}
                max={2040}
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel} htmlFor="m-timelines">
                Timeline Description
              </label>
              <input
                id="m-timelines"
                className={s.formInput}
                value={formTimelines}
                onChange={(e) => setFormTimelines(e.target.value)}
                placeholder="e.g., Q1 - Q3"
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel} htmlFor="m-startDate">
                Start Date
              </label>
              <input
                id="m-startDate"
                type="date"
                className={s.formInput}
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel} htmlFor="m-endDate">
                End Date
              </label>
              <input
                id="m-endDate"
                type="date"
                className={s.formInput}
                value={formEndDate}
                onChange={(e) => setFormEndDate(e.target.value)}
              />
            </div>
            <div className={s.formGroupFull}>
              <label className={s.formLabel} htmlFor="m-scope">
                Scope
              </label>
              <textarea
                id="m-scope"
                className={s.formTextarea}
                value={formScope}
                onChange={(e) => setFormScope(e.target.value)}
                placeholder="Describe the scope of the audit..."
                rows={3}
              />
            </div>
            <div className={s.formGroupFull}>
              <label className={s.formLabel} htmlFor="m-objectives">
                Objectives
              </label>
              <textarea
                id="m-objectives"
                className={s.formTextarea}
                value={formObjectives}
                onChange={(e) => setFormObjectives(e.target.value)}
                placeholder="State the objectives of the audit mandate..."
                rows={3}
              />
            </div>
            <div className={s.formGroupFull}>
              <label className={s.formLabel}>Audit Types</label>
              <div className={s.formCheckGroup}>
                {(
                  [
                    "Financial",
                    "Performance",
                    "Compliance",
                    "Combined",
                  ] as AuditType[]
                ).map((t) => (
                  <label key={t} className={s.formCheck}>
                    <input
                      type="checkbox"
                      checked={formTypes.includes(t)}
                      onChange={() => toggleType(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <div className={s.formGroupFull}>
              <label className={s.formLabel}>Auditor General Signature</label>
              <div
                style={{
                  border: "2px dashed #e2e8f0",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#f8fafc",
                }}
              >
                <label htmlFor="signature-upload" style={{ cursor: "pointer" }}>
                  <input
                    id="signature-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormSignature(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {formSignature ? (
                    <div>
                      <img
                        src={formSignature}
                        alt="Signature Preview"
                        style={{
                          maxHeight: "80px",
                          marginBottom: "0.5rem",
                          border: "1px solid #ccc",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          margin: 0,
                        }}
                      >
                        Click to change signature
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Plus
                        size={24}
                        style={{ color: "#94a3b8", marginBottom: "0.5rem" }}
                      />
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#64748b",
                          margin: 0,
                        }}
                      >
                        Click to upload signature
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
          <div className={s.formActions}>
            <button
              className={s.btnSecondary}
              onClick={() => {
                resetForm();
                onDone();
              }}
            >
              Cancel
            </button>
            <button
              className={s.btnPrimary}
              onClick={handleCreate}
              disabled={!formTitle.trim() || !formScope.trim()}
            >
              <FileText size={14} /> Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandateCreateView;
