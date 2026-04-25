import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { MOCK_USERS } from "../../mock/data";
import AddSupervisorModal from "../../components/Modals/AddSupervisorModal";
import AssignLeadModal from "../../components/Modals/AssignLeadModal";
import { Shield } from "lucide-react";
import s from "../../styles/pages.module.css";
import ZoneKpis from "../../features/zones/components/ZoneKpis";
import ZoneCard from "../../features/zones/components/ZoneCard";
import type { LGA } from "../../types";

const ZoneManagementPage: React.FC = () => {
  const zones = useAuditStore((st) => st.zones);
  const lgas = useAuditStore((st) => st.lgas);
  const audits = useAuditStore((st) => st.audits);
  const addSupervisor = useAuditStore((st) => st.addSupervisor);
  const removeSupervisor = useAuditStore((st) => st.removeSupervisor);
  const assignLead = useAuditStore((st) => st.assignLead);
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

  const [assignLeadModalOpen, setAssignLeadModalOpen] = useState(false);
  const [targetLga, setTargetLga] = useState<LGA | null>(null);

  const handleOpenAssignLeadModal = (lga: LGA) => {
    setTargetLga(lga);
    setAssignLeadModalOpen(true);
  };

  const handleAssignLead = (lgaId: string, leadId: string) => {
    // Audit mapping logic needs to be robust, creating a new audit entry if one doesn't exist
    const currentYear = new Date().getFullYear().toString();
    assignLead(
      lgaId,
      leadId,
      `audit-${lgaId}-${currentYear}`,
      `mandate-${lgaId}-${currentYear}`,
    );
  };

  const handleOpenAddModal = (zoneId: string) => {
    setTargetZoneId(zoneId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTargetZoneId(null);
  };

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

      <ZoneKpis
        zonesCount={zones.length}
        assignedCount={assignedCount}
        supervisorsCount={supervisors.length}
      />

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
        const isExpanded = expandedZone === zone.id;
        return (
          <ZoneCard
            key={zone.id}
            zone={zone}
            zoneLgas={zoneLgas}
            assignedSupervisors={assignedSupervisors}
            isExpanded={isExpanded}
            onToggleZone={() => setExpandedZone(isExpanded ? null : zone.id)}
            onAddSupervisor={() => handleOpenAddModal(zone.id)}
            onRemoveSupervisor={(supId) => handleRemove(zone.id, supId)}
            audits={audits}
            users={MOCK_USERS}
            expandedLgaId={expandedLgaId}
            setExpandedLgaId={setExpandedLgaId}
            onAssignLead={handleOpenAssignLeadModal}
          />
        );
      })}

      {assignLeadModalOpen && targetLga && (
        <AssignLeadModal
          isOpen={assignLeadModalOpen}
          onClose={() => setAssignLeadModalOpen(false)}
          lga={targetLga}
          users={MOCK_USERS}
          onAssign={handleAssignLead}
        />
      )}

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
