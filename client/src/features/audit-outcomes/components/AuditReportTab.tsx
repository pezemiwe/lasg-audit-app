import React, { useEffect, useState } from "react";
import { useAuditStore } from "../../../store/useAuditStore";
import SignaturePad from "../../../components/AuditOutcomes/SignaturePad";
import SectionBuilder, {
  type EditableSection,
} from "../../../components/AuditOutcomes/SectionBuilder";
import type {
  AuditOutcome,
  AuditReportDocument,
  ReportType,
} from "../../../types/auditOutcomes";
import Card from "./Card";
import EmptyState from "./EmptyState";
import SegmentedBtn from "./SegmentedBtn";
import LabeledInput from "./LabeledInput";
import LabeledTextarea from "./LabeledTextarea";
import { labelCss, primaryBtn } from "../utils/styles";

const AuditReportTab: React.FC<{ outcome: AuditOutcome; canEdit: boolean }> = ({
  outcome,
  canEdit,
}) => {
  const store = useAuditStore();
  const [reportType, setReportType] =
    useState<ReportType>("State Consolidated");
  const [selectedLgaId, setSelectedLgaId] = useState<string>("");

  const stateReport = store.auditReportDocuments?.find(
    (r) =>
      outcome.auditReportIds.includes(r.id) && r.type === "State Consolidated",
  );

  const lgaPackages = store.lgaAuditPackages?.filter(
    (p) => p.auditOutcomeId === outcome.id,
  );

  const activeReport: AuditReportDocument | undefined =
    reportType === "State Consolidated"
      ? stateReport
      : lgaPackages?.find((p) => p.lgaId === selectedLgaId)?.report;

  const [sections, setSections] = useState<EditableSection[]>(
    activeReport?.sections || [],
  );
  const [addressee, setAddressee] = useState(activeReport?.addressee || "");
  const [title, setTitle] = useState(activeReport?.title || "");
  const [basisText, setBasisText] = useState(
    activeReport?.basisOfOpinion || "",
  );
  const [opinion, setOpinion] = useState<AuditReportDocument["opinion"]>(
    activeReport?.opinion || "Unqualified",
  );

  useEffect(() => {
    setSections(activeReport?.sections || []);
    setAddressee(activeReport?.addressee || "");
    setTitle(activeReport?.title || "");
    setBasisText(activeReport?.basisOfOpinion || "");
    setOpinion(activeReport?.opinion || "Unqualified");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeReport?.id]);

  const handleSave = () => {
    if (!activeReport) return;
    store.saveAuditReportDocument({
      ...activeReport,
      sections: sections.map((s, i) => ({
        id: s.id,
        order: i + 1,
        header: s.header,
        description: s.description,
        bullets: s.bullets,
        table: s.table,
        recommendation: s.recommendation,
      })),
      addressee,
      title,
      basisOfOpinion: basisText,
      opinion,
      updatedAt: new Date().toISOString(),
    });
  };

  const lgas = store.lgas ?? [];

  return (
    <Card
      title="Auditor-General's Report"
      subtitle="Draft the report sections with headers, descriptions, and recommendations. Tables and bullet points are optional per section. Two report types: State Consolidated and Local Government (per LGA)."
      actions={
        canEdit && (
          <button type="button" onClick={handleSave} style={primaryBtn}>
            Save Report
          </button>
        )
      }
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <SegmentedBtn
          active={reportType === "State Consolidated"}
          onClick={() => setReportType("State Consolidated")}
        >
          State Consolidated
        </SegmentedBtn>
        <SegmentedBtn
          active={reportType === "Local Government"}
          onClick={() => setReportType("Local Government")}
        >
          Local Government
        </SegmentedBtn>
        {reportType === "Local Government" && (
          <select
            value={selectedLgaId}
            onChange={(e) => setSelectedLgaId(e.target.value)}
            style={{
              padding: "0.5rem 0.7rem",
              border: "1px solid #cbd5e1",
              borderRadius: 4,
              fontSize: "0.85rem",
              marginLeft: 8,
              minWidth: 200,
            }}
          >
            <option value="">Select LGA / LCDA…</option>
            {lgas.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} {l.councilType === "LCDA" ? "(LCDA)" : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      {!activeReport && reportType === "Local Government" && (
        <EmptyState
          title="Select an LGA / LCDA"
          message="Local Government reports are per-council. Select one above to edit."
        />
      )}

      {activeReport && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <LabeledInput
              label="Report Title"
              value={title}
              onChange={setTitle}
              disabled={!canEdit}
            />
            <LabeledInput
              label="Addressee"
              value={addressee}
              onChange={setAddressee}
              disabled={!canEdit}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <LabeledTextarea
              label="Basis of Opinion"
              value={basisText}
              onChange={setBasisText}
              rows={4}
              disabled={!canEdit}
            />
            <div>
              <label style={labelCss}>Opinion</label>
              <select
                value={opinion}
                onChange={(e) =>
                  setOpinion(e.target.value as AuditReportDocument["opinion"])
                }
                disabled={!canEdit}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.6rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: 4,
                  fontSize: "0.85rem",
                  background: "#ffffff",
                }}
              >
                <option>Unqualified</option>
                <option>Qualified</option>
                <option>Adverse</option>
                <option>Disclaimer</option>
              </select>
            </div>
          </div>

          <SectionBuilder
            sections={sections}
            onChange={setSections}
            showRecommendation
            headerLabel="Section Header"
            descriptionLabel="Observation / Description"
            readOnly={!canEdit}
          />

          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <h4
              style={{
                fontSize: "0.85rem",
                color: "#0f172a",
                fontWeight: 700,
                margin: "0 0 10px",
              }}
            >
              Approval Chain
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
              }}
            >
              <SignaturePad
                label="1. Audit Lead"
                role="AUDIT_LEAD"
                defaultTitle="Audit Lead"
                value={activeReport.auditLeadSignature}
                disabled={!canEdit}
                onChange={(sig) =>
                  store.saveAuditReportDocument({
                    ...activeReport,
                    auditLeadSignature: sig,
                    updatedAt: new Date().toISOString(),
                  })
                }
              />
              <SignaturePad
                label="2. Audit Supervisor"
                role="AUDIT_SUPERVISOR"
                defaultTitle="Audit Supervisor"
                value={activeReport.auditSupervisorSignature}
                disabled={
                  !canEdit || !activeReport.auditLeadSignature?.signedAt
                }
                onChange={(sig) =>
                  store.saveAuditReportDocument({
                    ...activeReport,
                    auditSupervisorSignature: sig,
                    updatedAt: new Date().toISOString(),
                  })
                }
              />
              <SignaturePad
                label="3. Auditor-General"
                role="AUDITOR_GENERAL"
                defaultTitle="Auditor-General for Local Governments"
                value={activeReport.auditorGeneralSignature}
                disabled={
                  !canEdit || !activeReport.auditSupervisorSignature?.signedAt
                }
                onChange={(sig) =>
                  store.saveAuditReportDocument({
                    ...activeReport,
                    auditorGeneralSignature: sig,
                    status: "Approved",
                    approvedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  })
                }
              />
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                marginTop: 8,
              }}
            >
              Signatures are sequential — each level unlocks the next.
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default AuditReportTab;
