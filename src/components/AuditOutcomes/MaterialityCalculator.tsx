/* ==================================================================
   MaterialityCalculator
   User's exact formula:
     Overall Materiality      = Profit Before Tax × 5%
     Performance Materiality  = Overall × 70%
     Trivial Materiality      = Performance × 5%    (equivalently PBT × 70% × 5% × 5%)
                                — per the brief, "70% × 5%" of PBT.
   Both the "trivial = 5% of performance" and "trivial = 70%×5% of PBT"
   interpretations yield the same relative scale — we expose both to
   avoid ambiguity. We default to the user's literal instruction.
   ================================================================== */

import React, { useMemo, useState } from "react";
import {
  Calculator,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";
import type { MaterialityCalc } from "../../types/auditOutcomes";

interface MaterialityCalculatorProps {
  auditOutcomeId: string;
  auditId: string;
  userId: string;
  profitBeforeTax: number; // from trial balance
  existing?: MaterialityCalc;
  onSave: (calc: MaterialityCalc) => void;
  onApprove?: () => void;
  canApprove?: boolean;
  readOnly?: boolean;
}

const fmt = (n: number) =>
  `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

const MaterialityCalculator: React.FC<MaterialityCalculatorProps> = ({
  auditOutcomeId,
  auditId,
  userId,
  profitBeforeTax,
  existing,
  onSave,
  onApprove,
  canApprove,
  readOnly,
}) => {
  const [pbt, setPbt] = useState<number>(
    existing?.profitBeforeTax ?? profitBeforeTax,
  );
  const [overallPct, setOverallPct] = useState<number>(
    existing?.overallPct ?? 5,
  );
  const [performancePct, setPerformancePct] = useState<number>(
    existing?.performancePct ?? 70,
  );
  const [rationale, setRationale] = useState<string>(
    existing?.rationale ??
      "Profit Before Tax selected as primary benchmark. 5% of PBT, 70% performance, 5% trivial threshold follows the user-specified policy aligned with ISA 320.",
  );

  // Keep PBT synced with incoming TB change if not locked
  const [prevProfitBeforeTax, setPrevProfitBeforeTax] =
    useState(profitBeforeTax);
  if (!existing?.locked && prevProfitBeforeTax !== profitBeforeTax) {
    setPrevProfitBeforeTax(profitBeforeTax);
    setPbt(profitBeforeTax);
  }

  const overall = useMemo(
    () => Math.round(pbt * (overallPct / 100)),
    [pbt, overallPct],
  );
  const performance = useMemo(
    () => Math.round(overall * (performancePct / 100)),
    [overall, performancePct],
  );
  const trivial = useMemo(() => Math.round(performance * 0.05), [performance]);
  // Alternative reading: PBT × 70% × 5% (×5%) — show for transparency
  const trivialAltPbt = useMemo(
    () => Math.round(pbt * (performancePct / 100) * (overallPct / 100)),
    [pbt, overallPct, performancePct],
  );

  const locked = !!existing?.locked || readOnly;

  const handleSave = () => {
    const now = new Date().toISOString();
    const calc: MaterialityCalc = {
      id: existing?.id ?? `mat-${Date.now().toString(36)}`,
      auditOutcomeId,
      auditId,
      profitBeforeTax: pbt,
      overallMateriality: overall,
      overallPct,
      performanceMateriality: performance,
      performancePct,
      trivialMateriality: trivial,
      trivialPct: 5,
      basis: "Profit Before Tax",
      rationale,
      preparedBy: userId,
      preparedAt: existing?.preparedAt ?? now,
      approvedBy: existing?.approvedBy,
      approvedAt: existing?.approvedAt,
      locked: false,
    };
    onSave(calc);
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
          gap: 16,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "1rem",
              color: "#0f172a",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Calculator size={18} color="#064e3b" />
            Materiality Determination
            {locked && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "0.15rem 0.45rem",
                  fontSize: "0.65rem",
                  border: "1px solid #fcd34d",
                  background: "#fffbeb",
                  color: "#92400e",
                  borderRadius: 3,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                <Lock size={10} /> Locked
              </span>
            )}
          </h3>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 4 }}>
            ISA 320 &middot; ISSAI 1320: Benchmark: Profit Before Tax
          </div>
        </div>
      </div>

      {/* Formula panel */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          padding: "0.85rem 1rem",
          marginBottom: "1.25rem",
          fontSize: "0.8rem",
          color: "#334155",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 4, color: "#0f172a" }}>
          Policy formula
        </div>
        <code
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.78rem",
          }}
        >
          Overall = PBT × 5% &nbsp;|&nbsp; Performance = Overall × 70%
          &nbsp;|&nbsp; Trivial = Performance × 5%
        </code>
      </div>

      {/* Inputs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 12,
          marginBottom: "1.25rem",
        }}
      >
        <LabeledInput
          label="Profit Before Tax (₦), from Trial Balance"
          value={pbt}
          onChange={setPbt}
          disabled={locked}
          currency
        />
        <LabeledInput
          label="Overall %"
          value={overallPct}
          onChange={setOverallPct}
          disabled={locked}
          suffix="%"
        />
        <LabeledInput
          label="Performance %"
          value={performancePct}
          onChange={setPerformancePct}
          disabled={locked}
          suffix="%"
        />
      </div>

      {/* Output tiles — the three materiality thresholds */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: "1.25rem",
        }}
      >
        <ThresholdTile
          title="Overall Materiality"
          value={overall}
          formula={`${overallPct}% × ${fmt(pbt)}`}
          tone="primary"
        />
        <ThresholdTile
          title="Performance Materiality"
          value={performance}
          formula={`${performancePct}% × ${fmt(overall)}`}
          tone="secondary"
        />
        <ThresholdTile
          title="Clearly Trivial Threshold"
          value={trivial}
          formula={`5% × ${fmt(performance)}`}
          tone="subtle"
          hint={
            trivial !== trivialAltPbt
              ? `Alt reading: ${performancePct}% × ${overallPct}% × PBT = ${fmt(
                  trivialAltPbt,
                )}`
              : undefined
          }
        />
      </div>

      {/* Rationale */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#475569",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: 4,
          }}
        >
          Rationale
        </label>
        <textarea
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          disabled={locked}
          rows={3}
          style={{
            width: "100%",
            padding: "0.6rem 0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: 4,
            fontSize: "0.85rem",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Warning if PBT looks weird */}
      {pbt <= 0 && (
        <div
          style={{
            padding: "0.7rem 0.85rem",
            border: "1px solid #fde68a",
            background: "#fffbeb",
            color: "#92400e",
            borderRadius: 6,
            fontSize: "0.8rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AlertCircle size={14} />
          PBT is zero or negative; materiality may not be meaningful. Consider
          using Total Revenue or Net Assets as an alternative benchmark.
        </div>
      )}

      {/* Actions */}
      {!readOnly && (
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={locked}
            style={primaryBtn(locked ?? false)}
          >
            <Save size={14} /> {existing ? "Update" : "Save"} Materiality
          </button>
          {canApprove && existing && !existing.locked && (
            <button type="button" onClick={onApprove} style={approveBtn}>
              <CheckCircle2 size={14} /> Approve &amp; Lock
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const LabeledInput: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  currency?: boolean;
  suffix?: string;
}> = ({ label, value, onChange, disabled, currency, suffix }) => (
  <div>
    <label
      style={{
        display: "block",
        fontSize: "0.7rem",
        fontWeight: 700,
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        marginBottom: 4,
      }}
    >
      {label}
    </label>
    <div style={{ position: "relative" }}>
      {currency && (
        <span
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: 10,
            color: "#64748b",
          }}
        >
          ₦
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        style={{
          width: "100%",
          padding: `0.5rem 0.75rem 0.5rem ${currency ? "22px" : "0.75rem"}`,
          border: "1px solid #cbd5e1",
          borderRadius: 4,
          fontSize: "0.9rem",
          color: "#0f172a",
          background: disabled ? "#f8fafc" : "#ffffff",
        }}
      />
      {suffix && (
        <span
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: 10,
            color: "#64748b",
            fontSize: "0.85rem",
          }}
        >
          {suffix}
        </span>
      )}
    </div>
    {currency && (
      <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 3 }}>
        {value.toLocaleString("en-NG")}
      </div>
    )}
  </div>
);

const ThresholdTile: React.FC<{
  title: string;
  value: number;
  formula: string;
  tone: "primary" | "secondary" | "subtle";
  hint?: string;
}> = ({ title, value, formula, tone, hint }) => {
  const palettes = {
    primary: { bg: "#064e3b", text: "#f0fdf4", sub: "#bbf7d0" },
    secondary: { bg: "#f0fdf4", text: "#064e3b", sub: "#065f46" },
    subtle: { bg: "#f8fafc", text: "#334155", sub: "#64748b" },
  } as const;
  const c = palettes[tone];
  return (
    <div
      style={{
        background: c.bg,
        borderRadius: 6,
        padding: "1rem 1.1rem",
        border: tone === "primary" ? "none" : "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          color: c.text,
          opacity: 0.8,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "1.35rem",
          fontWeight: 800,
          color: c.text,
          marginBottom: 4,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {fmt(value)}
      </div>
      <div style={{ fontSize: "0.72rem", color: c.sub, opacity: 0.9 }}>
        {formula}
      </div>
      {hint && (
        <div
          style={{
            marginTop: 6,
            fontSize: "0.68rem",
            color: c.sub,
            opacity: 0.8,
            fontStyle: "italic",
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
};

const primaryBtn = (disabled: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "0.6rem 1rem",
  background: disabled ? "#94a3b8" : "#064e3b",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: disabled ? "not-allowed" : "pointer",
});

const approveBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "0.6rem 1rem",
  background: "#ffffff",
  color: "#064e3b",
  border: "1px solid #064e3b",
  borderRadius: 6,
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: "pointer",
};

export default MaterialityCalculator;
