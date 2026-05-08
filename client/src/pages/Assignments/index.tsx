import React, { useMemo, useState } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import { Mail, CheckCircle, Clock, Briefcase } from "lucide-react";
import s from "../../styles/pages.module.css";
import PendingInvitationCard from "../../features/assignments/components/PendingInvitationCard";
import AcceptedInvitationCard from "../../features/assignments/components/AcceptedInvitationCard";
import DeclinedInvitationCard from "../../features/assignments/components/DeclinedInvitationCard";
import COIDeclarationModal from "../../features/assignments/components/COIDeclarationModal";
import { COI_DECLARATIONS } from "../../features/assignments/utils/assignmentsData";

const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const invitations = useAuditStore((st) => st.invitations);
  const acceptInvitation = useAuditStore((st) => st.acceptInvitation);
  const declineInvitation = useAuditStore((st) => st.declineInvitation);
  const openModal = useAuditStore((st) => st.openModal);
  const lgas = useAuditStore((st) => st.lgas);
  const zones = useAuditStore((st) => st.zones);
  const mandates = useAuditStore((st) => st.mandates);

  const [showCOIModal, setShowCOIModal] = useState(false);
  const [coiTargetId, setCoiTargetId] = useState<string | null>(null);
  const [coiChecks, setCoiChecks] = useState<boolean[]>(
    COI_DECLARATIONS.map(() => false),
  );
  const [coiCompleted, setCoiCompleted] = useState<Set<string>>(new Set());
  const [expandedPrep, setExpandedPrep] = useState<Set<string>>(new Set());

  const myInvitations = useMemo(
    () => (user ? invitations.filter((i) => i.userId === user.id) : []),
    [invitations, user],
  );

  const pending = myInvitations.filter((i) => i.status === "Pending");
  const accepted = myInvitations.filter((i) => i.status === "Accepted");
  const declined = myInvitations.filter((i) => i.status === "Declined");

  const allCOIChecked = coiChecks.every(Boolean);

  const handleAccept = (invId: string) => {
    setCoiTargetId(invId);
    setCoiChecks(COI_DECLARATIONS.map(() => false));
    setShowCOIModal(true);
  };

  const handleCOIConfirm = () => {
    if (!coiTargetId || !allCOIChecked) return;
    setCoiCompleted((prev) => new Set([...prev, coiTargetId]));
    acceptInvitation(coiTargetId);
    setShowCOIModal(false);
    setCoiTargetId(null);
  };

  const handleDecline = (invId: string) => {
    openModal({
      title: "Decline Assignment",
      message:
        "Are you sure you want to decline this assignment? The supervisor will be notified and may reassign the engagement.",
      confirmText: "Decline",
      variant: "danger",
      onConfirm: () => declineInvitation(invId),
    });
  };

  const togglePrep = (invId: string) => {
    setExpandedPrep((prev) => {
      const next = new Set(prev);
      if (next.has(invId)) {
        next.delete(invId);
      } else {
        next.add(invId);
      }
      return next;
    });
  };

  const handleStartCOI = (invId: string) => {
    setCoiTargetId(invId);
    setCoiChecks(COI_DECLARATIONS.map(() => false));
    setShowCOIModal(true);
  };

  const getLgaName = (id?: string) =>
    lgas.find((l) => l.id === id)?.name || "—";
  const getZoneName = (id?: string) =>
    zones.find((z) => z.id === id)?.name || "—";
  const getMandateTitle = (id: string) =>
    mandates.find((m) => m.id === id)?.title || "—";

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>My Assignments</h1>
          <p className={s.pageSubtitle}>
            Review and respond to your audit engagement invitations
          </p>
        </div>
        <span className={s.pageBadge}>
          <Briefcase size={12} /> {user?.role.replace(/_/g, " ")}
        </span>
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Pending</div>
            <div className={s.kpiValue}>{pending.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Accepted</div>
            <div className={s.kpiValue}>{accepted.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <Mail size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total</div>
            <div className={s.kpiValue}>{myInvitations.length}</div>
          </div>
        </div>
      </div>

      {pending.length > 0 && (
        <>
          <div className={s.sectionDivider} style={{ marginBottom: "1rem" }}>
            Pending Invitations
          </div>
          {pending.map((inv) => (
            <PendingInvitationCard
              key={inv.id}
              inv={inv}
              getLgaName={getLgaName}
              getZoneName={getZoneName}
              getMandateTitle={getMandateTitle}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))}
        </>
      )}

      {accepted.length > 0 && (
        <>
          <div className={s.sectionDivider} style={{ marginBottom: "1rem" }}>
            Active Assignments
          </div>
          {accepted.map((inv) => (
            <AcceptedInvitationCard
              key={inv.id}
              inv={inv}
              hasCOI={coiCompleted.has(inv.id)}
              isPrepExpanded={expandedPrep.has(inv.id)}
              getLgaName={getLgaName}
              getZoneName={getZoneName}
              getMandateTitle={getMandateTitle}
              onTogglePrep={togglePrep}
              onStartCOI={handleStartCOI}
            />
          ))}
        </>
      )}

      {declined.length > 0 && (
        <>
          <div className={s.sectionDivider} style={{ marginBottom: "1rem" }}>
            Declined
          </div>
          {declined.map((inv) => (
            <DeclinedInvitationCard
              key={inv.id}
              inv={inv}
              getLgaName={getLgaName}
            />
          ))}
        </>
      )}

      {myInvitations.length === 0 && (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <Mail size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No assignments yet</div>
              <div className={s.emptyDesc}>
                You have not received any audit engagement invitations.
                Assignments will appear here when a supervisor or lead adds you
                to their team.
              </div>
            </div>
          </div>
        </div>
      )}

      {showCOIModal && (
        <COIDeclarationModal
          coiChecks={coiChecks}
          setCoiChecks={setCoiChecks}
          allCOIChecked={allCOIChecked}
          isAcceptedTarget={
            !!(coiTargetId && accepted.find((i) => i.id === coiTargetId))
          }
          onCancel={() => setShowCOIModal(false)}
          onConfirm={handleCOIConfirm}
        />
      )}
    </div>
  );
};

export default AssignmentsPage;
