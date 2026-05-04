import React from "react";
import type { User } from "../../../types";
import { ROLE_COLORS, ROLE_LABELS } from "../data/roles";

interface Props {
  users: User[];
}

const UserTable: React.FC<Props> = ({ users }) => {
  return (
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
          {users.map((user, i) => {
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
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>
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
                <td style={{ padding: "0.9rem 1rem", color: "var(--text-2)" }}>
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
                <td style={{ padding: "0.9rem 1rem", color: "var(--text-2)" }}>
                  {user.zoneId ?? "—"}
                </td>
                <td style={{ padding: "0.9rem 1rem", color: "var(--text-2)" }}>
                  {user.lgaId ?? "—"}
                </td>
                <td style={{ padding: "0.9rem 1rem", color: "var(--text-2)" }}>
                  {user.specialisations?.join(", ") ?? "—"}
                </td>
                <td style={{ padding: "0.9rem 1rem", color: "var(--text-2)" }}>
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
          {users.length === 0 && (
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
  );
};

export default UserTable;
