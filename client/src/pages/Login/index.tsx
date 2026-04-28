import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MOCK_USERS } from "../../mock/data";
import type { Role } from "../../types";
import s from "../../styles/login.module.css";

const ROLE_LABELS: Record<Role, string> = {
  SYSTEM_ADMIN: "System Administrator",
  STATE_AUDITOR_GENERAL: "State Auditor General",
  AUDIT_SUPERVISOR: "Audit Supervisor",
  AUDIT_LEAD: "Audit Lead",
  TEAM_AUDITOR: "Team Auditor",
  HEAD_OF_LOCAL_GOVERNMENT: "Head of Local Government",
};

// Display order — Auditor General appears first
const ROLE_ORDER: Role[] = [
  "STATE_AUDITOR_GENERAL",
  "SYSTEM_ADMIN",
  "AUDIT_SUPERVISOR",
  "AUDIT_LEAD",
  "TEAM_AUDITOR",
  "HEAD_OF_LOCAL_GOVERNMENT",
];

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Group users by role in the desired display order
  const usersByRole = ROLE_ORDER.map((role) => ({
    role,
    users: MOCK_USERS.filter((u) => u.role === role).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  })).filter((g) => g.users.length > 0);

  const handleUserChange = (userEmail: string) => {
    setSelectedEmail(userEmail);
    setError("");
    const user = MOCK_USERS.find((u) => u.email === userEmail);
    if (user) {
      setEmail(user.email);
      setPassword("password123");
    } else {
      setEmail("");
      setPassword("");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please select a role to continue.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email);
      navigate("/dashboard");
    }, 1800);
  };

  return (
    <>
      {loading && (
        <div className={s.loadingOverlay}>
          <img
            src="/seal_lagos.png"
            alt="Lagos State Seal"
            className={s.loadingSeal}
          />
          <div className={s.loadingText}>
            <div className={s.loadingTitle}>Authenticating</div>
            <div className={s.loadingSub}>
              Verifying credentials and establishing secure session…
            </div>
          </div>
          <div className={s.loadingBar}>
            <div className={s.loadingProgress} />
          </div>
        </div>
      )}

      <div className={s.page}>
        <div className={s.brand}>
          <div className={s.brandInner}>
            <img
              src="/seal_lagos.png"
              alt="Lagos State Seal"
              className={s.seal}
            />
            <h1 className={s.brandTitle}>
              Lagos State <br />
              <span>Audit Platform</span>
            </h1>
            <p className={s.brandDesc}>
              Office of the Auditor-General for Local Governments. Ensuring
              transparency, accountability, and fiscal responsibility across all
              57 Councils (20 LGAs &amp; 37 LCDAs). Access to this system is
              restricted to authorized personnel only.
            </p>
            <div className={s.securityNotice}>
              <div className={s.securityHeader}>
                <div className={s.securityIcon}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span>OFFICIAL SYSTEM WARNING</span>
              </div>
              <p>
                This system is for the use of authorized Lagos State Government
                personnel only. Activities may be monitored and recorded.
                unauthorized access is a criminal offense under the Lagos State
                Digital Information Law.
              </p>
            </div>
          </div>
          <div className={s.brandFooter}>
            &copy; {new Date().getFullYear()} Lagos State Government
          </div>
        </div>

        <div className={s.formPanel}>
          <div className={s.formWrap}>
            <div className={s.formHeader}>
              <div className={s.lockIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 className={s.formTitle}>Sign in to Portal</h2>
              <p className={s.formSubtitle}>
                Authorised personnel only. Select your role to proceed.
              </p>
            </div>

            <form onSubmit={handleLogin} className={s.form}>
              <div className={s.field}>
                <label htmlFor="role" className={s.label}>
                  Select User
                </label>
                <div className={s.selectWrap}>
                  <select
                    id="role"
                    value={selectedEmail}
                    onChange={(e) => handleUserChange(e.target.value)}
                    className={s.selectEl}
                  >
                    <option value="">— Choose a user —</option>
                    {usersByRole.map((group) => (
                      <optgroup
                        key={group.role}
                        label={ROLE_LABELS[group.role]}
                      >
                        {group.users.map((u) => (
                          <option key={u.id} value={u.email}>
                            {u.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <span className={s.selectChevron}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className={s.field}>
                <label htmlFor="email" className={s.label}>
                  Official Email
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={s.input}
                  placeholder="user@lagosstate.gov.ng"
                  readOnly={!!selectedEmail}
                />
              </div>

              <div className={s.field}>
                <label htmlFor="password" className={s.label}>
                  Password
                </label>
                <div
                  className={s.passwordWrap}
                  style={{ position: "relative" }}
                >
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={s.input}
                    placeholder="••••••••"
                    readOnly={!!selectedEmail}
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#666",
                    }}
                  >
                    {showPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div
                className={s.fieldRow}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                  marginTop: "4px",
                }}
              >
                <label
                  className={s.checkboxLabel}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: "#4b5563",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "#16a34a",
                    }}
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className={s.forgotLink}
                  style={{
                    fontSize: "0.9rem",
                    color: "#16a34a",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </a>
              </div>

              {error && <div className={s.error}>{error}</div>}

              <button
                type="submit"
                className={s.submit}
                disabled={!email || loading}
              >
                {loading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      className={s.spin}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Verifying Credentials…
                  </span>
                ) : (
                  "Secure Sign In"
                )}
              </button>

              <div
                className={s.helpText}
                style={{
                  marginTop: "24px",
                  paddingTop: "24px",
                  borderTop: "1px solid #e5e7eb",
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                Having trouble accessing the system? <br />
                Contact IT Support:{" "}
                <a
                  href="mailto:support@lagosstate.gov.ng"
                  style={{ color: "#16a34a" }}
                >
                  support@lagosstate.gov.ng
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
