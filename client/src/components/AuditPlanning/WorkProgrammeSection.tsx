import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../UI/StatusBadge";
import DocumentPreviewModal from "../UI/DocumentPreviewModal";
import type { ExceptionSeverity, ExceptionClassification } from "../../types";
import {
  BookOpen,
  Plus,
  CheckCircle2,
  Clock,
  Play,
  Send,
  Shield,
  FileText,
  Layers,
  AlertTriangle,
  BarChart3,
  Calculator,
  MessageSquare,
  DollarSign,
  PenTool,
  FolderOpen,
  TrendingUp,
  Eye,
  Check,
  ChevronRight,
  Trash2,
  X,
  ArrowRight,
} from "lucide-react";
import s from "../../styles/pages.module.css";
import {
  fmtCurrency,
  sevColor,
  statusColor,
  TABS,
  type TabKey,
} from "./workProgrammeHelpers";
import { InlineBadge } from "./InlineBadge";
import {
  PROCEDURE_CATEGORY_META,
  CATEGORY_ORDER,
  categoryFromNcoa,
  categoryFromAccountName,
  matchProceduresForLineItem,
} from "../../features/auditProcedures/data/lineItemCategorizer";
import type { ProcedureCategory } from "../../features/auditProcedures/data/auditProcedures";
import {
  MOCK_FS,
  MOCK_TB,
  AR_FS_SECTIONS,
  AR_FS_LABELS,
  AR_TB_SECTIONS,
  AR_TB_LABELS,
} from "../../features/audit-planning/arMockData";

interface WorkProgrammeSectionProps {
  auditId?: string;
  embedded?: boolean;
  onOpenProcedure?: (executionId: string) => void;
}

const WorkProgrammeSection: React.FC<WorkProgrammeSectionProps> = ({
  auditId,
  embedded = false,
  onOpenProcedure,
}) => {
  const { user } = useAuth();
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);
  const programmes = useAuditStore((st) => st.programmes);
  const programmeTemplates = useAuditStore((st) => st.programmeTemplates);
  const createProgramme = useAuditStore((st) => st.createProgramme);
  const createProgrammeFromTemplate = useAuditStore(
    (st) => st.createProgrammeFromTemplate,
  );
  const submitProgramme = useAuditStore((st) => st.submitProgramme);
  const approveProgramme = useAuditStore((st) => st.approveProgramme);
  const requestProgrammeRevision = useAuditStore(
    (st) => st.requestProgrammeRevision,
  );
  const updateAuditStatus = useAuditStore((st) => st.updateAuditStatus);
  const addToast = useAuditStore((st) => st.addToast);

  /* new store hooks */
  const auditJournals = useAuditStore((st) => st.auditJournals);
  const auditComments = useAuditStore((st) => st.auditComments);
  const financialStatements = useAuditStore((st) => st.financialStatements);
  const completionChecklist = useAuditStore((st) => st.completionChecklist);
  const auditWorkpapers = useAuditStore((st) => st.auditWorkpapers);
  const toggleCompletionItem = useAuditStore((st) => st.toggleCompletionItem);
  const initFinancialStatements = useAuditStore(
    (st) => st.initFinancialStatements,
  );

  /* interactive tab store hooks */
  const setAuditMateriality = useAuditStore((st) => st.setAuditMateriality);
  const addAuditJournal = useAuditStore((st) => st.addAuditJournal);
  const addAuditComment = useAuditStore((st) => st.addAuditComment);
  const updateFinancialStatement = useAuditStore(
    (st) => st.updateFinancialStatement,
  );

  const allProcedureExecutions = useAuditStore((st) => st.procedureExecutions);
  const allFieldworkExceptions = useAuditStore((st) => st.fieldworkExceptions);
  const users = useAuditStore((st) => st.users);
  /* TB / FS data sourced from audit-outcomes for procedure mapping */
  const trialBalances = useAuditStore((st) => st.trialBalances);
  const auditedFinancialStatements = useAuditStore(
    (st) => st.auditedFinancialStatements,
  );
  const auditDocSources = useAuditStore((st) => st.auditDocSources);
  const removeProcedureEvidence = useAuditStore(
    (st) => st.removeProcedureEvidence,
  );
  const removeFieldworkException = useAuditStore(
    (st) => st.removeFieldworkException,
  );
  const classifyException = useAuditStore((st) => st.classifyException);
  const escalateExceptionToHlg = useAuditStore(
    (st) => st.escalateExceptionToHlg,
  );

  const [localAuditId, setLocalAuditId] = useState<string>(
    auditId || audits[0]?.id || "",
  );
  const selectedAuditId = auditId ?? localAuditId;

  const [searchParams, setSearchParams] = useSearchParams();
  const [localTab, setLocalTab] = useState<TabKey>("overview");
  const activeTab: TabKey = embedded
    ? localTab
    : (searchParams.get("tab") as TabKey) || "overview";
  const setActiveTab = useCallback(
    (key: TabKey) => {
      if (embedded) {
        setLocalTab(key);
      } else {
        setSearchParams(
          (prev) => {
            prev.set("tab", key);
            return prev;
          },
          { replace: true },
        );
      }
    },
    [embedded, setSearchParams],
  );

  useEffect(() => {
    if (selectedAuditId && activeTab === "statements") {
      initFinancialStatements(selectedAuditId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAuditId, activeTab]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [createForm, setCreateForm] = useState({
    objectives: "",
    scope: "",
    riskAreas: "",
  });
  const [matForm, setMatForm] = useState({
    basisLabel: "Total Expenditure",
    basisAmount: "",
    percentage: "5",
  });
  const matOverall =
    parseFloat(matForm.basisAmount.replace(/,/g, "")) *
      (parseFloat(matForm.percentage) / 100) || 0;
  const matPerformance = matOverall * 0.7;
  const matTrivial = matPerformance * 0.05;

  const [showAddJournal, setShowAddJournal] = useState(false);
  const [journalForm, setJournalForm] = useState({
    type: "Adjusting" as "Adjusting" | "Reclassifying" | "Proposed" | "Passed",
    description: "",
    affectedArea: "",
    workpaperRef: "",
  });
  const [journalEntries, setJournalEntries] = useState([
    { account: "", debit: "", credit: "" },
    { account: "", debit: "", credit: "" },
  ]);

  const [showAddComment, setShowAddComment] = useState(false);
  const [commentForm, setCommentForm] = useState({
    title: "",
    observation: "",
    criteria: "",
    cause: "",
    effect: "",
    recommendation: "",
    severity: "Medium" as "Low" | "Medium" | "High" | "Critical",
    responsibleParty: "",
    targetDate: "",
  });

  const [editingStmtId, setEditingStmtId] = useState<string | null>(null);
  const [stmtEditForm, setStmtEditForm] = useState({
    status: "Not Received" as
      | "Not Received"
      | "Received"
      | "Under Review"
      | "Adjusted"
      | "Final",
    notes: "",
    reviewedBy: "",
  });

  const [showMatModal, setShowMatModal] = useState(false);

  const [excFilter, setExcFilter] = useState<"all" | ExceptionSeverity>("all");
  const [classifyId, setClassifyId] = useState<string | null>(null);

  /* Procedures tab � source document for line-item driven view.
     Derived from the arDocType the audit team selected during the
     Analytical Review step; defaults to "tb" if not yet chosen. */
  const procSource = (auditDocSources[selectedAuditId] ?? "tb") as "tb" | "fs";
  const [expandedLineItem, setExpandedLineItem] = useState<string | null>(null);

  /* Evidence Library � view / delete */
  const [previewEvidence, setPreviewEvidence] = useState<{
    name: string;
    type: string;
    uploadedBy: string;
    uploadedAt: string;
    size?: string;
    url?: string;
  } | null>(null);
  const [confirmDeleteEvidence, setConfirmDeleteEvidence] = useState<{
    executionId: string;
    evidenceId: string;
    fileName: string;
  } | null>(null);
  const [confirmDeleteException, setConfirmDeleteException] = useState<{
    id: string;
    ref: string;
  } | null>(null);

  const currentProgramme = useMemo(
    () => programmes.find((p) => p.auditId === selectedAuditId),
    [programmes, selectedAuditId],
  );

  const selectedAudit = audits.find((a) => a.id === selectedAuditId);
  const lgaName = selectedAudit
    ? lgas.find((l) => l.id === selectedAudit.lgaId)?.name ||
      selectedAudit.lgaId
    : "";

  const isSupervisor =
    user?.role === "AUDIT_SUPERVISOR" || user?.role === "STATE_AUDITOR_GENERAL";
  const isLead = user?.role === "AUDIT_LEAD";

  /* filtered data */
  const filteredJournals = useMemo(
    () => auditJournals.filter((j) => j.auditId === selectedAuditId),
    [auditJournals, selectedAuditId],
  );
  const filteredComments = useMemo(
    () => auditComments.filter((c) => c.auditId === selectedAuditId),
    [auditComments, selectedAuditId],
  );
  const filteredStatements = useMemo(
    () => financialStatements.filter((f) => f.auditId === selectedAuditId),
    [financialStatements, selectedAuditId],
  );
  const filteredChecklist = useMemo(
    () => completionChecklist.filter((c) => c.auditId === selectedAuditId),
    [completionChecklist, selectedAuditId],
  );
  const filteredWorkpapers = useMemo(
    () => auditWorkpapers.filter((w) => w.auditId === selectedAuditId),
    [auditWorkpapers, selectedAuditId],
  );

  /* Trial-Balance line items for the current audit (selected in planning).
     Falls back to the most recently uploaded TB if none is tagged to this
     audit, since the seed/consolidated TB covers all audits. */
  const auditTrialBalance = useMemo(() => {
    if (!trialBalances || trialBalances.length === 0) return undefined;
    return (
      trialBalances.find((tb) => tb.auditId === selectedAuditId) ||
      trialBalances[trialBalances.length - 1]
    );
  }, [trialBalances, selectedAuditId]);

  /* Audited Financial Statements rows (Statement of Financial Position +
     Statement of Financial Performance) � used as the alternate procedure
     source. */
  const auditFsRows = useMemo(() => {
    if (!auditedFinancialStatements) return [];
    const stmts = auditedFinancialStatements.filter(
      (fs) =>
        (fs.kind === "StatementOfFinancialPosition" ||
          fs.kind === "StatementOfFinancialPerformance") &&
        !!fs.rows,
    );
    return stmts.flatMap((fs) =>
      (fs.rows || [])
        .filter((r) => !r.isHeader && !r.isSubtotal && r.ncoaCode)
        .map((r) => ({
          id: `${fs.id}-${r.id}`,
          ncoaCode: r.ncoaCode,
          accountName: r.description,
          currentYear: r.currentYear ?? 0,
          priorYear: r.priorYear ?? 0,
          source: fs.kind,
        })),
    );
  }, [auditedFinancialStatements]);

  /* Build category ? line items for the chosen source */
  const categorisedLineItems = useMemo(() => {
    type Item = {
      id: string;
      ncoaCode?: string;
      accountName: string;
      currentYear: number;
      priorYear: number;
      classification?: string;
    };
    const buckets = new Map<ProcedureCategory, Item[]>();
    CATEGORY_ORDER.forEach((c) => buckets.set(c, []));

    if (procSource === "tb") {
      const lines = auditTrialBalance?.lines ?? [];
      const seen = new Set<string>();
      lines.forEach((l) => {
        const cat =
          categoryFromNcoa(l.ncoaCode) ||
          categoryFromAccountName(l.accountName);
        if (!cat) return;
        const key = l.accountName.trim().toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        buckets.get(cat)!.push({
          id: l.id,
          ncoaCode: l.ncoaCode,
          accountName: l.accountName,
          currentYear: l.currentYear,
          priorYear: l.priorYear,
          classification: l.classification,
        });
      });
    } else {
      const seen = new Set<string>();
      auditFsRows.forEach((r) => {
        const cat =
          categoryFromNcoa(r.ncoaCode) ||
          categoryFromAccountName(r.accountName);
        if (!cat) return;
        const key = r.accountName.trim().toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        buckets.get(cat)!.push({
          id: r.id,
          ncoaCode: r.ncoaCode,
          accountName: r.accountName,
          currentYear: r.currentYear,
          priorYear: r.priorYear,
        });
      });
    }
    return buckets;
  }, [procSource, auditTrialBalance, auditFsRows]);

  const procedureStats = useMemo(() => {
    if (!currentProgramme) {
      return { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
    }
    const procs = currentProgramme.procedures;
    return {
      total: procs.length,
      completed: procs.filter((p) => p.status === "Completed").length,
      inProgress: procs.filter((p) => p.status === "In Progress").length,
      notStarted: procs.filter((p) => p.status === "Not Started").length,
    };
  }, [currentProgramme]);

  const procedureExecutions = useMemo(
    () => allProcedureExecutions.filter((e) => e.auditId === selectedAuditId),
    [allProcedureExecutions, selectedAuditId],
  );
  const fieldworkExceptions = useMemo(
    () => allFieldworkExceptions.filter((e) => e.auditId === selectedAuditId),
    [allFieldworkExceptions, selectedAuditId],
  );
  const filteredExceptions = useMemo(
    () =>
      excFilter === "all"
        ? fieldworkExceptions
        : fieldworkExceptions.filter((e) => e.severity === excFilter),
    [fieldworkExceptions, excFilter],
  );
  const excStats = useMemo(
    () => ({
      critical: fieldworkExceptions.filter((e) => e.severity === "Critical")
        .length,
      high: fieldworkExceptions.filter((e) => e.severity === "High").length,
      medium: fieldworkExceptions.filter((e) => e.severity === "Medium").length,
      low: fieldworkExceptions.filter((e) => e.severity === "Low").length,
      total: fieldworkExceptions.length,
      totalImpact: fieldworkExceptions.reduce(
        (s, e) => s + e.financialImpact,
        0,
      ),
    }),
    [fieldworkExceptions],
  );

  const getUserName = (id: string) =>
    users.find((u) => u.id === id)?.name || id;

  const severityVariant = (sv: ExceptionSeverity) => {
    switch (sv) {
      case "Low":
        return "success" as const;
      case "Medium":
        return "warning" as const;
      case "High":
      case "Critical":
        return "error" as const;
    }
  };

  const handleCreate = () => {
    if (!selectedAuditId) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Select an audit before creating a work programme",
      });
      return;
    }

    if (!createForm.objectives || !createForm.scope) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Objectives and scope are required",
      });
      return;
    }

    if (selectedTemplateId) {
      createProgrammeFromTemplate(
        selectedTemplateId,
        selectedAuditId,
        user?.name || "",
        createForm.objectives,
        createForm.scope,
      );
    } else {
      createProgramme({
        auditId: selectedAuditId,
        objectives: createForm.objectives,
        scope: createForm.scope,
        riskAreas: createForm.riskAreas
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        procedures: [],
        status: "Draft",
        preparedBy: user?.name || "",
      });
    }

    setCreateForm({ objectives: "", scope: "", riskAreas: "" });
    setSelectedTemplateId("");
    setShowCreateForm(false);
  };

  const handleSaveMateriality = () => {
    const amount = parseFloat(matForm.basisAmount.replace(/,/g, ""));
    if (!amount || amount <= 0) {
      addToast({ type: "error", title: "Enter a valid basis amount" });
      return;
    }
    setAuditMateriality({
      auditId: selectedAuditId,
      overallMateriality: matOverall,
      performanceMateriality: matPerformance,
      clearlyTrivialThreshold: matTrivial,
      basis: matForm.basisLabel,
      basisAmount: amount,
      percentage: parseFloat(matForm.percentage),
      preparedBy: user?.name || "",
    });
    addToast({
      type: "success",
      title: "Materiality Saved",
      message: `Overall: ${fmtCurrency(matOverall)}`,
    });
    setShowMatModal(false);
  };

  const handleAddJournal = () => {
    const validEntries = journalEntries.filter(
      (e) => e.account && (parseFloat(e.debit) > 0 || parseFloat(e.credit) > 0),
    );
    if (!journalForm.description || validEntries.length < 2) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Description and at least 2 valid journal lines are required",
      });
      return;
    }
    const entries = validEntries.map((e) => ({
      account: e.account,
      debit: parseFloat(e.debit) || 0,
      credit: parseFloat(e.credit) || 0,
    }));
    const totalDebits = entries.reduce((s, e) => s + e.debit, 0);
    const totalCredits = entries.reduce((s, e) => s + e.credit, 0);
    const netEffect = Math.max(totalDebits, totalCredits);
    const existing = filteredJournals;
    const prefix =
      journalForm.type === "Adjusting"
        ? "AJE"
        : journalForm.type === "Reclassifying"
          ? "RJE"
          : journalForm.type === "Passed"
            ? "PJE"
            : "JNL";
    const num = String(
      existing.filter((j) => j.type === journalForm.type).length + 1,
    ).padStart(3, "0");
    addAuditJournal({
      auditId: selectedAuditId,
      journalNumber: `${prefix}-${num}`,
      type: journalForm.type,
      description: journalForm.description,
      entries,
      netEffect,
      affectedArea: journalForm.affectedArea || "General",
      preparedBy: user?.name || "",
      status: "Proposed",
      workpaperRef: journalForm.workpaperRef || undefined,
    });
    setJournalForm({
      type: "Adjusting",
      description: "",
      affectedArea: "",
      workpaperRef: "",
    });
    setJournalEntries([
      { account: "", debit: "", credit: "" },
      { account: "", debit: "", credit: "" },
    ]);
    setShowAddJournal(false);
    addToast({ type: "success", title: "Journal Entry Recorded" });
  };

  const handleAddComment = () => {
    if (
      !commentForm.title ||
      !commentForm.observation ||
      !commentForm.recommendation
    ) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Title, Observation, and Recommendation are required",
      });
      return;
    }
    const existing = filteredComments;
    const year = new Date().getFullYear();
    const refNum = String(existing.length + 1).padStart(3, "0");
    addAuditComment({
      auditId: selectedAuditId,
      referenceNumber: `MC-${year}-${refNum}`,
      title: commentForm.title,
      observation: commentForm.observation,
      criteria: commentForm.criteria,
      cause: commentForm.cause,
      effect: commentForm.effect,
      recommendation: commentForm.recommendation,
      severity: commentForm.severity,
      status: "Draft",
      responsibleParty: commentForm.responsibleParty || undefined,
      targetDate: commentForm.targetDate || undefined,
      preparedBy: user?.name || "",
    });
    setCommentForm({
      title: "",
      observation: "",
      criteria: "",
      cause: "",
      effect: "",
      recommendation: "",
      severity: "Medium",
      responsibleParty: "",
      targetDate: "",
    });
    setShowAddComment(false);
    addToast({ type: "success", title: "Audit Comment Recorded" });
  };

  /* ─── Financial Statements Tab: base data, adjustment map, budget util ─── */
  const stmtBaseRows = useMemo(
    () => (procSource === "fs" ? MOCK_FS : MOCK_TB),
    [procSource],
  );
  const stmtSections = procSource === "fs" ? AR_FS_SECTIONS : AR_TB_SECTIONS;
  const stmtSectionLabels =
    procSource === "fs" ? AR_FS_LABELS : AR_TB_LABELS;

  /** accountName (lower-trim) → net debit/credit effect from active journals */
  const stmtAdjMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredJournals
      .filter((j) => j.status !== "Waived")
      .forEach((journal) => {
        journal.entries.forEach((entry) => {
          const key = entry.account.toLowerCase().trim();
          map.set(key, (map.get(key) ?? 0) + entry.debit - entry.credit);
        });
      });
    return map;
  }, [filteredJournals]);

  const stmtHasJournals = filteredJournals.some((j) => j.status !== "Waived");

  const stmtTotalAdjEffect = useMemo(
    () =>
      filteredJournals
        .filter((j) => j.status !== "Waived")
        .reduce((sum, j) => sum + j.netEffect, 0),
    [filteredJournals],
  );

  /** Budget utilisation % based on the first revenue total row */
  const stmtBudgetUtil = useMemo(() => {
    const pbtRow =
      stmtBaseRows.find((r) => r.type === "pbt") ||
      stmtBaseRows.find((r) => r.type === "total" && r.id.endsWith("-r0")) ||
      stmtBaseRows.find((r) => r.type === "total");
    if (!pbtRow || pbtRow.budget <= 0) return 0;
    return Math.round((pbtRow.current / pbtRow.budget) * 100);
  }, [stmtBaseRows]);

  const overviewStats = useMemo(() => {
    const journalTotal = filteredJournals.reduce(
      (sum, j) => sum + j.netEffect,
      0,
    );
    const journalAgreed = filteredJournals.filter(
      (j) => j.status === "Agreed" || j.status === "Posted",
    ).length;
    const commentsHigh = filteredComments.filter(
      (c) => c.severity === "High" || c.severity === "Critical",
    ).length;
    const stmtsFinal = filteredStatements.filter(
      (f) => f.status === "Final",
    ).length;
    const checkDone = filteredChecklist.filter((c) => c.completed).length;
    const wpReviewed = filteredWorkpapers.filter(
      (w) => w.status === "Reviewed" || w.status === "Final",
    ).length;
    return {
      journalTotal,
      journalAgreed,
      journalCount: filteredJournals.length,
      commentsCount: filteredComments.length,
      commentsHigh,
      stmtsFinal,
      stmtsTotal: filteredStatements.length,
      checkDone,
      checkTotal: filteredChecklist.length,
      wpReviewed,
      wpTotal: filteredWorkpapers.length,
    };
  }, [
    filteredJournals,
    filteredComments,
    filteredStatements,
    filteredChecklist,
    filteredWorkpapers,
  ]);

  return (
    <div>
      {/* Header */}
      {!embedded && (
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Audit Work Programme</h1>
            <p className={s.pageSubtitle}>
              Comprehensive ISA/ISSAI-standard engagement file ISA, ISSAI &amp;
              IPSAS aligned
            </p>
          </div>
          <span className={s.pageBadge}>
            <BookOpen size={12} /> Work Programme
          </span>
        </div>
      )}

      {/* Audit Selector */}
      {!auditId && (
        <div className={s.filterBar} style={{ marginBottom: "1.5rem" }}>
          <select
            className={s.formSelect}
            value={selectedAuditId}
            onChange={(e) => setLocalAuditId(e.target.value)}
            style={{ width: 320 }}
          >
            {audits.map((a) => {
              const lga = lgas.find((l) => l.id === a.lgaId);
              const councilLabel = lga?.councilType === "LCDA" ? " (LCDA)" : "";
              return (
                <option key={a.id} value={a.id}>
                  {lga?.name || a.lgaId}
                  {councilLabel} {a.type} Audit ({a.year})
                </option>
              );
            })}
          </select>
          {!currentProgramme && (
            <button
              className={s.btnPrimary}
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={14} /> Create Work Programme
            </button>
          )}
        </div>
      )}

      {embedded && currentProgramme && (
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            Work Programme for {lgaName}
          </div>
        </div>
      )}

      {/* Tab Bar */}
      {(currentProgramme || embedded) && (
        <div
          className={s.noScrollbar}
          style={{
            display: "flex",
            gap: "0.25rem",
            marginBottom: "1.5rem",
            overflowX: "auto",
            overflowY: "hidden",
            borderBottom: "2px solid var(--border)",
            paddingBottom: "0",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.65rem 1rem",
                fontSize: "0.78rem",
                fontWeight: activeTab === tab.key ? 700 : 500,
                color:
                  activeTab === tab.key ? "var(--primary)" : "var(--text-3)",
                background:
                  activeTab === tab.key ? "rgba(6,78,59,0.06)" : "transparent",
                border: "none",
                borderBottom:
                  activeTab === tab.key
                    ? "2px solid var(--primary)"
                    : "2px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
                marginBottom: "-2px",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* --- CREATE FORM --- */}
      {showCreateForm && !currentProgramme && !embedded && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>
              New Work Programme {lgaName} ({selectedAudit?.type} Audit)
            </h3>
          </div>
          <div className={s.cardBody}>
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                  color: "var(--primary)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <Layers size={14} />
                Generate from Standardised Template
              </div>
              <div
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
              >
                <select
                  className={s.formSelect}
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  style={{ flex: "1 1 300px" }}
                >
                  <option value="">Select a template (optional)</option>
                  {programmeTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} {t.sections.length} sections,{" "}
                      {t.sections.reduce(
                        (sum, sec) => sum + sec.procedures.length,
                        0,
                      )}{" "}
                      procedures
                    </option>
                  ))}
                </select>
              </div>
              {selectedTemplateId &&
                (() => {
                  const tpl = programmeTemplates.find(
                    (t) => t.id === selectedTemplateId,
                  );
                  if (!tpl) return null;
                  return (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        fontSize: "0.82rem",
                        color: "var(--text-2)",
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                        {tpl.name}
                      </div>
                      <div
                        style={{
                          color: "var(--text-2)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {tpl.description}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.35rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {tpl.sections.map((sec) => (
                          <span
                            key={sec.title}
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              padding: "0.15rem 0.5rem",
                              borderRadius: "3px",
                              background: "var(--bg-card)",
                              color: "var(--primary)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            {sec.title} ({sec.procedures.length})
                          </span>
                        ))}
                      </div>
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "0.72rem",
                          color: "var(--text-2)",
                        }}
                      >
                        <strong>Methodology:</strong> {tpl.methodology}
                      </div>
                    </div>
                  );
                })()}
            </div>

            <div className={s.formGrid}>
              <div className={s.formGroupFull}>
                <label className={s.formLabel}>Objectives</label>
                <textarea
                  className={s.formTextarea}
                  value={createForm.objectives}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, objectives: e.target.value })
                  }
                  placeholder="Define the objectives of the audit programme"
                />
              </div>
              <div className={s.formGroupFull}>
                <label className={s.formLabel}>Scope</label>
                <textarea
                  className={s.formTextarea}
                  value={createForm.scope}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, scope: e.target.value })
                  }
                  placeholder="Define the scope boundaries"
                />
              </div>
              {!selectedTemplateId && (
                <div className={s.formGroupFull}>
                  <label className={s.formLabel}>
                    Risk Areas (comma-separated)
                  </label>
                  <input
                    className={s.formInput}
                    value={createForm.riskAreas}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        riskAreas: e.target.value,
                      })
                    }
                    placeholder="e.g. Revenue, Procurement, Payroll, Assets"
                  />
                </div>
              )}
            </div>
            <div className={s.formActions}>
              <button
                className={s.btnSecondary}
                onClick={() => {
                  setShowCreateForm(false);
                  setSelectedTemplateId("");
                }}
              >
                Cancel
              </button>
              <button className={s.btnPrimary} onClick={handleCreate}>
                <FileText size={14} />{" "}
                {selectedTemplateId
                  ? "Generate from Template"
                  : "Create Programme"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: OVERVIEW --- */}
      {embedded && !currentProgramme && activeTab === "overview" && (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <FileText size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No Work Programme Yet</div>
              <div className={s.emptyDesc}>
                A work programme has not been created for this audit. Please
                complete the Planning stage first � the Audit Lead will create
                and submit the work programme before fieldwork can begin.
              </div>
            </div>
          </div>
        </div>
      )}
      {currentProgramme && activeTab === "overview" && (
        <>
          {/* --- Audit Lead Workflow Guide --- */}
          {isLead && (
            <div
              style={{
                background: "linear-gradient(135deg, #0d2b1e 0%, #064e3b 100%)",
                border: "none",
                borderRadius: "14px",
                padding: "1.5rem 1.75rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "0.4rem",
                    display: "flex",
                  }}
                >
                  <Shield size={18} style={{ color: "#fff" }} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#fff",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                    }}
                  >
                    Audit Lead Workflow Guide
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "0.7rem",
                    }}
                  >
                    Follow these steps in sequence to complete the work
                    programme
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {[
                  {
                    step: "01",
                    tab: "procedures",
                    icon: "📝",
                    title: "Review Procedures",
                    desc: "Update procedure status as audit testing is completed.",
                    action: "Procedures tab",
                  },
                  {
                    step: "02",
                    tab: "journals",
                    icon: "📓",
                    title: "Record Journals",
                    desc: "Log AJE/RJE audit adjustments with debit/credit lines.",
                    action: "Journals tab",
                  },
                  {
                    step: "03",
                    tab: "comments",
                    icon: "🔍",
                    title: "Record Findings",
                    desc: "Document CCEE audit comments for all control deficiencies.",
                    action: "Comments tab",
                  },
                  {
                    step: "04",
                    tab: "statements",
                    icon: "📊",
                    title: "Update Statements",
                    desc: "Track financial statements from Received through to Final.",
                    action: "Statements tab",
                  },
                  {
                    step: "05",
                    tab: "completion",
                    icon: "✅",
                    title: "Sign Off",
                    desc: "Complete checklist and submit the programme for review.",
                    action: "Completion tab",
                  },
                ].map((item) => (
                  <button
                    key={item.step}
                    onClick={() => setActiveTab(item.tab as TabKey)}
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "10px",
                      padding: "0.85rem 0.9rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.13)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.07)")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.6rem",
                      }}
                    >
                      <div style={{ fontSize: "1.2rem", lineHeight: 1 }}>
                        {item.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            marginBottom: "0.2rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.58rem",
                              fontWeight: 800,
                              color: "#4ade80",
                              fontFamily: "monospace",
                              letterSpacing: "0.05em",
                            }}
                          >
                            STEP {item.step}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            color: "#fff",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "rgba(255,255,255,0.8)",
                            lineHeight: 1.4,
                          }}
                        >
                          {item.desc}
                        </div>
                        <div
                          style={{
                            marginTop: "0.4rem",
                            fontSize: "0.68rem",
                            color: "#4ade80",
                            fontWeight: 600,
                          }}
                        >
                          → {item.action}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Programme Overview Card */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Programme Overview</h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {isLead && currentProgramme.status === "Draft" && (
                  <button
                    className={s.btnPrimary}
                    onClick={() => {
                      if (currentProgramme.procedures.length === 0) {
                        addToast({
                          type: "error",
                          title: "Validation Error",
                          message:
                            "Add at least one procedure before submitting.",
                        });
                        return;
                      }
                      submitProgramme(currentProgramme.id);
                      addToast({
                        type: "success",
                        title: "Programme Submitted for Review",
                        message: "Supervisor notified for approval.",
                      });
                    }}
                  >
                    <Send size={14} /> Submit for Review
                  </button>
                )}
                {isSupervisor && currentProgramme.status === "Submitted" && (
                  <>
                    <button
                      className={s.btnPrimary}
                      onClick={() => {
                        approveProgramme(currentProgramme.id, user?.id || "");
                        updateAuditStatus(
                          currentProgramme.auditId,
                          "Fieldwork",
                        );
                        addToast({
                          type: "success",
                          title: "Programme Approved",
                          message: "Audit phase advanced to Fieldwork.",
                        });
                      }}
                    >
                      <Shield size={14} /> Approve
                    </button>
                    <button
                      className={s.btnDanger}
                      onClick={() => {
                        requestProgrammeRevision(currentProgramme.id);
                        addToast({
                          type: "warning",
                          title: "Revision Requested",
                        });
                      }}
                    >
                      Request Revision
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className={s.cardBody}>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Objectives</span>
                <span className={s.detailValue}>
                  {currentProgramme.objectives}
                </span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Scope</span>
                <span className={s.detailValue}>{currentProgramme.scope}</span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Risk Areas</span>
                <span className={s.detailValue}>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.35rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {currentProgramme.riskAreas.map((area) => (
                      <span
                        key={area}
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "3px",
                          background: "var(--bg-hover)",
                          color: "var(--primary)",
                          border: "1px solid var(--primary)",
                        }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Prepared By</span>
                <span className={s.detailValue}>
                  {currentProgramme.preparedBy}
                </span>
              </div>
              {currentProgramme.methodology && (
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Methodology</span>
                  <span className={s.detailValue}>
                    {currentProgramme.methodology}
                  </span>
                </div>
              )}
              {currentProgramme.templateId && (
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Template</span>
                  <span className={s.detailValue}>
                    {programmeTemplates.find(
                      (t) => t.id === currentProgramme.templateId,
                    )?.name || currentProgramme.templateId}
                  </span>
                </div>
              )}
              {currentProgramme.approvedBy && (
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Approved By</span>
                  <span className={s.detailValue}>
                    {currentProgramme.approvedBy}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Audit Process Flow */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Audit Engagement Process Flow</h3>
            </div>
            <div className={s.cardBody}>
              {[
                {
                  phase: "1. Planning & Risk Assessment",
                  items: [
                    "Entity understanding & risk identification",
                    "Materiality calculation",
                    "Audit strategy & work programme design",
                    "Team assignment & timeline",
                  ],
                  done: procedureStats.total > 0,
                },
                {
                  phase: "2. Fieldwork Execution",
                  items: [
                    "Execute audit procedures from work programme",
                    "Test internal controls (TOC)",
                    "Perform substantive testing (TOD)",
                    "Analytical procedures & physical verification",
                  ],
                  done:
                    procedureStats.inProgress > 0 ||
                    procedureStats.completed > 0,
                },
                {
                  phase: "3. Audit Workpapers",
                  items: [
                    "Prepare lead schedules for each area",
                    "Document supporting schedules & reconciliations",
                    "Obtain confirmations from third parties",
                    "Cross-reference workpapers to procedures",
                  ],
                  done: overviewStats.wpTotal > 0,
                },
                {
                  phase: "4. Audit Journals",
                  items: [
                    "Propose adjusting journal entries (AJEs)",
                    "Propose reclassifying journal entries (RJEs)",
                    "Track passed adjustments (unadjusted differences)",
                    "Agree journals with management",
                  ],
                  done: overviewStats.journalCount > 0,
                },
                {
                  phase: "5. Audit Comments (Management Letter)",
                  items: [
                    "Document observations using Condition-Criteria-Cause-Effect",
                    "Rate severity and assign responsibility",
                    "Discuss with management and obtain responses",
                    "Include in management letter / report",
                  ],
                  done: overviewStats.commentsCount > 0,
                },
                {
                  phase: "6. Financial Statements Review",
                  items: [
                    "Review draft financial statements received",
                    "Apply agreed audit adjustments",
                    "Review adequacy of disclosures (IPSAS)",
                    "Sign-off on final audited financial statements",
                  ],
                  done: overviewStats.stmtsFinal > 0,
                },
                {
                  phase: "7. Audit Report",
                  items: [
                    "Draft audit opinion (Unqualified/Qualified/Adverse/Disclaimer)",
                    "Submit for supervisor review",
                    "Obtain management response",
                    "Final AG approval & sign-off",
                  ],
                  done: false,
                },
                {
                  phase: "8. Completion & File Assembly",
                  items: [
                    "Going concern assessment",
                    "Subsequent events review",
                    "Management representation letter",
                    "File assembly within 60 days (ISA 230)",
                  ],
                  done: overviewStats.checkDone > 0,
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                    padding: "1rem 0",
                    borderBottom: idx < 7 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: step.done
                        ? "var(--primary)"
                        : "var(--border)",
                      color: step.done ? "var(--bg-card)" : "var(--text-3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {step.done ? <Check size={14} color="#ffffff" /> : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        color: "var(--text)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {step.phase}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.25rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {step.items.map((item, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-2)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <ChevronRight size={10} /> {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* --- TAB: PROCEDURES (Risk-Based Audit Programme) --- */}
      {currentProgramme && activeTab === "procedures" && (
        <>
          {/* KPI strip */}
          <div className={s.kpiRow}>
            <div className={s.kpiCard}>
              <div className={s.kpiIconGreen}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Completed</div>
                <div className={s.kpiValue}>
                  {procedureStats.completed}/{procedureStats.total}
                </div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconAmber}>
                <Play size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>In Progress</div>
                <div className={s.kpiValue}>{procedureStats.inProgress}</div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconPurple}>
                <Clock size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Not Started</div>
                <div className={s.kpiValue}>{procedureStats.notStarted}</div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconBlue}>
                <Layers size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Risk Areas</div>
                <div className={s.kpiValue}>
                  {currentProgramme.sections?.length ??
                    new Set(currentProgramme.procedures.map((p) => p.area))
                      .size}
                </div>
              </div>
            </div>
          </div>

          {/* --- NEW: Reference procedures driven by TB / FS line items --- */}
          {(() => {
            const buckets = categorisedLineItems;
            const totalItems = Array.from(buckets.values()).reduce(
              (sum, arr) => sum + arr.length,
              0,
            );
            const sourceEmpty =
              procSource === "tb"
                ? !auditTrialBalance ||
                  (auditTrialBalance.lines?.length ?? 0) === 0
                : auditFsRows.length === 0;

            return (
              <div className={s.card} style={{ marginBottom: "1.25rem" }}>
                <div
                  className={s.cardHeader}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <h3 className={s.cardTitle}>
                      Audit Procedures by Line Item
                    </h3>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-3)",
                        marginTop: "0.25rem",
                      }}
                    >
                      Procedures matched from the reference library against the
                      selected source document.
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: 600,
                      }}
                    >
                      Source
                    </span>
                    <span
                      style={{
                        padding: "0.4rem 0.85rem",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "var(--primary)",
                        background: "var(--bg-card)",
                      }}
                    >
                      {procSource === "tb"
                        ? "Trial Balance"
                        : "Financial Statements"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    background: "var(--bg-card)",
                  }}
                >
                  {sourceEmpty ? (
                    <div className={s.emptyState}>
                      <BookOpen size={36} className={s.emptyIcon} />
                      <div className={s.emptyTitle}>
                        No{" "}
                        {procSource === "tb"
                          ? "Trial Balance"
                          : "Financial Statements"}{" "}
                        loaded
                      </div>
                      <div className={s.emptyDesc}>
                        {auditDocSources[selectedAuditId]
                          ? "No data found for the selected source. Upload the document in Audit Outcomes."
                          : "Select a document type in the Analytical Review step during Audit Planning to drive procedure mapping."}
                      </div>
                    </div>
                  ) : totalItems === 0 ? (
                    <div className={s.emptyState}>
                      <BookOpen size={36} className={s.emptyIcon} />
                      <div className={s.emptyTitle}>
                        No categorised line items
                      </div>
                      <div className={s.emptyDesc}>
                        The selected source has no line items matching the
                        standard audit categories.
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {CATEGORY_ORDER.map((cat) => {
                        const items = buckets.get(cat) || [];
                        if (items.length === 0) return null;
                        const meta = PROCEDURE_CATEGORY_META[cat];
                        return (
                          <div
                            key={cat}
                            style={{
                              border: "1px solid var(--border)",
                              borderRadius: "10px",
                              overflow: "hidden",
                              background: "var(--bg-card)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0.85rem 1rem",
                                background: meta.bg,
                                borderBottom: "1px solid var(--border)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.75rem",
                                }}
                              >
                                <span
                                  style={{
                                    background: meta.color,
                                    color: "#fff",
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    padding: "0.25rem 0.55rem",
                                    borderRadius: "4px",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  {meta.short}
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.95rem",
                                    fontWeight: 700,
                                    color: meta.color,
                                  }}
                                >
                                  {meta.label}
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--text-2)",
                                  fontWeight: 600,
                                }}
                              >
                                {items.length} line item
                                {items.length !== 1 ? "s" : ""}
                              </span>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {items.map((li) => {
                                const matched = matchProceduresForLineItem(
                                  li.ncoaCode,
                                  li.accountName,
                                  cat,
                                );
                                const variance = li.currentYear - li.priorYear;
                                const variancePct =
                                  li.priorYear !== 0
                                    ? (variance / li.priorYear) * 100
                                    : 0;
                                const expanded = expandedLineItem === li.id;
                                const programmeMatches =
                                  currentProgramme.procedures.filter(
                                    (p) =>
                                      p.area
                                        .toLowerCase()
                                        .includes(
                                          li.accountName.toLowerCase(),
                                        ) ||
                                      li.accountName
                                        .toLowerCase()
                                        .includes(p.area.toLowerCase()),
                                  );
                                return (
                                  <div
                                    key={li.id}
                                    style={{
                                      borderTop: "1px solid var(--border)",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedLineItem(
                                          expanded ? null : li.id,
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        background: "transparent",
                                        border: "none",
                                        padding: "0.85rem 1rem",
                                        display: "grid",
                                        gridTemplateColumns:
                                          "minmax(0,1fr) auto auto auto auto",
                                        gap: "0.75rem",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        textAlign: "left",
                                      }}
                                    >
                                      <div style={{ minWidth: 0 }}>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            fontSize: "0.85rem",
                                            fontWeight: 600,
                                            color: "var(--text)",
                                          }}
                                        >
                                          <ChevronRight
                                            size={14}
                                            style={{
                                              transform: expanded
                                                ? "rotate(90deg)"
                                                : "none",
                                              transition: "transform 0.2s",
                                              color: "var(--text-3)",
                                              flexShrink: 0,
                                            }}
                                          />
                                          <span
                                            style={{
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              whiteSpace: "nowrap",
                                            }}
                                          >
                                            {li.accountName}
                                          </span>
                                          {li.ncoaCode && (
                                            <span
                                              style={{
                                                fontFamily: "monospace",
                                                fontSize: "0.7rem",
                                                background: "var(--border)",
                                                color: "var(--text-2)",
                                                padding: "0.15rem 0.4rem",
                                                borderRadius: "3px",
                                                flexShrink: 0,
                                              }}
                                            >
                                              {li.ncoaCode}
                                            </span>
                                          )}
                                          {programmeMatches.length > 0 && (
                                            <span
                                              title={`${programmeMatches.length} procedure(s) saved to programme`}
                                              style={{
                                                background: "#dcfce7",
                                                color: "#15803d",
                                                fontSize: "0.65rem",
                                                fontWeight: 700,
                                                padding: "0.15rem 0.5rem",
                                                borderRadius: "100px",
                                                flexShrink: 0,
                                              }}
                                            >
                                              {programmeMatches.length} in
                                              programme
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "0.78rem",
                                          color: "var(--text-2)",
                                          textAlign: "right",
                                          minWidth: "100px",
                                        }}
                                      >
                                        <div
                                          style={{
                                            fontSize: "0.65rem",
                                            color: "var(--text-3)",
                                          }}
                                        >
                                          Current
                                        </div>
                                        <div style={{ fontWeight: 600 }}>
                                          {fmtCurrency(li.currentYear)}
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "0.78rem",
                                          color: "var(--text-2)",
                                          textAlign: "right",
                                          minWidth: "100px",
                                        }}
                                      >
                                        <div
                                          style={{
                                            fontSize: "0.65rem",
                                            color: "var(--text-3)",
                                          }}
                                        >
                                          Prior
                                        </div>
                                        <div>{fmtCurrency(li.priorYear)}</div>
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "0.78rem",
                                          textAlign: "right",
                                          minWidth: "100px",
                                          color:
                                            Math.abs(variancePct) > 25
                                              ? "#b91c1c"
                                              : "var(--text-2)",
                                          fontWeight:
                                            Math.abs(variancePct) > 25
                                              ? 700
                                              : 500,
                                        }}
                                      >
                                        <div
                                          style={{
                                            fontSize: "0.65rem",
                                            color: "var(--text-3)",
                                            fontWeight: 400,
                                          }}
                                        >
                                          Var %
                                        </div>
                                        <div>
                                          {variancePct >= 0 ? "+" : ""}
                                          {variancePct.toFixed(1)}%
                                        </div>
                                      </div>
                                    </button>

                                    {expanded && (
                                      <div
                                        style={{
                                          padding: "0.75rem 1rem 1rem",
                                          background: "var(--bg-card)",
                                          borderTop: "1px solid var(--border)",
                                        }}
                                      >
                                        {matched.length === 0 ? (
                                          <div
                                            style={{
                                              padding: "0.75rem",
                                              fontSize: "0.8rem",
                                              color: "var(--text-3)",
                                              fontStyle: "italic",
                                            }}
                                          >
                                            No reference procedures matched this
                                            account.
                                          </div>
                                        ) : (
                                          <div className={s.tableWrap}>
                                            <table className={s.table}>
                                              <thead>
                                                <tr>
                                                  <th style={{ width: 36 }}>
                                                    #
                                                  </th>
                                                  <th style={{ maxWidth: 260 }}>
                                                    Audit Procedure
                                                  </th>
                                                  <th style={{ width: 160 }}>
                                                    Accuracy / Valuation
                                                  </th>
                                                  <th style={{ width: 130 }}>
                                                    Assigned
                                                  </th>
                                                  <th style={{ width: 90 }}>
                                                    Action
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {matched.flatMap((mp) =>
                                                  (mp.procedures ?? []).map(
                                                    (step, i) => {
                                                      const rowKey = `${mp.code}-${i}`;
                                                      const savedProc =
                                                        currentProgramme.procedures.find(
                                                          (p) =>
                                                            p.procedure ===
                                                              step &&
                                                            p.area ===
                                                              li.accountName,
                                                        );
                                                      return (
                                                        <tr key={rowKey}>
                                                          <td
                                                            style={{
                                                              fontWeight: 600,
                                                              color:
                                                                "var(--text-3)",
                                                              fontSize:
                                                                "0.78rem",
                                                            }}
                                                          >
                                                            {String(
                                                              i + 1,
                                                            ).padStart(2, "0")}
                                                          </td>
                                                          <td
                                                            style={{
                                                              fontSize:
                                                                "0.82rem",
                                                              lineHeight: 1.55,
                                                              maxWidth: 260,
                                                              whiteSpace:
                                                                "normal",
                                                              wordBreak:
                                                                "break-word",
                                                            }}
                                                          >
                                                            {step}
                                                          </td>
                                                          <td>
                                                            <div
                                                              style={{
                                                                display: "flex",
                                                                flexWrap:
                                                                  "wrap",
                                                                gap: "0.25rem",
                                                              }}
                                                            >
                                                              {(
                                                                mp.assertions ??
                                                                []
                                                              ).map((a) => (
                                                                <span
                                                                  key={a}
                                                                  style={{
                                                                    fontSize:
                                                                      "0.65rem",
                                                                    background:
                                                                      "#eff6ff",
                                                                    color:
                                                                      "#1d4ed8",
                                                                    padding:
                                                                      "0.15rem 0.45rem",
                                                                    borderRadius:
                                                                      "100px",
                                                                    fontWeight: 600,
                                                                    textTransform:
                                                                      "uppercase",
                                                                    letterSpacing:
                                                                      "0.04em",
                                                                    whiteSpace:
                                                                      "nowrap",
                                                                  }}
                                                                >
                                                                  {a}
                                                                </span>
                                                              ))}
                                                            </div>
                                                          </td>
                                                          <td
                                                            style={{
                                                              fontSize:
                                                                "0.78rem",
                                                              color:
                                                                "var(--text-2)",
                                                            }}
                                                          >
                                                            {savedProc?.assignedTo
                                                              ? getUserName(
                                                                  savedProc.assignedTo,
                                                                )
                                                              : "-"}
                                                          </td>
                                                          <td>
                                                            <button
                                                              className={
                                                                s.btnIcon
                                                              }
                                                              title="Open Procedure Workspace"
                                                              onClick={() => {
                                                                const store =
                                                                  useAuditStore.getState();
                                                                /* find or create a procedure execution record */
                                                                let exec =
                                                                  savedProc
                                                                    ? store.procedureExecutions.find(
                                                                        (e) =>
                                                                          e.procedureId ===
                                                                          savedProc.id,
                                                                      )
                                                                    : undefined;
                                                                if (!exec) {
                                                                  /* ensure there's a programme procedure to attach to */
                                                                  let procId =
                                                                    savedProc?.id;
                                                                  if (
                                                                    !procId &&
                                                                    currentProgramme
                                                                  ) {
                                                                    /* create a minimal programme procedure on-the-fly */
                                                                    const newProc =
                                                                      {
                                                                        id: `proc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                                                                        area: li.accountName,
                                                                        procedure:
                                                                          step,
                                                                        status:
                                                                          "Not Started" as const,
                                                                        evidenceUploaded: false,
                                                                      };
                                                                    useAuditStore.setState(
                                                                      (st) => ({
                                                                        programmes:
                                                                          st.programmes.map(
                                                                            (
                                                                              p,
                                                                            ) =>
                                                                              p.id ===
                                                                              currentProgramme.id
                                                                                ? {
                                                                                    ...p,
                                                                                    procedures:
                                                                                      [
                                                                                        ...p.procedures,
                                                                                        newProc,
                                                                                      ],
                                                                                  }
                                                                                : p,
                                                                          ),
                                                                      }),
                                                                    );
                                                                    procId =
                                                                      newProc.id;
                                                                  }
                                                                  if (
                                                                    procId &&
                                                                    selectedAuditId &&
                                                                    currentProgramme
                                                                  ) {
                                                                    const newExec =
                                                                      {
                                                                        id: `exec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                                                                        auditId:
                                                                          selectedAuditId,
                                                                        programmeId:
                                                                          currentProgramme.id,
                                                                        procedureId:
                                                                          procId,
                                                                        procedureRef: `REF-${Date.now()}`,
                                                                        procedureDescription:
                                                                          step,
                                                                        auditArea:
                                                                          li.accountName,
                                                                        assertions:
                                                                          (mp.assertions ??
                                                                            []) as import("../../types").AuditAssertion[],
                                                                        riskRating:
                                                                          "Medium" as const,
                                                                        assignedTo:
                                                                          "",
                                                                        dueDate:
                                                                          new Date(
                                                                            Date.now() +
                                                                              14 *
                                                                                86400000,
                                                                          )
                                                                            .toISOString()
                                                                            .split(
                                                                              "T",
                                                                            )[0],
                                                                        status:
                                                                          "Not Started" as const,
                                                                        budgetedHours: 4,
                                                                        timeEntries:
                                                                          [],
                                                                        loggedHours: 0,
                                                                        evidence:
                                                                          [],
                                                                        workPerformed:
                                                                          "",
                                                                        exceptionIds:
                                                                          [],
                                                                        createdAt:
                                                                          new Date().toISOString(),
                                                                      };
                                                                    useAuditStore.setState(
                                                                      (st) => ({
                                                                        procedureExecutions:
                                                                          [
                                                                            ...st.procedureExecutions,
                                                                            newExec,
                                                                          ],
                                                                      }),
                                                                    );
                                                                    exec =
                                                                      newExec;
                                                                  }
                                                                }
                                                                if (exec) {
                                                                  onOpenProcedure?.(
                                                                    exec.id,
                                                                  );
                                                                }
                                                              }}
                                                            >
                                                              <ArrowRight
                                                                size={13}
                                                              />
                                                            </button>
                                                          </td>
                                                        </tr>
                                                      );
                                                    },
                                                  ),
                                                )}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* --- Currently saved in Work Programme --- (hidden � use reference table above) */}
          {null}
        </>
      )}
      {/* --- TAB: EVIDENCE LIBRARY --- */}
      {currentProgramme && activeTab === "evidence" && (
        <div>
          <div
            className={s.card}
            style={{ borderLeft: "4px solid #7c3aed", marginBottom: "0.75rem" }}
          >
            <div className={s.cardBody}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text-2)",
                }}
              >
                Evidence Library
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-2)",
                  marginTop: "0.15rem",
                }}
              >
                <strong>
                  {procedureExecutions.reduce(
                    (s, e) => s + e.evidence.length,
                    0,
                  )}
                </strong>{" "}
                evidence files across{" "}
                {
                  new Set(
                    procedureExecutions
                      .filter((e) => e.evidence.length > 0)
                      .map((e) => e.auditArea),
                  ).size
                }{" "}
                audit areas
              </div>
            </div>
          </div>

          {procedureExecutions.filter((e) => e.evidence.length > 0).length ===
            0 && (
            <div className={s.card}>
              <div className={s.cardBody}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem 0",
                    color: "var(--border)",
                    fontSize: "0.85rem",
                  }}
                >
                  <FolderOpen
                    size={32}
                    style={{ margin: "0 auto 0.75rem", opacity: 0.5 }}
                  />
                  <div>
                    No evidence files uploaded yet. Open a procedure to attach
                    evidence.
                  </div>
                </div>
              </div>
            </div>
          )}

          {(() => {
            const evidenceByArea: Record<
              string,
              {
                executionId: string;
                evidenceId: string;
                code: string;
                fileName: string;
                fileType: string;
                fileSize: string;
                fileUrl: string;
                uploadedAt: string;
                uploadedBy: string;
                procedureRef: string;
              }[]
            > = {};
            procedureExecutions.forEach((ex) => {
              ex.evidence.forEach((ev) => {
                (evidenceByArea[ex.auditArea] ||= []).push({
                  executionId: ex.id,
                  evidenceId: ev.id,
                  code: ev.code,
                  fileName: ev.fileName,
                  fileType: ev.fileType,
                  fileSize: ev.fileSize,
                  fileUrl: ev.fileUrl,
                  uploadedAt: ev.uploadedAt,
                  uploadedBy: ev.uploadedBy,
                  procedureRef: ex.procedureRef,
                });
              });
            });
            return Object.entries(evidenceByArea).map(([area, files]) => (
              <div
                key={area}
                className={s.card}
                style={{ marginBottom: "0.75rem" }}
              >
                <div className={s.cardHeader}>
                  <h3 className={s.cardTitle}>
                    EV-
                    {area
                      .replace(/[^A-Z]/gi, "")
                      .slice(0, 4)
                      .toUpperCase()}{" "}
                    � {area}
                  </h3>
                </div>
                <div className={s.cardBody}>
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th style={{ width: 90 }}>Code</th>
                          <th>File Name</th>
                          <th style={{ width: 80 }}>Type</th>
                          <th style={{ width: 110 }}>Procedure</th>
                          <th style={{ width: 90 }}>Uploaded</th>
                          <th style={{ width: 90 }}>By</th>
                          <th style={{ width: 80 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {files.map((f) => (
                          <tr key={f.evidenceId}>
                            <td
                              style={{
                                fontFamily: "monospace",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                              }}
                            >
                              {f.code}
                            </td>
                            <td style={{ fontSize: "0.82rem" }}>
                              {f.fileName}
                            </td>
                            <td style={{ fontSize: "0.78rem" }}>
                              {f.fileType}
                            </td>
                            <td
                              style={{
                                fontFamily: "monospace",
                                fontSize: "0.78rem",
                              }}
                            >
                              {f.procedureRef}
                            </td>
                            <td style={{ fontSize: "0.78rem" }}>
                              {new Date(f.uploadedAt).toLocaleDateString(
                                "en-GB",
                              )}
                            </td>
                            <td style={{ fontSize: "0.78rem" }}>
                              {getUserName(f.uploadedBy)}
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "0.25rem" }}>
                                <button
                                  className={s.btnIcon}
                                  title="View evidence"
                                  onClick={() =>
                                    setPreviewEvidence({
                                      name: f.fileName,
                                      type: f.fileType,
                                      uploadedBy: getUserName(f.uploadedBy),
                                      uploadedAt: f.uploadedAt,
                                      size: f.fileSize,
                                      url: f.fileUrl,
                                    })
                                  }
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  className={s.btnIcon}
                                  title="Delete evidence"
                                  style={{ color: "var(--text-3)" }}
                                  onClick={() =>
                                    setConfirmDeleteEvidence({
                                      executionId: f.executionId,
                                      evidenceId: f.evidenceId,
                                      fileName: f.fileName,
                                    })
                                  }
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* --- Evidence preview modal --- */}
      {previewEvidence && (
        <DocumentPreviewModal
          document={previewEvidence}
          onClose={() => setPreviewEvidence(null)}
        />
      )}

      {/* --- Evidence delete confirm --- */}
      {confirmDeleteEvidence && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className={s.card}
            style={{ maxWidth: 420, width: "90%", padding: "1.5rem" }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              Delete Evidence
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--text-2)",
                marginBottom: "1.25rem",
              }}
            >
              Remove <strong>{confirmDeleteEvidence.fileName}</strong> from this
              audit? This action cannot be undone.
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                className={s.btnSecondary}
                onClick={() => setConfirmDeleteEvidence(null)}
              >
                Cancel
              </button>
              <button
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.4rem",
                  padding: "0.45rem 1rem",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => {
                  removeProcedureEvidence(
                    confirmDeleteEvidence.executionId,
                    confirmDeleteEvidence.evidenceId,
                  );
                  addToast?.({
                    type: "success",
                    title: "Deleted",
                    message: "Evidence removed.",
                  });
                  setConfirmDeleteEvidence(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Exception delete confirm --- */}
      {confirmDeleteException && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className={s.card}
            style={{ maxWidth: 420, width: "90%", padding: "1.5rem" }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              Delete Exception
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--text-2)",
                marginBottom: "1.25rem",
              }}
            >
              Permanently delete exception{" "}
              <strong>{confirmDeleteException.ref}</strong>? This cannot be
              undone.
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                className={s.btnSecondary}
                onClick={() => setConfirmDeleteException(null)}
              >
                Cancel
              </button>
              <button
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.4rem",
                  padding: "0.45rem 1rem",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => {
                  removeFieldworkException(confirmDeleteException.id);
                  addToast({
                    type: "success",
                    title: "Deleted",
                    message: `${confirmDeleteException.ref} removed.`,
                  });
                  setConfirmDeleteException(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: EXCEPTIONS REGISTER --- */}
      {currentProgramme && activeTab === "exceptions" && (
        <div>
          <div
            className={s.card}
            style={{
              borderLeft: "4px solid var(--text-3)",
              marginBottom: "0.75rem",
            }}
          >
            <div className={s.cardBody}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--text-2)",
                    }}
                  >
                    Open Exceptions Summary
                  </div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-2)",
                      marginTop: "0.15rem",
                    }}
                  >
                    Critical:{" "}
                    <strong style={{ color: "var(--text-3)" }}>
                      {excStats.critical}
                    </strong>{" "}
                    | High:{" "}
                    <strong style={{ color: "#ea580c" }}>
                      {excStats.high}
                    </strong>{" "}
                    | Medium:{" "}
                    <strong style={{ color: "#ca8a04" }}>
                      {excStats.medium}
                    </strong>{" "}
                    | Low: <strong>{excStats.low}</strong>
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-2)",
                      marginTop: "0.15rem",
                    }}
                  >
                    Total Exposure:{" "}
                    <strong>₦{(excStats.totalImpact / 1e6).toFixed(1)}M</strong>{" "}
                    | Classified:{" "}
                    <strong>
                      {
                        fieldworkExceptions.filter((e) => e.classification)
                          .length
                      }
                      /{excStats.total}
                    </strong>
                  </div>
                </div>
                <div
                  style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}
                >
                  {(["all", "Critical", "High", "Medium", "Low"] as const).map(
                    (f) => (
                      <button
                        key={f}
                        className={
                          excFilter === f ? s.filterChipActive : s.filterChip
                        }
                        onClick={() => setExcFilter(f)}
                      >
                        {f === "all"
                          ? `All (${excStats.total})`
                          : `${f} (${excStats[f.toLowerCase() as keyof typeof excStats]})`}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {filteredExceptions.length === 0 && (
            <div className={s.card}>
              <div className={s.cardBody}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem 0",
                    color: "var(--border)",
                    fontSize: "0.85rem",
                  }}
                >
                  No exceptions{" "}
                  {excFilter !== "all"
                    ? `with ${excFilter} severity`
                    : "logged yet"}
                  .
                </div>
              </div>
            </div>
          )}

          {filteredExceptions.map((exc) => (
            <div
              key={exc.id}
              className={s.card}
              style={{
                marginBottom: "0.75rem",
                borderLeft: `4px solid ${
                  exc.severity === "Critical"
                    ? "var(--text-3)"
                    : exc.severity === "High"
                      ? "#ea580c"
                      : exc.severity === "Medium"
                        ? "#ca8a04"
                        : "var(--primary)"
                }`,
              }}
            >
              <div className={s.cardBody}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1 }}>
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
                          fontSize: "0.82rem",
                        }}
                      >
                        {exc.ref}
                      </span>
                      <StatusBadge
                        label={exc.severity}
                        variant={severityVariant(exc.severity)}
                      />
                      <StatusBadge
                        label={exc.status}
                        variant={
                          exc.status === "Open"
                            ? "warning"
                            : exc.status === "Classified"
                              ? "success"
                              : exc.status === "Escalated"
                                ? "error"
                                : "info"
                        }
                      />
                      {exc.potentialAuditQuery && (
                        <StatusBadge label="Audit Query" variant="gold" />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-2)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {exc.auditArea} | {exc.procedureRef} | Assertion:{" "}
                      {exc.assertionAffected}
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-2)",
                        lineHeight: 1.6,
                      }}
                    >
                      {exc.finding}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "1.5rem",
                        marginTop: "0.5rem",
                        fontSize: "0.78rem",
                        color: "var(--text-2)",
                      }}
                    >
                      <span>
                        Financial Impact:{" "}
                        <strong>₦{exc.financialImpact.toLocaleString()}</strong>
                      </span>
                      <span>Qualitative: {exc.qualitativeImpact}</span>
                      <span>
                        Raised:{" "}
                        {new Date(exc.raisedAt).toLocaleDateString("en-GB")}
                      </span>
                      <span>By: {getUserName(exc.raisedBy)}</span>
                    </div>
                    {exc.classification && (
                      <div
                        style={{ fontSize: "0.78rem", marginTop: "0.35rem" }}
                      >
                        Classification:{" "}
                        <StatusBadge
                          label={exc.classification}
                          variant={
                            exc.classification === "Proceed to Audit Query"
                              ? "error"
                              : exc.classification === "Resolved: No Query"
                                ? "success"
                                : exc.classification === "Limitation"
                                  ? "warning"
                                  : "default"
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.35rem",
                      flexDirection: "column",
                    }}
                  >
                    {isLead && exc.status === "Open" && (
                      <button
                        className={s.btnOutline}
                        onClick={() =>
                          setClassifyId(classifyId === exc.id ? null : exc.id)
                        }
                        style={{ fontSize: "0.72rem" }}
                      >
                        Classify
                      </button>
                    )}
                    {(isLead || isSupervisor) &&
                      exc.severity === "Critical" &&
                      !exc.escalatedToHlg && (
                        <button
                          className={s.btnDanger}
                          onClick={() => {
                            escalateExceptionToHlg(exc.id);
                            addToast({
                              type: "error",
                              title: "Escalated to HLG",
                              message: `${exc.ref} escalated � Critical finding alert sent`,
                            });
                          }}
                          style={{ fontSize: "0.72rem" }}
                        >
                          Escalate to HLG
                        </button>
                      )}
                    <button
                      className={s.btnIcon}
                      title="Delete exception"
                      style={{ color: "var(--text-3)", marginTop: "0.15rem" }}
                      onClick={() =>
                        setConfirmDeleteException({ id: exc.id, ref: exc.ref })
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {classifyId === exc.id && (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.75rem",
                      background: "var(--border)",
                      borderRadius: "0.5rem",
                      display: "flex",
                      gap: "0.35rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {(
                      [
                        "Proceed to Audit Query",
                        "Resolved: No Query",
                        "Limitation",
                        "Below Materiality",
                      ] as ExceptionClassification[]
                    ).map((cl) => (
                      <button
                        key={cl}
                        className={s.btnOutline}
                        onClick={() => {
                          classifyException(exc.id, cl);
                          addToast({
                            type: "success",
                            title: "Exception Classified",
                            message: `${exc.ref} ? ${cl}`,
                          });
                          setClassifyId(null);
                        }}
                        style={{ fontSize: "0.72rem" }}
                      >
                        {cl}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- TAB: WORKPAPERS (grouped by Risk Area) --- */}
      {currentProgramme &&
        activeTab === "workpapers" &&
        (() => {
          /* Build a map of procedure workpaper refs ? risk area */
          const wpRefToArea: Record<string, string> = {};
          currentProgramme.procedures.forEach((p) => {
            if (p.workpaperRef) wpRefToArea[p.workpaperRef] = p.area;
          });

          /* Group workpapers by risk area */
          const wpByArea: Record<string, typeof filteredWorkpapers> = {};
          const unlinkedWPs: typeof filteredWorkpapers = [];
          filteredWorkpapers.forEach((wp) => {
            const area = wpRefToArea[wp.reference];
            if (area) {
              if (!wpByArea[area]) wpByArea[area] = [];
              wpByArea[area].push(wp);
            } else {
              unlinkedWPs.push(wp);
            }
          });

          /* Sort areas by section sortOrder */
          const sectionMap = new Map(
            (currentProgramme.sections ?? []).map((sec) => [sec.title, sec]),
          );
          const areaKeys = Object.keys(wpByArea).sort((a, b) => {
            const sa = sectionMap.get(a)?.sortOrder ?? 99;
            const sb = sectionMap.get(b)?.sortOrder ?? 99;
            return sa - sb;
          });

          const renderWPTable = (wps: typeof filteredWorkpapers) => (
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Prepared By</th>
                    <th>Prepared Date</th>
                    <th>Reviewed By</th>
                    <th>Status</th>
                    <th>Cross-Refs</th>
                  </tr>
                </thead>
                <tbody>
                  {wps
                    .sort((a, b) => a.reference.localeCompare(b.reference))
                    .map((wp) => {
                      const sc = statusColor[wp.status] || {
                        bg: "#f3f4f6",
                        color: "#374151",
                      };
                      return (
                        <tr key={wp.id}>
                          <td
                            style={{
                              fontWeight: 700,
                              fontFamily: "monospace",
                              fontSize: "0.82rem",
                            }}
                          >
                            {wp.reference}
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {wp.title}
                            {wp.notes && (
                              <div
                                style={{
                                  fontSize: "0.7rem",
                                  color: "var(--text-2)",
                                  marginTop: "0.2rem",
                                }}
                              >
                                {wp.notes}
                              </div>
                            )}
                          </td>
                          <td>
                            <InlineBadge
                              label={wp.category}
                              bg="var(--bg-card)"
                              color="var(--primary)"
                            />
                          </td>
                          <td style={{ fontSize: "0.78rem" }}>
                            {wp.preparedBy}
                          </td>
                          <td style={{ fontSize: "0.78rem" }}>
                            {new Date(wp.preparedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td style={{ fontSize: "0.78rem" }}>
                            {wp.reviewedBy || "-"}
                          </td>
                          <td>
                            <InlineBadge
                              label={wp.status}
                              bg={sc.bg}
                              color={sc.color}
                            />
                          </td>
                          <td
                            style={{
                              fontSize: "0.72rem",
                              fontFamily: "monospace",
                            }}
                          >
                            {wp.crossReferences?.join(", ") || "-"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          );

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Summary KPI */}
              <div className={s.kpiRow}>
                <div className={s.kpiCard}>
                  <div className={s.kpiIconPurple}>
                    <FolderOpen size={20} />
                  </div>
                  <div>
                    <div className={s.kpiLabel}>Total Workpapers</div>
                    <div className={s.kpiValue}>
                      {filteredWorkpapers.length}
                    </div>
                  </div>
                </div>
                <div className={s.kpiCard}>
                  <div className={s.kpiIconBlue}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <div className={s.kpiLabel}>Risk Areas Covered</div>
                    <div className={s.kpiValue}>{areaKeys.length}</div>
                  </div>
                </div>
                <div className={s.kpiCard}>
                  <div className={s.kpiIconGreen}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div className={s.kpiLabel}>Reviewed / Final</div>
                    <div className={s.kpiValue}>
                      {
                        filteredWorkpapers.filter(
                          (w) =>
                            w.status === "Reviewed" || w.status === "Final",
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </div>

              {filteredWorkpapers.length === 0 ? (
                <div className={s.card}>
                  <div className={s.cardBody}>
                    <div className={s.emptyState}>
                      <FolderOpen size={40} className={s.emptyIcon} />
                      <div className={s.emptyTitle}>No Workpapers Indexed</div>
                      <div className={s.emptyDesc}>
                        Workpapers will appear here as audit procedures are
                        performed. Each risk area generates its own workpapers.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Per-risk-area workpaper cards */}
                  {areaKeys.map((area) => {
                    const wps = wpByArea[area];
                    const section = sectionMap.get(area);
                    const riskColor = section
                      ? (sevColor[section.riskLevel] ?? {
                          bg: "#f3f4f6",
                          color: "#6b7280",
                        })
                      : { bg: "#f3f4f6", color: "#6b7280" };
                    return (
                      <div
                        key={area}
                        className={s.card}
                        style={{ borderLeft: `4px solid ${riskColor.color}` }}
                      >
                        <div className={s.cardHeader}>
                          <h3
                            className={s.cardTitle}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <FolderOpen size={15} />
                            Workpapers: {area}
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.4rem",
                              alignItems: "center",
                            }}
                          >
                            {section && (
                              <InlineBadge
                                label={`${section.riskLevel} RISK`}
                                bg={riskColor.bg}
                                color={riskColor.color}
                              />
                            )}
                            <InlineBadge
                              label={`${wps.length} W/P`}
                              bg="#ede9fe"
                              color="#5b21b6"
                            />
                          </div>
                        </div>
                        <div className={s.cardBody} style={{ padding: 0 }}>
                          {renderWPTable(wps)}
                        </div>
                      </div>
                    );
                  })}

                  {/* General / unlinked workpapers */}
                  {unlinkedWPs.length > 0 && (
                    <div className={s.card}>
                      <div className={s.cardHeader}>
                        <h3 className={s.cardTitle}>
                          <FolderOpen
                            size={15}
                            style={{ marginRight: "0.4rem" }}
                          />
                          General Workpapers
                        </h3>
                        <InlineBadge
                          label={`${unlinkedWPs.length} W/P`}
                          bg="#f3f4f6"
                          color="#6b7280"
                        />
                      </div>
                      <div className={s.cardBody} style={{ padding: 0 }}>
                        {renderWPTable(unlinkedWPs)}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Status summary footer */}
              {filteredWorkpapers.length > 0 && (
                <div
                  className={s.card}
                  style={{ background: "#faf5ff", border: "1px solid #e9d5ff" }}
                >
                  <div className={s.cardBody}>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "#6b21a8",
                        }}
                      >
                        Status Summary
                      </span>
                      {["Draft", "Prepared", "Reviewed", "Final"].map((st) => {
                        const count = filteredWorkpapers.filter(
                          (w) => w.status === st,
                        ).length;
                        const sc = statusColor[st] || {
                          bg: "#f3f4f6",
                          color: "#374151",
                        };
                        return (
                          <span
                            key={st}
                            style={{
                              fontSize: "0.75rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.35rem",
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: sc.color,
                                display: "inline-block",
                              }}
                            />
                            {st}: {count}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      {/* --- TAB: JOURNALS --- */}
      {currentProgramme && activeTab === "journals" && (
        <>
          <div className={s.kpiRow}>
            <div className={s.kpiCard}>
              <div className={s.kpiIconBlue}>
                <PenTool size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Total Journals</div>
                <div className={s.kpiValue}>{filteredJournals.length}</div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconGreen}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Agreed / Posted</div>
                <div className={s.kpiValue}>{overviewStats.journalAgreed}</div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconAmber}>
                <TrendingUp size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Net Effect</div>
                <div className={s.kpiValue} style={{ fontSize: "0.95rem" }}>
                  {fmtCurrency(overviewStats.journalTotal)}
                </div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconPurple}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Passed (Waived)</div>
                <div className={s.kpiValue}>
                  {filteredJournals.filter((j) => j.status === "Waived").length}
                </div>
              </div>
            </div>
          </div>

          {/* {isLead && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1rem",
              }}
            >
              <button
                className={s.btnPrimary}
                onClick={() => setShowAddJournal(true)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <PenTool size={14} /> Record Journal Entry
              </button>
            </div>
          )} */}

          {filteredJournals.map((journal) => {
            const sc = statusColor[journal.status] || {
              bg: "#f3f4f6",
              color: "#374151",
            };
            return (
              <div
                className={s.card}
                key={journal.id}
                style={{ marginBottom: "1rem" }}
              >
                <div className={s.cardHeader}>
                  <h3
                    className={s.cardTitle}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                    >
                      {journal.journalNumber}
                    </span>
                    <InlineBadge
                      label={journal.type}
                      bg="var(--bg-card)"
                      color="var(--primary)"
                    />
                    <InlineBadge
                      label={journal.status}
                      bg={sc.bg}
                      color={sc.color}
                    />
                  </h3>
                  {journal.workpaperRef && (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontFamily: "monospace",
                        color: "var(--text-3)",
                      }}
                    >
                      W/P: {journal.workpaperRef}
                    </span>
                  )}
                </div>
                <div className={s.cardBody}>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                      marginBottom: "1rem",
                      color: "var(--text-2)",
                    }}
                  >
                    {journal.description}
                  </p>
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>Account</th>
                          <th style={{ textAlign: "right" }}>Debit (?)</th>
                          <th style={{ textAlign: "right" }}>Credit (?)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {journal.entries.map((entry, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 600 }}>{entry.account}</td>
                            <td
                              style={{
                                textAlign: "right",
                                fontFamily: "monospace",
                              }}
                            >
                              {entry.debit > 0 ? fmtCurrency(entry.debit) : "-"}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                fontFamily: "monospace",
                              }}
                            >
                              {entry.credit > 0
                                ? fmtCurrency(entry.credit)
                                : "-"}
                            </td>
                          </tr>
                        ))}
                        <tr
                          style={{
                            fontWeight: 700,
                            borderTop: "2px solid var(--border)",
                          }}
                        >
                          <td>Net Effect on Financial Statements</td>
                          <td
                            colSpan={2}
                            style={{
                              textAlign: "right",
                              fontFamily: "monospace",
                            }}
                          >
                            {fmtCurrency(journal.netEffect)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "2rem",
                      flexWrap: "wrap",
                      marginTop: "0.75rem",
                      fontSize: "0.75rem",
                      color: "var(--text-3)",
                    }}
                  >
                    <span>
                      Affected Area: <strong>{journal.affectedArea}</strong>
                    </span>
                    <span>
                      Prepared By: <strong>{journal.preparedBy}</strong>
                    </span>
                    {journal.reviewedBy && (
                      <span>
                        Reviewed By: <strong>{journal.reviewedBy}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredJournals.length === 0 && (
            <div className={s.card}>
              <div className={s.cardBody}>
                <div className={s.emptyState}>
                  <PenTool size={40} className={s.emptyIcon} />
                  <div className={s.emptyTitle}>No Audit Journals</div>
                  <div className={s.emptyDesc}>
                    Adjusting and reclassifying journal entries will be recorded
                    here during fieldwork.
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- TAB: AUDIT COMMENTS --- */}
      {currentProgramme && activeTab === "comments" && (
        <>
          <div className={s.kpiRow}>
            <div className={s.kpiCard}>
              <div className={s.kpiIconBlue}>
                <MessageSquare size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Total Comments</div>
                <div className={s.kpiValue}>{filteredComments.length}</div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconGreen}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Resolved</div>
                <div className={s.kpiValue}>
                  {
                    filteredComments.filter(
                      (c) => c.status === "Resolved" || c.status === "Reported",
                    ).length
                  }
                </div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconAmber}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>High / Critical</div>
                <div className={s.kpiValue}>{overviewStats.commentsHigh}</div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconPurple}>
                <Eye size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>With Mgmt Response</div>
                <div className={s.kpiValue}>
                  {filteredComments.filter((c) => c.managementResponse).length}
                </div>
              </div>
            </div>
          </div>

          {isLead && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1rem",
              }}
            >
              <button
                className={s.btnPrimary}
                onClick={() => setShowAddComment(true)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <MessageSquare size={14} /> Record Audit Comment
              </button>
            </div>
          )}

          {filteredComments.map((comment) => {
            const sev = sevColor[comment.severity] || {
              bg: "#f3f4f6",
              color: "#374151",
            };
            const sc = statusColor[comment.status] || {
              bg: "#f3f4f6",
              color: "#374151",
            };
            return (
              <div
                className={s.card}
                key={comment.id}
                style={{ marginBottom: "1rem" }}
              >
                <div className={s.cardHeader}>
                  <h3
                    className={s.cardTitle}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                    >
                      {comment.referenceNumber}
                    </span>
                    <span>{comment.title}</span>
                    <InlineBadge
                      label={comment.severity}
                      bg={sev.bg}
                      color={sev.color}
                    />
                    <InlineBadge
                      label={comment.status}
                      bg={sc.bg}
                      color={sc.color}
                    />
                  </h3>
                </div>
                <div className={s.cardBody}>
                  {[
                    {
                      label: "Observation (Condition)",
                      value: comment.observation,
                    },
                    { label: "Criteria", value: comment.criteria },
                    { label: "Cause", value: comment.cause },
                    { label: "Effect", value: comment.effect },
                    { label: "Recommendation", value: comment.recommendation },
                  ].map((field) => (
                    <div key={field.label} className={s.detailRow}>
                      <span className={s.detailLabel}>{field.label}</span>
                      <span
                        className={s.detailValue}
                        style={{ lineHeight: 1.6 }}
                      >
                        {field.value}
                      </span>
                    </div>
                  ))}
                  {comment.managementResponse && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.75rem 1rem",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "#15803d",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.35rem",
                        }}
                      >
                        Management Response
                      </div>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--text-2)",
                          lineHeight: 1.6,
                        }}
                      >
                        {comment.managementResponse}
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: "2rem",
                      flexWrap: "wrap",
                      marginTop: "0.75rem",
                      fontSize: "0.75rem",
                      color: "var(--text-3)",
                    }}
                  >
                    {comment.responsibleParty && (
                      <span>
                        Responsible: <strong>{comment.responsibleParty}</strong>
                      </span>
                    )}
                    {comment.targetDate && (
                      <span>
                        Target Date: <strong>{comment.targetDate}</strong>
                      </span>
                    )}
                    <span>
                      Prepared By: <strong>{comment.preparedBy}</strong>
                    </span>
                    {comment.reviewedBy && (
                      <span>
                        Reviewed By: <strong>{comment.reviewedBy}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredComments.length === 0 && (
            <div className={s.card}>
              <div className={s.cardBody}>
                <div className={s.emptyState}>
                  <MessageSquare size={40} className={s.emptyIcon} />
                  <div className={s.emptyTitle}>No Audit Comments</div>
                  <div className={s.emptyDesc}>
                    Management letter points and audit comments will be
                    documented here.
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- TAB: FINANCIAL STATEMENTS --- */}
      {currentProgramme && activeTab === "statements" && (
        <>
          {/* ── KPI Row ───────────────────────────────────────────────── */}
          <div className={s.kpiRow}>
            <div className={s.kpiCard}>
              <div className={s.kpiIconBlue}>
                <DollarSign size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Source Document</div>
                <div
                  className={s.kpiValue}
                  style={{ fontSize: "0.82rem", textTransform: "none" }}
                >
                  {procSource === "fs" ? "Financial Statements" : "Trial Balance"}
                </div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconGreen}>
                <PenTool size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Active Journals</div>
                <div className={s.kpiValue}>
                  {filteredJournals.filter((j) => j.status !== "Waived").length}
                </div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconAmber}>
                <TrendingUp size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Net Adj. Effect</div>
                <div
                  className={s.kpiValue}
                  style={{
                    fontSize: stmtTotalAdjEffect !== 0 ? "0.82rem" : undefined,
                  }}
                >
                  {stmtTotalAdjEffect !== 0
                    ? fmtCurrency(Math.abs(stmtTotalAdjEffect))
                    : "—"}
                </div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconPurple}>
                <BarChart3 size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Budget Utilisation</div>
                <div className={s.kpiValue}>{stmtBudgetUtil}%</div>
              </div>
            </div>
          </div>

          {/* ── Source / adjustment banner ─────────────────────────────── */}
          <div className={s.card} style={{ marginBottom: "0.75rem" }}>
            <div
              className={s.cardBody}
              style={{
                padding: "0.65rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <Layers size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-2)" }}>
                <strong>Source:</strong>{" "}
                {procSource === "fs"
                  ? "Financial Statements (imported for Analytical Review)"
                  : "Trial Balance (imported for Analytical Review)"}
              </span>
              <span style={{ color: "var(--border)" }}>|</span>
              {stmtHasJournals ? (
                <span style={{ fontSize: "0.82rem", color: "#92400e" }}>
                  <strong>
                    {filteredJournals.filter((j) => j.status !== "Waived").length}{" "}
                    journal entr
                    {filteredJournals.filter((j) => j.status !== "Waived").length === 1
                      ? "y"
                      : "ies"}
                  </strong>{" "}
                  applied — adjusted amounts shown
                </span>
              ) : (
                <span style={{ fontSize: "0.82rem", color: "var(--text-3)" }}>
                  No audit journal adjustments — original amounts shown
                </span>
              )}
            </div>
          </div>

          {/* ── Section-by-section financial data ─────────────────────── */}
          {stmtSections.map((section) => {
            const rows = stmtBaseRows.filter((r) => r.section === section);
            if (rows.length === 0) return null;
            return (
              <div
                className={s.card}
                key={section}
                style={{ marginBottom: "1rem" }}
              >
                <div className={s.cardHeader}>
                  <h3 className={s.cardTitle}>
                    <DollarSign
                      size={15}
                      style={{ marginRight: "0.4rem", opacity: 0.6 }}
                    />
                    {stmtSectionLabels[section]}
                  </h3>
                </div>
                <div className={s.cardBody} style={{ padding: 0 }}>
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th style={{ width: "5.5rem" }}>Code</th>
                          <th>Account / Line Item</th>
                          <th style={{ textAlign: "right" }}>Budget (₦)</th>
                          <th style={{ textAlign: "right" }}>Prior Year (₦)</th>
                          <th style={{ textAlign: "right" }}>
                            Current Year (₦)
                          </th>
                          {stmtHasJournals && (
                            <th style={{ textAlign: "right" }}>
                              Audit Adj. (₦)
                            </th>
                          )}
                          {stmtHasJournals && (
                            <th style={{ textAlign: "right" }}>Adjusted (₦)</th>
                          )}
                          <th style={{ textAlign: "right" }}>Budget Var.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => {
                          const adjKey = row.account.toLowerCase().trim();
                          const adj = stmtAdjMap.get(adjKey) ?? 0;
                          const finalAmt = row.current + adj;
                          const budgetVar =
                            row.budget > 0
                              ? ((finalAmt - row.budget) / row.budget) * 100
                              : null;
                          const isSectionRow =
                            row.type === "total" || row.type === "pbt";
                          return (
                            <tr
                              key={row.id}
                              style={
                                isSectionRow
                                  ? {
                                      fontWeight: 700,
                                      borderTop: "2px solid var(--border)",
                                      background: "var(--bg-hover)",
                                    }
                                  : undefined
                              }
                            >
                              <td
                                style={{
                                  fontFamily: "monospace",
                                  fontSize: "0.72rem",
                                  color: "var(--text-3)",
                                }}
                              >
                                {row.code || ""}
                              </td>
                              <td
                                style={{
                                  fontWeight: isSectionRow ? 700 : undefined,
                                }}
                              >
                                {row.account}
                              </td>
                              <td
                                style={{
                                  textAlign: "right",
                                  fontFamily: "monospace",
                                  fontSize: "0.8rem",
                                  color: "var(--text-3)",
                                }}
                              >
                                {row.budget > 0
                                  ? fmtCurrency(row.budget)
                                  : "—"}
                              </td>
                              <td
                                style={{
                                  textAlign: "right",
                                  fontFamily: "monospace",
                                  fontSize: "0.8rem",
                                  color: "var(--text-2)",
                                }}
                              >
                                {row.prior > 0 ? fmtCurrency(row.prior) : "—"}
                              </td>
                              <td
                                style={{
                                  textAlign: "right",
                                  fontFamily: "monospace",
                                  fontSize: "0.8rem",
                                }}
                              >
                                {fmtCurrency(row.current)}
                              </td>
                              {stmtHasJournals && (
                                <td
                                  style={{
                                    textAlign: "right",
                                    fontFamily: "monospace",
                                    fontSize: "0.8rem",
                                    color:
                                      adj > 0
                                        ? "#166534"
                                        : adj < 0
                                          ? "#991b1b"
                                          : "var(--text-3)",
                                    fontWeight: adj !== 0 ? 600 : undefined,
                                  }}
                                >
                                  {adj !== 0
                                    ? `${adj > 0 ? "+" : ""}${fmtCurrency(adj)}`
                                    : "—"}
                                </td>
                              )}
                              {stmtHasJournals && (
                                <td
                                  style={{
                                    textAlign: "right",
                                    fontFamily: "monospace",
                                    fontSize: "0.8rem",
                                    fontWeight: adj !== 0 ? 700 : undefined,
                                  }}
                                >
                                  {fmtCurrency(finalAmt)}
                                </td>
                              )}
                              <td
                                style={{
                                  textAlign: "right",
                                  fontSize: "0.78rem",
                                  fontWeight: isSectionRow ? 700 : undefined,
                                  color:
                                    budgetVar === null
                                      ? "var(--text-3)"
                                      : budgetVar > 10
                                        ? "#991b1b"
                                        : budgetVar < -10
                                          ? "#92400e"
                                          : "var(--text-2)",
                                }}
                              >
                                {budgetVar !== null
                                  ? `${budgetVar >= 0 ? "+" : ""}${budgetVar.toFixed(1)}%`
                                  : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── Budget vs Actual Comparison Summary ───────────────────── */}
          <div className={s.card} style={{ marginBottom: "1rem" }}>
            <div className={s.cardHeader}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}
              >
                <h3 className={s.cardTitle} style={{ margin: 0 }}>
                  <BarChart3 size={16} style={{ marginRight: "0.5rem" }} />
                  Budget vs Actual Comparison &mdash; FY{" "}
                  {selectedAudit?.year ?? "2022"}/
                  {String((selectedAudit?.year ?? 2022) + 1).slice(-2)}
                </h3>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-3)",
                    fontStyle: "italic",
                  }}
                >
                  ISA 520 · IPSAS 24 — Presentation of Budget Information
                </span>
              </div>
            </div>
            <div className={s.cardBody} style={{ padding: 0 }}>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th style={{ textAlign: "right" }}>
                        Approved Budget (₦)
                      </th>
                      <th style={{ textAlign: "right" }}>
                        Actual / Adjusted (₦)
                      </th>
                      <th style={{ textAlign: "right" }}>Variance (₦)</th>
                      <th style={{ textAlign: "right" }}>% Utilised</th>
                      <th>IPSAS 24 Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stmtSections.map((section) => {
                      const sectionRows = stmtBaseRows.filter(
                        (r) => r.section === section,
                      );
                      const totalRow =
                        sectionRows.find(
                          (r) => r.type === "total" || r.type === "pbt",
                        ) ?? sectionRows[sectionRows.length - 1];
                      if (!totalRow || totalRow.budget <= 0) return null;

                      /* Apply section-level journal adjustments */
                      const sectionAdj = filteredJournals
                        .filter((j) => j.status !== "Waived")
                        .filter((j) => {
                          const area = j.affectedArea.toLowerCase();
                          const label = (
                            stmtSectionLabels[section] ?? ""
                          ).toLowerCase();
                          return (
                            label.includes(area) ||
                            area.includes(section) ||
                            j.entries.some((e) =>
                              sectionRows.some(
                                (r) =>
                                  r.account.toLowerCase().trim() ===
                                  e.account.toLowerCase().trim(),
                              ),
                            )
                          );
                        })
                        .reduce((sum, j) => sum + j.netEffect, 0);

                      const actual = totalRow.current + sectionAdj;
                      const variance = actual - totalRow.budget;
                      const pctUtil = (actual / totalRow.budget) * 100;

                      let note = "";
                      let noteColor = "var(--text-2)";
                      if (Math.abs(pctUtil - 100) <= 5) {
                        note = "On target — within 5% of budget";
                        noteColor = "#166534";
                      } else if (pctUtil > 120) {
                        note =
                          "Significantly over budget — management explanation required";
                        noteColor = "#991b1b";
                      } else if (pctUtil > 100) {
                        note = "Marginally over budget — document reasons";
                        noteColor = "#92400e";
                      } else if (pctUtil < 60) {
                        note =
                          "Significantly under-utilised — review budget assumptions";
                        noteColor = "#92400e";
                      } else if (pctUtil < 80) {
                        note =
                          "Under-utilised — review capital/project execution";
                        noteColor = "#92400e";
                      } else {
                        note = "Within acceptable range";
                        noteColor = "#166534";
                      }

                      return (
                        <tr key={`bva-${section}`}>
                          <td style={{ fontWeight: 600 }}>
                            {stmtSectionLabels[section]}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              fontFamily: "monospace",
                              fontSize: "0.82rem",
                              color: "var(--text-3)",
                            }}
                          >
                            {fmtCurrency(totalRow.budget)}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              fontFamily: "monospace",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                            }}
                          >
                            {fmtCurrency(actual)}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              fontFamily: "monospace",
                              fontSize: "0.82rem",
                              color: variance > 0 ? "#991b1b" : "#166534",
                              fontWeight: 600,
                            }}
                          >
                            {variance !== 0
                              ? `${variance > 0 ? "+" : ""}${fmtCurrency(Math.abs(variance))} (${variance > 0 ? "Over" : "Under"})`
                              : "—"}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              color:
                                pctUtil > 110
                                  ? "#991b1b"
                                  : pctUtil < 70
                                    ? "#92400e"
                                    : "#166534",
                            }}
                          >
                            {pctUtil.toFixed(1)}%
                          </td>
                          <td
                            style={{ fontSize: "0.75rem", color: noteColor }}
                          >
                            {note}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
      {/* --- TAB: COMPLETION CHECKLIST --- */}
      {currentProgramme && activeTab === "completion" && (
        <>
          <div className={s.kpiRow}>
            <div className={s.kpiCard}>
              <div className={s.kpiIconGreen}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Completed</div>
                <div className={s.kpiValue}>
                  {overviewStats.checkDone}/{overviewStats.checkTotal}
                </div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconAmber}>
                <Clock size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Outstanding</div>
                <div className={s.kpiValue}>
                  {overviewStats.checkTotal - overviewStats.checkDone}
                </div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconBlue}>
                <BarChart3 size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Completion %</div>
                <div className={s.kpiValue}>
                  {overviewStats.checkTotal > 0
                    ? Math.round(
                        (overviewStats.checkDone / overviewStats.checkTotal) *
                          100,
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>

          {(() => {
            const sections = [
              ...new Set(filteredChecklist.map((c) => c.section)),
            ];
            return sections.map((section) => {
              const items = filteredChecklist.filter(
                (c) => c.section === section,
              );
              const done = items.filter((c) => c.completed).length;
              return (
                <div
                  className={s.card}
                  key={section}
                  style={{ marginBottom: "1rem" }}
                >
                  <div className={s.cardHeader}>
                    <h3
                      className={s.cardTitle}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {section}
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 400,
                          color: "var(--text-3)",
                        }}
                      >
                        ({done}/{items.length})
                      </span>
                    </h3>
                    <div
                      style={{
                        width: 100,
                        height: 6,
                        background: "var(--border)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${items.length > 0 ? (done / items.length) * 100 : 0}%`,
                          background: "var(--primary)",
                          borderRadius: 3,
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </div>
                  <div className={s.cardBody} style={{ padding: 0 }}>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.75rem 1.5rem",
                          borderBottom: "1px solid var(--border)",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          toggleCompletionItem(item.id, user?.id || "")
                        }
                      >
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "4px",
                            border: item.completed
                              ? "2px solid var(--primary)"
                              : "2px solid var(--border)",
                            background: item.completed
                              ? "var(--primary)"
                              : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "all 0.15s",
                          }}
                        >
                          {item.completed && (
                            <Check
                              size={14}
                              style={{ color: "var(--bg-card)" }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "0.82rem",
                              fontWeight: 500,
                              color: item.completed
                                ? "var(--text-3)"
                                : "var(--text)",
                              textDecoration: item.completed
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {item.item}
                          </div>
                          {(item.notes || item.reference) && (
                            <div
                              style={{
                                display: "flex",
                                gap: "1.5rem",
                                marginTop: "0.2rem",
                              }}
                            >
                              {item.reference && (
                                <span
                                  style={{
                                    fontSize: "0.7rem",
                                    fontFamily: "monospace",
                                    color: "var(--primary)",
                                  }}
                                >
                                  Ref: {item.reference}
                                </span>
                              )}
                              {item.notes && (
                                <span
                                  style={{
                                    fontSize: "0.7rem",
                                    color: "var(--text-3)",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {item.notes}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {item.completed && item.completedBy && (
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-3)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.completedBy}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </>
      )}

      {/* ----------------------------------------------------------
           MODAL: SET MATERIALITY THRESHOLDS (ISA 320)
      ---------------------------------------------------------- */}
      {showMatModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9990,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15,23,42,0.72)",
              backdropFilter: "blur(6px)",
            }}
            onClick={() => setShowMatModal(false)}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              background: "var(--bg-card,var(--bg-card))",
              borderRadius: "16px",
              width: "min(680px,96vw)",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 32px 72px rgba(0,0,0,0.28)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "var(--bg-card) 0%, var(--primary) 100%)",
                padding: "1.5rem 1.75rem",
                borderRadius: "16px 16px 0 0",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: "10px",
                    padding: "0.5rem",
                    display: "flex",
                  }}
                >
                  <Calculator size={22} style={{ color: "var(--bg-card)" }} />
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      color: "var(--bg-card)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                    }}
                  >
                    Set Materiality Thresholds
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--bg-card)",
                      fontSize: "0.75rem",
                      marginTop: "0.2rem",
                    }}
                  >
                    ISA 320 � Materiality in Planning and Performance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMatModal(false)}
                style={{
                  background: "var(--bg-card)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.4rem",
                  cursor: "pointer",
                  color: "var(--bg-card)",
                  display: "flex",
                }}
              >
                <X size={18} />
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: "1.5rem 1.75rem", flex: 1 }}>
              {/* Basis selector */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--text-2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Basis of Materiality
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "0.5rem",
                  }}
                >
                  {(
                    [
                      "Total Expenditure",
                      "Total Revenue",
                      "Total Assets",
                      "Net Assets",
                    ] as const
                  ).map((basis) => (
                    <button
                      key={basis}
                      onClick={() =>
                        setMatForm((f) => ({ ...f, basisLabel: basis }))
                      }
                      style={{
                        padding: "0.6rem 0.75rem",
                        borderRadius: "8px",
                        border:
                          matForm.basisLabel === basis
                            ? "2px solid var(--primary)"
                            : "2px solid var(--border)",
                        background:
                          matForm.basisLabel === basis
                            ? "var(--bg-card)"
                            : "transparent",
                        color:
                          matForm.basisLabel === basis
                            ? "var(--primary)"
                            : "var(--text-2)",
                        fontWeight: 600,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {basis}
                    </button>
                  ))}
                </div>
              </div>
              {/* Amount + Percentage */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <label className={s.label}>Basis Amount (?)</label>
                  <input
                    className={s.input}
                    placeholder="e.g. 5,200,000,000"
                    value={matForm.basisAmount}
                    onChange={(e) =>
                      setMatForm((f) => ({ ...f, basisAmount: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={s.label}>Percentage (%)</label>
                  <input
                    className={s.input}
                    type="number"
                    step="0.1"
                    placeholder="e.g. 2"
                    value={matForm.percentage}
                    onChange={(e) =>
                      setMatForm((f) => ({ ...f, percentage: e.target.value }))
                    }
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "0.35rem",
                      marginTop: "0.4rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {["0.5", "1", "2", "3", "5"].map((p) => (
                      <button
                        key={p}
                        onClick={() =>
                          setMatForm((f) => ({ ...f, percentage: p }))
                        }
                        style={{
                          padding: "0.2rem 0.5rem",
                          borderRadius: "6px",
                          border:
                            matForm.percentage === p
                              ? "1.5px solid var(--primary)"
                              : "1.5px solid var(--border)",
                          background:
                            matForm.percentage === p
                              ? "var(--bg-card)"
                              : "transparent",
                          color:
                            matForm.percentage === p
                              ? "var(--primary)"
                              : "var(--text-3)",
                          fontSize: "0.72rem",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Live preview */}
              {matOverall > 0 && (
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--primary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Live Threshold Preview
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "0.75rem",
                    }}
                  >
                    {[
                      {
                        label: "Overall Materiality",
                        value: matOverall,
                        color: "var(--primary)",
                        bg: "var(--bg-card)",
                      },
                      {
                        label: "Performance Materiality (70%)",
                        value: matPerformance,
                        color: "#7c3aed",
                        bg: "#f5f3ff",
                      },
                      {
                        label: "Clearly Trivial (5%)",
                        value: matTrivial,
                        color: "var(--primary)",
                        bg: "var(--bg-card)",
                      },
                    ].map((t) => (
                      <div
                        key={t.label}
                        style={{
                          background: t.bg,
                          borderRadius: "8px",
                          padding: "0.6rem 0.75rem",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.62rem",
                            color: t.color,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {t.label}
                        </div>
                        <div
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: 800,
                            color: t.color,
                            fontFamily: "monospace",
                          }}
                        >
                          {fmtCurrency(t.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Footer */}
            <div
              style={{
                padding: "1rem 1.75rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--surface-2,var(--border))",
                borderRadius: "0 0 16px 16px",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-3)",
                  fontStyle: "italic",
                }}
              >
                Ref: ISA 320 � Audit materiality must be documented in the
                planning file
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={s.btnOutline}
                  onClick={() => setShowMatModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={s.btnPrimary}
                  onClick={handleSaveMateriality}
                  style={{
                    background: "var(--bg-card),var(--primary))",
                    border: "none",
                  }}
                >
                  <Check size={14} style={{ marginRight: "0.35rem" }} /> Save
                  Thresholds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------
           MODAL: RECORD JOURNAL ENTRY
      ---------------------------------------------------------- */}
      {showAddJournal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9990,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15,23,42,0.72)",
              backdropFilter: "blur(6px)",
            }}
            onClick={() => setShowAddJournal(false)}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              background: "var(--bg-card,var(--bg-card))",
              borderRadius: "16px",
              width: "min(720px,96vw)",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 32px 72px rgba(0,0,0,0.28)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "var(--bg-card) 100%)",
                padding: "1.5rem 1.75rem",
                borderRadius: "16px 16px 0 0",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: "10px",
                    padding: "0.5rem",
                    display: "flex",
                  }}
                >
                  <PenTool size={22} style={{ color: "var(--bg-card)" }} />
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      color: "var(--bg-card)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                    }}
                  >
                    Record Journal Entry
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--bg-card)",
                      fontSize: "0.75rem",
                      marginTop: "0.2rem",
                    }}
                  >
                    ISA 330 � Document audit adjustments and reclassifications
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddJournal(false)}
                style={{
                  background: "var(--bg-card)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.4rem",
                  cursor: "pointer",
                  color: "var(--bg-card)",
                  display: "flex",
                }}
              >
                <X size={18} />
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: "1.5rem 1.75rem", flex: 1 }}>
              {/* Journal type */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--text-2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Journal Type
                </label>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  {(
                    [
                      {
                        val: "Adjusting",
                        label: "AJE � Audit Journal Entry",
                        color: "var(--text-3)",
                        bg: "var(--text-3)",
                      },
                      {
                        val: "Reclassifying",
                        label: "RJE � Reclassification Entry",
                        color: "var(--text-3)",
                        bg: "var(--text-3)",
                      },
                      {
                        val: "Passed",
                        label: "PJE � Passed Difference",
                        color: "#7c3aed",
                        bg: "#f5f3ff",
                      },
                      {
                        val: "Proposed",
                        label: "EJE � Unadjusted Entry",
                        color: "var(--text-2)",
                        bg: "var(--border)",
                      },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.val}
                      onClick={() =>
                        setJournalForm((f) => ({
                          ...f,
                          type: t.val as typeof f.type,
                        }))
                      }
                      style={{
                        padding: "0.45rem 0.85rem",
                        borderRadius: "8px",
                        border:
                          journalForm.type === t.val
                            ? `2px solid ${t.color}`
                            : "2px solid var(--border)",
                        background:
                          journalForm.type === t.val ? t.bg : "transparent",
                        color:
                          journalForm.type === t.val
                            ? t.color
                            : "var(--text-2)",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {t.val} � {t.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Description + Area + W/P Ref */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className={s.label}>Description / Narration</label>
                  <textarea
                    className={s.input}
                    rows={2}
                    placeholder="e.g. Adjustment for unrecorded salary arrears for Q3 2024"
                    value={journalForm.description}
                    onChange={(e) =>
                      setJournalForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={s.label}>Affected Area / Vote</label>
                  <input
                    className={s.input}
                    placeholder="e.g. Personnel Costs"
                    value={journalForm.affectedArea}
                    onChange={(e) =>
                      setJournalForm((f) => ({
                        ...f,
                        affectedArea: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={s.label}>Workpaper Reference</label>
                  <input
                    className={s.input}
                    placeholder="e.g. WP-102"
                    value={journalForm.workpaperRef}
                    onChange={(e) =>
                      setJournalForm((f) => ({
                        ...f,
                        workpaperRef: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              {/* Debit / Credit lines */}
              <div
                style={{
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "var(--surface-2,var(--border))",
                    padding: "0.5rem 0.75rem",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: "0.5rem",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--text-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  <span>Account / Description</span>
                  <span>Debit (Dr) ?</span>
                  <span>Credit (Cr) ?</span>
                  <span />
                </div>
                {journalEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr auto",
                      gap: "0.5rem",
                      padding: "0.5rem 0.75rem",
                      borderTop: "1px solid var(--border)",
                      alignItems: "center",
                    }}
                  >
                    <input
                      className={s.input}
                      style={{ margin: 0, fontSize: "0.8rem" }}
                      placeholder="Account name"
                      value={entry.account}
                      onChange={(e) =>
                        setJournalEntries((es) =>
                          es.map((r, i) =>
                            i === idx ? { ...r, account: e.target.value } : r,
                          ),
                        )
                      }
                    />
                    <input
                      className={s.input}
                      style={{ margin: 0, fontSize: "0.8rem" }}
                      type="number"
                      placeholder="0.00"
                      value={entry.debit}
                      onChange={(e) =>
                        setJournalEntries((es) =>
                          es.map((r, i) =>
                            i === idx ? { ...r, debit: e.target.value } : r,
                          ),
                        )
                      }
                    />
                    <input
                      className={s.input}
                      style={{ margin: 0, fontSize: "0.8rem" }}
                      type="number"
                      placeholder="0.00"
                      value={entry.credit}
                      onChange={(e) =>
                        setJournalEntries((es) =>
                          es.map((r, i) =>
                            i === idx ? { ...r, credit: e.target.value } : r,
                          ),
                        )
                      }
                    />
                    {journalEntries.length > 2 && (
                      <button
                        onClick={() =>
                          setJournalEntries((es) =>
                            es.filter((_, i) => i !== idx),
                          )
                        }
                        style={{
                          background: "var(--text-3)",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.3rem",
                          cursor: "pointer",
                          color: "var(--text-3)",
                          display: "flex",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
                {/* Balance row */}
                {(() => {
                  const totalDr = journalEntries.reduce(
                    (s, e) => s + (parseFloat(e.debit) || 0),
                    0,
                  );
                  const totalCr = journalEntries.reduce(
                    (s, e) => s + (parseFloat(e.credit) || 0),
                    0,
                  );
                  const balanced = Math.abs(totalDr - totalCr) < 0.01;
                  return (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr auto",
                        gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        borderTop: "2px solid var(--border)",
                        background: balanced
                          ? "var(--bg-card)"
                          : "var(--text-3)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: balanced ? "var(--primary)" : "var(--text-3)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        {balanced ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <AlertTriangle size={14} />
                        )}
                        {balanced ? "Balanced" : "Out of Balance"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          fontFamily: "monospace",
                          color: "var(--text-2)",
                        }}
                      >
                        {fmtCurrency(totalDr)}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          fontFamily: "monospace",
                          color: "var(--text-2)",
                        }}
                      >
                        {fmtCurrency(totalCr)}
                      </div>
                      <div />
                    </div>
                  );
                })()}
              </div>
              <button
                onClick={() =>
                  setJournalEntries((es) => [
                    ...es,
                    { account: "", debit: "", credit: "" },
                  ])
                }
                style={{
                  background: "none",
                  border: "1.5px dashed var(--border)",
                  borderRadius: "8px",
                  padding: "0.45rem 0.85rem",
                  cursor: "pointer",
                  color: "var(--primary)",
                  fontSize: "0.78rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Plus size={14} /> Add Line
              </button>
            </div>
            {/* Footer */}
            <div
              style={{
                padding: "1rem 1.75rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--surface-2,var(--border))",
                borderRadius: "0 0 16px 16px",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-3)",
                  fontStyle: "italic",
                }}
              >
                Ref: ISA 330 � Audit adjustments must be approved by Audit Lead
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={s.btnOutline}
                  onClick={() => setShowAddJournal(false)}
                >
                  Cancel
                </button>
                <button
                  className={s.btnPrimary}
                  onClick={handleAddJournal}
                  style={{
                    background: "var(--bg-card))",
                    border: "none",
                  }}
                >
                  <PenTool size={14} style={{ marginRight: "0.35rem" }} /> Save
                  Journal Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------
           MODAL: RECORD AUDIT COMMENT (CCEE)
      ---------------------------------------------------------- */}
      {showAddComment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9990,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15,23,42,0.72)",
              backdropFilter: "blur(6px)",
            }}
            onClick={() => setShowAddComment(false)}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              background: "var(--bg-card,var(--bg-card))",
              borderRadius: "16px",
              width: "min(760px,96vw)",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 32px 72px rgba(0,0,0,0.28)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "var(--bg-card) 0%, var(--text-3) 100%)",
                padding: "1.5rem 1.75rem",
                borderRadius: "16px 16px 0 0",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: "10px",
                    padding: "0.5rem",
                    display: "flex",
                  }}
                >
                  <MessageSquare
                    size={22}
                    style={{ color: "var(--bg-card)" }}
                  />
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      color: "var(--bg-card)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                    }}
                  >
                    Record Audit Comment
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--bg-card)",
                      fontSize: "0.75rem",
                      marginTop: "0.2rem",
                    }}
                  >
                    ISA 265 � Communicate deficiencies in internal control using
                    CCEE framework
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddComment(false)}
                style={{
                  background: "var(--bg-card)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.4rem",
                  cursor: "pointer",
                  color: "var(--bg-card)",
                  display: "flex",
                }}
              >
                <X size={18} />
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: "1.5rem 1.75rem", flex: 1 }}>
              {/* Severity + Title */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--text-2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Severity / Risk Rating
                </label>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  {(
                    [
                      { val: "Low", color: "#16a34a", bg: "var(--bg-card)" },
                      {
                        val: "Medium",
                        color: "var(--text-3)",
                        bg: "var(--text-3)",
                      },
                      {
                        val: "High",
                        color: "var(--text-3)",
                        bg: "var(--text-3)",
                      },
                      { val: "Critical", color: "#7c2d12", bg: "#fff7ed" },
                    ] as const
                  ).map((sv) => (
                    <button
                      key={sv.val}
                      onClick={() =>
                        setCommentForm((f) => ({ ...f, severity: sv.val }))
                      }
                      style={{
                        padding: "0.45rem 1rem",
                        borderRadius: "8px",
                        border:
                          commentForm.severity === sv.val
                            ? `2px solid ${sv.color}`
                            : "2px solid var(--border)",
                        background:
                          commentForm.severity === sv.val
                            ? sv.bg
                            : "transparent",
                        color:
                          commentForm.severity === sv.val
                            ? sv.color
                            : "var(--text-2)",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {sv.val}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label className={s.label}>Finding Title</label>
                <input
                  className={s.input}
                  placeholder="e.g. Unreconciled bank statements � Ministry of Finance"
                  value={commentForm.title}
                  onChange={(e) =>
                    setCommentForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              {/* CCEE Fields */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  marginBottom: "1.25rem",
                }}
              >
                {(
                  [
                    {
                      key: "observation",
                      num: "?",
                      label: "Observation (Condition)",
                      tag: "THE WHAT",
                      placeholder:
                        "What did we find? Describe the control weakness or non-compliance.",
                      color: "var(--text-3)",
                    },
                    {
                      key: "criteria",
                      num: "?",
                      label: "Criteria",
                      tag: "THE STANDARD",
                      placeholder:
                        "What should it be? Reference the applicable law, regulation or policy.",
                      color: "var(--text-3)",
                    },
                    {
                      key: "cause",
                      num: "?",
                      label: "Cause",
                      tag: "THE WHY",
                      placeholder:
                        "Why did this happen? Identify the root cause of the weakness.",
                      color: "#7c3aed",
                    },
                    {
                      key: "effect",
                      num: "?",
                      label: "Effect / Risk",
                      tag: "THE IMPACT",
                      placeholder:
                        "What is the financial, compliance or operational impact?",
                      color: "var(--primary)",
                    },
                    {
                      key: "recommendation",
                      num: "?",
                      label: "Recommendation",
                      tag: "THE REMEDY",
                      placeholder:
                        "What corrective action is required? Be specific and actionable.",
                      color: "var(--primary)",
                    },
                  ] as {
                    key: keyof typeof commentForm;
                    num: string;
                    label: string;
                    tag: string;
                    placeholder: string;
                    color: string;
                  }[]
                ).map((f) => (
                  <div key={f.key}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <span style={{ fontSize: "1rem", color: f.color }}>
                        {f.num}
                      </span>
                      <label
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "var(--text)",
                        }}
                      >
                        {f.label}
                      </label>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          background: f.color + "18",
                          color: f.color,
                          borderRadius: "4px",
                          padding: "0.1rem 0.4rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {f.tag}
                      </span>
                    </div>
                    <textarea
                      className={s.input}
                      rows={2}
                      placeholder={f.placeholder}
                      value={commentForm[f.key] as string}
                      onChange={(e) =>
                        setCommentForm((prev) => ({
                          ...prev,
                          [f.key]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
              {/* Responsible party + Target date */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label className={s.label}>Responsible Party / Auditee</label>
                  <input
                    className={s.input}
                    placeholder="e.g. Director of Finance"
                    value={commentForm.responsibleParty}
                    onChange={(e) =>
                      setCommentForm((f) => ({
                        ...f,
                        responsibleParty: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={s.label}>Target Resolution Date</label>
                  <input
                    className={s.input}
                    type="date"
                    value={commentForm.targetDate}
                    onChange={(e) =>
                      setCommentForm((f) => ({
                        ...f,
                        targetDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            {/* Footer */}
            <div
              style={{
                padding: "1rem 1.75rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--surface-2,var(--border))",
                borderRadius: "0 0 16px 16px",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-3)",
                  fontStyle: "italic",
                }}
              >
                Ref: ISA 265 � All material deficiencies must be communicated in
                writing to management
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={s.btnOutline}
                  onClick={() => setShowAddComment(false)}
                >
                  Cancel
                </button>
                <button
                  className={s.btnPrimary}
                  onClick={handleAddComment}
                  style={{
                    background: "var(--bg-card),var(--text-3))",
                    border: "none",
                  }}
                >
                  <MessageSquare size={14} style={{ marginRight: "0.35rem" }} />{" "}
                  Save Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------
           MODAL: UPDATE FINANCIAL STATEMENT STATUS
      ---------------------------------------------------------- */}
      {editingStmtId &&
        (() => {
          const editStmt = filteredStatements.find(
            (s) => s.id === editingStmtId,
          );
          if (!editStmt) return null;
          const steps = [
            "Not Received",
            "Received",
            "Under Review",
            "Adjusted",
            "Final",
          ] as const;
          const currentStep = steps.indexOf(
            stmtEditForm.status as (typeof steps)[number],
          );
          return (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9990,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(15,23,42,0.72)",
                  backdropFilter: "blur(6px)",
                }}
                onClick={() => setEditingStmtId(null)}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  background: "var(--bg-card,var(--bg-card))",
                  borderRadius: "16px",
                  width: "min(640px,96vw)",
                  maxHeight: "92vh",
                  overflowY: "auto",
                  boxShadow: "0 32px 72px rgba(0,0,0,0.28)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    background: "var(--bg-card) 0%, var(--primary) 100%)",
                    padding: "1.5rem 1.75rem",
                    borderRadius: "16px 16px 0 0",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        background: "var(--bg-card)",
                        borderRadius: "10px",
                        padding: "0.5rem",
                        display: "flex",
                      }}
                    >
                      <DollarSign
                        size={22}
                        style={{ color: "var(--bg-card)" }}
                      />
                    </div>
                    <div>
                      <h2
                        style={{
                          margin: 0,
                          color: "var(--bg-card)",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                        }}
                      >
                        Update Statement Status
                      </h2>
                      <p
                        style={{
                          margin: 0,
                          color: "var(--bg-card)",
                          fontSize: "0.75rem",
                          marginTop: "0.2rem",
                        }}
                      >
                        {editStmt.statementType}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingStmtId(null)}
                    style={{
                      background: "var(--bg-card)",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.4rem",
                      cursor: "pointer",
                      color: "var(--bg-card)",
                      display: "flex",
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
                {/* Body */}
                <div style={{ padding: "1.5rem 1.75rem", flex: 1 }}>
                  {/* Status progress stepper */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--text-2)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        display: "block",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Statement Progress
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: 0,
                          right: 0,
                          height: "2px",
                          background: "var(--border)",
                          zIndex: 0,
                          transform: "translateY(-50%)",
                        }}
                      />
                      {steps.map((step, i) => {
                        const active = i === currentStep;
                        const done = i < currentStep;
                        return (
                          <div
                            key={step}
                            style={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "0.4rem",
                              position: "relative",
                              zIndex: 1,
                            }}
                          >
                            <button
                              onClick={() =>
                                setStmtEditForm((f) => ({ ...f, status: step }))
                              }
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                border: "2px solid",
                                borderColor:
                                  done || active
                                    ? "var(--primary)"
                                    : "var(--border)",
                                background: done
                                  ? "var(--primary)"
                                  : active
                                    ? "var(--bg-card)"
                                    : "var(--bg-card,var(--bg-card))",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s",
                              }}
                            >
                              {done ? (
                                <Check
                                  size={13}
                                  style={{ color: "var(--bg-card)" }}
                                />
                              ) : (
                                <span
                                  style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: active
                                      ? "var(--primary)"
                                      : "transparent",
                                    display: "block",
                                  }}
                                />
                              )}
                            </button>
                            <span
                              style={{
                                fontSize: "0.6rem",
                                fontWeight: active ? 700 : 500,
                                color: active
                                  ? "var(--primary)"
                                  : done
                                    ? "var(--primary)"
                                    : "var(--text-3)",
                                textAlign: "center",
                                lineHeight: 1.2,
                                maxWidth: "70px",
                              }}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Review details */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <label className={s.label}>Reviewed By</label>
                      <input
                        className={s.input}
                        placeholder="e.g. Musa Aliyu ACA"
                        value={stmtEditForm.reviewedBy}
                        onChange={(e) =>
                          setStmtEditForm((f) => ({
                            ...f,
                            reviewedBy: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className={s.label}>Period Covered</label>
                      <input
                        className={s.input}
                        value={editStmt.draftReceivedDate || "Not recorded"}
                        readOnly
                        style={{
                          background: "var(--surface-2)",
                          cursor: "default",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={s.label}>Review Notes</label>
                    <textarea
                      className={s.input}
                      rows={3}
                      placeholder="Describe actions taken, adjustments made, or outstanding issues�"
                      value={stmtEditForm.notes}
                      onChange={(e) =>
                        setStmtEditForm((f) => ({
                          ...f,
                          notes: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {stmtEditForm.status === "Final" && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.75rem 1rem",
                        background: "var(--bg-card)",
                        border: "1px solid #6ee7b7",
                        borderRadius: "8px",
                        fontSize: "0.78rem",
                        color: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <CheckCircle2
                        size={16}
                        style={{ color: "var(--primary)", flexShrink: 0 }}
                      />
                      Marking as <strong>Final</strong> will set today as the
                      final date and lock this statement from further updates.
                    </div>
                  )}
                </div>
                {/* Footer */}
                <div
                  style={{
                    padding: "1rem 1.75rem",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--surface-2,var(--border))",
                    borderRadius: "0 0 16px 16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-3)",
                      fontStyle: "italic",
                    }}
                  >
                    Ref: ISA 700 � Financial statements must be reviewed and
                    finalised before signing
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className={s.btnOutline}
                      onClick={() => setEditingStmtId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className={s.btnPrimary}
                      onClick={() => {
                        updateFinancialStatement(editingStmtId, {
                          status: stmtEditForm.status,
                          notes: stmtEditForm.notes || undefined,
                          reviewedBy: stmtEditForm.reviewedBy || undefined,
                          finalDate:
                            stmtEditForm.status === "Final"
                              ? new Date().toISOString()
                              : editStmt.finalDate,
                        });
                        setEditingStmtId(null);
                        addToast({
                          type: "success",
                          title: "Statement Updated",
                          message: `${editStmt.statementType} ? ${stmtEditForm.status}`,
                        });
                      }}
                      style={{
                        background: "var(--bg-card),var(--primary))",
                        border: "none",
                      }}
                    >
                      <Check size={14} style={{ marginRight: "0.35rem" }} />{" "}
                      Save Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* --- NO PROGRAMME --- */}
      {!currentProgramme && !showCreateForm && (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <BookOpen size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No Work Programme</div>
              <div className={s.emptyDesc}>
                Create a work programme to define audit procedures and
                assignments for this engagement.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkProgrammeSection;
