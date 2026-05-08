/* ==================================================================
   SectionBuilder
   Re-usable repeatable block for Audit Report sections AND
   Accounting Policy items. Each block supports:
     - header, body (description)
     - optional bullet list
     - optional table
     - optional recommendation (hideable per-use)

   Props are intentionally generic: it edits a canonical shape and
   calls onChange with the updated record. Caller decides which
   fields to show.
   ================================================================== */

import React, { useState } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ListOrdered,
  Table as TableIcon,
  Lightbulb,
} from "lucide-react";
import type { SectionTable } from "../../types/auditOutcomes";

export interface EditableSection {
  id: string;
  order: number;
  header: string;
  description: string;
  bullets?: string[];
  table?: SectionTable;
  recommendation?: string;
}

interface SectionBuilderProps {
  sections: EditableSection[];
  onChange: (sections: EditableSection[]) => void;
  showRecommendation?: boolean; // Audit Report: true; Accounting Policy: false
  headerLabel?: string; // "Header" | "Policy Title"
  descriptionLabel?: string; // "Description / Observation" | "Policy Body"
  readOnly?: boolean;
}

const uid = () =>
  `sec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const SectionBuilder: React.FC<SectionBuilderProps> = ({
  sections,
  onChange,
  showRecommendation = true,
  headerLabel = "Header",
  descriptionLabel = "Description",
  readOnly = false,
}) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const updateSection = (id: string, patch: Partial<EditableSection>) => {
    onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const addSection = () => {
    const nextOrder =
      sections.length > 0
        ? Math.max(...sections.map((s) => s.order)) + 1
        : 1;
    onChange([
      ...sections,
      {
        id: uid(),
        order: nextOrder,
        header: "",
        description: "",
      },
    ]);
  };

  const deleteSection = (id: string) => {
    onChange(sections.filter((s) => s.id !== id));
  };

  const move = (id: string, direction: -1 | 1) => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const next = [...sections];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    onChange(next.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const toggleBullets = (s: EditableSection) => {
    if (s.bullets) {
      updateSection(s.id, { bullets: undefined });
    } else {
      updateSection(s.id, { bullets: [""] });
    }
  };

  const toggleTable = (s: EditableSection) => {
    if (s.table) {
      updateSection(s.id, { table: undefined });
    } else {
      updateSection(s.id, {
        table: {
          headers: ["Column A", "Column B"],
          rows: [
            [{ value: "" }, { value: "" }],
            [{ value: "" }, { value: "" }],
          ],
        },
      });
    }
  };

  const toggleRecommendation = (s: EditableSection) => {
    if (s.recommendation != null) {
      updateSection(s.id, { recommendation: undefined });
    } else {
      updateSection(s.id, { recommendation: "" });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {sections
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((section) => {
          const isCollapsed = collapsed[section.id];
          return (
            <div
              key={section.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                background: "#ffffff",
                overflow: "hidden",
              }}
            >
              {/* Header bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  background: "#f8fafc",
                  borderBottom: isCollapsed ? "none" : "1px solid #e2e8f0",
                }}
              >
                <GripVertical size={14} color="#94a3b8" />
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#064e3b",
                    background: "#d1fae5",
                    padding: "0.15rem 0.4rem",
                    borderRadius: 3,
                  }}
                >
                  #{section.order}
                </span>
                <strong
                  style={{
                    flex: 1,
                    fontSize: "0.85rem",
                    color: "#0f172a",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {section.header || <em style={{ color: "#94a3b8" }}>Untitled</em>}
                </strong>
                {!readOnly && (
                  <>
                    <button
                      type="button"
                      title="Move up"
                      onClick={() => move(section.id, -1)}
                      style={{ ...iconBtn, color: "#475569" }}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      title="Move down"
                      onClick={() => move(section.id, 1)}
                      style={{ ...iconBtn, color: "#475569" }}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => deleteSection(section.id)}
                      style={{ ...iconBtn, color: "#dc2626" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setCollapsed((c) => ({ ...c, [section.id]: !c[section.id] }))
                  }
                  style={{ ...iconBtn }}
                >
                  {isCollapsed ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronUp size={14} />
                  )}
                </button>
              </div>

              {!isCollapsed && (
                <div style={{ padding: "0.9rem 0.9rem 1rem" }}>
                  {/* Header input */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={labelStyle}>{headerLabel}</label>
                    <input
                      value={section.header}
                      onChange={(e) =>
                        updateSection(section.id, { header: e.target.value })
                      }
                      disabled={readOnly}
                      style={inputStyle}
                    />
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={labelStyle}>{descriptionLabel}</label>
                    <textarea
                      value={section.description}
                      onChange={(e) =>
                        updateSection(section.id, {
                          description: e.target.value,
                        })
                      }
                      disabled={readOnly}
                      rows={4}
                      style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                    />
                  </div>

                  {/* Bullets */}
                  {section.bullets && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <label style={labelStyle}>Bullet points</label>
                      {section.bullets.map((b, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 6,
                            marginBottom: 4,
                            alignItems: "center",
                          }}
                        >
                          <span style={{ color: "#64748b" }}>•</span>
                          <input
                            value={b}
                            onChange={(e) => {
                              const next = [...(section.bullets ?? [])];
                              next[i] = e.target.value;
                              updateSection(section.id, { bullets: next });
                            }}
                            disabled={readOnly}
                            style={inputStyle}
                          />
                          {!readOnly && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = (section.bullets ?? []).filter(
                                  (_, j) => j !== i,
                                );
                                updateSection(section.id, {
                                  bullets: next.length ? next : undefined,
                                });
                              }}
                              style={{ ...iconBtn, color: "#dc2626" }}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() =>
                            updateSection(section.id, {
                              bullets: [...(section.bullets ?? []), ""],
                            })
                          }
                          style={smallGhostBtn}
                        >
                          <Plus size={12} /> Add bullet
                        </button>
                      )}
                    </div>
                  )}

                  {/* Table */}
                  {section.table && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <label style={labelStyle}>Table</label>
                      <div style={{ overflowX: "auto" }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "0.8rem",
                          }}
                        >
                          <thead>
                            <tr>
                              {section.table.headers.map((h, ci) => (
                                <th key={ci} style={thStyle}>
                                  <input
                                    value={h}
                                    disabled={readOnly}
                                    onChange={(e) => {
                                      const headers = [...section.table!.headers];
                                      headers[ci] = e.target.value;
                                      updateSection(section.id, {
                                        table: { ...section.table!, headers },
                                      });
                                    }}
                                    style={{ ...inputStyle, fontWeight: 600 }}
                                  />
                                </th>
                              ))}
                              {!readOnly && (
                                <th style={{ ...thStyle, width: 36 }}>
                                  <button
                                    type="button"
                                    title="Add column"
                                    onClick={() => {
                                      const headers = [
                                        ...section.table!.headers,
                                        `Column ${section.table!.headers.length + 1}`,
                                      ];
                                      const rows = section.table!.rows.map(
                                        (r) => [...r, { value: "" }],
                                      );
                                      updateSection(section.id, {
                                        table: { headers, rows },
                                      });
                                    }}
                                    style={{ ...iconBtn }}
                                  >
                                    <Plus size={12} />
                                  </button>
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {section.table.rows.map((row, ri) => (
                              <tr key={ri}>
                                {row.map((cell, ci) => (
                                  <td key={ci} style={tdStyle}>
                                    <input
                                      value={cell.value}
                                      disabled={readOnly}
                                      onChange={(e) => {
                                        const rows = section.table!.rows.map(
                                          (r, i2) =>
                                            i2 === ri
                                              ? r.map((c, j2) =>
                                                  j2 === ci
                                                    ? { value: e.target.value }
                                                    : c,
                                                )
                                              : r,
                                        );
                                        updateSection(section.id, {
                                          table: { ...section.table!, rows },
                                        });
                                      }}
                                      style={inputStyle}
                                    />
                                  </td>
                                ))}
                                {!readOnly && (
                                  <td style={tdStyle}>
                                    <button
                                      type="button"
                                      title="Delete row"
                                      onClick={() => {
                                        const rows = section.table!.rows.filter(
                                          (_, i2) => i2 !== ri,
                                        );
                                        updateSection(section.id, {
                                          table: { ...section.table!, rows },
                                        });
                                      }}
                                      style={{ ...iconBtn, color: "#dc2626" }}
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => {
                            const cols = section.table!.headers.length;
                            updateSection(section.id, {
                              table: {
                                ...section.table!,
                                rows: [
                                  ...section.table!.rows,
                                  Array.from({ length: cols }, () => ({
                                    value: "",
                                  })),
                                ],
                              },
                            });
                          }}
                          style={smallGhostBtn}
                        >
                          <Plus size={12} /> Add row
                        </button>
                      )}
                    </div>
                  )}

                  {/* Recommendation */}
                  {showRecommendation && section.recommendation != null && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <label
                        style={{
                          ...labelStyle,
                          color: "#064e3b",
                          fontWeight: 700,
                        }}
                      >
                        Recommendation
                      </label>
                      <textarea
                        value={section.recommendation}
                        onChange={(e) =>
                          updateSection(section.id, {
                            recommendation: e.target.value,
                          })
                        }
                        disabled={readOnly}
                        rows={3}
                        style={{
                          ...inputStyle,
                          borderColor: "#10b981",
                          background: "#f0fdf4",
                          fontFamily: "inherit",
                          resize: "vertical",
                        }}
                      />
                    </div>
                  )}

                  {/* Toggles */}
                  {!readOnly && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => toggleBullets(section)}
                        style={toggleBtn(!!section.bullets)}
                      >
                        <ListOrdered size={12} />
                        {section.bullets ? "Remove" : "Add"} bullets
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleTable(section)}
                        style={toggleBtn(!!section.table)}
                      >
                        <TableIcon size={12} />
                        {section.table ? "Remove" : "Add"} table
                      </button>
                      {showRecommendation && (
                        <button
                          type="button"
                          onClick={() => toggleRecommendation(section)}
                          style={toggleBtn(section.recommendation != null)}
                        >
                          <Lightbulb size={12} />
                          {section.recommendation != null ? "Remove" : "Add"}{" "}
                          recommendation
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

      {!readOnly && (
        <button
          type="button"
          onClick={addSection}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "0.6rem 0.9rem",
            border: "1px dashed #94a3b8",
            borderRadius: 6,
            background: "#ffffff",
            color: "#475569",
            fontSize: "0.8rem",
            cursor: "pointer",
            justifyContent: "center",
          }}
        >
          <Plus size={14} /> Add section
        </button>
      )}
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 600,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.45rem 0.6rem",
  border: "1px solid #cbd5e1",
  borderRadius: 4,
  fontSize: "0.85rem",
  color: "#0f172a",
  background: "#ffffff",
};

const thStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  padding: "0.25rem",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  padding: "0.25rem",
};

const iconBtn: React.CSSProperties = {
  width: 24,
  height: 24,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "none",
  borderRadius: 3,
  cursor: "pointer",
};

const smallGhostBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "0.35rem 0.6rem",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  borderRadius: 4,
  fontSize: "0.72rem",
  color: "#475569",
  cursor: "pointer",
  marginTop: 4,
};

const toggleBtn = (active: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "0.35rem 0.7rem",
  border: active ? "1px solid #10b981" : "1px dashed #cbd5e1",
  background: active ? "#f0fdf4" : "#ffffff",
  color: active ? "#064e3b" : "#64748b",
  borderRadius: 4,
  fontSize: "0.72rem",
  cursor: "pointer",
});

export default SectionBuilder;
