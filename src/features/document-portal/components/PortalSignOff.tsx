import React from "react";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import s from "../../../styles/pages.module.css";

type SignOffBarProps = {
  signedOff: boolean;
  canSignOff: boolean;
  onSignOff: () => void;
};

export const PortalSignOffBar: React.FC<SignOffBarProps> = ({
  signedOff,
  canSignOff,
  onSignOff,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "1rem",
    }}
  >
    <button
      className={`${s.btnPrimary} ${signedOff ? s.btnSuccess : ""}`}
      disabled={signedOff || !canSignOff}
      onClick={onSignOff}
      style={{ opacity: signedOff || !canSignOff ? 0.6 : 1 }}
    >
      {signedOff ? (
        <>
          <CheckCircle2 size={16} /> Signed-Off By Lead
        </>
      ) : (
        <>
          <ShieldCheck size={16} /> Sign-Off & Attest Documents
        </>
      )}
    </button>
  </div>
);

export const PortalActionRequiredBanner: React.FC = () => (
  <div
    style={{
      backgroundColor: "#fff3cd",
      border: "1px solid #fde047",
      color: "#991b1b",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      display: "flex",
      gap: "0.75rem",
      alignItems: "center",
    }}
  >
    <AlertTriangle size={20} />
    <div>
      <strong>Action Required:</strong> All documents have been received. Please
      review the documents and initiate the sign-off process below.
    </div>
  </div>
);
