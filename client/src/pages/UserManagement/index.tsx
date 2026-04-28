import React, { useState } from "react";
import { MOCK_USERS } from "../../mock/data";
import type { Role } from "../../types";
import { ROLE_LABELS } from "../../features/user-management/data/roles";
import UserMgmtHeader from "../../features/user-management/components/UserMgmtHeader";
import RoleStatsGrid from "../../features/user-management/components/RoleStatsGrid";
import UserFilters from "../../features/user-management/components/UserFilters";
import UserTable from "../../features/user-management/components/UserTable";

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
      <UserMgmtHeader />

      <RoleStatsGrid
        stats={stats}
        roleFilter={roleFilter}
        onToggle={(role) =>
          setRoleFilter(roleFilter === role ? "ALL" : role)
        }
      />

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <UserFilters
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          roles={roles}
          shownCount={filtered.length}
          totalCount={MOCK_USERS.length}
        />
        <UserTable users={filtered} />
      </div>
    </div>
  );
};

export default UserManagement;
