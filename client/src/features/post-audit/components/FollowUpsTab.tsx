import React from "react";
import { CheckCircle, Plus, Target } from "lucide-react";
import StatusBadge from "../../../components/UI/StatusBadge";
import s from "../../../styles/pages.module.css";
import type {
  Finding,
  FollowUpItem,
  FollowUpStatus,
  User,
} from "../../../types";
import { followUpVariant, userName } from "../utils/helpers";

interface Props {
  canManage: boolean;
  isHLGA: boolean;
  allFindings: Finding[];
  auditFollowUps: FollowUpItem[];
  showFollowUpForm: boolean;
  setShowFollowUpForm: React.Dispatch<React.SetStateAction<boolean>>;
  fuFindingId: string;
  setFuFindingId: React.Dispatch<React.SetStateAction<string>>;
  fuResponsible: string;
  setFuResponsible: React.Dispatch<React.SetStateAction<string>>;
  fuTargetDate: string;
  setFuTargetDate: React.Dispatch<React.SetStateAction<string>>;
  handleAddFollowUp: () => void;
  handleUpdateFollowUpStatus: (
    id: string,
    status: FollowUpStatus,
    notes?: string,
  ) => void;
  users: User[];
}

const FollowUpsTab: React.FC<Props> = ({
  canManage,
  isHLGA,
  allFindings,
  auditFollowUps,
  showFollowUpForm,
  setShowFollowUpForm,
  fuFindingId,
  setFuFindingId,
  fuResponsible,
  setFuResponsible,
  fuTargetDate,
  setFuTargetDate,
  handleAddFollowUp,
  handleUpdateFollowUpStatus,
  users,
}) => (
  <div className={s.card}>
    <div className={s.cardHeader}>
      <h3 className={s.cardTitle}>
        <Target size={18} /> Follow-Up Tracker
      </h3>
      {canManage && allFindings.length > 0 && (
        <button
          className={s.btnPrimary}
          onClick={() => setShowFollowUpForm(!showFollowUpForm)}
        >
          <Plus size={16} /> Add Follow-Up
        </button>
      )}
    </div>

    {showFollowUpForm && (
      <div className={s.cardBody}>
        <div
          style={{
            padding: "1rem",
            background: "#f0fdf4",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <h4 style={{ marginBottom: "0.75rem", fontWeight: 600 }}>
            Create Follow-Up Item
          </h4>
          <div className={s.formGrid}>
            <div className={s.formGroupFull}>
              <label className={s.formLabel}>Select Finding</label>
              <select
                className={s.formSelect}
                value={fuFindingId}
                onChange={(e) => setFuFindingId(e.target.value)}
              >
                <option value="">âselect finding</option>
                {allFindings.map((f) => (
                  <option key={f.id} value={f.id}>
                    [{f.severity}] {f.title}
                  </option>
                ))}
              </select>
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Responsible Party</label>
              <select
                className={s.formSelect}
                value={fuResponsible}
                onChange={(e) => setFuResponsible(e.target.value)}
              >
                <option value="">select</option>
                <option value="LGA Management">LGA Management</option>
                <option value="Finance Department">Finance Department</option>
                <option value="Internal Audit">Internal Audit</option>
                <option value="Procurement Unit">Procurement Unit</option>
                <option value="HR Department">HR Department</option>
                <option value="IT Department">IT Department</option>
              </select>
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Target Date</label>
              <input
                type="date"
                className={s.formInput}
                value={fuTargetDate}
                onChange={(e) => setFuTargetDate(e.target.value)}
              />
            </div>
          </div>
          <div className={s.formActions}>
            <button className={s.btnPrimary} onClick={handleAddFollowUp}>
              <CheckCircle size={16} /> Create Follow-Up
            </button>
            <button
              className={s.btnSecondary}
              onClick={() => setShowFollowUpForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    <div className={s.cardBody}>
      {auditFollowUps.length === 0 ? (
        <div className={s.emptyState}>
          <Target size={40} className={s.emptyIcon} />
          <h3 className={s.emptyTitle}>No Follow-Up Items</h3>
          <p className={s.emptyDesc}>
            {canManage
              ? "Create follow-up items from audit findings to track remediation."
              : "Follow-up items will appear once created by the audit team."}
          </p>
        </div>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Finding</th>
                <th>Responsible</th>
                <th>Target Date</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {auditFollowUps.map((fu) => {
                const isOverdue =
                  fu.status !== "Verified" &&
                  new Date(fu.targetDate) < new Date();
                return (
                  <tr key={fu.id}>
                    <td>
                      <strong>{fu.findingTitle}</strong>
                      <br />
                      <small style={{ color: "#6b7280" }}>
                        {fu.recommendation.slice(0, 80)}...
                      </small>
                    </td>
                    <td>{fu.responsibleParty}</td>
                    <td>
                      <span
                        style={{
                          color: isOverdue ? "#dc2626" : "inherit",
                          fontWeight: isOverdue ? 600 : 400,
                        }}
                      >
                        {new Date(fu.targetDate).toLocaleDateString()}
                      </span>
                      {isOverdue && (
                        <small
                          style={{
                            display: "block",
                            color: "#dc2626",
                            fontWeight: 600,
                          }}
                        >
                          OVERDUE
                        </small>
                      )}
                    </td>
                    <td>
                      <StatusBadge
                        label={
                          isOverdue && fu.status !== "Verified"
                            ? "Overdue"
                            : fu.status
                        }
                        variant={
                          isOverdue && fu.status !== "Verified"
                            ? "error"
                            : followUpVariant(fu.status)
                        }
                      />
                    </td>
                    <td>
                      {fu.implementationNotes || (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                      {fu.verifiedBy && (
                        <small
                          style={{
                            display: "block",
                            color: "#059669",
                            marginTop: "4px",
                          }}
                        >
                          Verified by {userName(fu.verifiedBy, users)}
                        </small>
                      )}
                    </td>
                    <td>
                      <div className={s.tableActions}>
                        {isHLGA && fu.status === "Open" && (
                          <button
                            className={`${s.btnSmall} ${s.btnPrimary}`}
                            onClick={() =>
                              handleUpdateFollowUpStatus(
                                fu.id,
                                "In Progress",
                                "Implementation started by LGA",
                              )
                            }
                          >
                            Start
                          </button>
                        )}
                        {isHLGA && fu.status === "In Progress" && (
                          <button
                            className={`${s.btnSmall} ${s.btnPrimary}`}
                            onClick={() =>
                              handleUpdateFollowUpStatus(
                                fu.id,
                                "Implemented",
                                "Implementation completed, awaiting verification",
                              )
                            }
                          >
                            Mark Implemented
                          </button>
                        )}
                        {canManage && fu.status === "Implemented" && (
                          <button
                            className={`${s.btnSmall} ${s.btnGold}`}
                            onClick={() =>
                              handleUpdateFollowUpStatus(fu.id, "Verified")
                            }
                          >
                            <CheckCircle size={14} /> Verify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

export default FollowUpsTab;
