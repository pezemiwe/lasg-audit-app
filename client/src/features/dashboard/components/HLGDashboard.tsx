import React from "react";
import { useNavigate } from "react-router-dom";
import { FileCheck, Shield, Upload, Mail } from "lucide-react";
import { LGAS } from "../../../mock/data";
import type {
  User,
  Audit,
  Mandate,
  NotificationLetter,
  DocumentUpload,
} from "../../../types";
import s from "../../../styles/pages.module.css";

interface HLGDashboardProps {
  user: User;
  documentUploads: DocumentUpload[];
  letters: NotificationLetter[];
  mandates: Mandate[];
  audits: Audit[];
}

const HLGDashboard: React.FC<HLGDashboardProps> = ({
  user,
  documentUploads,
  letters,
  mandates,
  audits,
}) => {
  const navigate = useNavigate();
  const lgaObj = LGAS.find((l) => l.id === user.lgaId);
  const lgaName = lgaObj?.name || "Your Council";
  const lgaLabel = lgaObj?.councilType === "LCDA" ? "LCDA" : "LGA";
  const myDocs = documentUploads.filter((d) => d.lgaId === user.lgaId);
  const docsUploaded = myDocs.filter((d) => d.status !== "Not Uploaded").length;
  const docsApproved = myDocs.filter((d) => d.status === "Approved").length;
  const docsRejected = myDocs.filter((d) => d.status === "Rejected").length;
  const myLetters = letters.filter((l) => l.lgaId === user.lgaId);
  const activeMandates = mandates.filter(
    (m) => m.status === "Published" || m.status === "Active",
  );
  const lgaAudits = audits.filter((a) => a.lgaId === user.lgaId);
  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>
            {lgaName} {lgaLabel} Dashboard
          </h1>
          <p className={s.pageSubtitle}>
            Manage audit notifications, document submissions, and mandate
            compliance
          </p>
        </div>
        <span className={s.pageBadge}>
          <Shield size={12} /> Head of Local Government
        </span>
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <Mail size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Notifications</div>
            <div className={s.kpiValue}>{myLetters.length}</div>
            <div className={s.kpiMeta}>
              {myLetters.filter((l) => l.status === "Sent").length} pending
              action
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <Upload size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Documents</div>
            <div className={s.kpiValue}>
              {docsUploaded}/{myDocs.length}
            </div>
            <div className={s.kpiMeta}>
              {docsApproved} approved, {docsRejected} need re-upload
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Shield size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Active Mandates</div>
            <div className={s.kpiValue}>{activeMandates.length}</div>
            <div className={s.kpiMeta}>Requiring compliance</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <FileCheck size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Audit Status</div>
            <div className={s.kpiValue}>
              {lgaAudits.length > 0 ? lgaAudits[0].status : "None"}
            </div>
            <div className={s.kpiMeta}>
              {lgaAudits.length > 0
                ? `${lgaAudits[0].progress}% progress`
                : "No active audit"}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className={s.card} style={{ marginBottom: "2rem" }}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Engagement Readiness</h3>
          </div>
          <div className={s.cardBody}>
            <p
              style={{
                color: "var(--text-2)",
                fontSize: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              Please complete the engagement readiness steps required by the
              active audit.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => navigate("/document-submission")}
                className={s.btnPrimary}
                style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}
              >
                Go to Engagement Readiness
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HLGDashboard;
