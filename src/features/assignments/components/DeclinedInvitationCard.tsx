import React from "react";
import type { Invitation } from "../../../types";
import StatusBadge from "../../../components/UI/StatusBadge";
import { XCircle } from "lucide-react";
import s from "../../../styles/pages.module.css";
import { getRoleName } from "../utils/assignmentsData";

type Props = {
  inv: Invitation;
  getLgaName: (id?: string) => string;
};

const DeclinedInvitationCard: React.FC<Props> = ({ inv, getLgaName }) => (
  <div className={s.invitationCard} style={{ opacity: 0.6 }}>
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
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#dc2626",
            flexShrink: 0,
          }}
        >
          <XCircle size={20} />
        </div>
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "var(--text, #0f172a)",
            }}
          >
            {getRoleName(inv.role)}: {inv.lgaId ? getLgaName(inv.lgaId) : ""}
          </div>
        </div>
      </div>
      <StatusBadge label="Declined" variant="error" />
    </div>
  </div>
);

export default DeclinedInvitationCard;
