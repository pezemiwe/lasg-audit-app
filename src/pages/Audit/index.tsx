import React, { useState, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import StatusBadge from "../../components/UI/StatusBadge";
import type { Audit, AuditStatus } from "../../types";
import { FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import s from "../../styles/pages.module.css";

const AuditPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const audits = useAuditStore((state) => state.audits);
  const lgas = useAuditStore((state) => state.lgas);
  const zones = useAuditStore((state) => state.zones);
  const users = useAuditStore((state) => state.users);
  const computeAuditProgress = useAuditStore(
    (state) => state.computeAuditProgress,
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    AuditStatus | "All" | "In Progress"
  >("All");
  const [supervisorFilter, setSupervisorFilter] = useState<string>("All");

  const supervisors = useMemo(() => {
    return users.filter((u) => u.role === "AUDIT_SUPERVISOR");
  }, [users]);

  const getLgaName = useCallback(
    (lgaId: string) => {
      if (!lgas) return lgaId;
      return lgas.find((l) => l.id === lgaId)?.name || lgaId;
    },
    [lgas],
  );

  const getAuditTitle = useCallback(
    (audit: Audit) => {
      return `Annual Audit - ${getLgaName(audit.lgaId)} ${audit.year}`;
    },
    [getLgaName],
  );

  const myAudits = useMemo(() => {
    if (!user || !audits) return [];

    // Role-based filtering
    switch (user.role) {
      case "STATE_AUDITOR_GENERAL":
        return audits;
      case "AUDIT_SUPERVISOR": {
        // Find zones where user is supervisor
        if (!zones) return [];
        const myZoneIds = zones
          .filter((z) => z.supervisorIds?.includes(user.id))
          .map((z) => z.id);

        if (!lgas) return [];
        const myLgaIds = lgas
          .filter((l) => myZoneIds.includes(l.zoneId))
          .map((l) => l.id);
        return audits.filter((a) => myLgaIds.includes(a.lgaId));
      }
      case "AUDIT_LEAD":
        return audits.filter((a) => a.leadId === user.id);
      case "TEAM_AUDITOR":
        // Check property existence safely
        return audits.filter((a) => a.teamIds?.includes(user.id));
      case "HEAD_OF_LOCAL_GOVERNMENT":
        // HLGA sees only the audit for their own council
        return user.lgaId ? audits.filter((a) => a.lgaId === user.lgaId) : [];
      case "AUDITOR_GENERAL_FEDERATION":
        // AGF has oversight of all audits
        return audits;
      default:
        return [];
    }
  }, [audits, user, zones, lgas]);

  const filtered = useMemo(() => {
    if (!myAudits) return [];
    return myAudits.filter((a) => {
      const title = getAuditTitle(a);
      const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "In Progress"
          ? a.status !== "Completed" && a.status !== "Pending"
          : a.status === statusFilter);

      let matchesSupervisor = true;
      if (supervisorFilter !== "All" && lgas && zones) {
        const lga = lgas.find((l) => l.id === a.lgaId);
        if (lga) {
          const zone = zones.find((z) => z.id === lga.zoneId);
          if (zone && zone.supervisorIds) {
            matchesSupervisor = zone.supervisorIds.includes(supervisorFilter);
          } else {
            matchesSupervisor = false;
          }
        }
      }
      return matchesSearch && matchesStatus && matchesSupervisor;
    });
  }, [
    myAudits,
    search,
    statusFilter,
    getAuditTitle,
    supervisorFilter,
    lgas,
    zones,
  ]);

  return (
    <div className={s.container}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Audits</h1>
          <p className={s.pageSubtitle}>
            Overview of ongoing and completed audit assignments
          </p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardBody}>
          <div
            className={s.auditHeader}
            style={{ flexWrap: "wrap", gap: "1rem" }}
          >
            <div className={s.filterBar}>
              {(
                [
                  "All",
                  "In Progress",
                  "Pre-Audit",
                  "Planning",
                  "Fieldwork",
                  "Review",
                  "Reporting",
                  "Post-Audit",
                  "Completed",
                ] as const
              ).map((st) => (
                <button
                  key={st}
                  className={
                    statusFilter === st ? s.filterChipActive : s.filterChip
                  }
                  onClick={() => setStatusFilter(st)}
                >
                  {st}
                </button>
              ))}

              {user?.role === "STATE_AUDITOR_GENERAL" && (
                <select
                  value={supervisorFilter}
                  onChange={(e) => setSupervisorFilter(e.target.value)}
                  style={{
                    marginLeft: "0.5rem",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "20px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.875rem",
                    color: "#64748b",
                    outline: "none",
                    cursor: "pointer",
                    backgroundColor: "white",
                  }}
                >
                  <option value="All">All Supervisors</option>
                  {supervisors.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className={s.searchContainer} style={{ marginLeft: "auto" }}>
              <Search className={s.searchIcon} size={18} />
              <input
                type="text"
                className={s.searchInput}
                placeholder="Search audits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={s.auditList}>
        {filtered.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyTitle}>No audits found</div>
            <div className={s.emptyDesc}>
              Try adjusting your search or filters.
            </div>
          </div>
        ) : (
          filtered.map((audit) => {
            const progress = computeAuditProgress(audit.id);
            return (
              <div
                key={audit.id}
                className={s.auditRow}
                onClick={() => navigate(`/audits/${audit.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "#f0fdf4",
                      color: "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FileText size={20} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#0f172a",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {getAuditTitle(audit)}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>{audit.type} Audit</span>
                      <span>•</span>
                      <span>{audit.year}</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2rem",
                    marginRight: "1rem",
                  }}
                >
                  <div style={{ width: "120px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.25rem",
                        fontSize: "0.75rem",
                        color: "#64748b",
                      }}
                    >
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        background: "#e2e8f0",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${progress}%`,
                          background: "#16a34a",
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                  </div>
                  <StatusBadge label={audit.status} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AuditPage;
