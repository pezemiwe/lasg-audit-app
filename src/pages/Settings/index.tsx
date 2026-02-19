import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  Shield,
  Globe,
  Bell,
  HardDrive,
  Save,
  Mail,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import s from "../../styles/pages.module.css";

const PlatformSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "general" | "security" | "notifications" | "backup"
  >("general");

  if (!user || user.role !== "SYSTEM_ADMIN") return null;

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>System Settings</h1>
          <p className={s.pageSubtitle}>
            Configure global platform parameters, security policies, and backup
            schedules.
          </p>
        </div>
        <button className={s.btnPrimary}>
          <Save size={14} /> Save Changes
        </button>
      </div>

      <div className={s.gridThreeCols}>
        {/* Sidebar Navigation */}
        <div className={s.sidebarNav}>
          {[
            { id: "general", icon: Globe, label: "General Settings" },
            { id: "security", icon: Shield, label: "Security & Access" },
            { id: "notifications", icon: Bell, label: "Notifications" },
            { id: "backup", icon: HardDrive, label: "Backup & Recovery" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={activeTab === tab.id ? s.navLinkActive : s.navLink}
              style={{ padding: "0.8rem 1rem", fontSize: "0.9rem" }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className={s.mainContent} style={{ gridColumn: "span 2" }}>
          {activeTab === "general" && (
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Platform Configuration</h3>
              </div>
              <div
                className={s.cardBody}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Platform Name</label>
                  <input
                    type="text"
                    className={s.formInput}
                    defaultValue="Lagos State Audit Platform"
                  />
                  <div className={s.formHelp}>
                    Visible to all users on the login screen and header.
                  </div>
                </div>

                <div className={s.formGroup}>
                  <label className={s.formLabel}>Support Email</label>
                  <div className={s.inputGroup}>
                    <Mail size={16} style={{ marginLeft: "0.8rem" }} />
                    <input
                      type="email"
                      className={s.formInput}
                      defaultValue="support@lasg-audit.gov.ng"
                      style={{ paddingLeft: "0.5rem", border: "none" }}
                    />
                  </div>
                </div>

                <div className={s.formGroup}>
                  <label className={s.formLabel}>Maintenance Mode</label>
                  <div className={s.switchGroup}>
                    <div style={{ flex: 1 }}>
                      <div className={s.switchTitle}>Enable Maintenance</div>
                      <div className={s.switchDesc}>
                        Prevent user login during scheduled updates.
                      </div>
                    </div>
                    <ToggleLeft
                      size={32}
                      color="#cbd5e1"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Security Policies</h3>
              </div>
              <div
                className={s.cardBody}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Min Password Strength</label>
                  <select className={s.formSelect} defaultValue="High">
                    <option value="Medium">Medium (8+ chars)</option>
                    <option value="High">High (Symbols + Numbers)</option>
                    <option value="Critical">Critical (2FA Required)</option>
                  </select>
                </div>

                <div className={s.formGroup}>
                  <label className={s.formLabel}>Session Timeout</label>
                  <select className={s.formSelect} defaultValue="30">
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                  </select>
                  <div className={s.formHelp}>
                    Automatic logout after inactivity.
                  </div>
                </div>

                <div className={s.formGroup}>
                  <label className={s.formLabel}>
                    2-Factor Authentication (2FA)
                  </label>
                  <div className={s.switchGroup}>
                    <div style={{ flex: 1 }}>
                      <div className={s.switchTitle}>
                        Enforce 2FA for Admins
                      </div>
                      <div className={s.switchDesc}>
                        Require OTP for System Admin & Auditor General roles.
                      </div>
                    </div>
                    <ToggleRight
                      size={32}
                      color="#065f46"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Email Notifications</h3>
              </div>
              <div
                className={s.cardBody}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div className={s.switchGroup}>
                  <div style={{ flex: 1 }}>
                    <div className={s.switchTitle}>Audit Assignment Alerts</div>
                    <div className={s.switchDesc}>
                      Notify auditors when assigned to a new location.
                    </div>
                  </div>
                  <ToggleRight size={32} color="#065f46" />
                </div>
                <div className={s.switchGroup}>
                  <div style={{ flex: 1 }}>
                    <div className={s.switchTitle}>Report Approval</div>
                    <div className={s.switchDesc}>
                      Notify supervisors when a report is submitted for review.
                    </div>
                  </div>
                  <ToggleRight size={32} color="#065f46" />
                </div>
                <div className={s.switchGroup}>
                  <div style={{ flex: 1 }}>
                    <div className={s.switchTitle}>System Alerts</div>
                    <div className={s.switchDesc}>
                      Receive critical system health notifications.
                    </div>
                  </div>
                  <ToggleRight size={32} color="#065f46" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "backup" && (
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Backup Configuration</h3>
              </div>
              <div
                className={s.cardBody}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Backup Frequency</label>
                  <select className={s.formSelect} defaultValue="Daily">
                    <option value="Hourly">Hourly</option>
                    <option value="Daily">Daily at Midnight</option>
                    <option value="Weekly">Weekly (Sundays)</option>
                  </select>
                </div>

                <div className={s.formGroup}>
                  <h4
                    className={s.formLabel}
                    style={{ marginBottom: "0.5rem" }}
                  >
                    Last Successful Backup
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      background: "#ecfdf5",
                      padding: "1rem",
                      borderRadius: "6px",
                      border: "1px solid #a7f3d0",
                    }}
                  >
                    <CheckCircle size={24} color="#059669" />
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: "#065f46",
                        }}
                      >
                        Complete
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#064e3b" }}>
                        Today at 03:00 AM • 4.2GB
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className={s.btnOutline}
                  style={{ alignSelf: "flex-start" }}
                >
                  <HardDrive size={14} /> Trigger Manual Backup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings;
