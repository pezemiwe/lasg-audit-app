import React, { useState } from "react";
import { MOCK_USERS } from "../../mock/data";
import type { Role } from "../../types";

const ROLE_LABELS: Record<Role, string> = {
  SYSTEM_ADMIN: "System Administrator",
  STATE_AUDITOR_GENERAL: "State Auditor General",
  AUDIT_SUPERVISOR: "Audit Supervisor",
  AUDIT_LEAD: "Audit Lead",
  TEAM_AUDITOR: "Team Auditor",
  AUDITOR_GENERAL_FEDERATION: "Auditor General (Fed.)",
  HEAD_OF_LOCAL_GOVERNMENT: "Head of Local Government",
};

const ROLE_COLORS: Record<Role, { bg: string; color: string }> = {
  SYSTEM_ADMIN: { bg: "#fce7f3", color: "#9d174d" },
  STATE_AUDITOR_GENERAL: { bg: "#064e3b", color: "#fff" },
  AUDIT_SUPERVISOR: { bg: "#dbeafe", color: "#1e40af" },
  AUDIT_LEAD: { bg: "#fef3c7", color: "#92400e" },
  TEAM_AUDITOR: { bg: "#f3f4f6", color: "#374151" },
  AUDITOR_GENERAL_FEDERATION: { bg: "#ede9fe", color: "#4c1d95" },
  HEAD_OF_LOCAL_GOVERNMENT: { bg: "#cffafe", color: "#155e75" },
};

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const roles: Array<{ value: string; label: string }> = [
    { value: "ALL", label: "All Roles" },
    ...Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })),
  ];

  const filtered = MOCK_USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = Object.entries(ROLE_LABELS).map(([role, label]) => ({
    role: role as Role,
    label,
    count: MOCK_USERS.filter((u) => u.role === role).length,
  }));

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--primary)",
            marginBottom: "0.5rem",
          }}
        >
          System Administration
        </div>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--text)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          User Management
        </h1>
        <p
          style={{
            color: "var(--text-3)",
            marginTop: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          All platform users, their roles, zone/council assignments, and access
          levels.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat) => {
          const colors = ROLE_COLORS[stat.role];
          return (
            <div
              key={stat.role}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.color}30`,
                borderRadius: "4px",
                padding: "1.25rem 1rem",
                cursor: "pointer",
                transition: "opacity 0.15s",
                opacity:
                  roleFilter === stat.role || roleFilter === "ALL" ? 1 : 0.5,
              }}
              onClick={() =>
                setRoleFilter(roleFilter === stat.role ? "ALL" : stat.role)
              }
            >
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: colors.color,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  lineHeight: 1,
                }}
              >
                {stat.count}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: colors.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginTop: "0.4rem",
                  lineHeight: 1.3,
                  opacity: 0.8,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "220px" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "2px",
                fontSize: "0.875rem",
                background: "var(--bg)",
                color: "var(--text)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "2px",
              fontSize: "0.875rem",
              background: "var(--bg)",
              color: "var(--text)",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--text-3)",
              whiteSpace: "nowrap",
            }}
          >
            {filtered.length} of {MOCK_USERS.length} users
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.83rem",
            }}
          >
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                {[
                  "Name",
                  "Email",
                  "Role",
                  "Zone",
                  "Council",
                  "Specialisations",
                  "Experience",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "var(--text-3)",
                      borderBottom: "1px solid var(--border)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const roleColors = ROLE_COLORS[user.role];
                return (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background: i % 2 === 0 ? "transparent" : "var(--bg)",
                    }}
                  >
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "#064e3b",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div
                            style={{ fontWeight: 600, color: "var(--text)" }}
                          >
                            {user.name}
                          </div>
                          {user.phone && (
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--text-3)",
                              }}
                            >
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{ padding: "0.9rem 1rem", color: "var(--text-2)" }}
                    >
                      {user.email}
                    </td>
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <span
                        style={{
                          background: roleColors.bg,
                          color: roleColors.color,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "2px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td
                      style={{ padding: "0.9rem 1rem", color: "var(--text-2)" }}
                    >
                      {user.zoneId ?? "—"}
                    </td>
                    <td
                      style={{ padding: "0.9rem 1rem", color: "var(--text-2)" }}
                    >
                      {user.lgaId ?? "—"}
                    </td>
                    <td
                      style={{ padding: "0.9rem 1rem", color: "var(--text-2)" }}
                    >
                      {user.specialisations?.join(", ") ?? "—"}
                    </td>
                    <td
                      style={{ padding: "0.9rem 1rem", color: "var(--text-2)" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "0.3rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {user.experience?.slice(0, 2).map((exp) => (
                          <span
                            key={exp}
                            style={{
                              background: "var(--bg)",
                              border: "1px solid var(--border)",
                              borderRadius: "2px",
                              padding: "0.1rem 0.4rem",
                              fontSize: "0.7rem",
                              color: "var(--text-3)",
                            }}
                          >
                            {exp}
                          </span>
                        ))}
                        {(user.experience?.length ?? 0) > 2 && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-3)",
                            }}
                          >
                            +{(user.experience?.length ?? 0) - 2}
                          </span>
                        )}
                        {!user.experience && "—"}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "var(--text-3)",
                    }}
                  >
                    No users match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
