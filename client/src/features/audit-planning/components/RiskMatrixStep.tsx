import React, { useState, useMemo } from "react";
import { type AuditStore } from "../../../store/useAuditStore";
import type {
  User,
  RiskLevel,
  RiskMatrix,
  PreliminaryAnalytic,
} from "../../../types";
import {
  FileText,
  Plus,
  X,
  Save,
  Sparkles,
  Shield,
  Search,
  Download,
} from "lucide-react";
import StatusBadge from "../../../components/UI/StatusBadge";
import s from "../../../styles/pages.module.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import PlanningCard from "./PlanningCard";
import RiskBadge from "./RiskBadge";
import {
  RISK_LEVELS,
  RISK_AREAS,
  riskColor,
  type ArDocType,
} from "../constants";
import { calculateOverallRisk, fmtPercent } from "../utils/format";
import {
  MOCK_FS,
  MOCK_TB,
  AR_FS_SECTIONS,
  AR_FS_LABELS,
  AR_TB_SECTIONS,
  AR_TB_LABELS,
} from "../arMockData";

const RiskMatrixStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  risks: RiskMatrix[];
  analytics: PreliminaryAnalytic[];
  materialityData: AuditStore["materiality"][0] | undefined;
  store: AuditStore;
  user: User;
  arDocType: ArDocType | null;
}> = ({
  audit,
  lgaName,
  risks,
  analytics,
  materialityData,
  store,
  user,
  arDocType,
}) => {
  // ── Risk area groups derived from selected document's line items ──────────
  const isFS = arDocType !== "tb";
  const riskSections = isFS ? AR_FS_SECTIONS : AR_TB_SECTIONS;
  const riskLabels = isFS ? AR_FS_LABELS : AR_TB_LABELS;
  const riskData = isFS ? MOCK_FS : MOCK_TB;
  const riskAreaGroups = riskSections
    .map((sec) => ({
      label: riskLabels[sec] ?? sec,
      items: riskData
        .filter((r) => r.section === sec && r.type === "line")
        .map((r) => r.account),
    }))
    .filter((g) => g.items.length > 0);
  const firstArea = riskAreaGroups[0]?.items[0] ?? RISK_AREAS[0];
  const allAreas = riskAreaGroups.flatMap((g) => g.items);

  const [showForm, setShowForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [area, setArea] = useState(firstArea);
  const [inherent, setInherent] = useState<RiskLevel>("Medium");
  const [control, setControl] = useState<RiskLevel>("Medium");
  const [detection, setDetection] = useState<RiskLevel>("Medium");
  const [mitigation, setMitigation] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "heatmap">("table");

  const investigateItems = analytics.filter((a) => a.flag === "Investigate");

  const overall = calculateOverallRisk(inherent, control, detection);

  // ─── Link to Questionnaire Risk Assessment ───
  const questionnaireResponses = store.questionnaireResponses.filter(
    (r) => r.auditId === audit.id,
  );
  const questionnaireQuestions = store.questionnaireQuestions;

  const getResponse = (qId: string) =>
    questionnaireResponses.find((r) => r.questionId === qId)?.answer;

  const hasQuestionnaireData = questionnaireResponses.some(
    (r) =>
      questionnaireQuestions.find((q) => q.id === r.questionId)?.section ===
      "Risk Assessment",
  );

  const deriveRisksFromQuestionnaire = () => {
    // Map questionnaire responses to risk matrix entries
    const riskEntries: Array<{
      area: string;
      inherentRisk: RiskLevel;
      controlRisk: RiskLevel;
      detectionRisk: RiskLevel;
      mitigationPlan: string;
    }> = [];

    // q-23: Overall risk of material misstatement -> Revenue & Receipts + Expenditure
    const q23 = getResponse("q-23");
    const overallRiskLevel: RiskLevel =
      q23 === "5"
        ? "Critical"
        : q23 === "4"
          ? "High"
          : q23 === "3"
            ? "Medium"
            : "Low";

    // q-16: Internal control environment -> affects Control Risk across all areas
    const q16 = getResponse("q-16");
    const controlLevel: RiskLevel =
      q16 === "5" || q16 === "4" ? "High" : q16 === "3" ? "Medium" : "Low";

    // q-24: Fraud indicators -> Expenditure & Payments
    const q24 = getResponse("q-24");
    const fraudRisk: RiskLevel =
      q24 === "yes" ? "Critical" : q24 === "inconclusive" ? "High" : "Medium";

    // q-25: Related-party transactions -> Procurement & Contracts
    const q25 = getResponse("q-25");
    const relatedPartyRisk: RiskLevel =
      q25 === "yes_significant"
        ? "High"
        : q25 === "yes_minor"
          ? "Medium"
          : "Low";

    // q-28: Management integrity -> affects inherent risk broadly
    const q28 = getResponse("q-28");
    const mgmtRisk: RiskLevel =
      q28 === "4"
        ? "Critical"
        : q28 === "3"
          ? "High"
          : q28 === "2"
            ? "Medium"
            : "Low";

    // q-20: Fixed asset recording -> Fixed Assets & Capital Projects
    const q20 = getResponse("q-20");
    const assetRisk: RiskLevel =
      q20 === "none" ? "High" : q20 === "incomplete" ? "Medium" : "Low";

    // q-29: Personnel/system changes -> Payroll & Personnel
    const q29 = getResponse("q-29");
    const personnelRisk: RiskLevel =
      q29 === "frequent" ? "High" : q29 === "occasional" ? "Medium" : "Low";

    // q-17: Internal audit unit
    const q17 = getResponse("q-17");
    const internalAuditFactor: RiskLevel =
      q17 === "no" ? "High" : q17 === "yes_limited" ? "Medium" : "Low";

    // q-33/q-34: Revenue Assurance
    const q33 = getResponse("q-33");
    const revenueRisk: RiskLevel =
      q33 === "no" ? "High" : q33 === "yes_limited" ? "Medium" : "Low";

    // Build risk entries for each area
    riskEntries.push({
      area: "Revenue & Receipts",
      inherentRisk: overallRiskLevel,
      controlRisk:
        Math.max(
          RISK_LEVELS.indexOf(controlLevel),
          RISK_LEVELS.indexOf(revenueRisk),
        ) >= 2
          ? ("High" as RiskLevel)
          : controlLevel,
      detectionRisk: "Medium",
      mitigationPlan: "",
    });

    riskEntries.push({
      area: "Expenditure & Payments",
      inherentRisk: fraudRisk,
      controlRisk: controlLevel,
      detectionRisk:
        fraudRisk === "Critical" || fraudRisk === "High" ? "High" : "Medium",
      mitigationPlan: "",
    });

    riskEntries.push({
      area: "Payroll & Personnel Costs",
      inherentRisk: personnelRisk,
      controlRisk: controlLevel,
      detectionRisk: "Medium",
      mitigationPlan: "",
    });

    riskEntries.push({
      area: "Bank & Cash Management",
      inherentRisk: overallRiskLevel,
      controlRisk: controlLevel,
      detectionRisk: "Medium",
      mitigationPlan: "",
    });

    riskEntries.push({
      area: "Procurement & Contracts",
      inherentRisk: relatedPartyRisk === "Low" ? mgmtRisk : relatedPartyRisk,
      controlRisk: controlLevel,
      detectionRisk: relatedPartyRisk === "High" ? "High" : "Medium",
      mitigationPlan: "",
    });

    riskEntries.push({
      area: "Fixed Assets & Capital Projects",
      inherentRisk: assetRisk,
      controlRisk:
        Math.max(
          RISK_LEVELS.indexOf(controlLevel),
          RISK_LEVELS.indexOf(assetRisk),
        ) >= 2
          ? ("High" as RiskLevel)
          : controlLevel,
      detectionRisk: assetRisk === "High" ? "High" : "Medium",
      mitigationPlan: "",
    });

    riskEntries.push({
      area: "Grants & Transfers",
      inherentRisk: overallRiskLevel,
      controlRisk: internalAuditFactor,
      detectionRisk: "Medium",
      mitigationPlan: "",
    });

    riskEntries.push({
      area: "Tax & Deductions",
      inherentRisk:
        mgmtRisk === "Critical"
          ? "High"
          : mgmtRisk === "Low"
            ? "Low"
            : "Medium",
      controlRisk: controlLevel,
      detectionRisk: "Medium",
      mitigationPlan: "",
    });

    // Add each entry to store
    riskEntries.forEach((entry) => {
      const computedOverall = calculateOverallRisk(
        entry.inherentRisk,
        entry.controlRisk,
        entry.detectionRisk,
      );
      store.addRiskMatrix({
        auditId: audit.id,
        area: entry.area,
        inherentRisk: entry.inherentRisk,
        controlRisk: entry.controlRisk,
        detectionRisk: entry.detectionRisk,
        overallRisk: computedOverall,
        mitigationPlan: "",
        status: "Open",
        preparedBy: user.id,
      });
    });

    store.logActivity({
      userId: user.id,
      action: "IMPORT_RISK_FROM_QUESTIONNAIRE",
      details: `Imported ${riskEntries.length} risk entries from questionnaire risk assessment`,
      entityType: "audit",
      entityId: audit.id,
    });
    store.addToast({
      type: "success",
      title: "Risks Imported",
      message: `${riskEntries.length} risk entries derived from the Risk Assessment questionnaire responses.`,
    });
  };

  const handleAdd = () => {
    store.addRiskMatrix({
      auditId: audit.id,
      area,
      inherentRisk: inherent,
      controlRisk: control,
      detectionRisk: detection,
      overallRisk: overall,
      mitigationPlan: mitigation,
      status: "Open",
      preparedBy: user.id,
    });
    store.logActivity({
      userId: user.id,
      action: "ADD_RISK",
      details: `Risk entry added: ${area} (${overall})`,
      entityType: "audit",
      entityId: audit.id,
    });
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setArea(firstArea);
    setInherent("Medium");
    setControl("Medium");
    setDetection("Medium");
    setMitigation("");
  };

  const riskCounts = useMemo(() => {
    const c = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    risks.forEach((r) => c[r.overallRisk]++);
    return c;
  }, [risks]);

  const heatmapData = useMemo(() => {
    const grid: Record<string, Record<string, RiskMatrix[]>> = {};
    const levels = ["Low", "Medium", "High", "Critical"];
    levels.forEach((ir) => {
      grid[ir] = {};
      levels.forEach((cr) => {
        grid[ir][cr] = risks.filter(
          (r) => r.inherentRisk === ir && r.controlRisk === cr,
        );
      });
    });
    return grid;
  }, [risks]);

  // ─── Report data ───
  const totalRisks = risks.length;
  const criticalRisks = risks.filter((r) => r.overallRisk === "Critical");
  const highRisks = risks.filter((r) => r.overallRisk === "High");
  const mediumRisks = risks.filter((r) => r.overallRisk === "Medium");
  const mitigatedRisks = risks.filter((r) => r.status === "Mitigated");
  const overallProfile =
    criticalRisks.length > 0
      ? "Critical"
      : highRisks.length > totalRisks * 0.5
        ? "High"
        : highRisks.length > 0
          ? "Moderate-High"
          : mediumRisks.length > 0
            ? "Moderate"
            : "Low";
  const preparer = store.users.find((u) => u.id === user.id);
  const reportDate = new Date().toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "letter",
      orientation: "portrait",
      compress: true,
    });
    const W = 612,
      MX = 54,
      MT = 60;
    const ink: [number, number, number] = [20, 20, 20];
    const muted: [number, number, number] = [100, 100, 100];
    const accent: [number, number, number] = [3, 105, 161]; // #0369a1
    const ruleClr: [number, number, number] = [200, 200, 200];
    const riskPdfColor: Record<string, [number, number, number]> = {
      Low: [22, 163, 74],
      Medium: [202, 138, 4],
      High: [234, 88, 12],
      Critical: [220, 38, 38],
    };
    let y = MT;

    const addPage = () => {
      doc.addPage();
      y = MT;
    };
    const checkPage = (needed: number) => {
      if (y + needed > 792 - 60) addPage();
    };

    // ─── Cover Page ───
    doc.setFillColor(3, 105, 161);
    doc.rect(0, 0, W, 160, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("LAGOS STATE AUDITOR GENERAL'S OFFICE", W / 2, 55, {
      align: "center",
    });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Risk Assessment Report", W / 2, 90, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`${lgaName} - ${audit.type} Audit (${audit.year})`, W / 2, 115, {
      align: "center",
    });
    doc.setFontSize(9);
    const metaLine = `Prepared: ${reportDate}  |  By: ${preparer?.name || user.id}${materialityData ? `  |  Materiality: ₦${Number(materialityData.overallMateriality || 0).toLocaleString()}` : ""}`;
    doc.text(metaLine, W / 2, 140, { align: "center" });

    y = 200;
    doc.setTextColor(...ink);

    // Summary KPIs
    const kpis = [
      { label: "Overall Profile", value: overallProfile },
      { label: "Total Risks", value: String(totalRisks) },
      {
        label: "Critical/High",
        value: String(criticalRisks.length + highRisks.length),
      },
      { label: "Mitigated", value: `${mitigatedRisks.length}/${totalRisks}` },
    ];
    const kpiW = (W - MX * 2 - 30) / 4;
    kpis.forEach((kpi, i) => {
      const kx = MX + i * (kpiW + 10);
      doc.setDrawColor(...ruleClr);
      doc.setLineWidth(0.5);
      doc.roundedRect(kx, y, kpiW, 50, 3, 3);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text(kpi.label.toUpperCase(), kx + kpiW / 2, y + 16, {
        align: "center",
      });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(...ink);
      doc.text(kpi.value, kx + kpiW / 2, y + 38, { align: "center" });
    });
    y += 70;

    // ─── Section 1: Executive Summary ───
    const sectionHead = (num: number, title: string) => {
      checkPage(40);
      doc.setDrawColor(...accent);
      doc.setLineWidth(1.5);
      doc.line(MX, y, W - MX, y);
      y += 16;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...accent);
      doc.text(`${num}. ${title}`, MX, y);
      y += 18;
      doc.setTextColor(...ink);
    };

    sectionHead(1, "Executive Summary");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const summaryText = `This risk assessment report presents the findings of the risk identification and evaluation process conducted for ${lgaName} as part of the ${audit.year} ${audit.type} Audit engagement in accordance with ISA 315 (Revised 2019).`;
    const lines = doc.splitTextToSize(summaryText, W - MX * 2);
    doc.text(lines, MX, y);
    y += lines.length * 13 + 8;

    if (criticalRisks.length > 0 || highRisks.length > 0) {
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(MX, y, W - MX * 2, 28, 3, 3, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(153, 27, 27);
      doc.text(
        `ATTENTION: ${criticalRisks.length + highRisks.length} risk area(s) rated Critical/High require immediate attention.`,
        MX + 10,
        y + 17,
      );
      y += 38;
      doc.setTextColor(...ink);
    }

    // ─── Section 2: Methodology ───
    sectionHead(2, "Risk Assessment Methodology");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const methLines = doc.splitTextToSize(
      "The risk assessment was performed in accordance with ISA 315 (Revised 2019) and ISSAI 1315. Each identified risk area was evaluated across three dimensions:\n\n" +
        "(a) Inherent Risk - The susceptibility of an assertion to a misstatement that could be material, before consideration of related controls.\n\n" +
        "(b) Control Risk - The risk that a misstatement could occur and not be prevented or detected on a timely basis by the entity's internal controls.\n\n" +
        "(c) Detection Risk - The risk that audit procedures will not detect a misstatement that exists and could be material.",
      W - MX * 2,
    );
    checkPage(methLines.length * 13);
    doc.text(methLines, MX, y);
    y += methLines.length * 13 + 10;

    // ─── Section 3: Risk Matrix Table ───
    sectionHead(3, "Detailed Risk Assessment Matrix");
    autoTable(doc, {
      startY: y,
      margin: { left: MX, right: MX },
      head: [
        [
          "#",
          "Risk Area",
          "Inherent",
          "Control",
          "Detection",
          "Overall",
          "Audit Response",
          "Status",
        ],
      ],
      body: risks.map((r, i) => [
        String(i + 1),
        r.area,
        r.inherentRisk,
        r.controlRisk,
        r.detectionRisk,
        r.overallRisk,
        r.mitigationPlan || "-",
        r.status,
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 5,
        lineColor: [220, 220, 220],
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: [241, 245, 249] as [number, number, number],
        textColor: ink,
        fontStyle: "bold",
        fontSize: 7,
      },
      columnStyles: {
        0: { cellWidth: 24, halign: "center" },
        2: { cellWidth: 50, halign: "center" },
        3: { cellWidth: 48, halign: "center" },
        4: { cellWidth: 52, halign: "center" },
        5: { cellWidth: 48, halign: "center" },
        6: { cellWidth: 140 },
        7: { cellWidth: 45, halign: "center" },
      },
      didParseCell: (data) => {
        if (
          data.section === "body" &&
          data.column.index >= 2 &&
          data.column.index <= 5
        ) {
          const level = String(data.cell.raw);
          if (riskPdfColor[level]) {
            data.cell.styles.textColor = riskPdfColor[level];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });
    y =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 16;

    // ─── Section 4: Significant Risk Areas ───
    if (criticalRisks.length > 0 || highRisks.length > 0) {
      sectionHead(4, "Significant Risk Areas Requiring Enhanced Procedures");
      [...criticalRisks, ...highRisks].forEach((r) => {
        checkPage(60);
        doc.setFillColor(254, 242, 242);
        doc.setDrawColor(254, 202, 202);
        doc.roundedRect(MX, y, W - MX * 2, 48, 3, 3, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...ink);
        doc.text(r.area, MX + 10, y + 15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...(riskPdfColor[r.overallRisk] || ink));
        doc.text(r.overallRisk, W - MX - 10, y + 15, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(127, 29, 29);
        const descLines = doc.splitTextToSize(
          `Elevated risk due to ${r.inherentRisk.toLowerCase()} inherent risk combined with ${r.controlRisk.toLowerCase()} control risk. Planned response: ${r.mitigationPlan || "Extended substantive testing required."}`,
          W - MX * 2 - 20,
        );
        doc.text(descLines, MX + 10, y + 30);
        y += 56;
      });
    }

    // ─── Conclusion ───
    const cSec = criticalRisks.length > 0 || highRisks.length > 0 ? 5 : 4;
    sectionHead(cSec, "Conclusion & Recommendations");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const conclusionText =
      overallProfile === "Critical" || overallProfile === "High"
        ? `Based on the assessment, ${lgaName} exhibits a ${overallProfile.toLowerCase()} overall risk profile. The audit team should adopt a predominantly substantive approach with extended testing in the ${criticalRisks.length + highRisks.length} high/critical risk areas.`
        : overallProfile === "Moderate-High" || overallProfile === "Moderate"
          ? `Based on the assessment, ${lgaName} exhibits a ${overallProfile.toLowerCase()} overall risk profile. A combined audit approach (tests of controls supplemented by substantive procedures) is recommended.`
          : `Based on the assessment, ${lgaName} exhibits a low overall risk profile. A combined audit approach with reduced substantive testing is appropriate, subject to satisfactory tests of controls.`;
    const cLines = doc.splitTextToSize(conclusionText, W - MX * 2);
    checkPage(cLines.length * 13 + 100);
    doc.text(cLines, MX, y);
    y += cLines.length * 13 + 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...accent);
    doc.text("Recommendations:", MX, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...ink);
    const recos = [
      "Perform walkthroughs of key controls in all high-risk areas",
      "Obtain management representations on identified risk factors",
      "Consider the use of specialists where complex transactions exist",
      "Ensure adequate supervision of junior team members on high-risk areas",
      "Document all significant judgements and risk responses in working papers",
    ];
    recos.forEach((r, i) => {
      checkPage(14);
      doc.text(`${i + 1}.  ${r}`, MX + 10, y);
      y += 14;
    });
    y += 20;

    // ─── Sign-off ───
    checkPage(70);
    doc.setDrawColor(...ruleClr);
    doc.setLineWidth(0.5);
    doc.line(MX, y, W - MX, y);
    y += 20;
    const colW = (W - MX * 2) / 3;
    ["Prepared By", "Reviewed By", "Approved By"].forEach((label, i) => {
      const cx = MX + i * colW;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text(label.toUpperCase(), cx, y);
      if (i === 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...ink);
        doc.text(preparer?.name || user.id, cx, y + 14);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...muted);
        doc.text(reportDate, cx, y + 26);
      } else {
        doc.setDrawColor(...ruleClr);
        doc.line(cx, y + 30, cx + colW - 20, y + 30);
      }
    });

    // ─── Page numbers ───
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text(`Page ${i} of ${totalPages}`, W / 2, 792 - 30, {
        align: "center",
      });
    }

    // ─── Trigger download ───
    doc.save(
      `Risk_Assessment_Report_${lgaName.replace(/\s+/g, "_")}_${audit.year}.pdf`,
    );
    store.addToast({
      type: "success",
      title: "Downloaded",
      message: "Risk assessment report exported as PDF.",
    });
  };

  const reportModalContent = (
    <div
      style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "var(--text)" }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          padding: "1.5rem",
          background: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-3)",
            fontWeight: 700,
          }}
        >
          Lagos State Auditor General's Office
        </div>
        <div
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            marginTop: "0.5rem",
            color: "var(--text)",
          }}
        >
          Risk Assessment Report
        </div>
        <div
          style={{
            fontSize: "0.85rem",
            color: "var(--text-2)",
            marginTop: "0.25rem",
          }}
        >
          {lgaName} - {audit.type} Audit ({audit.year})
        </div>
        <div
          style={{
            fontSize: "0.78rem",
            color: "var(--text-3)",
            marginTop: "0.5rem",
          }}
        >
          Prepared: {reportDate} | By: {preparer?.name || user.id}
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h4
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            borderBottom: "2px solid var(--primary)",
            paddingBottom: "0.35rem",
            marginBottom: "0.75rem",
          }}
        >
          1. Executive Summary
        </h4>
        <p style={{ margin: "0 0 0.75rem" }}>
          This risk assessment report presents the findings of the risk
          identification and evaluation process conducted for{" "}
          <strong>{lgaName}</strong> as part of the {audit.year} {audit.type}{" "}
          Audit engagement in accordance with ISA 315 (Revised 2019).
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          {[
            {
              label: "Overall Profile",
              value: overallProfile,
              color:
                overallProfile === "Critical"
                  ? "#dc2626"
                  : overallProfile.includes("High")
                    ? "#ea580c"
                    : "#d97706",
            },
            {
              label: "Total Risks",
              value: String(totalRisks),
              color: "#0369a1",
            },
            {
              label: "Critical/High",
              value: String(criticalRisks.length + highRisks.length),
              color: "#dc2626",
            },
            {
              label: "Mitigated",
              value: `${mitigatedRisks.length}/${totalRisks}`,
              color: "#16a34a",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-3)",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: item.color,
                  marginTop: "0.25rem",
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
        {(criticalRisks.length > 0 || highRisks.length > 0) && (
          <div
            style={{
              padding: "0.75rem",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "6px",
              fontSize: "0.85rem",
              color: "#991b1b",
            }}
          >
            <strong>Attention:</strong>{" "}
            {criticalRisks.length + highRisks.length} risk area(s) rated
            Critical/High require immediate attention and extended substantive
            audit procedures.
          </div>
        )}
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h4
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            borderBottom: "2px solid var(--primary)",
            paddingBottom: "0.35rem",
            marginBottom: "0.75rem",
          }}
        >
          2. Detailed Risk Assessment Matrix
        </h4>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Risk Area</th>
                <th>Inherent</th>
                <th>Control</th>
                <th>Detection</th>
                <th>Overall</th>
                <th>Audit Response</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{r.area}</td>
                  <td>
                    <RiskBadge level={r.inherentRisk} />
                  </td>
                  <td>
                    <RiskBadge level={r.controlRisk} />
                  </td>
                  <td>
                    <RiskBadge level={r.detectionRisk} />
                  </td>
                  <td>
                    <RiskBadge level={r.overallRisk} />
                  </td>
                  <td style={{ fontSize: "0.82rem", maxWidth: "250px" }}>
                    {r.mitigationPlan}
                  </td>
                  <td>
                    <StatusBadge
                      label={r.status}
                      variant={
                        r.status === "Mitigated"
                          ? "success"
                          : r.status === "Accepted"
                            ? "info"
                            : "warning"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(criticalRisks.length > 0 || highRisks.length > 0) && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h4
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              borderBottom: "2px solid var(--primary)",
              paddingBottom: "0.35rem",
              marginBottom: "0.75rem",
            }}
          >
            3. Significant Risk Areas
          </h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {[...criticalRisks, ...highRisks].map((r) => (
              <div
                key={r.id}
                style={{
                  padding: "1rem",
                  border: "1px solid #fecaca",
                  borderRadius: "6px",
                  background: "#fef2f2",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                    {r.area}
                  </span>
                  <RiskBadge level={r.overallRisk} />
                </div>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#7f1d1d" }}>
                  Elevated risk due to {r.inherentRisk.toLowerCase()} inherent
                  risk combined with {r.controlRisk.toLowerCase()} control risk.
                  Planned response:{" "}
                  {r.mitigationPlan || "Extended substantive testing required."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: "1.5rem" }}>
        <h4
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            borderBottom: "2px solid var(--primary)",
            paddingBottom: "0.35rem",
            marginBottom: "0.75rem",
          }}
        >
          {criticalRisks.length > 0 || highRisks.length > 0 ? "4" : "3"}.
          Conclusion & Recommendations
        </h4>
        <p style={{ margin: "0 0 0.75rem" }}>
          Based on the assessment, <strong>{lgaName}</strong> exhibits a{" "}
          <strong>{overallProfile.toLowerCase()}</strong> overall risk profile.
          {overallProfile === "Critical" || overallProfile === "High"
            ? ` The audit team should adopt a predominantly substantive approach with extended testing in the ${criticalRisks.length + highRisks.length} high/critical risk areas.`
            : overallProfile === "Moderate-High" ||
                overallProfile === "Moderate"
              ? " A combined audit approach (tests of controls supplemented by substantive procedures) is recommended."
              : " A combined audit approach with reduced substantive testing is appropriate, subject to satisfactory tests of controls."}
        </p>
        <div
          style={{
            padding: "1rem",
            background: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: "6px",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "0.85rem",
              marginBottom: "0.5rem",
              color: "#0c4a6e",
            }}
          >
            Recommendations:
          </div>
          <ol
            style={{
              margin: 0,
              paddingLeft: "1.25rem",
              fontSize: "0.85rem",
              color: "#0c4a6e",
            }}
          >
            <li>Perform walkthroughs of key controls in all high-risk areas</li>
            <li>
              Obtain management representations on identified risk factors
            </li>
            <li>
              Consider the use of specialists where complex transactions exist
            </li>
            <li>
              Ensure adequate supervision of junior team members on high-risk
              areas
            </li>
            <li>
              Document all significant judgements and risk responses in working
              papers
            </li>
          </ol>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1.5rem",
          padding: "1.5rem",
          background: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          marginTop: "1rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-3)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Prepared By
          </div>
          <div style={{ fontWeight: 600, marginTop: "0.25rem" }}>
            {preparer?.name || user.id}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>
            {reportDate}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-3)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Reviewed By
          </div>
          <div
            style={{
              borderBottom: "1px solid var(--text-3)",
              marginTop: "1.5rem",
              width: "80%",
            }}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-3)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Approved By
          </div>
          <div
            style={{
              borderBottom: "1px solid var(--text-3)",
              marginTop: "1.5rem",
              width: "80%",
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* ─── Action Bar: Generate Report + Save ─── */}
      {risks.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}
        >
          <button
            className={s.btnSecondary}
            onClick={() => {
              store.addToast({
                type: "success",
                title: "Risk Assessment Saved",
                message: `All ${risks.length} risk entries saved.`,
              });
              store.logActivity({
                userId: user.id,
                action: "SAVE_RISK_ASSESSMENT",
                details: `Saved complete risk assessment (${risks.length} entries)`,
                entityType: "audit",
                entityId: audit.id,
              });
            }}
          >
            <Save size={14} /> Save All
          </button>
          <button
            className={s.btnPrimary}
            onClick={() => setShowReportModal(true)}
          >
            <FileText size={14} /> Generate Report
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div
        className={s.kpiRow}
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {RISK_LEVELS.map((level) => (
          <div key={level} className={s.kpiCard}>
            <div
              className={s.kpiIcon}
              style={{
                background: riskColor[level].bg,
                color: riskColor[level].text,
                border: `1px solid ${riskColor[level].border}`,
              }}
            >
              <Shield size={22} />
            </div>
            <div>
              <div className={s.kpiLabel}>{level} Risk</div>
              <div className={s.kpiValue}>{riskCounts[level]}</div>
              <div className={s.kpiMeta}>
                {risks.length > 0
                  ? `${Math.round((riskCounts[level] / risks.length) * 100)}% of total`
                  : "-"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Import from Questionnaire Risk Assessment */}
      {hasQuestionnaireData && risks.length === 0 && (
        <PlanningCard
          title="Import from Risk Assessment Questionnaire"
          subtitle="Derive risk entries automatically from your completed questionnaire responses"
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <p
              style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-2)" }}
            >
              Risk assessment questionnaire responses have been detected for
              this audit. You can automatically generate risk matrix entries
              based on those responses, mapping each risk area to the relevant
              questionnaire findings.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className={s.btnPrimary}
                onClick={deriveRisksFromQuestionnaire}
              >
                <Sparkles size={14} /> Import Risk Entries from Questionnaire
              </button>
            </div>
          </div>
        </PlanningCard>
      )}

      {investigateItems.length > 0 &&
        risks.length === 0 &&
        !hasQuestionnaireData && (
          <PlanningCard
            title="Risk Indicators from Analytics"
            subtitle="Items flagged during preliminary analytics that may inform risk entries"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {investigateItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "4px",
                    border: "1px solid #fecaca",
                    background: "#fef2f2",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <Search size={14} style={{ color: "#991b1b" }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                        {item.metric}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#7f1d1d" }}>
                        {fmtPercent(item.variancePercent)} variance
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      padding: "0.15rem 0.45rem",
                      borderRadius: "3px",
                      background: "#fef2f2",
                      color: "#991b1b",
                    }}
                  >
                    Investigate
                  </span>
                </div>
              ))}
            </div>
          </PlanningCard>
        )}

      <PlanningCard
        title="Risk Assessment Matrix"
        subtitle="ISA 315 - Identifying and Assessing the Risks of Material Misstatement"
        actions={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className={
                viewMode === "table" ? s.filterChipActive : s.filterChip
              }
              onClick={() => setViewMode("table")}
            >
              Table
            </button>
            <button
              className={
                viewMode === "heatmap" ? s.filterChipActive : s.filterChip
              }
              onClick={() => setViewMode("heatmap")}
            >
              Heat Map
            </button>
            {!showForm && (
              <>
                {/* {risks.length > 0 && viewMode === "table" && (
                  <button
                    className={s.btnSecondary}
                    onClick={() => {
                      if (confirm("Clear all Response / Mitigation fields?")) {
                        store.clearAllMitigations(audit.id);
                        store.addToast({
                          type: "success",
                          title: "Cleared",
                          message: "All mitigation fields have been cleared.",
                        });
                      }
                    }}
                    style={{ borderColor: "#ef4444", color: "#ef4444" }}
                  >
                    <Trash2 size={13} /> Clear Textareas
                  </button>
                )} */}
                <button
                  className={s.btnPrimary}
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={14} /> Add Risk
                </button>
              </>
            )}
          </div>
        }
        noPad={viewMode === "table"}
      >
        {/* ── Add Risk Modal ── */}
        {showForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) resetForm();
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                width: "100%",
                maxWidth: "640px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {/* Modal header */}
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#0f172a",
                    }}
                  >
                    Add Risk Area
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      marginTop: "0.15rem",
                    }}
                  >
                    ISA 315 — Identifying and Assessing Risks of Material
                    Misstatement
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                    background: "#f1f5f9",
                    fontSize: "1rem",
                    color: "#64748b",
                    flexShrink: 0,
                  }}
                  title="Close"
                >
                  ×
                </button>
              </div>

              {/* Modal body */}
              <div style={{ padding: "1.5rem" }}>
                <div className={s.formGrid}>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>
                      Risk Area (from Financial Statement)
                    </label>
                    <select
                      className={s.formSelect}
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    >
                      {riskAreaGroups.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.items.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Inherent Risk</label>
                    <select
                      className={s.formSelect}
                      value={inherent}
                      onChange={(e) => setInherent(e.target.value as RiskLevel)}
                    >
                      {RISK_LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Control Risk</label>
                    <select
                      className={s.formSelect}
                      value={control}
                      onChange={(e) => setControl(e.target.value as RiskLevel)}
                    >
                      {RISK_LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Detection Risk</label>
                    <select
                      className={s.formSelect}
                      value={detection}
                      onChange={(e) =>
                        setDetection(e.target.value as RiskLevel)
                      }
                    >
                      {RISK_LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Computed Overall Risk</label>
                    <div style={{ paddingTop: "0.5rem" }}>
                      <RiskBadge level={overall} />
                    </div>
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>
                      Mitigation / Audit Response
                    </label>
                    <textarea
                      className={s.formTextarea}
                      value={mitigation}
                      onChange={(e) => setMitigation(e.target.value)}
                      placeholder="Describe the planned audit response to this risk..."
                    />
                  </div>
                </div>
                <div className={s.formActions}>
                  <button className={s.btnSecondary} onClick={resetForm}>
                    Cancel
                  </button>
                  <button className={s.btnPrimary} onClick={handleAdd}>
                    <Plus size={14} /> Add Risk Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === "table" && (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Inherent</th>
                  <th>Control</th>
                  <th>Detection</th>
                  <th>Overall</th>
                  <th>Response / Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {allAreas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "var(--text-3)",
                      }}
                    >
                      No items available from the selected document.
                    </td>
                  </tr>
                ) : (
                  allAreas.map((areaItem) => {
                    const r = risks.find((x) => x.area === areaItem);
                    return (
                      <tr key={areaItem}>
                        <td style={{ fontWeight: 600 }}>{areaItem}</td>
                        <td>
                          <select
                            className={s.formSelect}
                            style={{
                              padding: "0.2rem",
                              fontSize: "0.8rem",
                              width: "100%",
                            }}
                            value={r?.inherentRisk || ""}
                            onChange={(e) => {
                              const newLevel = e.target.value as RiskLevel;
                              if (r) {
                                store.updateRiskMatrix(r.id, {
                                  inherentRisk: newLevel,
                                  overallRisk: calculateOverallRisk(
                                    newLevel,
                                    r.controlRisk,
                                    r.detectionRisk,
                                  ),
                                });
                              } else {
                                store.addRiskMatrix({
                                  auditId: audit.id,
                                  area: areaItem,
                                  inherentRisk: newLevel,
                                  controlRisk: "Medium",
                                  detectionRisk: "Medium",
                                  overallRisk: calculateOverallRisk(
                                    newLevel,
                                    "Medium",
                                    "Medium",
                                  ),
                                  mitigationPlan: "",
                                  status: "Open",
                                  preparedBy: user.id,
                                });
                              }
                            }}
                          >
                            {!r && (
                              <option value="" disabled>
                                Select
                              </option>
                            )}
                            {RISK_LEVELS.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            className={s.formSelect}
                            style={{
                              padding: "0.2rem",
                              fontSize: "0.8rem",
                              width: "100%",
                            }}
                            value={r?.controlRisk || ""}
                            onChange={(e) => {
                              const newLevel = e.target.value as RiskLevel;
                              if (r) {
                                store.updateRiskMatrix(r.id, {
                                  controlRisk: newLevel,
                                  overallRisk: calculateOverallRisk(
                                    r.inherentRisk,
                                    newLevel,
                                    r.detectionRisk,
                                  ),
                                });
                              } else {
                                store.addRiskMatrix({
                                  auditId: audit.id,
                                  area: areaItem,
                                  inherentRisk: "Medium",
                                  controlRisk: newLevel,
                                  detectionRisk: "Medium",
                                  overallRisk: calculateOverallRisk(
                                    "Medium",
                                    newLevel,
                                    "Medium",
                                  ),
                                  mitigationPlan: "",
                                  status: "Open",
                                  preparedBy: user.id,
                                });
                              }
                            }}
                          >
                            {!r && (
                              <option value="" disabled>
                                Select
                              </option>
                            )}
                            {RISK_LEVELS.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            className={s.formSelect}
                            style={{
                              padding: "0.2rem",
                              fontSize: "0.8rem",
                              width: "100%",
                            }}
                            value={r?.detectionRisk || ""}
                            onChange={(e) => {
                              const newLevel = e.target.value as RiskLevel;
                              if (r) {
                                store.updateRiskMatrix(r.id, {
                                  detectionRisk: newLevel,
                                  overallRisk: calculateOverallRisk(
                                    r.inherentRisk,
                                    r.controlRisk,
                                    newLevel,
                                  ),
                                });
                              } else {
                                store.addRiskMatrix({
                                  auditId: audit.id,
                                  area: areaItem,
                                  inherentRisk: "Medium",
                                  controlRisk: "Medium",
                                  detectionRisk: newLevel,
                                  overallRisk: calculateOverallRisk(
                                    "Medium",
                                    "Medium",
                                    newLevel,
                                  ),
                                  mitigationPlan: "",
                                  status: "Open",
                                  preparedBy: user.id,
                                });
                              }
                            }}
                          >
                            {!r && (
                              <option value="" disabled>
                                Select
                              </option>
                            )}
                            {RISK_LEVELS.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {r ? (
                            <RiskBadge level={r.overallRisk} />
                          ) : (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--text-3)",
                              }}
                            >
                              -
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            fontSize: "0.82rem",
                            maxWidth: "250px",
                            padding: "0.5rem",
                          }}
                        >
                          <textarea
                            className={s.formTextarea}
                            style={{
                              minHeight: "40px",
                              fontSize: "0.8rem",
                              padding: "0.4rem",
                            }}
                            value={r?.mitigationPlan || ""}
                            onChange={(e) => {
                              if (r) {
                                store.updateRiskMatrix(r.id, {
                                  mitigationPlan: e.target.value,
                                });
                              } else {
                                store.addRiskMatrix({
                                  auditId: audit.id,
                                  area: areaItem,
                                  inherentRisk: "Medium",
                                  controlRisk: "Medium",
                                  detectionRisk: "Medium",
                                  overallRisk: "Medium",
                                  mitigationPlan: e.target.value,
                                  status: "Open",
                                  preparedBy: user.id,
                                });
                              }
                            }}
                            placeholder="Enter response or mitigation plan..."
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === "heatmap" && (
          <div style={{ padding: "1.5rem" }}>
            <div
              style={{
                fontSize: "0.82rem",
                color: "var(--text-3)",
                marginBottom: "1rem",
              }}
            >
              Rows = Inherent Risk | Columns = Control Risk | Numbers = count of
              risk entries
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "100px repeat(4, 1fr)",
                gap: "2px",
              }}
            >
              <div />
              {RISK_LEVELS.map((l) => (
                <div
                  key={l}
                  style={{
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    padding: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: riskColor[l].text,
                  }}
                >
                  {l}
                </div>
              ))}
              {[...RISK_LEVELS].reverse().map((ir) => (
                <React.Fragment key={ir}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: riskColor[ir].text,
                      paddingRight: "0.5rem",
                    }}
                  >
                    {ir}
                  </div>
                  {RISK_LEVELS.map((cr) => {
                    const items = heatmapData[ir]?.[cr] || [];
                    const severity =
                      RISK_LEVELS.indexOf(ir) + RISK_LEVELS.indexOf(cr) >= 4
                        ? "Critical"
                        : RISK_LEVELS.indexOf(ir) + RISK_LEVELS.indexOf(cr) >= 2
                          ? "High"
                          : "Medium";
                    return (
                      <div
                        key={cr}
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          borderRadius: "4px",
                          background:
                            items.length > 0
                              ? riskColor[severity].bg
                              : "#f8fafc",
                          border: `1px solid ${items.length > 0 ? riskColor[severity].border : "#e2e8f0"}`,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color:
                            items.length > 0
                              ? riskColor[severity].text
                              : "#d1d5db",
                          minHeight: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title={items.map((i) => i.area).join(", ")}
                      >
                        {items.length || "-"}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--text-3)",
                marginTop: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              | Control Risk |
            </div>
          </div>
        )}
      </PlanningCard>

      {/* ─── Report Modal ─── */}
      {showReportModal && risks.length > 0 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReportModal(false);
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              width: "90vw",
              maxWidth: "1000px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                flexShrink: 0,
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>
                  Risk Assessment Report
                </h3>
                <p
                  style={{
                    margin: "0.15rem 0 0",
                    fontSize: "0.8rem",
                    color: "#64748b",
                  }}
                >
                  {lgaName} - {audit.type} Audit ({audit.year})
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className={s.btnPrimary} onClick={handleDownloadPDF}>
                  <Download size={14} /> Download PDF
                </button>
                <button
                  className={s.btnSecondary}
                  onClick={() => setShowReportModal(false)}
                >
                  <X size={14} /> Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ overflow: "auto", padding: "1.5rem", flex: 1 }}>
              {reportModalContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskMatrixStep;
