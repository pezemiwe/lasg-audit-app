import React, { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Eye,
  FileText,
  Plus,
  Send,
  Shield,
  Target,
} from "lucide-react";
import s from "../../../styles/pages.module.css";
import StatusBadge from "../../../components/UI/StatusBadge";
import { useAuditStore } from "../../../store/useAuditStore";
import { useAuth } from "../../../hooks/useAuth";
import type { MandateStatus } from "../../../types";
import { statusVariant } from "../utils/statusVariant";

const MandateListView: React.FC<{
  onCreate: () => void;
  onOpen: (id: string) => void;
}> = ({ onCreate, onOpen }) => {
  const { user } = useAuth();
  const mandates = useAuditStore((st) => st.mandates);
  const publishMandate = useAuditStore((st) => st.publishMandate);
  const openModal = useAuditStore((st) => st.openModal);

  const [filter, setFilter] = useState<MandateStatus | "All">("All");

  const filtered = useMemo(() => {
    if (filter === "All") return mandates;
    return mandates.filter((m) => m.status === filter);
  }, [mandates, filter]);

  const handlePublish = (id: string) => {
    openModal({
      title: "Publish Audit Mandate",
      message:
        "Publishing this mandate will make it visible to all assigned supervisors and initiate the audit cycle. This action cannot be undone.",
      confirmText: "Publish Mandate",
      variant: "info",
      onConfirm: () => publishMandate(id),
    });
  };

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Audit Mandates</h1>
          <p className={s.pageSubtitle}>
            {user?.role === "HEAD_OF_LOCAL_GOVERNMENT"
              ? "View and acknowledge audit mandates for your council"
              : "Create and manage audit mandates for Lagos State council audits"}
          </p>
        </div>
        {user?.role === "STATE_AUDITOR_GENERAL" && (
          <button className={s.btnPrimary} onClick={onCreate}>
            <Plus size={16} /> New Mandate
          </button>
        )}
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <FileText size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total Mandates</div>
            <div className={s.kpiValue}>{mandates.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Drafts</div>
            <div className={s.kpiValue}>
              {mandates.filter((m) => m.status === "Draft").length}
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <Target size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Published</div>
            <div className={s.kpiValue}>
              {
                mandates.filter(
                  (m) => m.status === "Published" || m.status === "Active",
                ).length
              }
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <Shield size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Completed</div>
            <div className={s.kpiValue}>
              {mandates.filter((m) => m.status === "Completed").length}
            </div>
          </div>
        </div>
      </div>

      <div className={s.filterBar} style={{ marginBottom: "1.5rem" }}>
        {(["All", "Draft", "Published", "Active", "Completed"] as const).map(
          (f) => (
            <button
              key={f}
              className={filter === f ? s.filterChipActive : s.filterChip}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ),
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <FileText size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No mandates found</div>
              <div className={s.emptyDesc}>
                Create a new audit mandate to begin the audit cycle.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={s.card}>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Types</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600, maxWidth: "300px" }}>
                      {m.title}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <Calendar size={14} style={{ color: "#64748b" }} /> FY{" "}
                        {m.auditYear}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.3rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {m.auditTypes.map((t: string) => (
                          <StatusBadge key={t} label={t} variant="info" />
                        ))}
                      </div>
                    </td>
                    <td>
                      <StatusBadge
                        label={m.status}
                        variant={statusVariant(m.status)}
                      />
                    </td>
                    <td style={{ fontSize: "0.82rem", color: "#64748b" }}>
                      {new Date(m.createdAt).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <div className={s.tableActions}>
                        <button
                          className={s.btnIcon}
                          aria-label="View mandate"
                          onClick={() => onOpen(m.id)}
                        >
                          <Eye size={14} />
                        </button>
                        {m.status === "Draft" &&
                          (user?.role === "SYSTEM_ADMIN" ||
                            user?.role === "STATE_AUDITOR_GENERAL") && (
                            <button
                              className={`${s.btnPrimary} ${s.btnSmall}`}
                              onClick={() => handlePublish(m.id)}
                            >
                              <Send size={12} /> Publish
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MandateListView;
