import React from "react";
import type { Invitation } from "../../../types";
import StatusBadge from "../../../components/UI/StatusBadge";
import {
  Mail,
  CheckCircle,
  XCircle,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import s from "../../../styles/pages.module.css";
import { getRoleName } from "../utils/assignmentsData";

type Props = {
  inv: Invitation;
  getLgaName: (id?: string) => string;
  getZoneName: (id?: string) => string;
  getMandateTitle: (id: string) => string;
  onAccept: (invId: string) => void;
  onDecline: (invId: string) => void;
};

const PendingInvitationCard: React.FC<Props> = ({
  inv,
  getLgaName,
  getZoneName,
  getMandateTitle,
  onAccept,
  onDecline,
}) => (
  <div className={s.invitationCard}>
    <div className={s.invitationHeader}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "4px",
            background: "#fffbeb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#d97706",
            flexShrink: 0,
          }}
        >
          <Mail size={20} />
        </div>
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "var(--text, #0f172a)",
            }}
          >
            {getRoleName(inv.role)} Assignment
          </div>
          <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
            {inv.lgaId && `${getLgaName(inv.lgaId)}`}
            {inv.zoneId && `${getZoneName(inv.zoneId)} Zone`}
            {` Â| Sent ${new Date(inv.sentAt).toLocaleDateString("en-NG")}`}
          </div>
        </div>
      </div>
      <div className={s.invitationActions}>
        <button
          className={`${s.btnPrimary} ${s.btnSmall}`}
          onClick={() => onAccept(inv.id)}
        >
          <CheckCircle size={14} /> Accept
        </button>
        <button
          className={`${s.btnDanger} ${s.btnSmall}`}
          onClick={() => onDecline(inv.id)}
        >
          <XCircle size={14} /> Decline
        </button>
      </div>
    </div>
    <div className={s.invitationBody}>
      <div className={s.detailRow}>
        <div className={s.detailLabel}>Mandate</div>
        <div className={s.detailValue}>{getMandateTitle(inv.mandateId)}</div>
      </div>
      <div className={s.detailRow}>
        <div className={s.detailLabel}>Role</div>
        <div className={s.detailValue}>
          <StatusBadge label={getRoleName(inv.role)} variant="gold" />
        </div>
      </div>
      <div className={s.detailRow}>
        <div className={s.detailLabel}>Expires</div>
        <div className={s.detailValue}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Calendar size={14} style={{ color: "#64748b" }} />
            {new Date(inv.expiresAt).toLocaleString("en-NG")}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: "0.75rem",
          padding: "0.75rem 1rem",
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: "6px",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.6rem",
        }}
      >
        <AlertTriangle
          size={15}
          style={{
            color: "#d97706",
            marginTop: "0.1rem",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            fontSize: "0.8rem",
            color: "#92400e",
            lineHeight: 1.5,
          }}
        >
          <strong>Required:</strong> You must complete a Conflict of Interest
          Declaration before accepting this engagement. Clicking <em>Accept</em>{" "}
          will open the declaration form.
        </div>
      </div>
    </div>
  </div>
);

export default PendingInvitationCard;
