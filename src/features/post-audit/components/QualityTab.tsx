import React from "react";
import {
  AlertTriangle,
  CheckCircle,
  Plus,
  Star,
  TrendingUp,
} from "lucide-react";
import s from "../../../styles/pages.module.css";
import type { QualityRating, QualityReview, User } from "../../../types";
import StarRating from "./StarRating";
import { userName } from "../utils/helpers";

interface Props {
  isAG: boolean;
  isSupervisor: boolean;
  auditQualityReview: QualityReview | undefined;
  showQualityForm: boolean;
  setShowQualityForm: React.Dispatch<React.SetStateAction<boolean>>;
  qrOverall: QualityRating;
  setQrOverall: React.Dispatch<React.SetStateAction<QualityRating>>;
  qrPlanning: QualityRating;
  setQrPlanning: React.Dispatch<React.SetStateAction<QualityRating>>;
  qrFieldwork: QualityRating;
  setQrFieldwork: React.Dispatch<React.SetStateAction<QualityRating>>;
  qrReporting: QualityRating;
  setQrReporting: React.Dispatch<React.SetStateAction<QualityRating>>;
  qrTeam: QualityRating;
  setQrTeam: React.Dispatch<React.SetStateAction<QualityRating>>;
  qrTimeliness: QualityRating;
  setQrTimeliness: React.Dispatch<React.SetStateAction<QualityRating>>;
  qrStrengths: string;
  setQrStrengths: React.Dispatch<React.SetStateAction<string>>;
  qrImprovements: string;
  setQrImprovements: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitQuality: () => void;
  users: User[];
}

const QualityTab: React.FC<Props> = ({
  isAG,
  isSupervisor,
  auditQualityReview,
  showQualityForm,
  setShowQualityForm,
  qrOverall,
  setQrOverall,
  qrPlanning,
  setQrPlanning,
  qrFieldwork,
  setQrFieldwork,
  qrReporting,
  setQrReporting,
  qrTeam,
  setQrTeam,
  qrTimeliness,
  setQrTimeliness,
  qrStrengths,
  setQrStrengths,
  qrImprovements,
  setQrImprovements,
  handleSubmitQuality,
  users,
}) => (
  <div className={s.card}>
    <div className={s.cardHeader}>
      <h3 className={s.cardTitle}>
        <Star size={18} /> Quality Assurance Review
      </h3>
      {(isAG || isSupervisor) && !auditQualityReview && (
        <button
          className={s.btnPrimary}
          onClick={() => setShowQualityForm(!showQualityForm)}
        >
          <Plus size={16} /> Submit Review
        </button>
      )}
    </div>

    {showQualityForm && !auditQualityReview && (
      <div className={s.cardBody}>
        <div
          style={{
            padding: "1.25rem",
            background: "#faf5ff",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <h4 style={{ marginBottom: "1rem", fontWeight: 600 }}>
            Quality Assessment
          </h4>
          <div className={s.gridTwoCols}>
            <div>
              <StarRating
                value={qrOverall}
                onChange={(v) => setQrOverall(v as QualityRating)}
                label="Overall Rating"
              />
              <StarRating
                value={qrPlanning}
                onChange={(v) => setQrPlanning(v as QualityRating)}
                label="Planning Quality"
              />
              <StarRating
                value={qrFieldwork}
                onChange={(v) => setQrFieldwork(v as QualityRating)}
                label="Fieldwork Quality"
              />
            </div>
            <div>
              <StarRating
                value={qrReporting}
                onChange={(v) => setQrReporting(v as QualityRating)}
                label="Reporting Quality"
              />
              <StarRating
                value={qrTeam}
                onChange={(v) => setQrTeam(v as QualityRating)}
                label="Team Performance"
              />
              <StarRating
                value={qrTimeliness}
                onChange={(v) => setQrTimeliness(v as QualityRating)}
                label="Timeliness"
              />
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <div className={s.formGroupFull}>
              <label className={s.formLabel}>Key Strengths *</label>
              <textarea
                className={s.formTextarea}
                rows={3}
                value={qrStrengths}
                onChange={(e) => setQrStrengths(e.target.value)}
                placeholder="What went well during this audit..."
              />
            </div>
            <div className={s.formGroupFull}>
              <label className={s.formLabel}>Areas for Improvement *</label>
              <textarea
                className={s.formTextarea}
                rows={3}
                value={qrImprovements}
                onChange={(e) => setQrImprovements(e.target.value)}
                placeholder="What could be improved for future audits..."
              />
            </div>
          </div>
          <div className={s.formActions}>
            <button className={s.btnPrimary} onClick={handleSubmitQuality}>
              <CheckCircle size={16} /> Submit Quality Review
            </button>
            <button
              className={s.btnSecondary}
              onClick={() => setShowQualityForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    <div className={s.cardBody}>
      {auditQualityReview ? (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
              padding: "1rem",
              background:
                auditQualityReview.overallRating >= 4
                  ? "#f0fdf4"
                  : auditQualityReview.overallRating >= 3
                    ? "#fefce8"
                    : "#fef2f2",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color:
                  auditQualityReview.overallRating >= 4
                    ? "#059669"
                    : auditQualityReview.overallRating >= 3
                      ? "#d97706"
                      : "#dc2626",
              }}
            >
              {auditQualityReview.overallRating}/5
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                Overall Quality Rating
              </div>
              <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                Reviewed by {userName(auditQualityReview.reviewedBy, users)} ”¢{" "}
                {new Date(auditQualityReview.reviewedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className={s.gridThreeCols}>
            {[
              {
                label: "Planning",
                val: auditQualityReview.planningQuality,
              },
              {
                label: "Fieldwork",
                val: auditQualityReview.fieldworkQuality,
              },
              {
                label: "Reporting",
                val: auditQualityReview.reportingQuality,
              },
              {
                label: "Team Performance",
                val: auditQualityReview.teamPerformance,
              },
              {
                label: "Timeliness",
                val: auditQualityReview.timelinessRating,
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "0.75rem",
                  background: "#f9fafb",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "2px",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={16}
                      fill={n <= item.val ? "#f59e0b" : "none"}
                      color={n <= item.val ? "#f59e0b" : "#d1d5db"}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={s.sectionDivider} />

          <div className={s.gridTwoCols}>
            <div>
              <h4
                style={{
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "#059669",
                }}
              >
                <TrendingUp size={16} /> Key Strengths
              </h4>
              <p style={{ color: "#374151", whiteSpace: "pre-wrap" }}>
                {auditQualityReview.strengths}
              </p>
            </div>
            <div>
              <h4
                style={{
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "#d97706",
                }}
              >
                <AlertTriangle size={16} /> Areas for Improvement
              </h4>
              <p style={{ color: "#374151", whiteSpace: "pre-wrap" }}>
                {auditQualityReview.improvements}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={s.emptyState}>
          <Star size={40} className={s.emptyIcon} />
          <h3 className={s.emptyTitle}>No Quality Review</h3>
          <p className={s.emptyDesc}>
            {isAG || isSupervisor
              ? "Submit a quality assurance review for this audit engagement."
              : "The quality review will be completed by the Supervisor or Auditor-General."}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default QualityTab;
