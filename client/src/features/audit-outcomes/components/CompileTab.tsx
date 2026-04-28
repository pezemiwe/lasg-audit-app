import React, { useMemo, useState } from "react";
import { AlertCircle, Check, Download, Loader2 } from "lucide-react";
import { useAuditStore } from "../../../store/useAuditStore";
import {
  generateAuditOutcomePdf,
  imageUrlToDataUrl,
} from "../../../utils/pdfGenerator";
import type {
  AuditOutcome,
  LgaAuditPackage,
} from "../../../types/auditOutcomes";
import Card from "./Card";
import { primaryBtn, smallGhostBtn } from "../utils/styles";

const CompileTab: React.FC<{ outcome: AuditOutcome }> = ({ outcome }) => {
  const store = useAuditStore();
  const lgas = store.lgas ?? [];

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [lastBlob, setLastBlob] = useState<Blob | null>(null);

  const stateReport = store.auditReportDocuments?.find(
    (r) =>
      r.type === "State Consolidated" && outcome.auditReportIds.includes(r.id),
  );
  const sor = store.statementsOfResponsibility?.find(
    (x) => x.id === outcome.statementOfResponsibilityId,
  );
  const ap = store.accountingPolicies?.find(
    (x) => x.id === outcome.accountingPoliciesId,
  );
  const sofp = store.auditedFinancialStatements?.find(
    (f) => f.id === outcome.consolidatedSofpId,
  );
  const sofPerf = store.auditedFinancialStatements?.find(
    (f) => f.id === outcome.consolidatedSofPerfId,
  );
  const cashFlow = store.auditedFinancialStatements?.find(
    (f) => f.id === outcome.consolidatedCashFlowId,
  );
  const notes = store.auditedFinancialStatements?.find(
    (f) => f.id === outcome.consolidatedNotesId,
  );

  const packages =
    store.lgaAuditPackages?.filter((p) => p.auditOutcomeId === outcome.id) ??
    [];

  const [includedLgaIds, setIncludedLgaIds] = useState<Set<string>>(
    new Set(packages.filter((p) => p.included).map((p) => p.lgaId)),
  );

  const toggleLga = (lgaId: string) => {
    setIncludedLgaIds((curr) => {
      const next = new Set(curr);
      if (next.has(lgaId)) next.delete(lgaId);
      else next.add(lgaId);
      return next;
    });
  };

  const selectAll = () => setIncludedLgaIds(new Set(lgas.map((l) => l.id)));
  const selectNone = () => setIncludedLgaIds(new Set());

  const readiness = useMemo(() => {
    const checks = [
      {
        ok: !!stateReport?.auditorGeneralSignature?.signedAt,
        label: "Audit Report signed by Auditor-General",
      },
      {
        ok:
          !!sor?.treasurerSignature?.signedAt &&
          !!sor?.auditLeadSignature?.signedAt,
        label: "Statement of Responsibility signed",
      },
      {
        ok: !!ap?.supervisorSignature?.signedAt,
        label: "Accounting Policies signed by Supervisor",
      },
      {
        ok: !!sofp && !!sofPerf && !!cashFlow && !!notes,
        label: "All four financial statements present",
      },
      {
        ok: includedLgaIds.size > 0,
        label: "At least one LGA selected for inclusion",
      },
    ];
    return checks;
  }, [stateReport, sor, ap, sofp, sofPerf, cashFlow, notes, includedLgaIds]);

  const canGenerate = readiness.every((c) => c.ok);

  const handleGenerate = async () => {
    if (!stateReport || !sor || !ap || !sofp || !sofPerf || !cashFlow || !notes)
      return;
    setError("");
    setGenerating(true);
    try {
      let sealDataUrl: string | undefined;
      try {
        sealDataUrl = await imageUrlToDataUrl("/seal_lagos.png");
      } catch {
        // seal optional
      }
      const lgasById: Record<string, (typeof lgas)[0]> = Object.fromEntries(
        lgas.map((l) => [l.id, l]),
      );
      const pkgs: LgaAuditPackage[] = packages.map((p) => ({
        ...p,
        included: includedLgaIds.has(p.lgaId),
      }));

      const blob = await generateAuditOutcomePdf({
        outcome,
        consolidated: {
          auditReport: stateReport,
          statementOfResponsibility: sor,
          accountingPolicies: ap,
          sofp,
          sofPerf,
          cashFlow,
          notes,
        },
        lgaPackages: pkgs,
        lgasById,
        sealImageDataUrl: sealDataUrl,
      });

      setLastBlob(blob);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `LASG-AG-Report-${outcome.auditYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      store.markCompilationComplete(outcome.id, 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card
      title="Compile & Generate Consolidated Report"
      subtitle="Assemble the complete audited financial statement document including the consolidated report and each selected Local Government Council's audit package."
    >
      <div
        style={{
          background: canGenerate ? "#f0fdf4" : "#fffbeb",
          border: `1px solid ${canGenerate ? "#bbf7d0" : "#fde68a"}`,
          borderRadius: 6,
          padding: "0.9rem 1rem",
          marginBottom: 18,
        }}
      >
        <strong
          style={{
            fontSize: "0.78rem",
            color: canGenerate ? "#14532d" : "#92400e",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Pre-flight Checklist
        </strong>
        <ul
          style={{ margin: "0.5rem 0 0 0.5rem", padding: 0, listStyle: "none" }}
        >
          {readiness.map((c, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                fontSize: "0.82rem",
                color: "#0f172a",
                padding: "3px 0",
              }}
            >
              {c.ok ? (
                <Check size={14} color="#16a34a" />
              ) : (
                <AlertCircle size={14} color="#ca8a04" />
              )}
              {c.label}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <strong style={{ fontSize: "0.85rem", color: "#0f172a" }}>
            Include Local Government Councils ({includedLgaIds.size} of{" "}
            {lgas.length})
          </strong>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" onClick={selectAll} style={smallGhostBtn}>
              Select all
            </button>
            <button type="button" onClick={selectNone} style={smallGhostBtn}>
              Select none
            </button>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 6,
            maxHeight: 340,
            overflowY: "auto",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            padding: 10,
          }}
        >
          {lgas.map((l) => (
            <label
              key={l.id}
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                fontSize: "0.78rem",
                padding: "0.35rem 0.5rem",
                background: includedLgaIds.has(l.id) ? "#f0fdf4" : "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={includedLgaIds.has(l.id)}
                onChange={() => toggleLga(l.id)}
              />
              <span style={{ flex: 1 }}>{l.name}</span>
              {l.councilType === "LCDA" && (
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "#64748b",
                    background: "#f1f5f9",
                    padding: "1px 4px",
                    borderRadius: 2,
                    fontWeight: 700,
                  }}
                >
                  LCDA
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "0.7rem 0.85rem",
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#991b1b",
            borderRadius: 6,
            fontSize: "0.8rem",
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate || generating}
        style={{
          ...primaryBtn,
          padding: "0.75rem 1.5rem",
          fontSize: "0.92rem",
          background: !canGenerate || generating ? "#94a3b8" : "#064e3b",
          cursor: !canGenerate || generating ? "not-allowed" : "pointer",
        }}
      >
        {generating ? (
          <>
            <Loader2
              size={16}
              className="spin"
              style={{ animation: "spin 1s linear infinite" }}
            />
            Generating PDF…
          </>
        ) : (
          <>
            <Download size={16} /> Generate Consolidated PDF
          </>
        )}
      </button>

      {lastBlob && !generating && (
        <div
          style={{
            marginTop: 10,
            fontSize: "0.78rem",
            color: "#16a34a",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Check size={14} /> Last generated {new Date().toLocaleTimeString()} —{" "}
          {(lastBlob.size / 1024 / 1024).toFixed(2)} MB
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Card>
  );
};

export default CompileTab;
