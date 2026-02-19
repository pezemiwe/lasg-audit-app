import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { MOCK_USERS } from "../../mock/data";
import StatusBadge from "../../components/UI/StatusBadge";
import {
  MapPin,
  Users,
  UserPlus,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import s from "../../styles/pages.module.css";

const ZoneManagementPage: React.FC = () => {
  const zones = useAuditStore((st) => st.zones);
  const lgas = useAuditStore((st) => st.lgas);
  const assignSupervisor = useAuditStore((st) => st.assignSupervisor);
  const unassignSupervisor = useAuditStore((st) => st.unassignSupervisor);
  const openModal = useAuditStore((st) => st.openModal);

  const supervisors = useMemo(
    () => MOCK_USERS.filter((u) => u.role === "AUDIT_SUPERVISOR"),
    [],
  );

  const assignedSupIds = useMemo(
    () =>
      new Set(zones.filter((z) => z.supervisorId).map((z) => z.supervisorId!)),
    [zones],
  );

  const [expandedZone, setExpandedZone] = useState<string | null>(null);
  const [assigningZone, setAssigningZone] = useState<string | null>(null);

  const handleAssign = (zoneId: string, supId: string) => {
    const sup = MOCK_USERS.find((u) => u.id === supId);
    const zone = zones.find((z) => z.id === zoneId);
    openModal({
      title: "Assign Supervisor",
      message: `Assign ${sup?.name} as the supervisor for ${zone?.name} Zone? They will oversee all LGA audits within this zone.`,
      confirmText: "Assign",
      variant: "info",
      onConfirm: () => {
        assignSupervisor(zoneId, supId);
        setAssigningZone(null);
      },
    });
  };

  const handleUnassign = (zoneId: string) => {
    const zone = zones.find((z) => z.id === zoneId);
    openModal({
      title: "Remove Supervisor Assignment",
      message: `Remove the current supervisor from ${zone?.name} Zone? This may impact ongoing audit activities.`,
      confirmText: "Remove",
      variant: "danger",
      onConfirm: () => unassignSupervisor(zoneId),
    });
  };

  const assignedCount = zones.filter((z) => z.supervisorId).length;

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Zone Management</h1>
          <p className={s.pageSubtitle}>
            Assign audit supervisors to the 5 administrative zones of Lagos
            State
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
            <div className={s.kpiLabel}>Supervisors Assigned</div>
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
            <div className={s.kpiLabel}>Pending Assignment</div>
            <div className={s.kpiValue}>{zones.length - assignedCount}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <Users size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Available Supervisors</div>
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
        const sup = zone.supervisorId
          ? MOCK_USERS.find((u) => u.id === zone.supervisorId)
          : null;
        const isExpanded = expandedZone === zone.id;
        const isAssigning = assigningZone === zone.id;

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
                    {zoneLgas.length} LGA{zoneLgas.length !== 1 ? "s" : ""}
                    {sup && ` · Supervisor: ${sup.name}`}
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
                  label={sup ? "Assigned" : "Pending"}
                  variant={sup ? "success" : "warning"}
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
                    <div className={s.sectionDivider}>Supervisor</div>
                    {sup ? (
                      <div
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
                            handleUnassign(zone.id);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : isAssigning ? (
                      <div style={{ marginTop: "0.75rem" }}>
                        <div
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            marginBottom: "0.5rem",
                            color: "#334155",
                          }}
                        >
                          Select a Supervisor
                        </div>
                        {supervisors
                          .filter(
                            (sp) =>
                              !assignedSupIds.has(sp.id) ||
                              sp.id === zone.supervisorId,
                          )
                          .map((sp) => (
                            <div key={sp.id} className={s.poolCard}>
                              <div className={s.poolInfo}>
                                <div className={s.poolName}>{sp.name}</div>
                                <div className={s.poolMeta}>{sp.email}</div>
                                <div
                                  className={s.poolTags}
                                  style={{ marginTop: "0.2rem" }}
                                >
                                  {sp.specialisations?.map((spec) => (
                                    <span key={spec} className={s.poolTag}>
                                      {spec}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <button
                                className={`${s.btnPrimary} ${s.btnSmall}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssign(zone.id, sp.id);
                                }}
                              >
                                <UserPlus size={12} /> Assign
                              </button>
                            </div>
                          ))}
                        <button
                          className={s.btnSecondary}
                          style={{ marginTop: "0.75rem" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAssigningZone(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div style={{ marginTop: "0.75rem" }}>
                        <button
                          className={s.btnGold}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAssigningZone(zone.id);
                          }}
                        >
                          <UserPlus size={14} /> Assign Supervisor
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: "1 1 300px" }}>
                    <div className={s.sectionDivider}>
                      Local Government Areas
                    </div>
                    <div style={{ marginTop: "0.75rem" }}>
                      {zoneLgas.map((lga) => (
                        <div key={lga.id} className={s.listRow}>
                          <div>
                            <div className={s.listRowName}>{lga.name}</div>
                            <div className={s.listRowSub}>
                              {lga.contactName} · {lga.contactEmail}
                            </div>
                          </div>
                          <StatusBadge
                            label={
                              lga.auditLeadId ? "Lead Assigned" : "Pending"
                            }
                            variant={lga.auditLeadId ? "success" : "default"}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ZoneManagementPage;
