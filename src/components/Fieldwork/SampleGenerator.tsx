import { useState, useMemo } from "react";
import {
  Shuffle,
  BarChart3,
  Download,
  Target,
  Layers,
  DollarSign,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import s from "../../styles/pages.module.css";

type SamplingMethod = "random" | "stratified" | "mus";

interface PopulationItem {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface SampleGeneratorProps {
  auditId: string;
  area: string;
  onSampleGenerated: (
    sample: PopulationItem[],
    method: SamplingMethod,
    population: PopulationItem[],
  ) => void;
  materialityThreshold?: number;
}

/* ─── Seed population for demo ─── */
const generatePopulation = (area: string): PopulationItem[] => {
  const categories: Record<string, string[]> = {
    Revenue: [
      "IGR",
      "Federal Allocation",
      "VAT Allocation",
      "Grants",
      "Fees & Charges",
      "Market Levies",
    ],
    Expenditure: [
      "Salaries",
      "Overheads",
      "Capital Projects",
      "Consultancy",
      "Travel",
      "Maintenance",
    ],
    Payroll: [
      "Regular Staff",
      "Contract Staff",
      "Allowances",
      "Pension",
      "PAYE",
      "NHF",
    ],
    Assets: [
      "Vehicles",
      "Equipment",
      "Furniture",
      "Buildings",
      "Land",
      "IT Equipment",
    ],
    Bank: [
      "Current Account",
      "Savings Account",
      "Fixed Deposit",
      "Special Account",
    ],
    Procurement: [
      "Open Tender",
      "Selective Tender",
      "Direct Purchase",
      "Framework Agreement",
    ],
    Liabilities: [
      "Creditors",
      "Provisions",
      "Accruals",
      "Loans",
      "Deferred Revenue",
    ],
  };
  const cats = categories[area] || categories.Revenue;
  const items: PopulationItem[] = [];
  const months = [
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
  ];

  for (let i = 0; i < 120; i++) {
    const cat = cats[i % cats.length];
    const month = months[i % 12];
    const baseAmt =
      area === "Revenue" ? 500000 : area === "Payroll" ? 150000 : 300000;
    const amount = Math.round(baseAmt + Math.random() * baseAmt * 4);
    items.push({
      id: `pop-${area.toLowerCase()}-${i + 1}`,
      description: `${cat} — ${month} 2025 Transaction #${i + 1}`,
      amount,
      category: cat,
      date: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    });
  }
  return items;
};

/* ─── Sampling algorithms ─── */
const randomSample = (
  population: PopulationItem[],
  size: number,
): PopulationItem[] => {
  const shuffled = [...population].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(size, population.length));
};

const stratifiedSample = (
  population: PopulationItem[],
  size: number,
): PopulationItem[] => {
  const groups: Record<string, PopulationItem[]> = {};
  population.forEach((item) => {
    (groups[item.category] ||= []).push(item);
  });

  const result: PopulationItem[] = [];
  const groupKeys = Object.keys(groups);
  const perGroup = Math.max(1, Math.floor(size / groupKeys.length));

  groupKeys.forEach((key) => {
    const shuffled = [...groups[key]].sort(() => Math.random() - 0.5);
    result.push(...shuffled.slice(0, perGroup));
  });

  return result.slice(0, size);
};

const musSample = (
  population: PopulationItem[],
  size: number,
  materialityThreshold: number,
): PopulationItem[] => {
  const totalAmount = population.reduce((sum, item) => sum + item.amount, 0);
  const interval = totalAmount / size;

  // All items above materiality get auto-selected
  const highValue = population.filter(
    (item) => item.amount >= materialityThreshold,
  );
  const remaining = population.filter(
    (item) => item.amount < materialityThreshold,
  );

  // Systematic MUS on remaining
  const sorted = [...remaining].sort((a, b) => b.amount - a.amount);
  let cumulative = 0;
  let nextSelect = Math.random() * interval;
  const selected: PopulationItem[] = [...highValue];

  for (const item of sorted) {
    cumulative += item.amount;
    if (cumulative >= nextSelect && selected.length < size) {
      selected.push(item);
      nextSelect += interval;
    }
  }

  return selected.slice(0, size);
};

const SampleGenerator: React.FC<SampleGeneratorProps> = ({
  auditId: _auditId,
  area,
  onSampleGenerated,
  materialityThreshold = 5000000,
}) => {
  const [method, setMethod] = useState<SamplingMethod>("random");
  const [sampleSize, setSampleSize] = useState(25);
  const [generated, setGenerated] = useState(false);
  const [sample, setSample] = useState<PopulationItem[]>([]);
  const [showPopulation, setShowPopulation] = useState(false);

  const population = useMemo(() => generatePopulation(area), [area]);

  const totalPopValue = population.reduce((sum, item) => sum + item.amount, 0);
  const categories = [...new Set(population.map((p) => p.category))];

  const handleGenerate = () => {
    let result: PopulationItem[];
    switch (method) {
      case "stratified":
        result = stratifiedSample(population, sampleSize);
        break;
      case "mus":
        result = musSample(population, sampleSize, materialityThreshold);
        break;
      default:
        result = randomSample(population, sampleSize);
    }
    setSample(result);
    setGenerated(true);
    onSampleGenerated(result, method, population);
  };

  const sampleValue = sample.reduce((sum, item) => sum + item.amount, 0);
  const coverageRate =
    totalPopValue > 0 ? (sampleValue / totalPopValue) * 100 : 0;

  const handleDownload = () => {
    const csv = [
      "ID,Description,Amount,Category,Date",
      ...sample.map(
        (item) =>
          `${item.id},"${item.description}",${item.amount},${item.category},${item.date}`,
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sample-${area.toLowerCase()}-${method}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={s.card} style={{ marginBottom: "1.5rem" }}>
      <div className={s.cardHeader}>
        <h3 className={s.cardTitle}>
          <Target size={16} style={{ marginRight: "0.5rem" }} />
          Sample Selection — {area}
        </h3>
      </div>
      <div className={s.cardBody}>
        {/* Population Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              padding: "0.75rem",
              background: "#f0f9ff",
              borderRadius: "4px",
              border: "1px solid #e0f2fe",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#0369a1",
                letterSpacing: "0.06em",
              }}
            >
              Population Size
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {population.length}
            </div>
          </div>
          <div
            style={{
              padding: "0.75rem",
              background: "#fffbeb",
              borderRadius: "4px",
              border: "1px solid #fef3c7",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#b45309",
                letterSpacing: "0.06em",
              }}
            >
              Total Value
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              ₦{(totalPopValue / 1e6).toFixed(1)}M
            </div>
          </div>
          <div
            style={{
              padding: "0.75rem",
              background: "#f0fdf4",
              borderRadius: "4px",
              border: "1px solid #dcfce7",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#15803d",
                letterSpacing: "0.06em",
              }}
            >
              Categories
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {categories.length}
            </div>
          </div>
          <div
            style={{
              padding: "0.75rem",
              background: "#faf5ff",
              borderRadius: "4px",
              border: "1px solid #f3e8ff",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#7e22ce",
                letterSpacing: "0.06em",
              }}
            >
              Materiality
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              ₦{(materialityThreshold / 1e6).toFixed(1)}M
            </div>
          </div>
        </div>

        {/* Population Distribution */}
        <button
          type="button"
          className={s.btnSecondary}
          style={{ marginBottom: "1rem", fontSize: "0.78rem" }}
          onClick={() => setShowPopulation(!showPopulation)}
        >
          <BarChart3 size={14} /> {showPopulation ? "Hide" : "View"} Population
          Distribution
        </button>

        {showPopulation && (
          <div style={{ marginBottom: "1.5rem" }}>
            {categories.map((cat) => {
              const catItems = population.filter((p) => p.category === cat);
              const catTotal = catItems.reduce((sum, p) => sum + p.amount, 0);
              const pct = (catTotal / totalPopValue) * 100;
              return (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: "150px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                    }}
                  >
                    {cat}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "16px",
                      background: "#e2e8f0",
                      borderRadius: "99px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "linear-gradient(90deg, #c8930a, #f5a800)",
                        borderRadius: "99px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      minWidth: "80px",
                      textAlign: "right",
                    }}
                  >
                    {catItems.length} items · {pct.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Sampling Controls */}
        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Sampling Method</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                {
                  key: "random" as const,
                  label: "Random",
                  icon: <Shuffle size={14} />,
                },
                {
                  key: "stratified" as const,
                  label: "Stratified",
                  icon: <Layers size={14} />,
                },
                {
                  key: "mus" as const,
                  label: "Monetary Unit (MUS)",
                  icon: <DollarSign size={14} />,
                },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className={
                    method === m.key ? s.filterChipActive : s.filterChip
                  }
                  onClick={() => setMethod(m.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Sample Size</label>
            <input
              className={s.formInput}
              type="number"
              value={sampleSize || ""}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              min={1}
              max={population.length}
            />
            <span
              style={{
                fontSize: "0.72rem",
                color:
                  sampleSize / population.length < 0.03 ? "#dc2626" : "#15803d",
                fontWeight: 600,
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {((sampleSize / population.length) * 100).toFixed(1)}% of
              population
              {sampleSize / population.length < 0.03
                ? " — ⚠ Below minimum 3%"
                : " — ✓ Adequate"}
            </span>
          </div>
        </div>

        {/* Method Description */}
        <div
          style={{
            padding: "0.75rem",
            background: "#f8fafc",
            borderRadius: "4px",
            fontSize: "0.82rem",
            color: "#475569",
            marginBottom: "1rem",
            border: "1px solid #e2e8f0",
          }}
        >
          {method === "random" && (
            <>
              <strong>Simple Random Sampling:</strong> Each item in the
              population has an equal probability of selection. Suitable for
              homogeneous populations. ISA 530 compliant.
            </>
          )}
          {method === "stratified" && (
            <>
              <strong>Stratified Sampling:</strong> Population divided into{" "}
              {categories.length} categories. Equal representation from each
              stratum. Ensures coverage across all transaction types per ISA
              530.
            </>
          )}
          {method === "mus" && (
            <>
              <strong>Monetary Unit Sampling (MUS):</strong> Probability
              proportional to size. Higher-value transactions more likely
              selected. Items above materiality (₦
              {(materialityThreshold / 1e6).toFixed(1)}M) auto-selected. ISA 530
              preferred for substantive testing.
            </>
          )}
        </div>

        <div className={s.formActions}>
          <button className={s.btnPrimary} onClick={handleGenerate}>
            <Target size={14} /> Generate Sample
          </button>
        </div>

        {/* Results */}
        {generated && (
          <div style={{ marginTop: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#64748b",
                    }}
                  >
                    Selected
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                    {sample.length} items
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#64748b",
                    }}
                  >
                    Sample Value
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                    ₦{(sampleValue / 1e6).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#64748b",
                    }}
                  >
                    Coverage
                  </div>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: coverageRate > 50 ? "#15803d" : "#d97706",
                    }}
                  >
                    {coverageRate.toFixed(1)}%
                  </div>
                </div>
              </div>
              <button
                className={`${s.btnSecondary} ${s.btnSmall}`}
                onClick={handleDownload}
              >
                <Download size={14} /> Download CSV
              </button>
            </div>

            {/* High-value auto-selected items */}
            {method === "mus" &&
              sample.filter((item) => item.amount >= materialityThreshold)
                .length > 0 && (
                <div
                  style={{
                    padding: "0.75rem",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                    fontSize: "0.82rem",
                  }}
                >
                  <AlertTriangle
                    size={14}
                    style={{
                      marginRight: "0.3rem",
                      verticalAlign: "middle",
                      color: "#dc2626",
                    }}
                  />
                  <strong>
                    {
                      sample.filter(
                        (item) => item.amount >= materialityThreshold,
                      ).length
                    }
                  </strong>{" "}
                  item(s) auto-selected (above materiality threshold)
                </div>
              )}

            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th style={{ textAlign: "right" }}>Amount (₦)</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sample.slice(0, 30).map((item, idx) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600, color: "#64748b" }}>
                        {idx + 1}
                      </td>
                      <td
                        style={{
                          fontSize: "0.82rem",
                          maxWidth: "250px",
                          whiteSpace: "normal",
                        }}
                      >
                        {item.description}
                      </td>
                      <td style={{ fontSize: "0.82rem" }}>{item.category}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {item.amount.toLocaleString()}
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "#64748b" }}>
                        {item.date}
                      </td>
                      <td>
                        {item.amount >= materialityThreshold ? (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              color: "#dc2626",
                              background: "#fef2f2",
                              padding: "0.15rem 0.4rem",
                              borderRadius: "99px",
                            }}
                          >
                            HIGH VALUE
                          </span>
                        ) : (
                          <span
                            style={{ fontSize: "0.72rem", color: "#15803d" }}
                          >
                            <CheckCircle
                              size={12}
                              style={{ verticalAlign: "middle" }}
                            />{" "}
                            Selected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {sample.length > 30 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "0.75rem",
                  fontSize: "0.82rem",
                  color: "#64748b",
                }}
              >
                Showing 30 of {sample.length} items. Download CSV for full list.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SampleGenerator;
