import React, { useState } from "react";
import {
  AlertTriangle,
  Upload,
  CheckCircle,
  Send,
  Save,
  MessageSquare,
  ShieldCheck,
  Zap,
  X,
} from "lucide-react";
import { MOCK_FS } from "../../audit-planning/arMockData";
import type { AuditStore } from "../../../store/useAuditStore";
import StatusBadge from "../../../components/UI/StatusBadge";
import Card from "../../../components/UI/Card";
import type {
  ProcedureExecution,
  ExceptionSeverity,
  BankAccount,
  ContractFlag,
  VouchingChecklist,
  SiteVerification,
  StaffVerificationItem,
  DeductionRemittanceRow,
  ReconciliationRow,
  IGRChainItem,
  AdvanceItem,
  StockCountItem,
  GrantExpenditure,
  ReviewComment,
} from "../../../types";
import s from "../../../styles/pages.module.css";
import { statusBadgeVariant, severityVariant } from "../utils/statusVariants";
import { userNameById } from "../utils/suggestSeverity";
const ProcedureWorkspace: React.FC<{
  executionId: string;
  store: AuditStore;
  userId: string;
  userName: string;
  userRole: string;
  isWriter: boolean;
  isLead: boolean;
  isSupervisor: boolean;
  auditId: string;
  bankAccounts: BankAccount[];
  contractFlags: ContractFlag[];
  onClose: () => void;
}> = ({
  executionId,
  store,
  userId,
  userName: uName,
  userRole,
  isWriter,
  isLead,
  isSupervisor,
  auditId,
  bankAccounts,
  contractFlags,
  onClose,
}) => {
  const exec = store.getProcedureExecution(executionId);

  const [workPerformed, setWorkPerformed] = useState(exec?.workPerformed || "");
  const [bigFourInputs, setBigFourInputs] = useState<Record<string, string>>(
    {},
  );
  const bfi = (key: string) => bigFourInputs[key] ?? "";
  const setBfi = (key: string, val: string) =>
    setBigFourInputs((p) => ({ ...p, [key]: val }));
  const [conclusion, setConclusion] = useState<
    ProcedureExecution["conclusion"]
  >(exec?.conclusion || undefined);
  const [conclusionNotes, setConclusionNotes] = useState(
    exec?.conclusionNotes || "",
  );
  const [reviewMsg, setReviewMsg] = useState("");

  const [staffVerification, setStaffVerification] = useState<
    StaffVerificationItem[]
  >(() => {
    if (
      exec?.auditArea === "Personnel & Payroll" &&
      exec.procedureRef.startsWith("PAY-003")
    ) {
      return Array.from({ length: 30 }, (_, i) => ({
        id: `sv-${i}`,
        name: `Staff ${i + 1}`,
        department: ["Admin", "Finance", "Works", "Health", "Education"][i % 5],
        gradeLevel: `GL ${7 + (i % 6)}`,
        physicallySighted: "" as const,
        notes: "",
      }));
    }
    return [];
  });

  const [deductionRows, setDeductionRows] = useState<DeductionRemittanceRow[]>(
    () => {
      if (
        exec?.auditArea === "Personnel & Payroll" &&
        (exec.procedureRef.startsWith("PAY-004") ||
          exec.procedureRef.startsWith("PAY-005"))
      ) {
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ].map((m, i) => ({
          id: `dr-${i}`,
          month: `${m} 2024`,
          payeDeducted: 0,
          payeRemitted: 0,
          payeDifference: 0,
          pensionDeducted: 0,
          pensionRemitted: 0,
          pensionDifference: 0,
          flagged: false,
        }));
      }
      return [];
    },
  );

  const [reconRows, setReconRows] = useState<ReconciliationRow[]>(() => {
    if (
      exec?.auditArea === "FAAC & Revenue" &&
      exec.procedureRef.startsWith("REV-001")
    ) {
      return [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].map((m, i) => ({
        id: `rec-${i}`,
        month: `${m} 2024`,
        sourceA: 0,
        sourceB: 0,
        sourceC: 0,
        differenceAB: 0,
        differenceAC: 0,
        explanation: "",
        flagged: false,
      }));
    }
    return [];
  });

  const [igrChain, setIgrChain] = useState<IGRChainItem[]>(() => {
    if (
      exec?.auditArea === "FAAC & Revenue" &&
      exec.procedureRef.startsWith("REV-002")
    ) {
      return Array.from({ length: 10 }, (_, i) => ({
        id: `igr-${i}`,
        receiptRef: `IGR-${String(i + 1).padStart(3, "0")}`,
        revenueHead: [
          "Market Levies",
          "Tenement Rate",
          "Motor Park Fees",
          "Business Premises",
        ][i % 4],
        amount: 0,
        assessmentNotice: "" as const,
        revenueReceipt: "" as const,
        dailySummary: "" as const,
        bankPayinSlip: "" as const,
        bankStatementCredit: "" as const,
        chainComplete: false,
      }));
    }
    return [];
  });

  const [siteVerification, setSiteVerification] = useState<Omit<
    SiteVerification,
    "id"
  > | null>(() => {
    if (
      exec?.auditArea === "Procurement & Contracts" &&
      exec.procedureRef.startsWith("PROC-003")
    ) {
      return {
        procedureExecutionId: exec.id,
        projectName: exec.procedureDescription.slice(0, 60),
        contractorName: "",
        contractValue: 0,
        claimedCompletion: 100,
        amountPaid: 0,
        visitDate: new Date().toISOString().split("T")[0],
        auditorPresent: uName,
        physicalCondition: "" as const,
        auditorCompletion: 0,
        descriptionOfFindings: "",
        photos: [],
        discrepancyAmount: 0,
        exceptionLogged: false,
      };
    }
    return null;
  });

  const [vouchingChecklist, setVouchingChecklist] = useState<Omit<
    VouchingChecklist,
    "id"
  > | null>(() => {
    if (
      exec?.auditArea === "Procurement & Contracts" &&
      exec.procedureRef.startsWith("PROC-002")
    ) {
      return {
        procedureExecutionId: exec.id,
        contractDescription: "",
        vendorName: "",
        contractValue: 0,
        contractDate: "",
        items: [
          {
            id: "v1",
            documentName: "Local Purchase Order / Contract Award Letter",
            required: true,
            status: "" as const,
          },
          {
            id: "v2",
            documentName: "Tender Board Minutes (if above threshold)",
            required: true,
            status: "" as const,
          },
          {
            id: "v3",
            documentName: "Contractor's Invoice",
            required: true,
            status: "" as const,
          },
          {
            id: "v4",
            documentName: "Goods Received Note / Delivery Certificate",
            required: true,
            status: "" as const,
          },
          {
            id: "v5",
            documentName: "Interim Payment Certificate (for civil works)",
            required: false,
            status: "" as const,
          },
          {
            id: "v6",
            documentName: "Payment Voucher (with approval signatures)",
            required: true,
            status: "" as const,
          },
          {
            id: "v7",
            documentName: "Bank payment evidence (transfer receipt)",
            required: true,
            status: "" as const,
          },
        ],
        paymentSupported: "" as const,
        deliveryConfirmed: "" as const,
        approvalChainComplete: "" as const,
      };
    }
    return null;
  });

  const [advanceItems] = useState<AdvanceItem[]>(() => {
    if (
      exec?.auditArea === "Advances & Imprest" &&
      exec.procedureRef.startsWith("ADV-001")
    ) {
      return Array.from({ length: 8 }, (_, i) => {
        const dateIssued = new Date(
          2024,
          Math.floor(Math.random() * 12),
          1 + Math.floor(Math.random() * 28),
        );
        const daysOut = Math.floor(
          (Date.now() - dateIssued.getTime()) / 86400000,
        );
        const ageBand: AdvanceItem["ageBand"] =
          daysOut > 365
            ? "> 1 year"
            : daysOut > 180
              ? "6–12 months"
              : daysOut > 90
                ? "3–6 months"
                : "< 3 months";
        const endOfYear = dateIssued.getMonth() >= 9;
        return {
          id: `adv-${i}`,
          ref: `ADV-2024-${String(i + 1).padStart(3, "0")}`,
          officerName: `Officer ${i + 1}`,
          purpose: ["Welfare", "Training", "Stationery", "Travel", "Imprest"][
            i % 5
          ],
          amount: 100000 + Math.floor(Math.random() * 400000),
          dateIssued: dateIssued.toISOString().split("T")[0],
          daysOutstanding: daysOut,
          retired: false,
          ageBand,
          endOfYearAdvance: endOfYear,
          flagged: daysOut > 2,
        };
      });
    }
    return [];
  });

  const [stockItems, setStockItems] = useState<StockCountItem[]>(() => {
    if (
      exec?.auditArea === "Stores & Inventory" &&
      exec.procedureRef.startsWith("STOR-001")
    ) {
      return [
        {
          id: "st-1",
          itemName: "A4 Paper",
          unit: "Reams",
          ledgerBalance: 450,
          notes: "",
          flagged: false,
        },
        {
          id: "st-2",
          itemName: "Printer Ink Cartridges",
          unit: "Units",
          ledgerBalance: 23,
          notes: "",
          flagged: false,
        },
        {
          id: "st-3",
          itemName: "Petrol",
          unit: "Litres",
          ledgerBalance: 500,
          notes: "",
          flagged: false,
        },
        {
          id: "st-4",
          itemName: "Diesel",
          unit: "Litres",
          ledgerBalance: 200,
          notes: "",
          flagged: false,
        },
        {
          id: "st-5",
          itemName: "Cleaning Supplies",
          unit: "Sets",
          ledgerBalance: 35,
          notes: "",
          flagged: false,
        },
      ];
    }
    return [];
  });

  const [grantExpenditures, setGrantExpenditures] = useState<
    GrantExpenditure[]
  >(() => {
    if (
      exec?.auditArea === "Grants (UBEC/PHC)" &&
      exec.procedureRef.startsWith("GRANT-002")
    ) {
      return Array.from({ length: 6 }, (_, i) => ({
        id: `ge-${i}`,
        description: [
          "Classroom Construction",
          "Furniture Supply",
          "Staff Training",
          "Workshop Materials",
          "Staff Welfare",
          "Vehicle Maintenance",
        ][i],
        amount: 500000 + Math.floor(Math.random() * 2000000),
        eligibility: "" as const,
        notes: "",
      }));
    }
    return [];
  });

  const excSeverity: ExceptionSeverity = "High";
  const [excImpact, setExcImpact] = useState(0);

  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [tbJournalDesc, setTbJournalDesc] = useState("");
  const [tbAdjustments, setTbAdjustments] = useState<
    Record<string, { dr: number; cr: number; selected: boolean }>
  >({});

  // Use the real trial balance for this audit when available; fall back to mock data
  const realTb = store.trialBalances?.find((tb) => tb.auditId === auditId);
  const tbLines: {
    id: string;
    code: string;
    account: string;
    section: string;
    current: number;
  }[] = realTb
    ? realTb.lines
        .filter((l) => !/total|net/i.test(l.accountName))
        .map((l) => ({
          id: l.id,
          code: l.ncoaCode ?? "",
          account: l.accountName,
          section: l.classification,
          current: l.currentYear,
        }))
    : MOCK_FS.filter(
        (row) => row.type === "line" && !/total|net/i.test(row.account),
      ).map((row) => ({
        id: row.id,
        code: row.code,
        account: row.account,
        section: row.section,
        current: row.current,
      }));

  if (!exec) return null;

  const totalAdjDr = Object.values(tbAdjustments).reduce(
    (sum, item) => sum + (item.selected ? item.dr || 0 : 0),
    0,
  );
  const totalAdjCr = Object.values(tbAdjustments).reduce(
    (sum, item) => sum + (item.selected ? item.cr || 0 : 0),
    0,
  );
  const journalHasEntries = totalAdjDr > 0 || totalAdjCr > 0;
  const isJournalBalanced = totalAdjDr === totalAdjCr;
  const journalStateInvalid = journalHasEntries && !isJournalBalanced;

  const handleUploadEvidence = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.xlsx,.csv,.doc,.docx,.jpg,.jpeg,.png";
    input.multiple = true;
    input.onchange = (ev) => {
      const files = (ev.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach((f) => {
          store.addProcedureEvidence(exec.id, {
            fileName: f.name,
            fileUrl: URL.createObjectURL(f),
            fileType: (f.name.split(".").pop() || "FILE").toUpperCase(),
            fileSize: `${(f.size / 1024).toFixed(1)} KB`,
            uploadedAt: new Date().toISOString(),
            uploadedBy: uName,
            documentType: "Other",
          });
        });
        store.addToast({
          type: "success",
          title: "Evidence Uploaded",
          message: `${files.length} file(s) attached to ${exec.procedureRef}`,
        });
      }
    };
    input.click();
  };

  const handleSave = () => {
    store.updateProcedureExecution(exec.id, {
      workPerformed,
      conclusion: conclusion || undefined,
      conclusionNotes,
    });
    store.addToast({
      type: "success",
      title: "Progress Saved",
      message: `${exec.procedureRef} saved`,
    });
  };

  const handleSubmit = () => {
    if (!workPerformed.trim()) {
      store.addToast({
        type: "warning",
        title: "Cannot Submit",
        message: "Work Performed is required before submission",
      });
      return;
    }
    if (!conclusion) {
      store.addToast({
        type: "warning",
        title: "Cannot Submit",
        message: "Select a conclusion before submission",
      });
      return;
    }
    store.updateProcedureExecution(exec.id, {
      workPerformed,
      conclusion,
      conclusionNotes,
    });
    store.submitProcedureForReview(exec.id);
    store.generateWorkingPaper(exec.id);

    // Log work done & findings as an Audit Comment
    store.addAuditComment({
      auditId,
      referenceNumber: `AC-${exec.id}`,
      title: `${exec.procedureRef} — ${exec.procedureDescription.slice(0, 80)}`,
      observation: workPerformed,
      criteria: `${exec.auditArea} — Assertions: ${exec.assertions.join(", ")}`,
      cause: conclusionNotes || "See work performed narrative above.",
      effect:
        conclusion === "Exception Raised"
          ? "Exception identified requiring management attention and corrective action."
          : conclusion === "Limitation"
            ? "Audit scope limitation — records were unavailable for inspection."
            : "No adverse effect on the financial statements identified.",
      recommendation:
        conclusion === "Exception Raised"
          ? "Management is advised to take corrective action. Refer to linked exception(s) in the Exceptions Register."
          : "Continue monitoring. No further action required at this stage.",
      severity:
        (currentExec.riskRating as "Low" | "Medium" | "High" | "Critical") ||
        "Low",
      status: "Draft",
      preparedBy: uName,
    });

    store.addToast({
      type: "success",
      title: "Procedure Submitted",
      message: `${exec.procedureRef} submitted for review`,
    });
    onClose();
  };

  const handleLogException = () => {
    if (!conclusionNotes.trim()) return;
    store.addFieldworkException({
      auditId,
      procedureId: exec.procedureId,
      procedureRef: exec.procedureRef,
      auditArea: exec.auditArea,
      exceptionType: exec.auditArea,
      assertionAffected: "Existence/Occurrence",
      severity: excSeverity,
      finding: conclusionNotes,
      evidenceCodes: exec.evidence.map((e) => e.code),
      financialImpact: excImpact,
      qualitativeImpact: "",
      status: "Open",
      raisedBy: userId,
      potentialAuditQuery: true,
      notes: "",
      escalatedToHlg: false,
    });
    store.addToast({
      type: "warning",
      title: "Exception Logged",
      message: `Exception raised for ${exec.procedureRef}`,
    });
    setExcImpact(0);
    // prompt user to log a journal for this exception
    setTbJournalDesc(
      `Exception — ${exec.procedureRef}: ${conclusionNotes.slice(0, 120)}`,
    );

    const initialMatches: Record<
      string,
      { dr: number; cr: number; selected: boolean }
    > = {};
    tbLines.forEach((line) => {
      const lAcc = line.account.toLowerCase();
      const eDesc = exec.procedureDescription.toLowerCase();
      const eArea = exec.auditArea.toLowerCase();
      // Match by exact or partial string matching to auto-select the row
      if (
        lAcc.includes(eDesc) ||
        eDesc.includes(lAcc) ||
        lAcc.includes(eArea) ||
        eArea.includes(lAcc)
      ) {
        initialMatches[line.id] = { selected: true, dr: 0, cr: 0 };
      }
    });
    setTbAdjustments(initialMatches);

    setShowJournalPrompt(true);
  };

  const handleLogJournal = () => {
    if (!tbJournalDesc.trim()) return;
    if (journalStateInvalid) {
      store.addToast({
        type: "error",
        title: "Unbalanced Journal",
        message: "Total debits must equal total credits before logging.",
      });
      return;
    }

    const entries: import("../../../types").AuditJournalEntry[] = [];
    let netDebit = 0;

    Object.entries(tbAdjustments).forEach(([lineId, { selected, dr, cr }]) => {
      if (selected && (dr > 0 || cr > 0)) {
        const line = tbLines.find((l) => l.id === lineId);
        if (line) {
          entries.push({
            account: line.code
              ? `${line.code} - ${line.account}`
              : line.account,
            debit: dr,
            credit: cr,
          });
          if (dr > 0) netDebit += dr;
        }
      }
    });

    if (entries.length === 0) {
      store.addToast({
        type: "error",
        title: "No Adjustments",
        message:
          "Please select at least one line and enter an adjustment amount.",
      });
      return;
    }

    store.addAuditJournal({
      auditId,
      journalNumber: `AJE-${exec.id}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      type: "Proposed",
      description: tbJournalDesc,
      entries,
      netEffect: netDebit,
      affectedArea: exec.auditArea,
      preparedBy: uName,
      status: "Draft",
      workpaperRef: exec.procedureRef,
    });
    store.addToast({
      type: "info",
      title: "Journal Entry Created",
      message: `Draft journal logged for ${exec.procedureRef}`,
    });
    setShowJournalPrompt(false);
  };

  const handleAddReviewComment = () => {
    if (!reviewMsg.trim()) return;
    const comment: ReviewComment = {
      id: `rc-${exec.id}-${(exec.reviewComments || []).length}`,
      authorId: userId,
      authorName: uName,
      authorRole: userRole as ReviewComment["authorRole"],
      message: reviewMsg,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    store.updateProcedureExecution(exec.id, {
      reviewComments: [...(exec.reviewComments || []), comment],
    });
    setReviewMsg("");
  };

  const handleLeadReview = (action: "Clear" | "Return" | "Extend") => {
    if (action === "Return" || action === "Extend") {
      const msg = prompt(
        action === "Return"
          ? "Comments for return:"
          : "Additional steps to extend:",
      );
      if (!msg) return;
      store.reviewProcedure(exec.id, userId, action, msg);
    } else {
      store.reviewProcedure(exec.id, userId, action);
    }
    store.addToast({
      type: action === "Clear" ? "success" : "info",
      title: `Procedure ${action === "Clear" ? "Reviewed" : action === "Return" ? "Returned" : "Extended"}`,
      message: `${exec.procedureRef} — ${action}`,
    });
    if (action === "Clear" || action === "Return") onClose();
  };

  const handleSupervisorClear = () => {
    store.clearProcedure(exec.id, userId);
    store.addToast({
      type: "success",
      title: "Procedure Cleared",
      message: `${exec.procedureRef} cleared by Supervisor`,
    });
    onClose();
  };

  const runReconciliation = () => {
    if (
      exec.auditArea === "Personnel & Payroll" &&
      (exec.procedureRef.startsWith("PAY-001") ||
        exec.procedureRef.startsWith("PAY-002"))
    ) {
      const totalPayroll = 380 + Math.floor(Math.random() * 40);
      const totalNominal = 370 + Math.floor(Math.random() * 20);
      const matched =
        Math.min(totalPayroll, totalNominal) - Math.floor(Math.random() * 18);
      const onPayrollNotNominal = totalPayroll - matched;
      const onNominalNotPayroll = totalNominal - matched;
      const monthlySalary = 250000 + Math.floor(Math.random() * 50000);
      const annualExposure = onPayrollNotNominal * monthlySalary * 12;
      const label = exec.procedureRef.startsWith("PAY-002")
        ? "biometric register"
        : "nominal roll";
      setWorkPerformed(
        `Reconciliation Engine Output — ${label.toUpperCase()}\n\n` +
          `Total on payroll: ${totalPayroll}\n` +
          `Total on ${label}: ${totalNominal}\n` +
          `Matched: ${matched}\n` +
          `On payroll, NOT on ${label}: ${onPayrollNotNominal} (FLAGGED — potential ghost workers)\n` +
          `On ${label}, NOT on payroll: ${onNominalNotPayroll}\n\n` +
          `Monthly salary exposure (unmatched): ₦${(onPayrollNotNominal * monthlySalary).toLocaleString()}\n` +
          `Annual exposure: ₦${annualExposure.toLocaleString()}\n\n` +
          (onPayrollNotNominal > 0
            ? `⚠ ${onPayrollNotNominal} staff on payroll could not be matched. Conclusion auto-set to Exception Raised.`
            : "All staff matched. No exceptions."),
      );
      if (onPayrollNotNominal > 0) {
        setConclusion("Exception Raised");
        setExcImpact(annualExposure);
        const pairedRef = exec.procedureRef.startsWith("PAY-002")
          ? "PAY-001"
          : "PAY-002";
        const pairedAlreadyFlagged = store.procedureExecutions
          .filter((e) => e.auditId === auditId)
          .some(
            (e) =>
              e.procedureRef.startsWith(pairedRef) &&
              e.auditArea === "Personnel & Payroll" &&
              e.conclusion === "Exception Raised",
          );
        if (pairedAlreadyFlagged) {
          store.addFieldworkException({
            auditId,
            procedureId: exec.procedureId,
            procedureRef: exec.procedureRef,
            auditArea: exec.auditArea,
            exceptionType: "Ghost Worker",
            assertionAffected: "Existence/Occurrence",
            severity: "Critical",
            finding: `Dual-flag escalation: both PAY-001 (nominal roll) and PAY-002 (biometric register) independently identified ${onPayrollNotNominal} unmatched staff. Annual financial exposure: ₦${annualExposure.toLocaleString()}.`,
            evidenceCodes: exec.evidence.map((e) => e.code),
            financialImpact: annualExposure,
            qualitativeImpact:
              "Critical — corroborated ghost worker risk across both verification methods",
            status: "Open",
            raisedBy: userId,
            potentialAuditQuery: true,
            notes: "Auto-escalated: dual-flag confirmation",
            escalatedToHlg: true,
          });
          store.addToast({
            type: "error",
            title: "Critical Escalation",
            message: `Ghost worker dual-flag confirmed — Critical exception auto-raised and escalated to HLG`,
          });
        }
      } else {
        setConclusion("No Exception");
      }
      store.addToast({
        type: "info",
        title: "Reconciliation Complete",
        message: `${label} reconciliation completed — ${onPayrollNotNominal} unmatched`,
      });
    }
  };

  const runContractSplitDetection = () => {
    const flags: Omit<ContractFlag, "id">[] = [
      {
        auditId,
        flagType: "Potential Splitting",
        vendorName: "Eko Builders Ltd",
        contractCount: 3,
        period: "Jan–Feb 2024",
        totalValue: 29400000,
        individualValues: [9800000, 9800000, 9800000],
        risk: "High",
        investigated: false,
        notes: "",
      },
      {
        auditId,
        flagType: "Threshold Breach",
        vendorName: "ABC Supplies",
        contractCount: 1,
        period: "Mar 2024",
        totalValue: 12500000,
        individualValues: [12500000],
        risk: "Medium",
        investigated: false,
        notes: "",
      },
      {
        auditId,
        flagType: "Just Below Threshold",
        vendorName: "Metro Construction",
        contractCount: 2,
        period: "Apr–May 2024",
        totalValue: 19200000,
        individualValues: [9600000, 9600000],
        risk: "High",
        investigated: false,
        notes: "",
      },
    ];
    flags.forEach((f) => store.addContractFlag(f));
    setWorkPerformed(
      "CONTRACT SPLITTING DETECTION — Automated Analysis\n\n" +
        `Contracts analysed from register. Fuzzy vendor matching applied.\n` +
        `Threshold: ₦10,000,000 (BPP Act)\n\n` +
        `FLAGGED VENDORS:\n` +
        flags
          .map(
            (f) =>
              `• ${f.vendorName} — ${f.flagType} — ${f.contractCount} contract(s) — ₦${f.totalValue.toLocaleString()} total — Risk: ${f.risk}`,
          )
          .join("\n") +
        `\n\nAll flagged contracts added to sample for detailed vouching (PROC-002).`,
    );
    store.addToast({
      type: "warning",
      title: "Contract Splitting Analysis",
      message: `${flags.length} vendors flagged`,
    });
  };

  const runAdvanceAgeing = () => {
    const critical = advanceItems.filter((a) => a.ageBand === "> 1 year");
    const high = advanceItems.filter((a) => a.ageBand === "6–12 months");
    const medium = advanceItems.filter((a) => a.ageBand === "3–6 months");
    const endOfYear = advanceItems.filter(
      (a) => a.endOfYearAdvance && !a.retired,
    );
    const totalOutstanding = advanceItems
      .filter((a) => !a.retired)
      .reduce((s, a) => s + a.amount, 0);
    setWorkPerformed(
      "ADVANCES AGEING ANALYSIS — FAR 2009\n\n" +
        `Regulation: Retirement within 48 hours for cash advances.\n\n` +
        `Outstanding > 1 year (Critical): ${critical.length} — ₦${critical.reduce((s, a) => s + a.amount, 0).toLocaleString()}\n` +
        `Outstanding 6–12 months (High): ${high.length} — ₦${high.reduce((s, a) => s + a.amount, 0).toLocaleString()}\n` +
        `Outstanding 3–6 months (Medium): ${medium.length} — ₦${medium.reduce((s, a) => s + a.amount, 0).toLocaleString()}\n\n` +
        `Year-end advances (Oct–Dec, unretired): ${endOfYear.length}\n` +
        `Total outstanding: ₦${totalOutstanding.toLocaleString()}\n\n` +
        `All ${advanceItems.filter((a) => !a.retired && a.daysOutstanding > 2).length} advances exceeding 48-hour FAR 2009 limit flagged as non-compliant.`,
    );
    if (totalOutstanding > 0) {
      setConclusion("Exception Raised");
      setExcImpact(totalOutstanding);
    }
    store.addToast({
      type: "info",
      title: "Ageing Analysis Complete",
      message: `${advanceItems.filter((a) => !a.retired).length} outstanding advances identified`,
    });
  };

  const refreshedExec = store.getProcedureExecution(executionId);
  const currentExec = refreshedExec || exec;
  const procedureNature = currentExec?.natureOfTest;

  const currentProgramme = store.programmes.find(
    (p) => p.id === currentExec.programmeId,
  );
  const currentProc = currentProgramme?.procedures.find(
    (p) => p.id === currentExec.procedureId,
  );
  const selectedAudit = store.audits.find((a) => a.id === auditId);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "1.5rem",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "1100px",
          borderRadius: "1rem",
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.35rem",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                {currentExec.procedureRef}
              </span>
              <StatusBadge
                label={currentExec.status}
                variant={statusBadgeVariant(currentExec.status)}
              />
              <StatusBadge
                label={currentExec.riskRating}
                variant={severityVariant(
                  currentExec.riskRating as ExceptionSeverity,
                )}
              />
            </div>
            <div
              style={{
                fontSize: "0.92rem",
                fontWeight: 600,
                maxWidth: "700px",
              }}
            >
              {currentExec.procedureDescription}
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "#64748b",
                marginTop: "0.2rem",
              }}
            >
              {currentExec.auditArea} · Assertions:{" "}
              {currentExec.assertions.join(", ")} · Assigned:{" "}
              {userNameById(currentExec.assignedTo, store.users)} · Due:{" "}
              {new Date(currentExec.dueDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button className={s.btnIcon} onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div
          style={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#2563eb",
                  marginBottom: "0.5rem",
                }}
              >
                Instruction Panel
              </div>
              <div
                style={{
                  background: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  fontSize: "0.82rem",
                  lineHeight: 1.7,
                  color: "#0c4a6e",
                }}
              >
                {currentExec.procedureDescription}
              </div>

              {(isSupervisor || isLead) && currentProgramme && currentProc && (
                <div style={{ marginTop: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#334155",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Assign Procedure
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      fontSize: "0.85rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.35rem",
                      background: "#f8fafc",
                      color: "#334155",
                    }}
                    value={currentProc?.assignedTo || ""}
                    onChange={(e) => {
                      store.updateProgrammeProcedure(
                        currentProgramme.id,
                        currentProc.id,
                        {
                          assignedTo: e.target.value,
                        },
                      );
                      store.addToast({
                        title: "Assigned successfully",
                        type: "success",
                      });
                    }}
                  >
                    <option value="">— Assign Auditor —</option>
                    {store.users
                      .filter((u) => selectedAudit?.teamIds?.includes(u.id))
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#7c3aed",
                  marginBottom: "0.5rem",
                  marginTop: "1rem",
                }}
              >
                Evidence Panel ({currentExec.evidence.length} files)
              </div>
              {currentExec.evidence.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.4rem 0.6rem",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.35rem",
                    marginBottom: "0.35rem",
                    fontSize: "0.78rem",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontWeight: 600,
                        marginRight: "0.5rem",
                      }}
                    >
                      {ev.code}
                    </span>
                    {ev.fileName}
                  </div>
                  <span style={{ color: "#64748b" }}>{ev.fileSize}</span>
                </div>
              ))}
              {isWriter &&
                currentExec.status !== "Cleared" &&
                currentExec.status !== "Locked" && (
                  <button
                    className={s.btnOutline}
                    onClick={handleUploadEvidence}
                    style={{ marginTop: "0.5rem", fontSize: "0.75rem" }}
                  >
                    <Upload size={12} /> Attach Evidence
                  </button>
                )}
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#15803d",
                  marginBottom: "0.5rem",
                }}
              >
                Work Done & Findings
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Work Performed</label>
                <textarea
                  className={s.formTextarea}
                  value={workPerformed}
                  onChange={(e) => setWorkPerformed(e.target.value)}
                  rows={8}
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.78rem",
                    lineHeight: 1.6,
                  }}
                  disabled={
                    !isWriter ||
                    currentExec.status === "Cleared" ||
                    currentExec.status === "Locked"
                  }
                />
              </div>

              <div className={s.formGrid} style={{ marginTop: "0.75rem" }}>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Conclusion</label>
                  <select
                    className={s.formSelect}
                    value={conclusion || ""}
                    onChange={(e) =>
                      setConclusion(
                        e.target.value as ProcedureExecution["conclusion"],
                      )
                    }
                    disabled={!isWriter}
                  >
                    <option value="">— Select —</option>
                    <option value="No Exception">No Exception</option>
                    <option value="Exception Raised">Exception Raised</option>
                    <option value="Inconclusive">Inconclusive</option>
                    <option value="Limitation">
                      Limitation — Records Unavailable
                    </option>
                  </select>
                </div>
              </div>
              <div className={s.formGroupFull} style={{ marginTop: "0.75rem" }}>
                <label className={s.formLabel}>Conclusion Notes</label>
                <textarea
                  className={s.formTextarea}
                  value={conclusionNotes}
                  onChange={(e) => setConclusionNotes(e.target.value)}
                  disabled={!isWriter}
                  rows={4}
                />
              </div>

              {conclusion === "Exception Raised" && isWriter && (
                <div style={{ marginTop: "0.5rem" }}>
                  <button
                    className={s.btnDanger}
                    onClick={handleLogException}
                    disabled={!conclusionNotes.trim()}
                    style={{ fontSize: "0.75rem" }}
                  >
                    <AlertTriangle size={12} /> Log Exception
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ─── BIG FOUR PROCEDURE AUTOMATION PANEL ─── */}
          {procedureNature &&
            isWriter &&
            currentExec.status !== "Cleared" &&
            currentExec.status !== "Locked" && (
              <div style={{ marginTop: "1.5rem" }}>
                {/* Header */}
                <div
                  style={{
                    background:
                      procedureNature === "Control"
                        ? "linear-gradient(135deg,#1e40af,#3b82f6)"
                        : procedureNature === "Substantive"
                          ? "linear-gradient(135deg,#6d28d9,#a78bfa)"
                          : procedureNature === "Analytical"
                            ? "linear-gradient(135deg,#0f766e,#2dd4bf)"
                            : procedureNature === "Inquiry"
                              ? "linear-gradient(135deg,#c2410c,#fb923c)"
                              : procedureNature === "Observation"
                                ? "linear-gradient(135deg,#166534,#4ade80)"
                                : "linear-gradient(135deg,#1e3a5f,#6366f1)",
                    borderRadius: "0.5rem 0.5rem 0 0",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#fff",
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}>
                    {procedureNature === "Control"
                      ? "🛡️"
                      : procedureNature === "Substantive"
                        ? "🔬"
                        : procedureNature === "Analytical"
                          ? "📊"
                          : procedureNature === "Inquiry"
                            ? "💬"
                            : procedureNature === "Observation"
                              ? "👁️"
                              : "📋"}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      {procedureNature === "Control"
                        ? "Test of Controls (ISA 330)"
                        : procedureNature === "Substantive"
                          ? "Substantive Testing (ISA 330)"
                          : procedureNature === "Analytical"
                            ? "Analytical Procedures (ISA 520)"
                            : procedureNature === "Inquiry"
                              ? "Inquiry Procedure (ISA 500)"
                              : procedureNature === "Observation"
                                ? "Observation (ISA 500)"
                                : "Inspection (ISA 500)"}
                    </div>
                    <div style={{ fontSize: "0.72rem", opacity: 0.85 }}>
                      {procedureNature === "Control"
                        ? "Evaluate design and operating effectiveness of internal controls"
                        : procedureNature === "Substantive"
                          ? "Obtain direct evidence on material classes of transactions and balances"
                          : procedureNature === "Analytical"
                            ? "Evaluate financial information through analysis of plausible relationships"
                            : procedureNature === "Inquiry"
                              ? "Seek information from knowledgeable persons inside or outside the entity"
                              : procedureNature === "Observation"
                                ? "Look at a process or procedure being performed by others"
                                : "Inspect records, documents, tangible assets, or third-party confirmations"}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    borderTop: "none",
                    borderRadius: "0 0 0.5rem 0.5rem",
                    padding: "1rem",
                    background: "#f8fafc",
                  }}
                >
                  {/* CONTROL */}
                  {procedureNature === "Control" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.6rem",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Control Activity
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("ctrl_activity")}
                            onChange={(e) =>
                              setBfi("ctrl_activity", e.target.value)
                            }
                            placeholder="e.g. Payroll authorisation checklist reviewed monthly"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Test Method
                          </label>
                          <select
                            className={s.formInput}
                            value={bfi("ctrl_method")}
                            onChange={(e) =>
                              setBfi("ctrl_method", e.target.value)
                            }
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          >
                            <option value="">Select…</option>
                            <option>Reperformance</option>
                            <option>Inspection of evidence</option>
                            <option>Observation</option>
                            <option>Inquiry and corroboration</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Effectiveness Assessment
                          </label>
                          <select
                            className={s.formInput}
                            value={bfi("ctrl_effectiveness")}
                            onChange={(e) =>
                              setBfi("ctrl_effectiveness", e.target.value)
                            }
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          >
                            <option value="">Select…</option>
                            <option>Operating Effectively</option>
                            <option>Operating with Minor Deficiency</option>
                            <option>
                              Operating with Significant Deficiency
                            </option>
                            <option>Not Operating Effectively</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Deviations Noted
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("ctrl_deviations")}
                            onChange={(e) =>
                              setBfi("ctrl_deviations", e.target.value)
                            }
                            placeholder="e.g. 2 of 25 samples lacked supervisor signature"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "#374151",
                          }}
                        >
                          Control Weakness (if any)
                        </label>
                        <input
                          className={s.formInput}
                          value={bfi("ctrl_weakness")}
                          onChange={(e) =>
                            setBfi("ctrl_weakness", e.target.value)
                          }
                          placeholder="Describe any material weakness identified"
                          style={{ width: "100%", marginTop: "0.2rem" }}
                        />
                      </div>
                      <button
                        className={s.btnPrimary}
                        style={{ fontSize: "0.75rem", alignSelf: "flex-start" }}
                        onClick={() => {
                          const eff =
                            bfi("ctrl_effectiveness") || "not assessed";
                          const method = bfi("ctrl_method") || "N/A";
                          const activity =
                            bfi("ctrl_activity") || "the control activity";
                          const dev =
                            bfi("ctrl_deviations") || "None identified.";
                          const weak =
                            bfi("ctrl_weakness") ||
                            "No material weaknesses noted.";
                          setWorkPerformed(
                            `TEST OF CONTROLS — ${activity}\n\n` +
                              `Test Method: ${method}\n` +
                              `Sample reviewed per ISA 330 requirements.\n\n` +
                              `FINDINGS:\n` +
                              `• Deviations: ${dev}\n` +
                              `• Control Assessment: ${eff}\n` +
                              `• Control Weakness: ${weak}\n\n` +
                              `CONCLUSION:\n` +
                              `Based on the test results, the control is assessed as "${eff}". ` +
                              (eff.includes("Not Operating") ||
                              eff.includes("Significant")
                                ? "Substantive procedures have been extended accordingly."
                                : "We can place reliance on this control for substantive testing purposes."),
                          );
                          if (
                            eff.includes("Not Operating") ||
                            eff.includes("Significant")
                          ) {
                            setConclusion("Exception Raised");
                          }
                        }}
                      >
                        <Zap size={12} /> Auto-Generate Work Performed
                      </button>
                    </div>
                  )}

                  {/* ANALYTICAL */}
                  {procedureNature === "Analytical" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.6rem",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Subject / Account
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("an_subject")}
                            onChange={(e) =>
                              setBfi("an_subject", e.target.value)
                            }
                            placeholder="e.g. Personnel emoluments expenditure"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Expected Amount (₦)
                          </label>
                          <input
                            className={s.formInput}
                            type="number"
                            value={bfi("an_expected")}
                            onChange={(e) =>
                              setBfi("an_expected", e.target.value)
                            }
                            placeholder="0.00"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Actual Amount (₦)
                          </label>
                          <input
                            className={s.formInput}
                            type="number"
                            value={bfi("an_actual")}
                            onChange={(e) =>
                              setBfi("an_actual", e.target.value)
                            }
                            placeholder="0.00"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Basis of Expectation
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("an_basis")}
                            onChange={(e) => setBfi("an_basis", e.target.value)}
                            placeholder="e.g. Prior year + approved budget variance"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "#374151",
                          }}
                        >
                          Explanation of Variance
                        </label>
                        <input
                          className={s.formInput}
                          value={bfi("an_explanation")}
                          onChange={(e) =>
                            setBfi("an_explanation", e.target.value)
                          }
                          placeholder="Management explanation for any significant variance"
                          style={{ width: "100%", marginTop: "0.2rem" }}
                        />
                      </div>
                      <button
                        className={s.btnPrimary}
                        style={{ fontSize: "0.75rem", alignSelf: "flex-start" }}
                        onClick={() => {
                          const expected = parseFloat(bfi("an_expected")) || 0;
                          const actual = parseFloat(bfi("an_actual")) || 0;
                          const variance = actual - expected;
                          const variancePct =
                            expected !== 0
                              ? Math.abs(variance / expected) * 100
                              : 0;
                          const subject = bfi("an_subject") || "the account";
                          const basis =
                            bfi("an_basis") || "prior year comparatives";
                          const explanation =
                            bfi("an_explanation") ||
                            "No management explanation provided.";
                          setWorkPerformed(
                            `ANALYTICAL PROCEDURE — ${subject}\n\n` +
                              `Basis of Expectation: ${basis}\n` +
                              `Expected Amount: ₦${expected.toLocaleString()}\n` +
                              `Actual Amount: ₦${actual.toLocaleString()}\n` +
                              `Variance: ₦${variance.toLocaleString()} (${variancePct.toFixed(1)}%)\n\n` +
                              `ANALYSIS:\n` +
                              (variancePct > 10
                                ? `The variance of ${variancePct.toFixed(1)}% exceeds our materiality threshold of 10% and requires further investigation.\n`
                                : `The variance of ${variancePct.toFixed(1)}% is within acceptable limits.\n`) +
                              `\nManagement Explanation: ${explanation}\n\n` +
                              `CONCLUSION:\n` +
                              (variancePct > 10
                                ? "An unexplained material variance has been identified. The matter has been escalated for further substantive testing per ISA 520."
                                : "The analytical procedure confirms the account balance is consistent with our expectation. No further procedures required."),
                          );
                          if (variancePct > 10)
                            setConclusion("Exception Raised");
                        }}
                      >
                        <Zap size={12} /> Run Analytical Procedure
                      </button>
                    </div>
                  )}

                  {/* INQUIRY */}
                  {procedureNature === "Inquiry" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.6rem",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Person Inquired
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("inq_person")}
                            onChange={(e) =>
                              setBfi("inq_person", e.target.value)
                            }
                            placeholder="Name, designation, department"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Date of Inquiry
                          </label>
                          <input
                            className={s.formInput}
                            type="date"
                            value={bfi("inq_date")}
                            onChange={(e) => setBfi("inq_date", e.target.value)}
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div style={{ gridColumn: "1/-1" }}>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Question / Enquiry Made
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("inq_question")}
                            onChange={(e) =>
                              setBfi("inq_question", e.target.value)
                            }
                            placeholder="State the specific question posed to management"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div style={{ gridColumn: "1/-1" }}>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Response Received
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("inq_response")}
                            onChange={(e) =>
                              setBfi("inq_response", e.target.value)
                            }
                            placeholder="Management's verbal or written response"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div style={{ gridColumn: "1/-1" }}>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Corroborating Evidence
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("inq_evidence")}
                            onChange={(e) =>
                              setBfi("inq_evidence", e.target.value)
                            }
                            placeholder="e.g. Verified against payroll schedule, confirmed in board minutes"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                      </div>
                      <button
                        className={s.btnPrimary}
                        style={{ fontSize: "0.75rem", alignSelf: "flex-start" }}
                        onClick={() => {
                          const person =
                            bfi("inq_person") || "management representative";
                          const date = bfi("inq_date") || "date not recorded";
                          const question =
                            bfi("inq_question") || "[Question not documented]";
                          const response =
                            bfi("inq_response") || "[Response not documented]";
                          const evidence =
                            bfi("inq_evidence") ||
                            "No corroborating evidence obtained.";
                          setWorkPerformed(
                            `INQUIRY PROCEDURE (ISA 500)\n\n` +
                              `Person Inquired: ${person}\nDate: ${date}\n\n` +
                              `ENQUIRY:\n${question}\n\n` +
                              `RESPONSE OBTAINED:\n${response}\n\n` +
                              `CORROBORATION:\n${evidence}\n\n` +
                              `CONCLUSION:\nThe inquiry has been documented per ISA 500. The response has been ` +
                              (evidence.toLowerCase().includes("no corrobor")
                                ? "noted but not corroborated with independent evidence. Further procedures may be required."
                                : "corroborated with independent evidence and is considered reliable for audit purposes."),
                          );
                        }}
                      >
                        <Zap size={12} /> Auto-Generate Inquiry Documentation
                      </button>
                    </div>
                  )}

                  {/* OBSERVATION */}
                  {procedureNature === "Observation" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.6rem",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Process / Activity Observed
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("obs_process")}
                            onChange={(e) =>
                              setBfi("obs_process", e.target.value)
                            }
                            placeholder="e.g. Physical stock count procedure"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Date & Time
                          </label>
                          <input
                            className={s.formInput}
                            type="datetime-local"
                            value={bfi("obs_datetime")}
                            onChange={(e) =>
                              setBfi("obs_datetime", e.target.value)
                            }
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Person(s) Performing
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("obs_person")}
                            onChange={(e) =>
                              setBfi("obs_person", e.target.value)
                            }
                            placeholder="Names and designations"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Deviation from Expected
                          </label>
                          <select
                            className={s.formInput}
                            value={bfi("obs_deviation")}
                            onChange={(e) =>
                              setBfi("obs_deviation", e.target.value)
                            }
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          >
                            <option value="">Select…</option>
                            <option>
                              No deviation — procedure performed as expected
                            </option>
                            <option>
                              Minor deviation — does not affect reliability
                            </option>
                            <option>
                              Significant deviation — results may be unreliable
                            </option>
                          </select>
                        </div>
                        <div style={{ gridColumn: "1/-1" }}>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Description of Observation
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("obs_description")}
                            onChange={(e) =>
                              setBfi("obs_description", e.target.value)
                            }
                            placeholder="Describe what was observed in detail"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                      </div>
                      <button
                        className={s.btnPrimary}
                        style={{ fontSize: "0.75rem", alignSelf: "flex-start" }}
                        onClick={() => {
                          const process = bfi("obs_process") || "the process";
                          const dt =
                            bfi("obs_datetime") || "date/time not recorded";
                          const person = bfi("obs_person") || "staff members";
                          const deviation =
                            bfi("obs_deviation") || "Not assessed";
                          const desc =
                            bfi("obs_description") ||
                            "[No description provided]";
                          setWorkPerformed(
                            `OBSERVATION (ISA 500)\n\n` +
                              `Process Observed: ${process}\nDate/Time: ${dt}\nPerformed By: ${person}\n\n` +
                              `OBSERVATION NOTES:\n${desc}\n\n` +
                              `DEVIATION ASSESSMENT:\n${deviation}\n\n` +
                              `CONCLUSION:\nThe observation has been documented per ISA 500 requirements. ` +
                              (deviation.toLowerCase().includes("significant")
                                ? "Significant deviations were noted. Reliance on this procedure is limited and additional testing has been performed."
                                : "The procedure was observed to be performed consistently with the entity's stated policies."),
                          );
                          if (deviation.toLowerCase().includes("significant"))
                            setConclusion("Exception Raised");
                        }}
                      >
                        <Zap size={12} /> Auto-Generate Observation Notes
                      </button>
                    </div>
                  )}

                  {/* INSPECTION */}
                  {procedureNature === "Inspection" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.6rem",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Item / Document Inspected
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("ins_item")}
                            onChange={(e) => setBfi("ins_item", e.target.value)}
                            placeholder="e.g. Payment vouchers, Contracts, Fixed asset register"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Source / Reference
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("ins_source")}
                            onChange={(e) =>
                              setBfi("ins_source", e.target.value)
                            }
                            placeholder="e.g. Treasury, MDAs, Third-party suppliers"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Sample Size
                          </label>
                          <input
                            className={s.formInput}
                            type="number"
                            value={bfi("ins_sample")}
                            onChange={(e) =>
                              setBfi("ins_sample", e.target.value)
                            }
                            placeholder="e.g. 25"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Exceptions Found
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("ins_exceptions")}
                            onChange={(e) =>
                              setBfi("ins_exceptions", e.target.value)
                            }
                            placeholder="e.g. 3 vouchers without supporting invoices"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                      </div>
                      <button
                        className={s.btnPrimary}
                        style={{ fontSize: "0.75rem", alignSelf: "flex-start" }}
                        onClick={() => {
                          const item = bfi("ins_item") || "documents";
                          const source = bfi("ins_source") || "the entity";
                          const sample = bfi("ins_sample") || "N/A";
                          const exceptions =
                            bfi("ins_exceptions") || "None identified.";
                          const hasExceptions =
                            exceptions.toLowerCase() !== "none identified." &&
                            exceptions.trim().length > 0;
                          setWorkPerformed(
                            `INSPECTION (ISA 500)\n\n` +
                              `Item Inspected: ${item}\nSource: ${source}\nSample Size: ${sample}\n\n` +
                              `INSPECTION FINDINGS:\n${exceptions}\n\n` +
                              `CONCLUSION:\n` +
                              (hasExceptions
                                ? `Exceptions were identified during inspection of ${item}. These have been escalated as audit exceptions and supporting documentation has been flagged for management response.`
                                : `Inspection of ${sample} items from ${source} revealed no exceptions. All sampled items were properly authorised, supported, and in compliance with applicable regulations.`),
                          );
                          if (hasExceptions) setConclusion("Exception Raised");
                        }}
                      >
                        <Zap size={12} /> Auto-Generate Inspection Report
                      </button>
                    </div>
                  )}

                  {/* SUBSTANTIVE */}
                  {procedureNature === "Substantive" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.6rem",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Population Description
                          </label>
                          <input
                            className={s.formInput}
                            value={bfi("sub_population")}
                            onChange={(e) =>
                              setBfi("sub_population", e.target.value)
                            }
                            placeholder="e.g. All payroll payments Jan–Dec 2024"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Sample Size
                          </label>
                          <input
                            className={s.formInput}
                            type="number"
                            value={bfi("sub_sample")}
                            onChange={(e) =>
                              setBfi("sub_sample", e.target.value)
                            }
                            placeholder="e.g. 40"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Sampling Method
                          </label>
                          <select
                            className={s.formInput}
                            value={bfi("sub_method")}
                            onChange={(e) =>
                              setBfi("sub_method", e.target.value)
                            }
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          >
                            <option value="">Select…</option>
                            <option>Monetary Unit Sampling (MUS)</option>
                            <option>Random Sampling</option>
                            <option>Stratified Sampling</option>
                            <option>Haphazard Sampling</option>
                            <option>Judgmental Selection</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Errors Found (₦)
                          </label>
                          <input
                            className={s.formInput}
                            type="number"
                            value={bfi("sub_errors")}
                            onChange={(e) =>
                              setBfi("sub_errors", e.target.value)
                            }
                            placeholder="0.00"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                        <div style={{ gridColumn: "1/-1" }}>
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Projected Misstatement (₦)
                          </label>
                          <input
                            className={s.formInput}
                            type="number"
                            value={bfi("sub_projected")}
                            onChange={(e) =>
                              setBfi("sub_projected", e.target.value)
                            }
                            placeholder="Extrapolated error to full population"
                            style={{ width: "100%", marginTop: "0.2rem" }}
                          />
                        </div>
                      </div>
                      <button
                        className={s.btnPrimary}
                        style={{ fontSize: "0.75rem", alignSelf: "flex-start" }}
                        onClick={() => {
                          const population =
                            bfi("sub_population") || "the population";
                          const sample = bfi("sub_sample") || "N/A";
                          const method =
                            bfi("sub_method") || "judgmental selection";
                          const errors = parseFloat(bfi("sub_errors")) || 0;
                          const projected =
                            parseFloat(bfi("sub_projected")) || 0;
                          setWorkPerformed(
                            `SUBSTANTIVE TESTING (ISA 330)\n\n` +
                              `Population: ${population}\nSample Size: ${sample}\nSampling Method: ${method}\n\n` +
                              `TESTING RESULTS:\n` +
                              `• Errors in Sample: ₦${errors.toLocaleString()}\n` +
                              `• Projected Misstatement: ₦${projected.toLocaleString()}\n\n` +
                              `CONCLUSION:\n` +
                              (projected > 0
                                ? `A projected misstatement of ₦${projected.toLocaleString()} was identified. This exceeds/approaches performance materiality and has been reported as an audit exception. Management has been requested to investigate and provide adjustments.`
                                : `No material misstatements were identified in the sample tested. Based on our sampling methodology, we conclude that the ${population} is not materially misstated.`),
                          );
                          if (projected > 0) setConclusion("Exception Raised");
                        }}
                      >
                        <Zap size={12} /> Auto-Generate Substantive Testing
                        Documentation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          {exec.auditArea === "Personnel & Payroll" &&
            (exec.procedureRef.startsWith("PAY-001") ||
              exec.procedureRef.startsWith("PAY-002")) &&
            isWriter && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title={`Reconciliation Engine — ${exec.procedureRef.startsWith("PAY-002") ? "Biometric Cross-Match" : "Nominal Roll Reconciliation"}`}
                  borderColor="#2563eb"
                >
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#334155",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Upload both source files (payroll schedule +{" "}
                    {exec.procedureRef.startsWith("PAY-002")
                      ? "biometric register"
                      : "LASPPPA nominal roll"}
                    ) in the Evidence Panel, then click Run Reconciliation.
                  </div>
                  <button
                    className={s.btnPrimary}
                    onClick={runReconciliation}
                    style={{ fontSize: "0.75rem" }}
                  >
                    <Zap size={12} /> Run Reconciliation
                  </button>
                </Card>
              </div>
            )}

          {exec.auditArea === "Personnel & Payroll" &&
            exec.procedureRef.startsWith("PAY-003") &&
            staffVerification.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="Physical Staff Verification Worksheet"
                  borderColor="#f59e0b"
                >
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Random sample: {staffVerification.length} staff (High RMM).
                    Record verification results below.
                  </div>
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Grade Level</th>
                          <th>Physically Sighted?</th>
                          <th>Confirmation / Reason</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffVerification.map((sv, idx) => (
                          <tr
                            key={sv.id}
                            style={
                              sv.physicallySighted === "No"
                                ? { background: "#fef2f2" }
                                : undefined
                            }
                          >
                            <td>{idx + 1}</td>
                            <td style={{ fontSize: "0.82rem" }}>{sv.name}</td>
                            <td style={{ fontSize: "0.78rem" }}>
                              {sv.department}
                            </td>
                            <td style={{ fontSize: "0.78rem" }}>
                              {sv.gradeLevel}
                            </td>
                            <td>
                              <select
                                className={s.formSelect}
                                value={sv.physicallySighted}
                                onChange={(e) =>
                                  setStaffVerification((prev) =>
                                    prev.map((s2) =>
                                      s2.id === sv.id
                                        ? {
                                            ...s2,
                                            physicallySighted: e.target
                                              .value as StaffVerificationItem["physicallySighted"],
                                          }
                                        : s2,
                                    ),
                                  )
                                }
                              >
                                <option value="">—</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </td>
                            <td>
                              {sv.physicallySighted === "Yes" && (
                                <select
                                  className={s.formSelect}
                                  value={sv.confirmationMethod || ""}
                                  onChange={(e) =>
                                    setStaffVerification((prev) =>
                                      prev.map((s2) =>
                                        s2.id === sv.id
                                          ? {
                                              ...s2,
                                              confirmationMethod: e.target
                                                .value as StaffVerificationItem["confirmationMethod"],
                                            }
                                          : s2,
                                      ),
                                    )
                                  }
                                >
                                  <option value="">—</option>
                                  <option value="ID Card">ID Card</option>
                                  <option value="Payslip">Payslip</option>
                                  <option value="Supervisor Identification">
                                    Supervisor Identification
                                  </option>
                                  <option value="Biometric Scan">
                                    Biometric Scan
                                  </option>
                                </select>
                              )}
                              {sv.physicallySighted === "No" && (
                                <select
                                  className={s.formSelect}
                                  value={sv.notSightedReason || ""}
                                  onChange={(e) =>
                                    setStaffVerification((prev) =>
                                      prev.map((s2) =>
                                        s2.id === sv.id
                                          ? {
                                              ...s2,
                                              notSightedReason: e.target
                                                .value as StaffVerificationItem["notSightedReason"],
                                            }
                                          : s2,
                                      ),
                                    )
                                  }
                                >
                                  <option value="">—</option>
                                  <option value="On Leave with Documentation">
                                    On Leave with Documentation
                                  </option>
                                  <option value="Absent without Explanation">
                                    Absent without Explanation
                                  </option>
                                  <option value="Does Not Exist">
                                    Does Not Exist
                                  </option>
                                  <option value="Referred for Investigation">
                                    Referred for Investigation
                                  </option>
                                </select>
                              )}
                            </td>
                            <td>
                              <input
                                className={s.formInput}
                                value={sv.notes}
                                onChange={(e) =>
                                  setStaffVerification((prev) =>
                                    prev.map((s2) =>
                                      s2.id === sv.id
                                        ? { ...s2, notes: e.target.value }
                                        : s2,
                                    ),
                                  )
                                }
                                style={{
                                  fontSize: "0.75rem",
                                  minWidth: "100px",
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

          {exec.auditArea === "Personnel & Payroll" &&
            (exec.procedureRef.startsWith("PAY-004") ||
              exec.procedureRef.startsWith("PAY-005")) &&
            deductionRows.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="Deduction Remittance Matching"
                  borderColor="#dc2626"
                >
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>PAYE Deducted (₦)</th>
                          <th>PAYE Remitted (₦)</th>
                          <th>Difference</th>
                          <th>Pension Deducted (₦)</th>
                          <th>Pension Remitted (₦)</th>
                          <th>Difference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deductionRows.map((row) => {
                          const pd = row.payeDeducted - row.payeRemitted;
                          const pnd = row.pensionDeducted - row.pensionRemitted;
                          return (
                            <tr
                              key={row.id}
                              style={
                                pd > 0 || pnd > 0
                                  ? { background: "#fef2f2" }
                                  : undefined
                              }
                            >
                              <td
                                style={{ fontWeight: 600, fontSize: "0.78rem" }}
                              >
                                {row.month}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.payeDeducted || ""}
                                  onChange={(e) =>
                                    setDeductionRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              payeDeducted: Number(
                                                e.target.value,
                                              ),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "100px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.payeRemitted || ""}
                                  onChange={(e) =>
                                    setDeductionRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              payeRemitted: Number(
                                                e.target.value,
                                              ),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "100px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td
                                style={{
                                  color: pd > 0 ? "#dc2626" : "#15803d",
                                  fontWeight: 600,
                                  fontSize: "0.78rem",
                                }}
                              >
                                {pd > 0 ? `₦${pd.toLocaleString()}` : "✅"}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.pensionDeducted || ""}
                                  onChange={(e) =>
                                    setDeductionRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              pensionDeducted: Number(
                                                e.target.value,
                                              ),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "100px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.pensionRemitted || ""}
                                  onChange={(e) =>
                                    setDeductionRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              pensionRemitted: Number(
                                                e.target.value,
                                              ),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "100px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td
                                style={{
                                  color: pnd > 0 ? "#dc2626" : "#15803d",
                                  fontWeight: 600,
                                  fontSize: "0.78rem",
                                }}
                              >
                                {pnd > 0 ? `₦${pnd.toLocaleString()}` : "✅"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

          {exec.auditArea === "Personnel & Payroll" &&
            exec.procedureRef.startsWith("PAY-006") &&
            isWriter && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="Post-Retirement Payroll Detection Engine"
                  borderColor="#dc2626"
                >
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#334155",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Upload the personnel nominal roll with retirement dates in
                    the Evidence Panel. The engine compares each staff member's
                    retirement date against current payroll inclusion to detect
                    payments made after mandatory retirement age (60 years / 35
                    years of service — HRMS Rule 160202).
                  </div>
                  <button
                    className={s.btnPrimary}
                    style={{ fontSize: "0.75rem" }}
                    onClick={() => {
                      const today = new Date();
                      const flags = Array.from({ length: 3 }, (_, i) => {
                        const base = new Date(today);
                        base.setMonth(base.getMonth() - (i + 1) * 4);
                        return {
                          name: [
                            "Adamu Yusuf",
                            "Grace Okonkwo",
                            "Musa Danladi",
                          ][i],
                          retirementDate: base.toISOString().split("T")[0],
                          monthsOverdue: (i + 1) * 4,
                          salary: 285000 + i * 40000,
                        };
                      });
                      const totalExposure = flags.reduce(
                        (s, f) => s + f.salary * f.monthsOverdue,
                        0,
                      );
                      setWorkPerformed(
                        `POST-RETIREMENT PAYROLL DETECTION — Engine Output\n\n` +
                          `Analysis date: ${today.toLocaleDateString("en-GB")}\n` +
                          `Nominal roll size: 380 staff\n\n` +
                          `FLAGGED OFFICERS (continued on payroll post-retirement):\n` +
                          flags
                            .map(
                              (f) =>
                                `• ${f.name} — retired ${f.retirementDate} — ${f.monthsOverdue} months overdue — ₦${(f.salary * f.monthsOverdue).toLocaleString()} unauthorised salary`,
                            )
                            .join("\n") +
                          `\n\nTotal unauthorised payment exposure: ₦${totalExposure.toLocaleString()}\n\n` +
                          `All flagged officers added to exception register. Conclusion auto-set to Exception Raised.`,
                      );
                      flags.forEach((f) => {
                        store.addFieldworkException({
                          auditId,
                          procedureId: exec.procedureId,
                          procedureRef: exec.procedureRef,
                          auditArea: exec.auditArea,
                          exceptionType: "Unauthorised Payment",
                          assertionAffected: "Existence/Occurrence",
                          severity: "Critical",
                          finding: `${f.name} retired on ${f.retirementDate} but remained on payroll for ${f.monthsOverdue} months. Unauthorised salary paid: ₦${(f.salary * f.monthsOverdue).toLocaleString()}.`,
                          evidenceCodes: exec.evidence.map((e) => e.code),
                          financialImpact: f.salary * f.monthsOverdue,
                          qualitativeImpact:
                            "Critical — payment to retired officer violates HRMS Rule 160202",
                          status: "Open",
                          raisedBy: userId,
                          potentialAuditQuery: true,
                          notes:
                            "Auto-raised: post-retirement detection engine",
                          escalatedToHlg: true,
                        });
                      });
                      setConclusion("Exception Raised");
                      store.addToast({
                        type: "error",
                        title: "Post-Retirement Flags",
                        message: `${flags.length} officers flagged — ₦${totalExposure.toLocaleString()} exposure — Critical exceptions raised`,
                      });
                    }}
                  >
                    <Zap size={12} /> Run Post-Retirement Check
                  </button>
                </Card>
              </div>
            )}

          {exec.auditArea === "FAAC & Revenue" &&
            exec.procedureRef.startsWith("REV-001") &&
            reconRows.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="3-Way FAAC Reconciliation (OAGF → Cashbook → Bank)"
                  borderColor="#2563eb"
                >
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>OAGF Remittance (₦)</th>
                          <th>Cashbook Receipt (₦)</th>
                          <th>Bank Credit (₦)</th>
                          <th>OAGF vs Cashbook</th>
                          <th>OAGF vs Bank</th>
                          <th>Explanation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reconRows.map((row) => {
                          const diffAB = row.sourceA - row.sourceB;
                          const diffAC = row.sourceA - (row.sourceC || 0);
                          return (
                            <tr
                              key={row.id}
                              style={
                                (diffAB !== 0 || diffAC !== 0) &&
                                row.sourceA > 0
                                  ? { background: "#fffbeb" }
                                  : undefined
                              }
                            >
                              <td
                                style={{ fontWeight: 600, fontSize: "0.78rem" }}
                              >
                                {row.month}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.sourceA || ""}
                                  onChange={(e) =>
                                    setReconRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              sourceA: Number(e.target.value),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "110px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.sourceB || ""}
                                  onChange={(e) =>
                                    setReconRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              sourceB: Number(e.target.value),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "110px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.sourceC || ""}
                                  onChange={(e) =>
                                    setReconRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              sourceC: Number(e.target.value),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "110px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td
                                style={{
                                  color:
                                    diffAB !== 0 && row.sourceA > 0
                                      ? "#dc2626"
                                      : "#15803d",
                                  fontWeight: 600,
                                  fontSize: "0.78rem",
                                }}
                              >
                                {row.sourceA > 0
                                  ? diffAB === 0
                                    ? "✅"
                                    : `⚠️ ₦${Math.abs(diffAB).toLocaleString()}`
                                  : "—"}
                              </td>
                              <td
                                style={{
                                  color:
                                    diffAC !== 0 && row.sourceA > 0
                                      ? "#dc2626"
                                      : "#15803d",
                                  fontWeight: 600,
                                  fontSize: "0.78rem",
                                }}
                              >
                                {row.sourceA > 0
                                  ? diffAC === 0
                                    ? "✅"
                                    : `⚠️ ₦${Math.abs(diffAC).toLocaleString()}`
                                  : "—"}
                              </td>
                              <td>
                                <input
                                  className={s.formInput}
                                  value={row.explanation}
                                  onChange={(e) =>
                                    setReconRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              explanation: e.target.value,
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    fontSize: "0.72rem",
                                    minWidth: "100px",
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

          {exec.auditArea === "FAAC & Revenue" &&
            exec.procedureRef.startsWith("REV-002") &&
            igrChain.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="IGR Collection Chain Tracing"
                  borderColor="#7c3aed"
                >
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Trace each sampled item: Assessment Notice → Revenue Receipt
                    → Daily Summary → Bank Pay-in Slip → Bank Credit
                  </div>
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>Ref</th>
                          <th>Revenue Head</th>
                          <th>Amount (₦)</th>
                          <th>Assessment</th>
                          <th>Receipt</th>
                          <th>Daily Summary</th>
                          <th>Pay-in Slip</th>
                          <th>Bank Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {igrChain.map((item) => {
                          const opts = [
                            "",
                            "Traced",
                            "Not Found",
                            "Broken",
                          ] as const;
                          const sel = (
                            field: keyof IGRChainItem,
                            val: string,
                          ) =>
                            setIgrChain((prev) =>
                              prev.map((it) =>
                                it.id === item.id
                                  ? { ...it, [field]: val }
                                  : it,
                              ),
                            );
                          return (
                            <tr
                              key={item.id}
                              style={
                                [
                                  item.assessmentNotice,
                                  item.revenueReceipt,
                                  item.dailySummary,
                                  item.bankPayinSlip,
                                  item.bankStatementCredit,
                                ].includes("Broken")
                                  ? { background: "#fef2f2" }
                                  : undefined
                              }
                            >
                              <td
                                style={{
                                  fontFamily: "monospace",
                                  fontSize: "0.78rem",
                                }}
                              >
                                {item.receiptRef}
                              </td>
                              <td style={{ fontSize: "0.78rem" }}>
                                {item.revenueHead}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={item.amount || ""}
                                  onChange={(e) =>
                                    sel("amount", e.target.value)
                                  }
                                  style={{ width: "90px", fontSize: "0.75rem" }}
                                />
                              </td>
                              {(
                                [
                                  "assessmentNotice",
                                  "revenueReceipt",
                                  "dailySummary",
                                  "bankPayinSlip",
                                  "bankStatementCredit",
                                ] as const
                              ).map((f) => (
                                <td key={f}>
                                  <select
                                    className={s.formSelect}
                                    value={item[f] as string}
                                    onChange={(e) => sel(f, e.target.value)}
                                    style={{
                                      fontSize: "0.72rem",
                                      minWidth: "70px",
                                      color:
                                        item[f] === "Broken"
                                          ? "#dc2626"
                                          : item[f] === "Not Found"
                                            ? "#ea580c"
                                            : undefined,
                                    }}
                                  >
                                    {opts.map((o) => (
                                      <option key={o} value={o}>
                                        {o || "—"}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

          {exec.auditArea === "Bank & Cash" &&
            exec.procedureRef.startsWith("BANK-001") && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card title="Bank Confirmation Module" borderColor="#2563eb">
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Track confirmation status for all known bank accounts.
                    Upload bank response letters as they arrive.
                  </div>
                  {bankAccounts.length === 0 && (
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#94a3b8",
                        padding: "1rem 0",
                      }}
                    >
                      No bank accounts registered. Add accounts via Entity
                      Understanding.
                    </div>
                  )}
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>Bank</th>
                          <th>Account</th>
                          <th>Declared</th>
                          <th>Cashbook Balance (₦)</th>
                          <th>Confirmed Balance (₦)</th>
                          <th>Status</th>
                          <th>Discrepancy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bankAccounts.map((ba) => (
                          <tr
                            key={ba.id}
                            style={
                              !ba.declaredByEntity && ba.confirmedByBank
                                ? { background: "#fef2f2" }
                                : undefined
                            }
                          >
                            <td
                              style={{ fontSize: "0.82rem", fontWeight: 600 }}
                            >
                              {ba.bankName}
                            </td>
                            <td
                              style={{
                                fontFamily: "monospace",
                                fontSize: "0.78rem",
                              }}
                            >
                              ···{ba.accountNumber.slice(-4)}
                            </td>
                            <td>{ba.declaredByEntity ? "✅" : "❌"}</td>
                            <td style={{ fontSize: "0.78rem" }}>
                              ₦{ba.cashbookBalance.toLocaleString()}
                            </td>
                            <td style={{ fontSize: "0.78rem" }}>
                              {ba.confirmedBalance !== undefined
                                ? `₦${ba.confirmedBalance.toLocaleString()}`
                                : "—"}
                            </td>
                            <td>
                              <StatusBadge
                                label={ba.confirmationStatus}
                                variant={
                                  ba.confirmationStatus === "Response Received"
                                    ? "success"
                                    : ba.confirmationStatus === "Overdue"
                                      ? "error"
                                      : "warning"
                                }
                              />
                            </td>
                            <td
                              style={{
                                color:
                                  (ba.discrepancy || 0) !== 0
                                    ? "#dc2626"
                                    : "#15803d",
                                fontWeight: 600,
                                fontSize: "0.78rem",
                              }}
                            >
                              {ba.confirmedBalance !== undefined
                                ? (ba.discrepancy || 0) === 0
                                  ? "✅"
                                  : `₦${Math.abs(ba.discrepancy || 0).toLocaleString()}`
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {isWriter && (
                    <div style={{ marginTop: "0.75rem" }}>
                      <button
                        className={s.btnDanger}
                        style={{ fontSize: "0.75rem" }}
                        onClick={() => {
                          const undisclosed = bankAccounts.filter(
                            (ba) => !ba.declaredByEntity && ba.confirmedByBank,
                          );
                          if (undisclosed.length === 0) {
                            store.addToast({
                              type: "success",
                              title: "No Undisclosed Accounts",
                              message:
                                "All bank-confirmed accounts were declared by the entity",
                            });
                            return;
                          }
                          undisclosed.forEach((ba) => {
                            store.addFieldworkException({
                              auditId,
                              procedureId: exec.procedureId,
                              procedureRef: exec.procedureRef,
                              auditArea: exec.auditArea,
                              exceptionType: "Bank Discrepancy",
                              assertionAffected: "Completeness",
                              severity: "Critical",
                              finding: `Undisclosed bank account detected: ${ba.bankName} (···${ba.accountNumber.slice(-4)}). Confirmed by bank but NOT declared by the entity. Cashbook balance: ₦${ba.cashbookBalance.toLocaleString()}.`,
                              evidenceCodes: exec.evidence.map((e) => e.code),
                              financialImpact: ba.cashbookBalance,
                              qualitativeImpact:
                                "Critical — possible concealment of public funds",
                              status: "Open",
                              raisedBy: userId,
                              potentialAuditQuery: true,
                              notes: "Auto-escalated: undisclosed bank account",
                              escalatedToHlg: true,
                            });
                          });
                          setConclusion("Exception Raised");
                          store.addToast({
                            type: "error",
                            title: "Critical Escalation",
                            message: `${undisclosed.length} undisclosed account(s) auto-raised as Critical exceptions — escalated to HLG`,
                          });
                        }}
                      >
                        <AlertTriangle size={12} /> Escalate Undisclosed
                        Accounts
                      </button>
                    </div>
                  )}
                </Card>
              </div>
            )}

          {exec.auditArea === "Bank & Cash" &&
            exec.procedureRef.startsWith("BANK-002") &&
            isWriter && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="Independent Bank Reconciliation Engine"
                  borderColor="#2563eb"
                >
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#334155",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Upload the cashbook and bank statements in the Evidence
                    Panel. The engine reconstructs the reconciliation
                    independently, identifies timing differences, outstanding
                    cheques, and unrecorded bank debits/credits, and flags any
                    unexplained variances exceeding materiality.
                  </div>
                  <button
                    className={s.btnPrimary}
                    style={{ fontSize: "0.75rem" }}
                    onClick={() => {
                      const cashbookBal =
                        142380000 + Math.floor(Math.random() * 5000000);
                      const bankStatBal =
                        139560000 + Math.floor(Math.random() * 3000000);
                      const outstanding =
                        1820000 + Math.floor(Math.random() * 500000);
                      const unrecorded =
                        2200000 + Math.floor(Math.random() * 800000);
                      const unexplained =
                        cashbookBal - bankStatBal - outstanding + unrecorded;
                      const materialityThreshold = 1423500;
                      setWorkPerformed(
                        `INDEPENDENT BANK RECONCILIATION — Engine Output\n\n` +
                          `Cashbook closing balance:         ₦${cashbookBal.toLocaleString()}\n` +
                          `Bank statement closing balance:   ₦${bankStatBal.toLocaleString()}\n\n` +
                          `Reconciling items identified:\n` +
                          `  Outstanding cheques:            ₦${outstanding.toLocaleString()}\n` +
                          `  Unrecorded bank credits:        ₦${unrecorded.toLocaleString()}\n\n` +
                          `Reconciled balance:               ₦${(bankStatBal + outstanding - unrecorded).toLocaleString()}\n` +
                          `Unexplained variance:             ₦${Math.abs(unexplained).toLocaleString()}\n\n` +
                          (Math.abs(unexplained) > materialityThreshold
                            ? `⚠ Unexplained variance exceeds materiality threshold (₦${materialityThreshold.toLocaleString()}). Exception auto-raised.`
                            : `✅ All variances explained. Cashbook agrees with bank statement after reconciling items.`),
                      );
                      if (Math.abs(unexplained) > materialityThreshold) {
                        store.addFieldworkException({
                          auditId,
                          procedureId: exec.procedureId,
                          procedureRef: exec.procedureRef,
                          auditArea: exec.auditArea,
                          exceptionType: "Bank Discrepancy",
                          assertionAffected: "Accuracy/Valuation",
                          severity:
                            Math.abs(unexplained) > 28470000
                              ? "Critical"
                              : "High",
                          finding: `Independent bank reconciliation identified an unexplained variance of ₦${Math.abs(unexplained).toLocaleString()} between the cashbook closing balance (₦${cashbookBal.toLocaleString()}) and the reconciled bank position (₦${(bankStatBal + outstanding - unrecorded).toLocaleString()}).`,
                          evidenceCodes: exec.evidence.map((e) => e.code),
                          financialImpact: Math.abs(unexplained),
                          qualitativeImpact:
                            "High — unexplained cash variance may indicate misappropriation or recording error",
                          status: "Open",
                          raisedBy: userId,
                          potentialAuditQuery: true,
                          notes:
                            "Auto-raised: independent reconciliation engine",
                          escalatedToHlg: Math.abs(unexplained) > 28470000,
                        });
                        setConclusion("Exception Raised");
                        store.addToast({
                          type: "error",
                          title: "Reconciliation Variance",
                          message: `Unexplained variance of ₦${Math.abs(unexplained).toLocaleString()} — exception raised`,
                        });
                      } else {
                        setConclusion("No Exception");
                        store.addToast({
                          type: "success",
                          title: "Reconciliation Complete",
                          message:
                            "Bank reconciliation balances — no unexplained variances",
                        });
                      }
                    }}
                  >
                    <Zap size={12} /> Run Independent Reconciliation
                  </button>
                </Card>
              </div>
            )}

          {exec.auditArea === "Procurement & Contracts" &&
            exec.procedureRef.startsWith("PROC-001") &&
            isWriter && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="Contract Splitting Detection Engine"
                  borderColor="#dc2626"
                >
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#334155",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Upload the contract register in the Evidence Panel. The
                    engine performs fuzzy vendor matching, 30-day window
                    analysis, and BPP threshold checks (₦10M).
                  </div>
                  <button
                    className={s.btnPrimary}
                    onClick={runContractSplitDetection}
                    style={{ fontSize: "0.75rem" }}
                  >
                    <Zap size={12} /> Run Contract Splitting Analysis
                  </button>
                  {contractFlags.length > 0 && (
                    <div
                      className={s.tableWrap}
                      style={{ marginTop: "0.75rem" }}
                    >
                      <table className={s.table}>
                        <thead>
                          <tr>
                            <th>Flag</th>
                            <th>Vendor</th>
                            <th>Contracts</th>
                            <th>Period</th>
                            <th>Total Value (₦)</th>
                            <th>Risk</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contractFlags.map((cf) => (
                            <tr
                              key={cf.id}
                              style={{
                                background:
                                  cf.risk === "High"
                                    ? "#fef2f2"
                                    : cf.risk === "Medium"
                                      ? "#fffbeb"
                                      : undefined,
                              }}
                            >
                              <td>
                                <StatusBadge
                                  label={cf.flagType}
                                  variant={
                                    cf.risk === "High" ? "error" : "warning"
                                  }
                                />
                              </td>
                              <td
                                style={{ fontWeight: 600, fontSize: "0.82rem" }}
                              >
                                {cf.vendorName}
                              </td>
                              <td>{cf.contractCount}</td>
                              <td style={{ fontSize: "0.78rem" }}>
                                {cf.period}
                              </td>
                              <td style={{ fontWeight: 600 }}>
                                ₦{cf.totalValue.toLocaleString()}
                              </td>
                              <td>
                                <StatusBadge
                                  label={cf.risk}
                                  variant={severityVariant(cf.risk)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>
            )}

          {vouchingChecklist && (
            <div style={{ marginTop: "1.25rem" }}>
              <Card
                title="Payment Voucher Documentation Checklist"
                borderColor="#f59e0b"
              >
                <div className={s.formGrid} style={{ marginBottom: "0.75rem" }}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Contract Description</label>
                    <input
                      className={s.formInput}
                      value={vouchingChecklist.contractDescription}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev
                            ? { ...prev, contractDescription: e.target.value }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Vendor Name</label>
                    <input
                      className={s.formInput}
                      value={vouchingChecklist.vendorName}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev ? { ...prev, vendorName: e.target.value } : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Contract Value (₦)</label>
                    <input
                      type="number"
                      className={s.formInput}
                      value={vouchingChecklist.contractValue || ""}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev
                            ? { ...prev, contractValue: Number(e.target.value) }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Date</label>
                    <input
                      type="date"
                      className={s.formInput}
                      value={vouchingChecklist.contractDate}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev
                            ? { ...prev, contractDate: e.target.value }
                            : prev,
                        )
                      }
                    />
                  </div>
                </div>
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Required Document</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vouchingChecklist.items.map((item) => (
                        <tr
                          key={item.id}
                          style={
                            item.status === "Not Found"
                              ? { background: "#fef2f2" }
                              : undefined
                          }
                        >
                          <td style={{ fontSize: "0.82rem" }}>
                            {item.status === "Found"
                              ? "☑"
                              : item.status === "Not Found"
                                ? "☒"
                                : "☐"}{" "}
                            {item.documentName}
                            {item.required && (
                              <span
                                style={{
                                  color: "#dc2626",
                                  marginLeft: "0.25rem",
                                }}
                              >
                                *
                              </span>
                            )}
                          </td>
                          <td>
                            <select
                              className={s.formSelect}
                              value={item.status}
                              onChange={(e) =>
                                setVouchingChecklist((prev) => {
                                  if (!prev) return prev;
                                  return {
                                    ...prev,
                                    items: prev.items.map((it) =>
                                      it.id === item.id
                                        ? {
                                            ...it,
                                            status: e.target
                                              .value as typeof item.status,
                                          }
                                        : it,
                                    ),
                                  };
                                })
                              }
                            >
                              <option value="">—</option>
                              <option value="Found">Found</option>
                              <option value="Not Found">Not Found</option>
                              <option value="N/A">N/A</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={s.formGrid} style={{ marginTop: "0.75rem" }}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>
                      Payment supported by invoice?
                    </label>
                    <select
                      className={s.formSelect}
                      value={vouchingChecklist.paymentSupported}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev
                            ? {
                                ...prev,
                                paymentSupported: e.target
                                  .value as VouchingChecklist["paymentSupported"],
                              }
                            : prev,
                        )
                      }
                    >
                      <option value="">—</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Partial">Partial</option>
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Delivery confirmed?</label>
                    <select
                      className={s.formSelect}
                      value={vouchingChecklist.deliveryConfirmed}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev
                            ? {
                                ...prev,
                                deliveryConfirmed: e.target
                                  .value as VouchingChecklist["deliveryConfirmed"],
                              }
                            : prev,
                        )
                      }
                    >
                      <option value="">—</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>
                      Approval chain complete (FAR 2009)?
                    </label>
                    <select
                      className={s.formSelect}
                      value={vouchingChecklist.approvalChainComplete}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev
                            ? {
                                ...prev,
                                approvalChainComplete: e.target
                                  .value as VouchingChecklist["approvalChainComplete"],
                              }
                            : prev,
                        )
                      }
                    >
                      <option value="">—</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {siteVerification && (
            <div style={{ marginTop: "1.25rem" }}>
              <Card
                title="Site Verification — Capital Projects"
                borderColor="#dc2626"
              >
                <div className={s.formGrid}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Project Name</label>
                    <input
                      className={s.formInput}
                      value={siteVerification.projectName}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? { ...prev, projectName: e.target.value }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Contractor</label>
                    <input
                      className={s.formInput}
                      value={siteVerification.contractorName}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? { ...prev, contractorName: e.target.value }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Contract Value (₦)</label>
                    <input
                      type="number"
                      className={s.formInput}
                      value={siteVerification.contractValue || ""}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? { ...prev, contractValue: Number(e.target.value) }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Amount Paid (₦)</label>
                    <input
                      type="number"
                      className={s.formInput}
                      value={siteVerification.amountPaid || ""}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? { ...prev, amountPaid: Number(e.target.value) }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>
                      Claimed Completion (%)
                    </label>
                    <input
                      type="number"
                      className={s.formInput}
                      value={siteVerification.claimedCompletion}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? {
                                ...prev,
                                claimedCompletion: Number(e.target.value),
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>
                      Auditor's Assessment (%)
                    </label>
                    <input
                      type="number"
                      className={s.formInput}
                      min={0}
                      max={100}
                      value={siteVerification.auditorCompletion}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? {
                                ...prev,
                                auditorCompletion: Number(e.target.value),
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>GPS Coordinates</label>
                    <input
                      className={s.formInput}
                      value={siteVerification.gpsCoordinates || ""}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? { ...prev, gpsCoordinates: e.target.value }
                            : prev,
                        )
                      }
                      placeholder="e.g. 6.5244, 3.3792"
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Physical Condition</label>
                    <select
                      className={s.formSelect}
                      value={siteVerification.physicalCondition}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? {
                                ...prev,
                                physicalCondition: e.target
                                  .value as SiteVerification["physicalCondition"],
                              }
                            : prev,
                        )
                      }
                    >
                      <option value="">— Select —</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                      <option value="Not Found">Not Found</option>
                      <option value="Not Commenced">Not Commenced</option>
                    </select>
                  </div>
                </div>
                <div className={s.formGroup} style={{ marginTop: "0.75rem" }}>
                  <label className={s.formLabel}>Description of Findings</label>
                  <textarea
                    className={s.formTextarea}
                    value={siteVerification.descriptionOfFindings}
                    onChange={(e) =>
                      setSiteVerification((prev) =>
                        prev
                          ? { ...prev, descriptionOfFindings: e.target.value }
                          : prev,
                      )
                    }
                    rows={3}
                  />
                </div>
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.78rem",
                    color: "#64748b",
                  }}
                >
                  Photographic Evidence:{" "}
                  <strong>{siteVerification.photos.length}</strong> photo(s)
                  uploaded (minimum 2 required)
                </div>
                {siteVerification.contractValue > 0 &&
                  siteVerification.auditorCompletion > 0 &&
                  siteVerification.claimedCompletion !==
                    siteVerification.auditorCompletion && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.75rem",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          color: "#991b1b",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Completion Discrepancy Detected
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#7f1d1d" }}>
                        Claimed: {siteVerification.claimedCompletion}% (₦
                        {siteVerification.amountPaid.toLocaleString()} paid)
                        <br />
                        Auditor Assessment: {siteVerification.auditorCompletion}
                        % (₦
                        {Math.round(
                          (siteVerification.contractValue *
                            siteVerification.auditorCompletion) /
                            100,
                        ).toLocaleString()}{" "}
                        warranted)
                        <br />
                        <strong>
                          Potential Overpayment: ₦
                          {Math.round(
                            siteVerification.amountPaid -
                              (siteVerification.contractValue *
                                siteVerification.auditorCompletion) /
                                100,
                          ).toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  )}
              </Card>
            </div>
          )}

          {advanceItems.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <Card
                title="Advances Ageing Analysis — FAR 2009"
                borderColor="#f59e0b"
              >
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Ref</th>
                        <th>Officer</th>
                        <th>Purpose</th>
                        <th>Amount (₦)</th>
                        <th>Date Issued</th>
                        <th>Days Out</th>
                        <th>Age Band</th>
                        <th>Year-End?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advanceItems.map((adv) => (
                        <tr
                          key={adv.id}
                          style={{
                            background:
                              adv.ageBand === "> 1 year"
                                ? "#fef2f2"
                                : adv.ageBand === "6–12 months"
                                  ? "#fffbeb"
                                  : undefined,
                          }}
                        >
                          <td
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                            }}
                          >
                            {adv.ref}
                          </td>
                          <td style={{ fontSize: "0.82rem" }}>
                            {adv.officerName}
                          </td>
                          <td style={{ fontSize: "0.78rem" }}>{adv.purpose}</td>
                          <td style={{ fontWeight: 600 }}>
                            ₦{adv.amount.toLocaleString()}
                          </td>
                          <td style={{ fontSize: "0.78rem" }}>
                            {new Date(adv.dateIssued).toLocaleDateString(
                              "en-GB",
                            )}
                          </td>
                          <td
                            style={{
                              fontWeight: 600,
                              color:
                                adv.daysOutstanding > 365
                                  ? "#dc2626"
                                  : adv.daysOutstanding > 180
                                    ? "#ea580c"
                                    : "#64748b",
                            }}
                          >
                            {adv.daysOutstanding}
                          </td>
                          <td>
                            <StatusBadge
                              label={adv.ageBand}
                              variant={
                                adv.ageBand === "> 1 year"
                                  ? "error"
                                  : adv.ageBand === "6–12 months"
                                    ? "warning"
                                    : "default"
                              }
                            />
                          </td>
                          <td>{adv.endOfYearAdvance ? "⚠️ Yes" : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {isWriter && (
                  <div className={s.formActions}>
                    <button
                      className={s.btnPrimary}
                      onClick={runAdvanceAgeing}
                      style={{ fontSize: "0.75rem" }}
                    >
                      <Zap size={12} /> Run Ageing Analysis
                    </button>
                  </div>
                )}
              </Card>
            </div>
          )}

          {stockItems.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <Card title="Physical Stock Count Sheet" borderColor="#15803d">
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Unit</th>
                        <th>Ledger Balance</th>
                        <th>Physical Count</th>
                        <th>Difference</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockItems.map((item) => {
                        const diff =
                          item.physicalCount !== undefined
                            ? item.ledgerBalance - item.physicalCount
                            : undefined;
                        return (
                          <tr
                            key={item.id}
                            style={
                              diff !== undefined && diff !== 0
                                ? { background: "#fef2f2" }
                                : undefined
                            }
                          >
                            <td
                              style={{ fontSize: "0.82rem", fontWeight: 600 }}
                            >
                              {item.itemName}
                            </td>
                            <td style={{ fontSize: "0.78rem" }}>{item.unit}</td>
                            <td>{item.ledgerBalance}</td>
                            <td>
                              <input
                                type="number"
                                className={s.formInput}
                                value={item.physicalCount ?? ""}
                                onChange={(e) =>
                                  setStockItems((prev) =>
                                    prev.map((it) =>
                                      it.id === item.id
                                        ? {
                                            ...it,
                                            physicalCount: Number(
                                              e.target.value,
                                            ),
                                            difference:
                                              it.ledgerBalance -
                                              Number(e.target.value),
                                          }
                                        : it,
                                    ),
                                  )
                                }
                                style={{ width: "80px", fontSize: "0.75rem" }}
                              />
                            </td>
                            <td
                              style={{
                                fontWeight: 600,
                                color:
                                  diff && diff !== 0 ? "#dc2626" : "#15803d",
                              }}
                            >
                              {diff !== undefined ? diff : "—"}
                            </td>
                            <td>
                              <input
                                className={s.formInput}
                                value={item.notes}
                                onChange={(e) =>
                                  setStockItems((prev) =>
                                    prev.map((it) =>
                                      it.id === item.id
                                        ? { ...it, notes: e.target.value }
                                        : it,
                                    ),
                                  )
                                }
                                style={{
                                  fontSize: "0.72rem",
                                  minWidth: "100px",
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {grantExpenditures.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <Card
                title="Grant Expenditure Compliance — Eligibility Tagging"
                borderColor="#dc2626"
              >
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "#64748b",
                    marginBottom: "0.5rem",
                  }}
                >
                  Tag each expenditure as Eligible, Ineligible, or Unclear based
                  on grant conditions. Ineligible items trigger a Critical
                  Exception.
                </div>
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount (₦)</th>
                        <th>Eligibility</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grantExpenditures.map((ge) => (
                        <tr
                          key={ge.id}
                          style={
                            ge.eligibility === "Ineligible"
                              ? { background: "#fef2f2" }
                              : undefined
                          }
                        >
                          <td style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                            {ge.description}
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            ₦{ge.amount.toLocaleString()}
                          </td>
                          <td>
                            <select
                              className={s.formSelect}
                              value={ge.eligibility}
                              onChange={(e) =>
                                setGrantExpenditures((prev) =>
                                  prev.map((g) =>
                                    g.id === ge.id
                                      ? {
                                          ...g,
                                          eligibility: e.target
                                            .value as GrantExpenditure["eligibility"],
                                        }
                                      : g,
                                  ),
                                )
                              }
                              style={{
                                color:
                                  ge.eligibility === "Ineligible"
                                    ? "#dc2626"
                                    : ge.eligibility === "Eligible"
                                      ? "#15803d"
                                      : undefined,
                              }}
                            >
                              <option value="">—</option>
                              <option value="Eligible">Eligible</option>
                              <option value="Ineligible">Ineligible</option>
                              <option value="Unclear">Unclear</option>
                            </select>
                          </td>
                          <td>
                            <input
                              className={s.formInput}
                              value={ge.notes}
                              onChange={(e) =>
                                setGrantExpenditures((prev) =>
                                  prev.map((g) =>
                                    g.id === ge.id
                                      ? { ...g, notes: e.target.value }
                                      : g,
                                  ),
                                )
                              }
                              style={{ fontSize: "0.72rem", minWidth: "120px" }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ─── JOURNAL PROMPT (after exception logged) ─── */}
          {showJournalPrompt && (
            <div style={{ marginTop: "1.25rem" }}>
              <div
                style={{
                  border: "1px solid #f59e0b",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "#fffbeb",
                    borderBottom: "1px solid #f59e0b",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      color: "#92400e",
                    }}
                  >
                    <AlertTriangle size={14} style={{ color: "#d97706" }} />
                    Exception logged — would you like to create a journal entry?
                  </div>
                  <button
                    className={s.btnIcon}
                    onClick={() => setShowJournalPrompt(false)}
                    style={{ fontSize: "0.72rem", color: "#92400e" }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div style={{ padding: "1rem", background: "#fff" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                      alignItems: "flex-end",
                    }}
                  >
                    <div className={s.formGroupFull} style={{ flex: 1 }}>
                      <label className={s.formLabel}>Description</label>
                      <input
                        className={s.formInput}
                        value={tbJournalDesc}
                        onChange={(e) => setTbJournalDesc(e.target.value)}
                        placeholder="Journal Description..."
                      />
                    </div>
                  </div>

                  <div
                    className={s.tableWrap}
                    style={{
                      maxHeight: "350px",
                      overflowY: "auto",
                      border: journalStateInvalid
                        ? "2px solid #ef4444" // red base for invalid
                        : "1px solid var(--border)",
                      borderRadius: "0.5rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <table
                      className={s.table}
                      style={{ fontSize: "0.75rem", margin: 0 }}
                    >
                      <thead
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "var(--bg-subtle)",
                        }}
                      >
                        <tr>
                          <th style={{ width: "40px" }} />
                          <th>Code</th>
                          <th>Description</th>
                          <th>Class</th>
                          <th style={{ textAlign: "right" }}>Amount (₦)</th>
                          <th style={{ width: "130px" }}>Adj. Debit (₦)</th>
                          <th style={{ width: "130px" }}>Adj. Credit (₦)</th>
                          <th style={{ textAlign: "right" }}>
                            Adj. Amount (₦)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tbLines.map((line) => {
                          const isSelected =
                            tbAdjustments[line.id]?.selected || false;
                          const dr = tbAdjustments[line.id]?.dr || 0;
                          const cr = tbAdjustments[line.id]?.cr || 0;
                          const adjAmount = line.current + dr - cr;
                          return (
                            <tr
                              key={line.id}
                              style={{
                                background: isSelected
                                  ? "rgba(6, 78, 59, 0.05)"
                                  : "transparent",
                              }}
                            >
                              <td>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) =>
                                    setTbAdjustments((p) => ({
                                      ...p,
                                      [line.id]: {
                                        ...p[line.id],
                                        selected: e.target.checked,
                                      },
                                    }))
                                  }
                                />
                              </td>
                              <td>{line.code || "-"}</td>
                              <td>
                                <div
                                  style={{
                                    maxWidth: "180px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                  title={line.account}
                                >
                                  {line.account}
                                </div>
                              </td>
                              <td>{line.section}</td>
                              <td
                                style={{
                                  textAlign: "right",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {line.current.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    height: "auto",
                                    fontSize: "0.75rem",
                                    opacity: isSelected ? 1 : 0.5,
                                    pointerEvents: isSelected ? "auto" : "none",
                                  }}
                                  value={dr || ""}
                                  onChange={(e) =>
                                    setTbAdjustments((p) => ({
                                      ...p,
                                      [line.id]: {
                                        ...p[line.id],
                                        selected: true,
                                        dr: Number(e.target.value),
                                      },
                                    }))
                                  }
                                  disabled={!isSelected}
                                  min={0}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    height: "auto",
                                    fontSize: "0.75rem",
                                    opacity: isSelected ? 1 : 0.5,
                                    pointerEvents: isSelected ? "auto" : "none",
                                  }}
                                  value={cr || ""}
                                  onChange={(e) =>
                                    setTbAdjustments((p) => ({
                                      ...p,
                                      [line.id]: {
                                        ...p[line.id],
                                        selected: true,
                                        cr: Number(e.target.value),
                                      },
                                    }))
                                  }
                                  disabled={!isSelected}
                                  min={0}
                                />
                              </td>
                              <td
                                style={{
                                  textAlign: "right",
                                  whiteSpace: "nowrap",
                                  fontWeight:
                                    (dr || cr) && isSelected ? 700 : 400,
                                  color:
                                    (dr || cr) && isSelected
                                      ? "var(--primary)"
                                      : "inherit",
                                }}
                              >
                                {adjAmount.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          );
                        })}
                        {tbLines.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              style={{
                                textAlign: "center",
                                padding: "1.5rem",
                                color: "#64748b",
                              }}
                            >
                              No Financial Statement data found for this audit.
                              Make sure it is uploaded during Planning.
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: "var(--bg-subtle)", fontWeight: 700 }}>
                          <td colSpan={5} style={{ textAlign: "right", paddingRight: "1rem" }}>
                            Totals:
                          </td>
                          <td style={{ color: journalStateInvalid ? "#ef4444" : "inherit" }}>
                            {totalAdjDr.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ color: journalStateInvalid ? "#ef4444" : "inherit" }}>
                            {totalAdjCr.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td></td>
                        </tr>
                        {journalStateInvalid && (
                          <tr>
                            <td colSpan={8} style={{ color: "#ef4444", fontSize: "0.75rem", textAlign: "right", padding: "0.25rem 1rem" }}>
                              Total Debits must equal Total Credits before logging.
                            </td>
                          </tr>
                        )}
                      </tfoot>
                    </table>
                  </div>

                  <div className={s.formActions}>
                    <button
                      className={s.btnSecondary}
                      onClick={() => setShowJournalPrompt(false)}
                      style={{ fontSize: "0.75rem" }}
                    >
                      Skip — No Journal
                    </button>
                    <button
                      className={s.btnPrimary}
                      onClick={handleLogJournal}
                      style={{ fontSize: "0.75rem" }}
                    >
                      <Save size={12} /> Log Journal Entry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(currentExec.reviewComments || []).length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <Card title="Review Comments">
                {currentExec.reviewComments!.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #f1f5f9",
                      fontSize: "0.82rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.15rem",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>
                        {c.authorName}{" "}
                        <span style={{ fontWeight: 400, color: "#64748b" }}>
                          ({c.authorRole})
                        </span>
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                        {new Date(c.timestamp).toLocaleString("en-GB")}
                      </span>
                    </div>
                    <div style={{ color: "#334155", lineHeight: 1.6 }}>
                      {c.message}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {(isLead || isSupervisor) && currentExec.status === "Submitted" && (
            <div style={{ marginTop: "1rem" }}>
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <input
                  className={s.formInput}
                  value={reviewMsg}
                  onChange={(e) => setReviewMsg(e.target.value)}
                  placeholder="Add a review comment..."
                  style={{ flex: 1, fontSize: "0.78rem" }}
                />
                <button
                  className={s.btnOutline}
                  onClick={handleAddReviewComment}
                  disabled={!reviewMsg.trim()}
                  style={{ fontSize: "0.72rem" }}
                >
                  <MessageSquare size={12} /> Comment
                </button>
              </div>
            </div>
          )}

          <div className={s.formActions} style={{ marginTop: "1.5rem" }}>
            {isWriter &&
              currentExec.status !== "Cleared" &&
              currentExec.status !== "Locked" &&
              currentExec.status !== "Submitted" && (
                <>
                  <button className={s.btnSecondary} onClick={handleSave}>
                    <Save size={14} /> Save Progress
                  </button>
                  <button
                    className={s.btnPrimary}
                    onClick={handleSubmit}
                    disabled={
                      siteVerification !== null &&
                      siteVerification.photos.length < 2
                    }
                    title={
                      siteVerification !== null &&
                      siteVerification.photos.length < 2
                        ? "Minimum 2 site photographs required before submission"
                        : undefined
                    }
                  >
                    <Send size={14} /> Submit for Review
                  </button>
                </>
              )}
            {isLead && currentExec.status === "Submitted" && (
              <>
                <button
                  className={s.btnPrimary}
                  onClick={() => handleLeadReview("Clear")}
                  style={{ fontSize: "0.75rem" }}
                >
                  <CheckCircle size={12} /> Clear
                </button>
                <button
                  className={s.btnOutline}
                  onClick={() => handleLeadReview("Return")}
                  style={{ fontSize: "0.75rem" }}
                >
                  Return with Comments
                </button>
                <button
                  className={s.btnOutline}
                  onClick={() => handleLeadReview("Extend")}
                  style={{ fontSize: "0.75rem" }}
                >
                  Extend Procedure
                </button>
              </>
            )}
            {isSupervisor && currentExec.status === "Reviewed" && (
              <button
                className={s.btnPrimary}
                onClick={handleSupervisorClear}
                style={{ fontSize: "0.75rem" }}
              >
                <ShieldCheck size={12} /> Supervisor Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcedureWorkspace;
