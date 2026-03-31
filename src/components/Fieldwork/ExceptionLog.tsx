import { useState, useMemo } from "react";
import {
  AlertTriangle,
  User,
  Clock,
  CheckCircle,
  Search,
  FileText,
  MessageSquare,
  Filter,
} from "lucide-react";
import type {
  InternalControlTest,
  SubstantiveTest,
  FraudFlag,
  RiskLevel,
} from "../../types";
import StatusBadge from "../../components/UI/StatusBadge";
import { MOCK_USERS } from "../../mock/data";
import s from "../../styles/pages.module.css";

type ExceptionStatus = "Open" | "Investigating" | "Resolved" | "Escalated";
type ExceptionSource =
  | "control"
  | "substantive"
  | "fraud"
  | "compliance"
  | "physical";

interface Exception {
  id: string;
  source: ExceptionSource;
  sourceRef: string;
  title: string;
  description: string;
  area: string;
  severity: RiskLevel;
  amount: number;
  status: ExceptionStatus;
  assignedTo: string;
  raisedBy: string;
  raisedAt: string;
  resolution?: string;
  resolvedAt?: string;
  evidence: string[];
}

interface ComplianceCheck {
  id: string;
  regulation: string;
  compliant: string;
  finding: string;
}

interface PhysicalItem {
  id: string;
  assetDescription: string;
  exists: string;
  registerValue: number;
  remarks: string;
}

interface ExceptionLogProps {
  auditId: string;
  controlTests: InternalControlTest[];
  substantiveTests: SubstantiveTest[];
  fraudFlags: FraudFlag[];
  complianceChecks: ComplianceCheck[];
  physicalItems: PhysicalItem[];
  userId: string;
  isWriter: boolean;
  isReviewer: boolean;
  teamMembers: string[];
  onToast: (toast: { type: string; title: string; message: string }) => void;
  onLogActivity: (entry: {
    userId: string;
    action: string;
    details: string;
    entityType: string;
    entityId: string;
  }) => void;
}

const userName = (id: string) =>
  MOCK_USERS.find((u) => u.id === id)?.name || id;

const ExceptionLog: React.FC<ExceptionLogProps> = ({
  auditId,
  controlTests,
  substantiveTests,
  fraudFlags,
  complianceChecks,
  physicalItems,
  userId,
  isWriter,
  isReviewer,
  teamMembers,
  onToast,
  onLogActivity,
}) => {
  const [filterStatus, setFilterStatus] = useState<ExceptionStatus | "All">(
    "All",
  );
  const [filterSource, setFilterSource] = useState<ExceptionSource | "All">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [localResolutions, setLocalResolutions] = useState<
    Record<
      string,
      { status: ExceptionStatus; resolution: string; assignedTo: string }
    >
  >({});

  /* ─── Auto-aggregate exceptions from all sources ─── */
  const exceptions = useMemo<Exception[]>(() => {
    const items: Exception[] = [];

    // From ineffective/partial controls
    controlTests
      .filter(
        (ct) =>
          ct.result === "Ineffective" || ct.result === "Partially Effective",
      )
      .forEach((ct) => {
        items.push({
          id: `exc-ctrl-${ct.id}`,
          source: "control",
          sourceRef: ct.id,
          title: `Control Weakness: ${ct.controlArea}`,
          description: ct.weakness || ct.controlDescription,
          area: ct.controlArea,
          severity: ct.result === "Ineffective" ? "High" : "Medium",
          amount: 0,
          status: "Open",
          assignedTo: ct.testedBy,
          raisedBy: ct.testedBy,
          raisedAt: ct.testedAt,
          evidence: [],
        });
      });

    // From substantive tests with exceptions
    substantiveTests
      .filter((st) => st.exceptionCount > 0)
      .forEach((st) => {
        const rate =
          st.sampleSize > 0 ? (st.exceptionCount / st.sampleSize) * 100 : 0;
        items.push({
          id: `exc-sub-${st.id}`,
          source: "substantive",
          sourceRef: st.id,
          title: `${st.exceptionCount} Exception(s): ${st.area}`,
          description: st.conclusion || st.procedure,
          area: st.area,
          severity: rate > 10 ? "Critical" : rate > 5 ? "High" : "Medium",
          amount: st.exceptionAmount,
          status: st.status === "Escalated" ? "Escalated" : "Open",
          assignedTo: st.performedBy,
          raisedBy: st.performedBy,
          raisedAt: st.performedAt,
          evidence: st.evidenceFiles?.map((f) => f.name) || [],
        });
      });

    // From fraud flags
    fraudFlags.forEach((ff) => {
      items.push({
        id: `exc-fraud-${ff.id}`,
        source: "fraud",
        sourceRef: ff.id,
        title: ff.indicator,
        description: ff.description,
        area: ff.area,
        severity: ff.severity,
        amount: 0,
        status:
          ff.status === "Resolved" || ff.status === "Dismissed"
            ? "Resolved"
            : ff.status === "Escalated"
              ? "Escalated"
              : ff.status === "Under Investigation"
                ? "Investigating"
                : "Open",
        assignedTo: ff.raisedBy,
        raisedBy: ff.raisedBy,
        raisedAt: ff.raisedAt,
        resolution: ff.resolution,
        resolvedAt: ff.resolvedAt,
        evidence: [],
      });
    });

    // From non-compliant checks
    complianceChecks
      .filter((cc) => cc.compliant === "No")
      .forEach((cc) => {
        items.push({
          id: `exc-comp-${cc.id}`,
          source: "compliance",
          sourceRef: cc.id,
          title: `Non-Compliance: ${cc.regulation}`,
          description: cc.finding || `Non-compliant with ${cc.regulation}`,
          area: "Compliance",
          severity: "High",
          amount: 0,
          status: "Open",
          assignedTo: userId,
          raisedBy: userId,
          raisedAt: new Date().toISOString(),
          evidence: [],
        });
      });

    // From missing/partial physical assets
    physicalItems
      .filter((pv) => pv.exists === "No" || pv.exists === "Partial")
      .forEach((pv) => {
        items.push({
          id: `exc-phys-${pv.id}`,
          source: "physical",
          sourceRef: pv.id,
          title: `Asset ${pv.exists === "No" ? "Missing" : "Partial"}: ${pv.assetDescription}`,
          description: pv.remarks || `Asset not fully verified`,
          area: "Fixed Assets",
          severity: pv.exists === "No" ? "High" : "Medium",
          amount: pv.registerValue,
          status: "Open",
          assignedTo: userId,
          raisedBy: userId,
          raisedAt: new Date().toISOString(),
          evidence: [],
        });
      });

    // Apply local resolution overrides
    return items.map((item) => {
      const override = localResolutions[item.id];
      return override ? { ...item, ...override } : item;
    });
  }, [
    controlTests,
    substantiveTests,
    fraudFlags,
    complianceChecks,
    physicalItems,
    userId,
    localResolutions,
  ]);

  const filtered = exceptions.filter((exc) => {
    if (filterStatus !== "All" && exc.status !== filterStatus) return false;
    if (filterSource !== "All" && exc.source !== filterSource) return false;
    if (
      searchQuery &&
      !exc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !exc.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const stats = {
    total: exceptions.length,
    open: exceptions.filter((e) => e.status === "Open").length,
    investigating: exceptions.filter((e) => e.status === "Investigating")
      .length,
    resolved: exceptions.filter((e) => e.status === "Resolved").length,
    escalated: exceptions.filter((e) => e.status === "Escalated").length,
    totalAmount: exceptions.reduce((sum, e) => sum + e.amount, 0),
  };

  const handleUpdateStatus = (
    excId: string,
    status: ExceptionStatus,
    resolution?: string,
  ) => {
    setLocalResolutions((prev) => ({
      ...prev,
      [excId]: {
        ...prev[excId],
        status,
        resolution: resolution || prev[excId]?.resolution || "",
        assignedTo: prev[excId]?.assignedTo || userId,
      },
    }));
    onLogActivity({
      userId,
      action: `EXCEPTION_${status.toUpperCase()}`,
      details: `Exception ${excId} marked as ${status}`,
      entityType: "fieldwork",
      entityId: auditId,
    });
    onToast({
      type: status === "Resolved" ? "success" : "info",
      title: "Exception Updated",
      message: `Status changed to ${status}`,
    });
  };

  const handleAssign = (excId: string, assignee: string) => {
    setLocalResolutions((prev) => ({
      ...prev,
      [excId]: {
        ...prev[excId],
        status: prev[excId]?.status || "Investigating",
        resolution: prev[excId]?.resolution || "",
        assignedTo: assignee,
      },
    }));
    onToast({
      type: "info",
      title: "Exception Assigned",
      message: `Assigned to ${userName(assignee)}`,
    });
  };

  const sourceLabel: Record<ExceptionSource, string> = {
    control: "Internal Control",
    substantive: "Substantive Test",
    fraud: "Fraud Flag",
    compliance: "Compliance",
    physical: "Physical Verification",
  };

  const sourceColor: Record<ExceptionSource, string> = {
    control: "#2563eb",
    substantive: "#d97706",
    fraud: "#dc2626",
    compliance: "#7e22ce",
    physical: "#0891b2",
  };

  const sevColor: Record<RiskLevel, string> = {
    Low: "#15803d",
    Medium: "#d97706",
    High: "#dc2626",
    Critical: "#991b1b",
  };

  return (
    <div>
      {/* KPI Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { label: "Total", value: stats.total, color: "#334155" },
          { label: "Open", value: stats.open, color: "#d97706" },
          {
            label: "Investigating",
            value: stats.investigating,
            color: "#2563eb",
          },
          { label: "Escalated", value: stats.escalated, color: "#dc2626" },
          { label: "Resolved", value: stats.resolved, color: "#15803d" },
          {
            label: "Exception Value",
            value: `₦${(stats.totalAmount / 1e6).toFixed(1)}M`,
            color: "#991b1b",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              padding: "0.75rem",
              background: "var(--bg-card, #fff)",
              border: "1px solid var(--border, rgba(0,0,0,0.1))",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#64748b",
                letterSpacing: "0.06em",
              }}
            >
              {kpi.label}
            </div>
            <div
              style={{ fontSize: "1.25rem", fontWeight: 700, color: kpi.color }}
            >
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <div className={s.searchContainer} style={{ flex: "1 1 200px" }}>
          <Search size={16} className={s.searchIcon} />
          <input
            className={s.searchInput}
            placeholder="Search exceptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <Filter size={14} style={{ color: "#64748b", marginTop: "2px" }} />
          {(
            ["All", "Open", "Investigating", "Escalated", "Resolved"] as const
          ).map((st) => (
            <button
              key={st}
              className={
                filterStatus === st ? s.filterChipActive : s.filterChip
              }
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {(
            [
              "All",
              "control",
              "substantive",
              "fraud",
              "compliance",
              "physical",
            ] as const
          ).map((src) => (
            <button
              key={src}
              className={
                filterSource === src ? s.filterChipActive : s.filterChip
              }
              onClick={() => setFilterSource(src)}
            >
              {src === "All" ? "All Sources" : sourceLabel[src]}
            </button>
          ))}
        </div>
      </div>

      {/* Exception Cards */}
      {filtered.length > 0 ? (
        filtered.map((exc) => (
          <div
            key={exc.id}
            className={s.card}
            style={{
              marginBottom: "0.75rem",
              borderLeft: `4px solid ${sevColor[exc.severity]}`,
            }}
          >
            <div style={{ padding: "1rem 1.25rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.35rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        padding: "0.1rem 0.45rem",
                        borderRadius: "99px",
                        background: `${sourceColor[exc.source]}15`,
                        color: sourceColor[exc.source],
                      }}
                    >
                      {sourceLabel[exc.source]}
                    </span>
                    <StatusBadge
                      label={exc.severity}
                      variant={
                        exc.severity === "Critical" || exc.severity === "High"
                          ? "error"
                          : exc.severity === "Medium"
                            ? "warning"
                            : "success"
                      }
                    />
                    <StatusBadge
                      label={exc.status}
                      variant={
                        exc.status === "Resolved"
                          ? "success"
                          : exc.status === "Escalated"
                            ? "error"
                            : exc.status === "Investigating"
                              ? "info"
                              : "warning"
                      }
                    />
                  </div>
                  <strong
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.9rem",
                    }}
                  >
                    {exc.title}
                  </strong>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "#475569",
                      lineHeight: 1.6,
                      marginTop: "0.25rem",
                    }}
                  >
                    {exc.description?.slice(0, 200)}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      marginTop: "0.5rem",
                      fontSize: "0.75rem",
                      color: "#64748b",
                    }}
                  >
                    <span>
                      <strong>Area:</strong> {exc.area}
                    </span>
                    {exc.amount > 0 && (
                      <span>
                        <strong>Amount:</strong> ₦{exc.amount.toLocaleString()}
                      </span>
                    )}
                    <span>
                      <User size={12} style={{ verticalAlign: "middle" }} />{" "}
                      {userName(exc.assignedTo)}
                    </span>
                    <span>
                      <Clock size={12} style={{ verticalAlign: "middle" }} />{" "}
                      {new Date(exc.raisedAt).toLocaleDateString("en-NG")}
                    </span>
                  </div>
                  {exc.evidence.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.3rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      {exc.evidence.map((e, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "0.72rem",
                            padding: "0.1rem 0.4rem",
                            background: "#f1f5f9",
                            borderRadius: "4px",
                            color: "#475569",
                          }}
                        >
                          <FileText
                            size={10}
                            style={{ verticalAlign: "middle" }}
                          />{" "}
                          {e}
                        </span>
                      ))}
                    </div>
                  )}
                  {exc.resolution && (
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        background: "#f0fdf4",
                        borderRadius: "4px",
                        fontSize: "0.82rem",
                        color: "#15803d",
                      }}
                    >
                      <CheckCircle
                        size={12}
                        style={{
                          verticalAlign: "middle",
                          marginRight: "0.3rem",
                        }}
                      />
                      <strong>Resolution:</strong> {exc.resolution}
                    </div>
                  )}
                </div>
                {/* Actions */}
                {exc.status !== "Resolved" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      minWidth: "120px",
                    }}
                  >
                    {isWriter && exc.status === "Open" && (
                      <button
                        className={`${s.btnPrimary} ${s.btnSmall}`}
                        onClick={() =>
                          handleUpdateStatus(exc.id, "Investigating")
                        }
                      >
                        <Search size={12} /> Investigate
                      </button>
                    )}
                    {(isWriter || isReviewer) && exc.status !== "Escalated" && (
                      <button
                        className={`${s.btnDanger} ${s.btnSmall}`}
                        onClick={() => handleUpdateStatus(exc.id, "Escalated")}
                      >
                        <AlertTriangle size={12} /> Escalate
                      </button>
                    )}
                    {isReviewer && (
                      <button
                        className={`${s.btnPrimary} ${s.btnSmall}`}
                        onClick={() => {
                          const res = prompt("Enter resolution details:");
                          if (res) handleUpdateStatus(exc.id, "Resolved", res);
                        }}
                      >
                        <CheckCircle size={12} /> Resolve
                      </button>
                    )}
                    {(isWriter || isReviewer) && teamMembers.length > 0 && (
                      <select
                        className={s.formSelect}
                        style={{ fontSize: "0.72rem", padding: "0.25rem" }}
                        value={
                          localResolutions[exc.id]?.assignedTo || exc.assignedTo
                        }
                        onChange={(e) => handleAssign(exc.id, e.target.value)}
                      >
                        <option value="">Assign to...</option>
                        {teamMembers.map((id) => (
                          <option key={id} value={id}>
                            {userName(id)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <CheckCircle size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>
                {exceptions.length === 0
                  ? "No exceptions identified"
                  : "No matching exceptions"}
              </div>
              <div className={s.emptyDesc}>
                {exceptions.length === 0
                  ? "Exceptions from controls, substantive tests, fraud flags, compliance, and physical verification will appear here automatically."
                  : "Try adjusting your filters or search query."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-aggregation Note */}
      <div
        style={{
          padding: "0.75rem",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "4px",
          fontSize: "0.78rem",
          color: "#1e40af",
          marginTop: "1rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        <MessageSquare size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong>Auto-Aggregated:</strong> This log automatically collects
          exceptions from all fieldwork tabs — ineffective controls, substantive
          test exceptions, fraud flags, non-compliance findings, and missing
          assets. Resolve exceptions here or in their source tabs.
        </div>
      </div>
    </div>
  );
};

export default ExceptionLog;
