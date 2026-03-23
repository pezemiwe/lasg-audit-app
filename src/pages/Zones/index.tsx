import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { MOCK_USERS } from "../../mock/data";
import StatusBadge from "../../components/UI/StatusBadge";
import AddSupervisorModal from "../../components/Modals/AddSupervisorModal"; // New Import
import {
  MapPin,
  Users,
  UserPlus,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Trash2,
} from "lucide-react";
import s from "../../styles/pages.module.css";

const ZoneManagementPage: React.FC = () => {
  const zones = useAuditStore((st) => st.zones);
  const lgas = useAuditStore((st) => st.lgas);
  const audits = useAuditStore((st) => st.audits);
  const addSupervisor = useAuditStore((st) => st.addSupervisor);
  const removeSupervisor = useAuditStore((st) => st.removeSupervisor);
  const openModal = useAuditStore((st) => st.openModal);

  const supervisors = useMemo(
    () => MOCK_USERS.filter((u) => u.role === "AUDIT_SUPERVISOR"),
    [],
  );

  const assignedSupIds = useMemo(() => {
    const ids = new Set<string>();
    zones.forEach((z) => {
      z.supervisorIds?.forEach((id) => ids.add(id));
    });
    return ids;
  }, [zones]);

  const [expandedZone, setExpandedZone] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetZoneId, setTargetZoneId] = useState<string | null>(null);
  const [expandedLgaId, setExpandedLgaId] = useState<string | null>(null);

  const handleOpenAddModal = (zoneId: string) => {
    setTargetZoneId(zoneId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTargetZoneId(null);
  };

  // Old handleAssign removed, replaced by modal
  const handleAssign = (zoneId: string, supId: string) => {
    addSupervisor(zoneId, supId);
    setModalOpen(false);
  };

  const handleRemove = (zoneId: string, supId: string) => {
    const sup = MOCK_USERS.find((u) => u.id === supId);
    const zone = zones.find((z) => z.id === zoneId);
    openModal({
      title: "Remove Supervisor",
      message: `Remove ${sup?.name} from ${zone?.name} Zone?`,
      confirmText: "Remove",
      variant: "danger",
      onConfirm: () => removeSupervisor(zoneId, supId),
    });
  };

  const assignedCount = zones.filter(
    (z) => z.supervisorIds && z.supervisorIds.length > 0,
  ).length;

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Zone Management</h1>
          <p className={s.pageSubtitle}>
            Assign audit supervisors to the 5 administrative zones of Lagos
            State — covering {lgas.length} Councils (
            {
              lgas.filter((l) => !l.councilType || l.councilType === "LGA")
                .length
            }{" "}
            LGAs &amp; {lgas.filter((l) => l.councilType === "LCDA").length}{" "}
            LCDAs)
          </p>
        </div>
        <span className={s.pageBadge}>
          <Shield size={12} /> Auditor General
        </span>
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <MapPin size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total Zones</div>
            <div className={s.kpiValue}>{zones.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Zones Covered</div>
            <div className={s.kpiValue}>
              {assignedCount} / {zones.length}
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <AlertCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Partially/Unassigned</div>
            <div className={s.kpiValue}>{zones.length - assignedCount}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <Users size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Supervisors Pool</div>
            <div className={s.kpiValue}>{supervisors.length}</div>
          </div>
        </div>
      </div>

      <div
        className={s.progressBar}
        style={{ marginBottom: "2rem", height: "8px" }}
      >
        <div
          className={s.progressFill}
          style={{ width: `${(assignedCount / zones.length) * 100}%` }}
        />
      </div>

      {zones.map((zone) => {
        const zoneLgas = lgas.filter((l) => l.zoneId === zone.id);
        const assignedSupervisors =
          zone.supervisorIds
            ?.map((id) => MOCK_USERS.find((u) => u.id === id))
            .filter((u): u is typeof u & { id: string } => !!u) || [];

        const hasSupervisors = assignedSupervisors.length > 0;
        const isExpanded = expandedZone === zone.id;

        return (
          <div
            key={zone.id}
            className={s.card}
            style={{ marginBottom: "1rem" }}
          >
            <div
              className={s.cardHeader}
              style={{ cursor: "pointer" }}
              onClick={() => setExpandedZone(isExpanded ? null : zone.id)}
              role="button"
              aria-expanded={isExpanded}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setExpandedZone(isExpanded ? null : zone.id);
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <MapPin size={18} style={{ color: "#c8930a" }} />
                <div>
                  <h3 className={s.cardTitle}>{zone.name} Zone</h3>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      marginTop: "0.15rem",
                    }}
                  >
                    {
                      zoneLgas.filter(
                        (l) => !l.councilType || l.councilType === "LGA",
                      ).length
                    }{" "}
                    LGAs,{" "}
                    {zoneLgas.filter((l) => l.councilType === "LCDA").length}{" "}
                    LCDAs
                    {hasSupervisors &&
                      ` · ${assignedSupervisors.length} Supervisor(s)`}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <StatusBadge
                  label={hasSupervisors ? "Assigned" : "Pending"}
                  variant={hasSupervisors ? "success" : "warning"}
                />
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </div>

            {isExpanded && (
              <div className={s.cardBody}>
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 300px" }}>
                    <div
                      className={s.sectionDivider}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Supervisors</span>
                      <button
                        className={s.btnSmall}
                        style={{
                          padding: "0.25rem 0.6rem",
                          fontSize: "0.75rem",
                          borderRadius: "4px",
                          border: "1px solid #e2e8f0",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAddModal(zone.id);
                        }}
                      >
                        <UserPlus size={14} /> Add Supervisor
                      </button>
                    </div>

                    {assignedSupervisors.map((sup) => (
                      <div
                        key={sup.id}
                        className={s.poolCard}
                        style={{ marginTop: "0.75rem" }}
                      >
                        <div className={s.poolInfo}>
                          <div className={s.poolName}>{sup.name}</div>
                          <div className={s.poolMeta}>
                            {sup.email} · {sup.phone}
                          </div>
                          <div
                            className={s.poolTags}
                            style={{ marginTop: "0.3rem" }}
                          >
                            {sup.specialisations?.map((sp) => (
                              <span key={sp} className={s.poolTag}>
                                {sp}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          className={`${s.btnDanger} ${s.btnSmall}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(zone.id, sup.id);
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}

                    {assignedSupervisors.length === 0 && (
                      <div
                        style={{
                          padding: "1.5rem",
                          textAlign: "center",
                          color: "#94a3b8",
                          fontSize: "0.9rem",
                          border: "1px dashed #cbd5e1",
                          borderRadius: "6px",
                          marginTop: "1rem",
                          background: "#f8fafc",
                          fontStyle: "italic",
                        }}
                      >
                        No supervisors assigned yet.
                      </div>
                    )}
                  </div>

                  <div style={{ flex: "1 1 300px" }}>
                    <div className={s.sectionDivider}>
                      Councils (LGAs &amp; LCDAs)
                    </div>
                    <div style={{ marginTop: "0.75rem" }}>
                      {zoneLgas.map((lga) => {
                        const activeAudit = audits.find(
                          (a) => a.lgaId === lga.id && a.status !== "Completed",
                        );
                        const lead = activeAudit?.leadId
                          ? MOCK_USERS.find((u) => u.id === activeAudit.leadId)
                          : null;
                        const team = activeAudit?.teamIds
                          ? activeAudit.teamIds
                              .map((id) => MOCK_USERS.find((u) => u.id === id))
                              .filter(
                                (u): u is typeof u & { id: string } => !!u,
                              )
                          : [];

                        return (
                          <div
                            key={lga.id}
                            className={s.listRow}
                            style={{
                              flexDirection: "column",
                              alignItems: "flex-start",
                              gap: "0.5rem",
                              cursor: lead ? "pointer" : "default",
                            }}
                            onClick={() =>
                              lead &&
                              setExpandedLgaId(
                                expandedLgaId === lga.id ? null : lga.id,
                              )
                            }
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <div className={s.listRowName}>
                                  {lga.name}
                                  {lga.councilType === "LCDA" && (
                                    <span
                                      style={{
                                        fontSize: "0.65rem",
                                        fontWeight: 600,
                                        color: "#7c3aed",
                                        background: "#ede9fe",
                                        padding: "0.1rem 0.4rem",
                                        borderRadius: "4px",
                                        marginLeft: "0.4rem",
                                        letterSpacing: "0.04em",
                                      }}
                                    >
                                      LCDA
                                    </span>
                                  )}
                                  {lead && (
                                    <span
                                      style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 400,
                                        color: "var(--text-2)",
                                        marginLeft: "0.5rem",
                                      }}
                                    >
                                      • Audited by {lead.name}
                                    </span>
                                  )}
                                </div>
                                <div className={s.listRowSub}>
                                  {lga.contactName} · {lga.contactEmail}
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <StatusBadge
                                  label={lead ? `Lead Assigned` : "Pending"}
                                  variant={lead ? "success" : "default"}
                                />
                                {lead && (
                                  <ChevronDown
                                    size={14}
                                    style={{
                                      transform:
                                        expandedLgaId === lga.id
                                          ? "rotate(180deg)"
                                          : "rotate(0deg)",
                                      transition: "transform 0.2s",
                                    }}
                                  />
                                )}
                              </div>
                            </div>

                            {expandedLgaId === lga.id && lead && (
                              <div
                                style={{
                                  width: "100%",
                                  paddingTop: "0.75rem",
                                  marginTop: "0.25rem",
                                  borderTop: "1px dashed #e2e8f0",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    color: "var(--text-2)",
                                    marginBottom: "0.5rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  Audit Team for {activeAudit?.year}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "0.5rem",
                                  }}
                                >
                                  {/* Lead Badge */}
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.4rem",
                                      background: "#eff6ff",
                                      color: "#1e40af",
                                      padding: "0.3rem 0.6rem",
                                      borderRadius: "99px",
                                      fontSize: "0.8rem",
                                      border: "1px solid #dbeafe",
                                    }}
                                  >
                                    <Shield size={12} />
                                    <span style={{ fontWeight: 600 }}>
                                      {lead.name}
                                    </span>
                                    <span style={{ opacity: 0.7 }}>(Lead)</span>
                                  </div>

                                  {/* Team Members */}
                                  {team.map((member) => (
                                    <div
                                      key={member.id}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.4rem",
                                        background: "#f8fafc",
                                        color: "#475569",
                                        padding: "0.3rem 0.6rem",
                                        borderRadius: "99px",
                                        fontSize: "0.8rem",
                                        border: "1px solid #e2e8f0",
                                      }}
                                    >
                                      <Users size={12} />
                                      <span>{member.name}</span>
                                    </div>
                                  ))}

                                  {team.length === 0 && (
                                    <span
                                      style={{
                                        fontSize: "0.8rem",
                                        color: "#94a3b8",
                                        fontStyle: "italic",
                                        padding: "0.3rem 0",
                                      }}
                                    >
                                      No other team members assigned.
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {modalOpen && (
        <AddSupervisorModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          zone={zones.find((z) => z.id === targetZoneId)}
          supervisors={supervisors}
          assignedSupervisorIds={assignedSupIds}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
};

export default ZoneManagementPage;
