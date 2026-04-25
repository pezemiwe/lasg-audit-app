import React from "react";
import { Eye } from "lucide-react";
import s from "../../../styles/pages.module.css";
import StatusBadge from "../../../components/UI/StatusBadge";
import { useAuditStore } from "../../../store/useAuditStore";
import { useAuth } from "../../../hooks/useAuth";
import type { Mandate } from "../../../types";

const MandateComplianceTab: React.FC<{
  mandate: Mandate;
  onSelectLga: (lgaId: string) => void;
}> = ({ mandate, onSelectLga }) => {
  const { user } = useAuth();
  const lgas = useAuditStore((st) => st.lgas);
  const zones = useAuditStore((st) => st.zones);
  const documentUploads = useAuditStore((st) => st.documentUploads);

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h3 className={s.cardTitle}>Council Compliance Tracker</h3>
        <div style={{ display: "flex", gap: "1rem" }}>
          <StatusBadge
            label={`Accepted: ${
              mandate.acceptedByLgas?.length || 0
            } of ${lgas.length}`}
            variant="info"
          />
        </div>
      </div>
      <div className={s.cardBody}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              {user?.role === "STATE_AUDITOR_GENERAL" ||
              user?.role === "AUDITOR_GENERAL_FEDERATION" ? (
                <tr>
                  <th>Council Name</th>
                  <th>Zone</th>
                  <th>Mandate Status</th>
                  <th>Action</th>
                </tr>
              ) : (
                <tr>
                  <th>Council Name</th>
                  <th>Zone</th>
                  <th>Mandate Status</th>
                  <th>Documents Uploaded</th>
                  <th>Progress</th>
                  <th>Last Activity</th>
                  <th>Action</th>
                </tr>
              )}
            </thead>
            <tbody>
              {lgas.map((lga) => {
                const isAccepted = mandate.acceptedByLgas?.includes(lga.id);
                const zone = zones.find((z) => z.id === lga.zoneId);

                const lgaDocs = documentUploads.filter(
                  (d) => d.mandateId === mandate.id && d.lgaId === lga.id,
                );

                const uploadedCount = lgaDocs.filter(
                  (d) => d.status === "Uploaded" || d.status === "Approved",
                ).length;

                let isVisible = false;

                if (
                  user?.role === "STATE_AUDITOR_GENERAL" ||
                  user?.role === "AUDITOR_GENERAL_FEDERATION"
                ) {
                  isVisible = true;
                } else if (user?.role === "SYSTEM_ADMIN") {
                  if (isAccepted && uploadedCount > 0) isVisible = true;
                } else if (user?.role === "AUDIT_SUPERVISOR") {
                  if (isAccepted || uploadedCount > 0) isVisible = true;
                } else if (
                  user?.role === "AUDIT_LEAD" ||
                  user?.role === "TEAM_AUDITOR"
                ) {
                  if (uploadedCount > 0) isVisible = true;
                } else {
                  if (isAccepted) isVisible = true;
                }

                if (
                  user?.role === "HEAD_OF_LOCAL_GOVERNMENT" &&
                  user.lgaId === lga.id
                ) {
                  isVisible = true;
                }

                if (!isVisible) return null;

                const totalDocs = lgaDocs.length > 0 ? lgaDocs.length : 10;
                const percentage = Math.round(
                  (uploadedCount / totalDocs) * 100,
                );

                const lastUpload = lgaDocs
                  .filter((d) => d.uploadedAt)
                  .sort(
                    (a, b) =>
                      new Date(b.uploadedAt!).getTime() -
                      new Date(a.uploadedAt!).getTime(),
                  )[0];

                const isAG =
                  user?.role === "STATE_AUDITOR_GENERAL" ||
                  user?.role === "AUDITOR_GENERAL_FEDERATION";

                return (
                  <tr key={lga.id}>
                    <td style={{ fontWeight: 600 }}>{lga.name}</td>
                    <td style={{ color: "var(--text-2)" }}>{zone?.name}</td>
                    <td>
                      {isAccepted ? (
                        <StatusBadge label="Accepted" variant="success" />
                      ) : (
                        <StatusBadge label="Pending" variant="warning" />
                      )}
                    </td>
                    {!isAG && (
                      <>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              fontWeight: 500,
                            }}
                          >
                            <span>
                              {uploadedCount} / {totalDocs}
                            </span>
                          </div>
                        </td>
                        <td style={{ width: "20%" }}>
                          <div
                            style={{
                              width: "100%",
                              height: "6px",
                              background: "#e2e8f0",
                              borderRadius: "3px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${percentage}%`,
                                height: "100%",
                                background:
                                  percentage === 100
                                    ? "#10b981"
                                    : percentage > 50
                                      ? "#3b82f6"
                                      : "#cbd5e1",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-3)",
                              marginTop: "0.25rem",
                              textAlign: "right",
                            }}
                          >
                            {percentage}%
                          </div>
                        </td>
                        <td
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-2)",
                          }}
                        >
                          {lastUpload?.uploadedAt
                            ? new Date(
                                lastUpload.uploadedAt,
                              ).toLocaleDateString()
                            : "-"}
                        </td>
                      </>
                    )}
                    <td>
                      <button
                        className={s.btnSecondary}
                        style={{
                          padding: "0.4rem 0.8rem",
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                        onClick={() => onSelectLga(lga.id)}
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MandateComplianceTab;
