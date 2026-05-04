import React from "react";
import {
  Users,
  CheckCircle,
  Shield,
  Activity,
  Server,
  Database,
  Lock,
  Search,
} from "lucide-react";
import { MOCK_USERS } from "../../../mock/data";
import type { ActivityLog } from "../../../types";
import s from "../../../styles/pages.module.css";

interface SystemAdminDashboardProps {
  activityLog: ActivityLog[];
}

const SystemAdminDashboard: React.FC<SystemAdminDashboardProps> = ({
  activityLog,
}) => {
  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>System Administration</h1>
          <p className={s.pageSubtitle}>
            Platform health monitoring, user management, and security logs
          </p>
        </div>
        <span className={s.pageBadge}>
          <Shield size={12} /> System Admin
        </span>
      </div>

      {/* Admin KPI Row */}
      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <Users size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total Users</div>
            <div className={s.kpiValue}>{MOCK_USERS.length}</div>
            <div className={s.kpiMeta}>Across 5 roles</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <Activity size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>System Status</div>
            <div className={s.kpiValue} style={{ fontSize: "1.5rem" }}>
              Operational
            </div>
            <div className={s.kpiMeta}>Uptime: 99.98%</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <Server size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Server Load</div>
            <div className={s.kpiValue}>12%</div>
            <div className={s.kpiMeta}>Memory: 4.2GB / 16GB</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Database size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Database</div>
            <div className={s.kpiValue}>Healthy</div>
            <div className={s.kpiMeta}>Last backup: 2h ago</div>
          </div>
        </div>
      </div>

      <div className={s.gridTwoCols}>
        {/* Recent Activity Log */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Recent System Activity</h3>
          </div>
          <div className={s.listTable}>
            {activityLog.slice(0, 6).map((log) => {
              const logUser = MOCK_USERS.find((u) => u.id === log.userId);
              const userName = logUser?.name || "Unknown User";
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
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748b",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {initials}
                    </div>
                    <div>
                      <div className={s.listRowName}>{log.action}</div>
                      <div className={s.listRowSub}>
                        {log.details} • {userName}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              );
            })}
            {activityLog.length === 0 && (
              <div className={s.emptyState}>
                <div className={s.emptyDesc}>No recent activity logged.</div>
              </div>
            )}
          </div>
        </div>

        {/* Security & Quick Actions */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Security Overview</h3>
            </div>
            <div className={s.cardBody}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Lock size={18} color="#059669" />
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#065f46",
                      }}
                    >
                      No Active Threats
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#064e3b" }}>
                      Firewall active, all systems secure.
                    </div>
                  </div>
                </div>
                <CheckCircle size={18} color="#059669" />
              </div>

              <div className={s.listRow}>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Failed Login Attempts (24h)
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>2</div>
              </div>
              <div className={s.listRow}>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Active Sessions
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>14</div>
              </div>
              <div className={s.listRow}>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Pending User Approvals
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>0</div>
              </div>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Quick Actions</h3>
            </div>
            <div className={s.cardBody}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <button className={s.btnPrimary}>
                  <Users size={14} /> Manage Users
                </button>
                <button className={s.btnOutline}>
                  <Search size={14} /> View Logs
                </button>
                <button className={s.btnOutline}>
                  <Database size={14} /> Backup
                </button>
                <button className={s.btnOutline}>
                  <Activity size={14} /> Optimise
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;
