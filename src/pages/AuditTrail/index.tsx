import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import {
  Activity,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Shield,
  Clock,
} from "lucide-react";
import s from "../../styles/pages.module.css";
import { MOCK_USERS } from "../../mock/data";

const AuditTrail: React.FC = () => {
  const { user } = useAuth();
  const activityLog = useAuditStore((state) => state.activityLog);
  const [searchTerm, setSearchTerm] = useState("");

  if (!user || user.role !== "SYSTEM_ADMIN") return null;

  const filteredLogs = activityLog.filter((log) => {
    const actor = MOCK_USERS.find((u) => u.id === log.userId);
    const actorName = actor ? actor.name : "System";

    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Audit Trail</h1>
          <p className={s.pageSubtitle}>
            Comprehensive log of all system activities, access events, and data
            modifications.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className={s.btnOutline}>
            <Download size={14} /> Export CSV
          </button>
          <button className={s.btnPrimary}>
            <Filter size={14} /> Filter Logs
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <Activity size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total Events</div>
            <div className={s.kpiValue}>{activityLog.length}</div>
            <div className={s.kpiMeta}>All time</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Shield size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Security Events</div>
            <div className={s.kpiValue}>24</div>
            <div className={s.kpiMeta}>Last 30 days</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <User size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Active Users</div>
            <div className={s.kpiValue}>
              {new Set(activityLog.map((l) => l.userId)).size}
            </div>
            <div className={s.kpiMeta}>Generating logs</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <Calendar size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Retention Period</div>
            <div className={s.kpiValue}>7 Years</div>
            <div className={s.kpiMeta}>Standard compliance</div>
          </div>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>System Event Log</h3>
          <div className={s.filterBar} style={{ padding: 0, border: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--bg-subtle)",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                width: "300px",
              }}
            >
              <Search size={14} color="var(--text-3)" />
              <input
                type="text"
                placeholder="Search logs..."
                style={{
                  border: "none",
                  background: "transparent",
                  marginLeft: "0.5rem",
                  fontSize: "0.85rem",
                  color: "var(--text)",
                  width: "100%",
                  outline: "none",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className={s.listTable}>
          {filteredLogs.map((log) => {
            const logUser = MOCK_USERS.find((u) => u.id === log.userId);
            const userName = logUser?.name || "Unknown User";
            const userRole = logUser?.role.replace(/_/g, " ") || "System";
            const initials = userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <div key={log.id} className={s.listRow}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "var(--bg-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-3)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span className={s.listRowName}>{log.action}</span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.1rem 0.4rem",
                          borderRadius: "4px",
                          background: "var(--bg-subtle)",
                          color: "var(--text-3)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {log.entityType}
                      </span>
                    </div>
                    <div className={s.listRowSub}>
                      <span style={{ fontWeight: 500, color: "var(--text-2)" }}>
                        {userName}
                      </span>{" "}
                      • {userRole} • {log.details}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.25rem",
                    minWidth: "140px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--text-2)",
                    }}
                  >
                    <Clock size={12} />
                    {new Date(log.timestamp).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredLogs.length === 0 && (
            <div className={s.emptyState}>
              <Activity size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No matching logs found</div>
              <div className={s.emptyDesc}>
                Try adjusting your search filters.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
