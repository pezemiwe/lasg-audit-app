import { useState, useMemo } from "react";
import {
  FileText,
  CheckCircle,
  Plus,
  Eye,
  Download,
  Search,
  Filter,
  Zap,
} from "lucide-react";
import type {
  AuditWorkpaper,
  WorkpaperCategory,
  ProgrammeProcedure,
  InternalControlTest,
  SubstantiveTest,
} from "../../types";
import { MOCK_USERS } from "../../mock/data";
import StatusBadge from "../../components/UI/StatusBadge";
import s from "../../styles/pages.module.css";

interface WorkpaperSummaryProps {
  auditId: string;
  workpapers: AuditWorkpaper[];
  procedures: ProgrammeProcedure[];
  controlTests: InternalControlTest[];
  substantiveTests: SubstantiveTest[];
  userId: string;
  isWriter: boolean;
  isReviewer: boolean;
  onAddWorkpaper: (wp: Omit<AuditWorkpaper, "id">) => void;
  onUpdateWorkpaper: (id: string, updates: Partial<AuditWorkpaper>) => void;
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

const categoryIcons: Record<WorkpaperCategory, string> = {
  "Lead Schedule": "📊",
  "Supporting Schedule": "📋",
  Reconciliation: "🔄",
  Confirmation: "✅",
  "Analytical Procedure": "📈",
  "Representation Letter": "✉️",
  "Minutes & Correspondence": "📝",
  "Permanent File": "🗂️",
  "Planning Memorandum": "📌",
  "Completion Memorandum": "🏁",
};

const WorkpaperSummary: React.FC<WorkpaperSummaryProps> = ({
  auditId,
  workpapers,
  procedures,
  controlTests,
  substantiveTests,
  userId,
  isWriter,
  isReviewer,
  onAddWorkpaper,
  onUpdateWorkpaper,
  onToast,
  onLogActivity,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    WorkpaperCategory | "All"
  >("All");
  const [filterStatus, setFilterStatus] = useState<
    AuditWorkpaper["status"] | "All"
  >("All");
  const [showGenerator, setShowGenerator] = useState(false);
  const [previewWp, setPreviewWp] = useState<AuditWorkpaper | null>(null);

  /* ─── Stats ─── */
  const stats = useMemo(
    () => ({
      total: workpapers.length,
      draft: workpapers.filter((w) => w.status === "Draft").length,
      prepared: workpapers.filter((w) => w.status === "Prepared").length,
      reviewed: workpapers.filter((w) => w.status === "Reviewed").length,
      final: workpapers.filter((w) => w.status === "Final").length,
      coverage: procedures.length
        ? Math.round((workpapers.length / Math.max(procedures.length, 1)) * 100)
        : 0,
    }),
    [workpapers, procedures],
  );

  const filtered = workpapers.filter((wp) => {
    if (filterCategory !== "All" && wp.category !== filterCategory)
      return false;
    if (filterStatus !== "All" && wp.status !== filterStatus) return false;
    if (
      searchQuery &&
      !wp.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !wp.reference.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  /* ─── Auto-generate workpapers from completed procedures ─── */
  const handleAutoGenerate = () => {
    const existingRefs = new Set(workpapers.map((w) => w.reference));
    let count = 0;

    // Generate from procedures
    procedures
      .filter((p) => p.status === "Completed" || p.evidenceUploaded)
      .forEach((proc, idx) => {
        const ref = `WP-${proc.area.replace(/\s+/g, "-").substring(0, 10).toUpperCase()}-${(idx + 1).toString().padStart(3, "0")}`;
        if (!existingRefs.has(ref)) {
          onAddWorkpaper({
            auditId,
            reference: ref,
            title: `${proc.area} – ${proc.procedure.substring(0, 60)}`,
            category: "Supporting Schedule",
            section: proc.area,
            preparedBy: userId,
            preparedAt: new Date().toISOString(),
            status: "Draft",
            crossReferences: proc.workpaperRef ? [proc.workpaperRef] : [],
            notes: `Auto-generated from procedure: ${proc.procedure}\nAssertion: ${proc.assertion}\nSample Size: ${proc.sampleSize}\nFindings: ${proc.findings || "None noted"}`,
          });
          existingRefs.add(ref);
          count++;
        }
      });

    // Generate from control tests
    controlTests
      .filter((ct) => ct.result)
      .forEach((ct, idx) => {
        const ref = `WP-CTRL-${(idx + 1).toString().padStart(3, "0")}`;
        if (!existingRefs.has(ref)) {
          onAddWorkpaper({
            auditId,
            reference: ref,
            title: `Control Test: ${ct.controlArea} – ${ct.controlDescription.substring(0, 50)}`,
            category: "Supporting Schedule",
            section: ct.controlArea,
            preparedBy: userId,
            preparedAt: new Date().toISOString(),
            status: "Draft",
            notes: `Result: ${ct.result}\nProcedure: ${ct.testProcedure}\nWeakness: ${ct.weakness || "None"}\nRecommendation: ${ct.recommendation || "N/A"}`,
          });
          existingRefs.add(ref);
          count++;
        }
      });

    // Generate from substantive tests
    substantiveTests.forEach((st, idx) => {
      const ref = `WP-SUB-${(idx + 1).toString().padStart(3, "0")}`;
      if (!existingRefs.has(ref)) {
        onAddWorkpaper({
          auditId,
          reference: ref,
          title: `Substantive Test: ${st.area} – ${st.procedure.substring(0, 50)}`,
          category: st.area.toLowerCase().includes("analytical")
            ? "Analytical Procedure"
            : "Supporting Schedule",
          section: st.area,
          preparedBy: userId,
          preparedAt: new Date().toISOString(),
          status: "Draft",
          notes: `Population size: ${st.populationSize}\nSample: ${st.sampleSize}\nExceptions: ${st.exceptionCount} (₦${st.exceptionAmount.toLocaleString()})\nConclusion: ${st.conclusion || "Pending"}`,
        });
        existingRefs.add(ref);
        count++;
      }
    });

    // Generate lead schedule
    const areas = [
      ...new Set([
        ...procedures.map((p) => p.area),
        ...controlTests.map((c) => c.controlArea),
        ...substantiveTests.map((s) => s.area),
      ]),
    ];
    areas.forEach((area, idx) => {
      const ref = `WP-LEAD-${(idx + 1).toString().padStart(3, "0")}`;
      if (!existingRefs.has(ref)) {
        const procs = procedures.filter((p) => p.area === area);
        onAddWorkpaper({
          auditId,
          reference: ref,
          title: `Lead Schedule – ${area}`,
          category: "Lead Schedule",
          section: area,
          preparedBy: userId,
          preparedAt: new Date().toISOString(),
          status: "Draft",
          crossReferences: procs
            .map((p) => p.workpaperRef)
            .filter(Boolean) as string[],
          notes: `Procedures: ${procs.length}\nCompleted: ${procs.filter((p) => p.status === "Completed").length}\nPending: ${procs.filter((p) => p.status !== "Completed").length}`,
        });
        existingRefs.add(ref);
        count++;
      }
    });

    onLogActivity({
      userId,
      action: "WORKPAPERS_GENERATED",
      details: `Auto-generated ${count} workpapers from fieldwork results`,
      entityType: "fieldwork",
      entityId: auditId,
    });
    onToast({
      type: count > 0 ? "success" : "info",
      title: "Workpaper Generation",
      message:
        count > 0
          ? `${count} workpapers generated`
          : "All workpapers are up to date",
    });
    setShowGenerator(false);
  };

  const handleReview = (wp: AuditWorkpaper) => {
    onUpdateWorkpaper(wp.id, {
      reviewedBy: userId,
      reviewedAt: new Date().toISOString(),
      status: "Reviewed",
    });
    onLogActivity({
      userId,
      action: "WORKPAPER_REVIEWED",
      details: `Reviewed ${wp.reference}`,
      entityType: "fieldwork",
      entityId: auditId,
    });
    onToast({
      type: "success",
      title: "Workpaper Reviewed",
      message: wp.reference,
    });
  };

  const handleFinalize = (wp: AuditWorkpaper) => {
    onUpdateWorkpaper(wp.id, { status: "Final" });
    onLogActivity({
      userId,
      action: "WORKPAPER_FINALIZED",
      details: `Finalized ${wp.reference}`,
      entityType: "fieldwork",
      entityId: auditId,
    });
    onToast({
      type: "success",
      title: "Workpaper Finalized",
      message: wp.reference,
    });
  };

  const exportIndex = () => {
    const header =
      "Reference,Title,Category,Section,Status,Prepared By,Reviewed By\n";
    const rows = workpapers
      .map(
        (w) =>
          `${w.reference},"${w.title}",${w.category},${w.section},${w.status},${userName(w.preparedBy)},${w.reviewedBy ? userName(w.reviewedBy) : ""}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `workpaper-index-${auditId}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      {/* KPI Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { label: "Total WPs", value: stats.total, color: "#334155" },
          { label: "Draft", value: stats.draft, color: "#d97706" },
          { label: "Prepared", value: stats.prepared, color: "#2563eb" },
          { label: "Reviewed", value: stats.reviewed, color: "#7e22ce" },
          { label: "Final", value: stats.final, color: "#15803d" },
          {
            label: "Coverage",
            value: `${Math.min(stats.coverage, 100)}%`,
            color: stats.coverage >= 80 ? "#15803d" : "#d97706",
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
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#64748b",
                letterSpacing: "0.06em",
              }}
            >
              {kpi.label}
            </div>
            <div
              style={{ fontSize: "1.2rem", fontWeight: 700, color: kpi.color }}
            >
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        {isWriter && (
          <button
            className={`${s.btnGold} ${s.btnSmall}`}
            onClick={() => setShowGenerator(true)}
          >
            <Zap size={14} /> Auto-Generate Workpapers
          </button>
        )}
        <button
          className={`${s.btnSecondary} ${s.btnSmall}`}
          onClick={exportIndex}
        >
          <Download size={14} /> Export Index (CSV)
        </button>
      </div>

      {/* Auto-Generate Confirmation */}
      {showGenerator && (
        <div
          className={s.card}
          style={{ marginBottom: "1rem", borderLeft: "4px solid #d97706" }}
        >
          <div className={s.cardBody}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h4
                  style={{
                    margin: "0 0 0.35rem 0",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  <Zap
                    size={16}
                    style={{ verticalAlign: "middle", color: "#d97706" }}
                  />{" "}
                  Auto-Generate Workpapers
                </h4>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "#475569",
                    marginBottom: "0.5rem",
                  }}
                >
                  This will create workpapers from:
                </p>
                <ul
                  style={{
                    fontSize: "0.82rem",
                    color: "#475569",
                    paddingLeft: "1.5rem",
                    lineHeight: 1.8,
                  }}
                >
                  <li>
                    <strong>
                      {
                        procedures.filter(
                          (p) => p.status === "Completed" || p.evidenceUploaded,
                        ).length
                      }
                    </strong>{" "}
                    completed procedures → Supporting Schedules
                  </li>
                  <li>
                    <strong>
                      {controlTests.filter((ct) => ct.result).length}
                    </strong>{" "}
                    control tests → Control Documentation
                  </li>
                  <li>
                    <strong>{substantiveTests.length}</strong> substantive tests
                    → Test Documentation
                  </li>
                  <li>Area-level Lead Schedules</li>
                </ul>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={`${s.btnPrimary} ${s.btnSmall}`}
                  onClick={handleAutoGenerate}
                >
                  Generate
                </button>
                <button
                  className={`${s.btnSecondary} ${s.btnSmall}`}
                  onClick={() => setShowGenerator(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            placeholder="Search workpapers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <Filter size={14} style={{ color: "#64748b", marginTop: "2px" }} />
          {(["All", "Draft", "Prepared", "Reviewed", "Final"] as const).map(
            (st) => (
              <button
                key={st}
                className={
                  filterStatus === st ? s.filterChipActive : s.filterChip
                }
                onClick={() => setFilterStatus(st)}
              >
                {st}
              </button>
            ),
          )}
        </div>
        <select
          className={s.formSelect}
          style={{ fontSize: "0.78rem", width: "180px" }}
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(e.target.value as WorkpaperCategory | "All")
          }
        >
          <option value="All">All Categories</option>
          {Object.keys(categoryIcons).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Workpaper Table */}
      {filtered.length > 0 ? (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Ref</th>
                <th>Title</th>
                <th>Category</th>
                <th>Section</th>
                <th>Prepared</th>
                <th>Reviewed</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((wp) => (
                <tr key={wp.id}>
                  <td
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#064e3b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {wp.reference}
                  </td>
                  <td style={{ fontSize: "0.82rem", maxWidth: "280px" }}>
                    <span
                      style={{
                        cursor: "pointer",
                        color: "#1e40af",
                        textDecoration: "underline",
                      }}
                      onClick={() => setPreviewWp(wp)}
                    >
                      {wp.title}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                    {categoryIcons[wp.category]} {wp.category}
                  </td>
                  <td style={{ fontSize: "0.78rem" }}>{wp.section}</td>
                  <td style={{ fontSize: "0.75rem" }}>
                    <div>{userName(wp.preparedBy)}</div>
                    <div style={{ color: "#94a3b8", fontSize: "0.68rem" }}>
                      {new Date(wp.preparedAt).toLocaleDateString("en-NG")}
                    </div>
                  </td>
                  <td style={{ fontSize: "0.75rem" }}>
                    {wp.reviewedBy ? (
                      <div>
                        <div>{userName(wp.reviewedBy)}</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.68rem" }}>
                          {wp.reviewedAt
                            ? new Date(wp.reviewedAt).toLocaleDateString(
                                "en-NG",
                              )
                            : ""}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: "#94a3b8" }}>—</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge
                      label={wp.status}
                      variant={
                        wp.status === "Final"
                          ? "success"
                          : wp.status === "Reviewed"
                            ? "info"
                            : wp.status === "Prepared"
                              ? "warning"
                              : "warning"
                      }
                    />
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.3rem" }}>
                      <button
                        className={`${s.btnSecondary} ${s.btnSmall}`}
                        style={{ fontSize: "0.68rem" }}
                        onClick={() => setPreviewWp(wp)}
                      >
                        <Eye size={10} /> View
                      </button>
                      {isReviewer && wp.status === "Prepared" && (
                        <button
                          className={`${s.btnPrimary} ${s.btnSmall}`}
                          style={{ fontSize: "0.68rem" }}
                          onClick={() => handleReview(wp)}
                        >
                          <CheckCircle size={10} /> Review
                        </button>
                      )}
                      {isReviewer && wp.status === "Reviewed" && (
                        <button
                          className={`${s.btnGold} ${s.btnSmall}`}
                          style={{ fontSize: "0.68rem" }}
                          onClick={() => handleFinalize(wp)}
                        >
                          <CheckCircle size={10} /> Finalize
                        </button>
                      )}
                      {isWriter && wp.status === "Draft" && (
                        <button
                          className={`${s.btnPrimary} ${s.btnSmall}`}
                          style={{ fontSize: "0.68rem" }}
                          onClick={() =>
                            onUpdateWorkpaper(wp.id, { status: "Prepared" })
                          }
                        >
                          <Plus size={10} /> Submit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <FileText size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>
                {workpapers.length === 0
                  ? "No workpapers yet"
                  : "No matching workpapers"}
              </div>
              <div className={s.emptyDesc}>
                {workpapers.length === 0
                  ? "Use Auto-Generate to create workpapers from completed fieldwork, or add them manually."
                  : "Adjust your search or filters"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workpaper Preview Modal */}
      {previewWp && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setPreviewWp(null)}
        >
          <div
            className={s.card}
            style={{
              width: "600px",
              maxHeight: "80vh",
              overflow: "auto",
              margin: "2rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={s.cardHeader}
              style={{
                position: "sticky",
                top: 0,
                background: "var(--bg-card, #fff)",
                zIndex: 1,
              }}
            >
              <h4 className={s.cardTitle}>
                <FileText size={16} /> {previewWp.reference}
              </h4>
              <button
                className={`${s.btnSecondary} ${s.btnSmall}`}
                onClick={() => setPreviewWp(null)}
              >
                Close
              </button>
            </div>
            <div className={s.cardBody}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <strong style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    Title
                  </strong>
                  <div style={{ fontSize: "0.88rem" }}>{previewWp.title}</div>
                </div>
                <div>
                  <strong style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    Category
                  </strong>
                  <div style={{ fontSize: "0.88rem" }}>
                    {categoryIcons[previewWp.category]} {previewWp.category}
                  </div>
                </div>
                <div>
                  <strong style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    Section
                  </strong>
                  <div style={{ fontSize: "0.88rem" }}>{previewWp.section}</div>
                </div>
                <div>
                  <strong style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    Status
                  </strong>
                  <div>
                    <StatusBadge
                      label={previewWp.status}
                      variant={
                        previewWp.status === "Final" ? "success" : "warning"
                      }
                    />
                  </div>
                </div>
                <div>
                  <strong style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    Prepared By
                  </strong>
                  <div style={{ fontSize: "0.88rem" }}>
                    {userName(previewWp.preparedBy)}
                  </div>
                </div>
                <div>
                  <strong style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    Prepared At
                  </strong>
                  <div style={{ fontSize: "0.88rem" }}>
                    {new Date(previewWp.preparedAt).toLocaleString("en-NG")}
                  </div>
                </div>
                {previewWp.reviewedBy && (
                  <>
                    <div>
                      <strong style={{ fontSize: "0.72rem", color: "#64748b" }}>
                        Reviewed By
                      </strong>
                      <div style={{ fontSize: "0.88rem" }}>
                        {userName(previewWp.reviewedBy)}
                      </div>
                    </div>
                    <div>
                      <strong style={{ fontSize: "0.72rem", color: "#64748b" }}>
                        Reviewed At
                      </strong>
                      <div style={{ fontSize: "0.88rem" }}>
                        {previewWp.reviewedAt
                          ? new Date(previewWp.reviewedAt).toLocaleString(
                              "en-NG",
                            )
                          : "—"}
                      </div>
                    </div>
                  </>
                )}
              </div>
              {previewWp.crossReferences &&
                previewWp.crossReferences.length > 0 && (
                  <div style={{ marginBottom: "1rem" }}>
                    <strong style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      Cross References
                    </strong>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.3rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {previewWp.crossReferences.map((ref, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.15rem 0.5rem",
                            background: "#f1f5f9",
                            borderRadius: "4px",
                            fontFamily: "monospace",
                          }}
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              {previewWp.notes && (
                <div>
                  <strong style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    Content / Notes
                  </strong>
                  <pre
                    style={{
                      fontSize: "0.82rem",
                      whiteSpace: "pre-wrap",
                      background: "#f8fafc",
                      padding: "0.75rem",
                      borderRadius: "4px",
                      marginTop: "0.35rem",
                      lineHeight: 1.6,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {previewWp.notes}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guidance */}
      <div
        style={{
          padding: "0.75rem",
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "4px",
          fontSize: "0.78rem",
          color: "#166534",
          marginTop: "1rem",
        }}
      >
        <strong>ISA 230 – Audit Documentation:</strong> The auditor shall
        prepare documentation sufficient to enable an experienced auditor to
        understand the nature, timing, and extent of procedures performed,
        results obtained, and significant matters arising. Auto-generated
        workpapers should be reviewed and supplemented as needed.
      </div>
    </div>
  );
};

export default WorkpaperSummary;
