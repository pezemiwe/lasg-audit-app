import { useState, useMemo } from "react";
import {
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  TrendingUp,
  Filter,
} from "lucide-react";
import StatusBadge from "../../components/UI/StatusBadge";
import s from "../../styles/pages.module.css";

interface CutoffTransaction {
  id: string;
  description: string;
  amount: number;
  transactionDate: string;
  invoiceDate: string;
  deliveryDate: string;
  recordedPeriod: "Current" | "Prior" | "Next";
  correctPeriod: "Current" | "Prior" | "Next";
  type: "Revenue" | "Purchase" | "Payable" | "Receivable";
  status: "Pending" | "Correct" | "Misstatement";
  misstatementAmount: number;
}

interface CutoffTestingProps {
  auditId: string;
  periodEnd: string; // e.g. "2024-12-31"
  isWriter: boolean;
  onToast: (toast: { type: string; title: string; message: string }) => void;
}

const generateTransactions = (periodEnd: string): CutoffTransaction[] => {
  const end = new Date(periodEnd);
  const items: CutoffTransaction[] = [];
  const types: CutoffTransaction["type"][] = [
    "Revenue",
    "Purchase",
    "Payable",
    "Receivable",
  ];
  const descriptions: Record<string, string[]> = {
    Revenue: [
      "Service contract billing",
      "Monthly subscription renewal",
      "Consulting fee invoice",
      "Project milestone payment",
      "Tax assessment revenue",
      "Permit fee collection",
    ],
    Purchase: [
      "Office supplies order",
      "IT equipment procurement",
      "Vehicle maintenance contract",
      "Stationery bulk purchase",
      "Software license renewal",
      "Professional services fee",
    ],
    Payable: [
      "Contractor payment",
      "Utility bill settlement",
      "Rent payment processing",
      "Insurance premium payment",
      "Audit fee payment",
      "Training provider invoice",
    ],
    Receivable: [
      "Outstanding tax collection",
      "Grant reimbursement",
      "Intergovernmental transfer",
      "Penalty fee recovery",
      "License renewal receivable",
      "Court fine collection",
    ],
  };

  for (let i = 0; i < 25; i++) {
    const type = types[i % 4];
    const daysOffset = Math.floor(Math.random() * 14) - 7; // -7 to +7 days around period end
    const txDate = new Date(end);
    txDate.setDate(txDate.getDate() + daysOffset);

    const invDate = new Date(txDate);
    invDate.setDate(invDate.getDate() - Math.floor(Math.random() * 5));

    const delDate = new Date(txDate);
    delDate.setDate(delDate.getDate() + Math.floor(Math.random() * 5) - 2);

    const recordedPeriod = txDate <= end ? "Current" : "Next";
    const correctPeriod = delDate <= end ? "Current" : "Next";
    const isMis = recordedPeriod !== correctPeriod && Math.random() > 0.4;
    const amt = Math.round((50000 + Math.random() * 5000000) * 100) / 100;

    const descs = descriptions[type];
    items.push({
      id: `cut-${i + 1}`,
      description: descs[i % descs.length],
      amount: amt,
      transactionDate: txDate.toISOString().split("T")[0],
      invoiceDate: invDate.toISOString().split("T")[0],
      deliveryDate: delDate.toISOString().split("T")[0],
      recordedPeriod: recordedPeriod as CutoffTransaction["recordedPeriod"],
      correctPeriod: correctPeriod as CutoffTransaction["correctPeriod"],
      type,
      status: isMis ? "Misstatement" : "Pending",
      misstatementAmount: isMis ? amt : 0,
    });
  }
  return items.sort((a, b) =>
    a.transactionDate.localeCompare(b.transactionDate),
  );
};

const CutoffTesting: React.FC<CutoffTestingProps> = ({
  auditId: _auditId,
  periodEnd,
  isWriter,
  onToast,
}) => {
  const [transactions, setTransactions] = useState<CutoffTransaction[]>(() =>
    generateTransactions(periodEnd),
  );
  const [filterType, setFilterType] = useState<
    CutoffTransaction["type"] | "All"
  >("All");
  const [showOnly, setShowOnly] = useState<"All" | "Misstatement" | "Pending">(
    "All",
  );
  const [daysWindow, setDaysWindow] = useState(7);

  const endDate = new Date(periodEnd);

  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== "All" && t.type !== filterType) return false;
      if (showOnly !== "All" && t.status !== showOnly) return false;
      const txDate = new Date(t.transactionDate);
      const diff = Math.abs(
        (txDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      return diff <= daysWindow;
    });
  }, [transactions, filterType, showOnly, daysWindow, endDate]);

  const stats = useMemo(() => {
    const all = transactions;
    return {
      total: all.length,
      correct: all.filter((t) => t.status === "Correct").length,
      misstatements: all.filter((t) => t.status === "Misstatement").length,
      misAmount: all
        .filter((t) => t.status === "Misstatement")
        .reduce((s, t) => s + t.misstatementAmount, 0),
      pending: all.filter((t) => t.status === "Pending").length,
      beforePeriodEnd: all.filter((t) => new Date(t.transactionDate) <= endDate)
        .length,
      afterPeriodEnd: all.filter((t) => new Date(t.transactionDate) > endDate)
        .length,
    };
  }, [transactions, endDate]);

  const markTransaction = (id: string, status: "Correct" | "Misstatement") => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              misstatementAmount: status === "Misstatement" ? t.amount : 0,
            }
          : t,
      ),
    );
    onToast({
      type: status === "Correct" ? "success" : "warning",
      title: "Cut-off Test Updated",
      message: `Transaction marked as ${status}`,
    });
  };

  /* ─── Timeline indicator ─── */
  const renderTimeline = () => {
    const window = daysWindow;
    const buckets: Record<
      string,
      { correct: number; mis: number; pending: number }
    > = {};
    for (let d = -window; d <= window; d++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() + d);
      const key = date.toISOString().split("T")[0];
      buckets[key] = { correct: 0, mis: 0, pending: 0 };
    }
    transactions.forEach((t) => {
      if (buckets[t.transactionDate]) {
        if (t.status === "Correct") buckets[t.transactionDate].correct++;
        else if (t.status === "Misstatement") buckets[t.transactionDate].mis++;
        else buckets[t.transactionDate].pending++;
      }
    });
    const entries = Object.entries(buckets);
    const maxVal = Math.max(
      ...entries.map(([, v]) => v.correct + v.mis + v.pending),
      1,
    );

    return (
      <div className={s.card} style={{ marginBottom: "1.5rem" }}>
        <div className={s.cardHeader}>
          <h4 className={s.cardTitle}>
            <Calendar size={16} /> Cut-off Timeline
          </h4>
          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
            Period End: <strong>{periodEnd}</strong>
          </span>
        </div>
        <div className={s.cardBody} style={{ overflowX: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "2px",
              minHeight: "100px",
              paddingBottom: "1.5rem",
              position: "relative",
            }}
          >
            {entries.map(([date, v]) => {
              const total = v.correct + v.mis + v.pending;
              const height = Math.max((total / maxVal) * 80, 4);
              const isPeriodEnd = date === periodEnd;
              return (
                <div
                  key={date}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                    position: "relative",
                  }}
                >
                  {isPeriodEnd && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-20px",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: "#dc2626",
                        whiteSpace: "nowrap",
                      }}
                    >
                      PERIOD END
                    </div>
                  )}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "22px",
                      height: `${height}px`,
                      borderRadius: "3px 3px 0 0",
                      background:
                        v.mis > 0
                          ? "#fca5a5"
                          : v.pending > 0
                            ? "#fde68a"
                            : "#86efac",
                      border: isPeriodEnd
                        ? "2px solid #dc2626"
                        : "1px solid rgba(0,0,0,0.05)",
                      cursor: "default",
                      position: "relative",
                    }}
                    title={`${date}: ${total} txn(s) — ${v.correct} ok, ${v.mis} mis, ${v.pending} pending`}
                  />
                  <div
                    style={{
                      fontSize: "0.55rem",
                      color: "#94a3b8",
                      transform: "rotate(-45deg)",
                      transformOrigin: "top left",
                      whiteSpace: "nowrap",
                      marginTop: "4px",
                    }}
                  >
                    {new Date(date).getDate()}
                  </div>
                </div>
              );
            })}
            {/* Period-end divider line */}
            <div
              style={{
                position: "absolute",
                left: `${(entries.findIndex(([d]) => d === periodEnd) / entries.length) * 100}%`,
                top: 0,
                bottom: 0,
                width: "2px",
                background: "#dc2626",
                opacity: 0.5,
                pointerEvents: "none",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              fontSize: "0.72rem",
              color: "#64748b",
              marginTop: "0.5rem",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  background: "#86efac",
                  borderRadius: "2px",
                }}
              />
              Correct
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  background: "#fde68a",
                  borderRadius: "2px",
                }}
              />
              Pending
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  background: "#fca5a5",
                  borderRadius: "2px",
                }}
              />
              Misstatement
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* KPI Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Transactions",
            value: stats.total,
            icon: FileText,
            color: "#334155",
          },
          {
            label: "Before Period End",
            value: stats.beforePeriodEnd,
            icon: ArrowRight,
            color: "#2563eb",
          },
          {
            label: "After Period End",
            value: stats.afterPeriodEnd,
            icon: ArrowRight,
            color: "#d97706",
          },
          {
            label: "Correct",
            value: stats.correct,
            icon: CheckCircle,
            color: "#15803d",
          },
          {
            label: "Misstatements",
            value: stats.misstatements,
            icon: AlertTriangle,
            color: "#dc2626",
          },
          {
            label: "Exception Value",
            value: `₦${(stats.misAmount / 1e6).toFixed(1)}M`,
            icon: TrendingUp,
            color: "#991b1b",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            style={{
              padding: "0.75rem",
              background: "var(--bg-card, #fff)",
              border: "1px solid var(--border, rgba(0,0,0,0.1))",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <Icon size={16} style={{ color, marginBottom: "0.25rem" }} />
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#64748b",
                letterSpacing: "0.06em",
              }}
            >
              {label}
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Timeline */}
      {renderTimeline()}

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
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <Filter size={14} style={{ color: "#64748b", marginTop: "3px" }} />
          {(
            ["All", "Revenue", "Purchase", "Payable", "Receivable"] as const
          ).map((t) => (
            <button
              key={t}
              className={filterType === t ? s.filterChipActive : s.filterChip}
              onClick={() => setFilterType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {(["All", "Pending", "Misstatement"] as const).map((st) => (
            <button
              key={st}
              className={showOnly === st ? s.filterChipActive : s.filterChip}
              onClick={() => setShowOnly(st)}
            >
              {st}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.78rem",
          }}
        >
          <Clock size={14} style={{ color: "#64748b" }} />
          <span>Window:</span>
          <select
            className={s.formSelect}
            style={{ width: "70px", fontSize: "0.78rem", padding: "0.2rem" }}
            value={daysWindow}
            onChange={(e) => setDaysWindow(Number(e.target.value))}
          >
            <option value={3}>±3d</option>
            <option value={5}>±5d</option>
            <option value={7}>±7d</option>
            <option value={14}>±14d</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Type</th>
              <th style={{ textAlign: "right" }}>Amount (₦)</th>
              <th>Txn Date</th>
              <th>Invoice Date</th>
              <th>Delivery Date</th>
              <th>Recorded</th>
              <th>Correct Period</th>
              <th>Status</th>
              {isWriter && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTxns.map((t) => {
              const mismatch = t.recordedPeriod !== t.correctPeriod;
              return (
                <tr
                  key={t.id}
                  style={{ background: mismatch ? "#fff7ed" : undefined }}
                >
                  <td style={{ fontSize: "0.82rem", maxWidth: "200px" }}>
                    {t.description}
                  </td>
                  <td>
                    <span className={s.filterChip}>{t.type}</span>
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontFamily: "monospace",
                      fontWeight: 600,
                    }}
                  >
                    {t.amount.toLocaleString()}
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
                    {t.transactionDate}
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
                    {t.invoiceDate}
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
                    {t.deliveryDate}
                  </td>
                  <td>
                    <StatusBadge
                      label={t.recordedPeriod}
                      variant={
                        t.recordedPeriod === t.correctPeriod
                          ? "success"
                          : "warning"
                      }
                    />
                  </td>
                  <td>
                    <StatusBadge label={t.correctPeriod} variant="info" />
                  </td>
                  <td>
                    <StatusBadge
                      label={t.status}
                      variant={
                        t.status === "Correct"
                          ? "success"
                          : t.status === "Misstatement"
                            ? "error"
                            : "warning"
                      }
                    />
                  </td>
                  {isWriter && (
                    <td>
                      {t.status === "Pending" && (
                        <div style={{ display: "flex", gap: "0.3rem" }}>
                          <button
                            className={`${s.btnPrimary} ${s.btnSmall}`}
                            style={{ fontSize: "0.68rem" }}
                            onClick={() => markTransaction(t.id, "Correct")}
                          >
                            <CheckCircle size={10} /> OK
                          </button>
                          <button
                            className={`${s.btnDanger} ${s.btnSmall}`}
                            style={{ fontSize: "0.68rem" }}
                            onClick={() =>
                              markTransaction(t.id, "Misstatement")
                            }
                          >
                            <AlertTriangle size={10} /> Mis
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredTxns.length === 0 && (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <Calendar size={36} className={s.emptyIcon} />
              <div className={s.emptyTitle}>
                No transactions in selected window
              </div>
              <div className={s.emptyDesc}>
                Adjust the date window or filters to see cut-off transactions.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ISA Guidance */}
      <div
        style={{
          padding: "0.75rem",
          background: "#fefce8",
          border: "1px solid #fde68a",
          borderRadius: "4px",
          fontSize: "0.78rem",
          color: "#854d0e",
          marginTop: "1rem",
        }}
      >
        <strong>ISA 500 – Cut-off Testing:</strong> Verify transactions are
        recorded in the correct accounting period by comparing delivery/service
        dates with invoice dates and recording dates. Transactions near
        period-end require special attention to ensure proper cut-off.
        Mismatches between recorded period and correct period indicate potential
        misstatements.
      </div>
    </div>
  );
};

export default CutoffTesting;
