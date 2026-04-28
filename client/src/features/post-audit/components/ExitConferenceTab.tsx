import React from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  FileText,
  Plus,
  Users,
} from "lucide-react";
import StatusBadge from "../../../components/UI/StatusBadge";
import s from "../../../styles/pages.module.css";
import type { ExitConference } from "../../../types";

interface Props {
  canManage: boolean;
  auditExitConf: ExitConference | undefined;
  showExitForm: boolean;
  setShowExitForm: React.Dispatch<React.SetStateAction<boolean>>;
  ecDate: string;
  setEcDate: React.Dispatch<React.SetStateAction<string>>;
  ecLgaRep: string;
  setEcLgaRep: React.Dispatch<React.SetStateAction<string>>;
  ecAttendees: string;
  setEcAttendees: React.Dispatch<React.SetStateAction<string>>;
  ecDiscussions: string;
  setEcDiscussions: React.Dispatch<React.SetStateAction<string>>;
  ecActions: string;
  setEcActions: React.Dispatch<React.SetStateAction<string>>;
  handleAddExitConference: () => void;
}

const ExitConferenceTab: React.FC<Props> = ({
  canManage,
  auditExitConf,
  showExitForm,
  setShowExitForm,
  ecDate,
  setEcDate,
  ecLgaRep,
  setEcLgaRep,
  ecAttendees,
  setEcAttendees,
  ecDiscussions,
  setEcDiscussions,
  ecActions,
  setEcActions,
  handleAddExitConference,
}) => (
  <div className={s.card}>
    <div className={s.cardHeader}>
      <h3 className={s.cardTitle}>
        <Users size={18} /> Exit Conference
      </h3>
      {canManage && !auditExitConf && (
        <button
          className={s.btnPrimary}
          onClick={() => setShowExitForm(!showExitForm)}
        >
          <Plus size={16} /> Record Exit Conference
        </button>
      )}
    </div>

    {showExitForm && !auditExitConf && (
      <div className={s.cardBody}>
        <div
          style={{
            padding: "1rem",
            background: "#eff6ff",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <h4 style={{ marginBottom: "0.75rem", fontWeight: 600 }}>
            Exit Conference Details
          </h4>
          <div className={s.formGrid}>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Conference Date *</label>
              <input
                type="date"
                className={s.formInput}
                value={ecDate}
                onChange={(e) => setEcDate(e.target.value)}
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel}>LGA Representative *</label>
              <input
                type="text"
                className={s.formInput}
                value={ecLgaRep}
                onChange={(e) => setEcLgaRep(e.target.value)}
                placeholder="Name of LGA representative"
              />
            </div>
            <div className={s.formGroupFull}>
              <label className={s.formLabel}>
                Attendees * (comma-separated)
              </label>
              <input
                type="text"
                className={s.formInput}
                value={ecAttendees}
                onChange={(e) => setEcAttendees(e.target.value)}
                placeholder="e.g. John Doe, Jane Smith, Mohammed Ibrahim"
              />
            </div>
            <div className={s.formGroupFull}>
              <label className={s.formLabel}>Key Discussions *</label>
              <textarea
                className={s.formTextarea}
                rows={4}
                value={ecDiscussions}
                onChange={(e) => setEcDiscussions(e.target.value)}
                placeholder="Summarise key discussion points during the exit conference..."
              />
            </div>
            <div className={s.formGroupFull}>
              <label className={s.formLabel}>Agreed Actions *</label>
              <textarea
                className={s.formTextarea}
                rows={3}
                value={ecActions}
                onChange={(e) => setEcActions(e.target.value)}
                placeholder="List agreed follow-up actions and timelines..."
              />
            </div>
          </div>
          <div className={s.formActions}>
            <button className={s.btnPrimary} onClick={handleAddExitConference}>
              <CheckCircle size={16} /> Save Exit Conference
            </button>
            <button
              className={s.btnSecondary}
              onClick={() => setShowExitForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    <div className={s.cardBody}>
      {auditExitConf ? (
        <div>
          <div className={s.gridTwoCols}>
            <div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Date</span>
                <span className={s.detailValue}>
                  <Calendar size={14} style={{ marginRight: "6px" }} />
                  {new Date(auditExitConf.date).toLocaleDateString()}
                </span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>LGA Representative</span>
                <span className={s.detailValue}>
                  {auditExitConf.lgaRepresentative}
                </span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Audit Representative</span>
                <span className={s.detailValue}>
                  {auditExitConf.auditRepresentative}
                </span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Minutes Approved</span>
                <span className={s.detailValue}>
                  <StatusBadge
                    label={
                      auditExitConf.minutesApproved ? "Approved" : "Pending"
                    }
                    variant={
                      auditExitConf.minutesApproved ? "success" : "warning"
                    }
                  />
                </span>
              </div>
            </div>
            <div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Attendees</span>
                <span className={s.detailValue}>
                  {auditExitConf.attendees.map((a, i) => (
                    <span
                      key={i}
                      className={s.poolTag}
                      style={{ marginRight: "4px", marginBottom: "4px" }}
                    >
                      {a}
                    </span>
                  ))}
                </span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Agenda Items</span>
                <span className={s.detailValue}>
                  <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                    {auditExitConf.agendaItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </span>
              </div>
            </div>
          </div>

          <div className={s.sectionDivider} />

          <div style={{ marginBottom: "1rem" }}>
            <h4
              style={{
                fontWeight: 600,
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FileText size={16} /> Key Discussions
            </h4>
            <p style={{ color: "#374151", whiteSpace: "pre-wrap" }}>
              {auditExitConf.keyDiscussions}
            </p>
          </div>

          <div>
            <h4
              style={{
                fontWeight: 600,
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ArrowRight size={16} /> Agreed Actions
            </h4>
            <p style={{ color: "#374151", whiteSpace: "pre-wrap" }}>
              {auditExitConf.agreedActions}
            </p>
          </div>
        </div>
      ) : (
        <div className={s.emptyState}>
          <Users size={40} className={s.emptyIcon} />
          <h3 className={s.emptyTitle}>No Exit Conference Recorded</h3>
          <p className={s.emptyDesc}>
            {canManage
              ? "Record the exit conference with LGA management to document agreed-upon actions."
              : "The exit conference will be recorded by the audit team."}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default ExitConferenceTab;
