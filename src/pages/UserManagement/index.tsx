import React, { useState } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import type { Role } from "../../types";
import { ROLE_LABELS } from "../../features/user-management/data/roles";
import UserMgmtHeader from "../../features/user-management/components/UserMgmtHeader";
import RoleStatsGrid from "../../features/user-management/components/RoleStatsGrid";
import UserFilters from "../../features/user-management/components/UserFilters";
import UserTable from "../../features/user-management/components/UserTable";
import AddUserModal from "../../features/user-management/components/AddUserModal";

const UserManagement: React.FC = () => {
  const store = useAuditStore();
  const allUsers = store.users ?? [];

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  const roles: Array<{ value: string; label: string }> = [
    { value: "ALL", label: "All Roles" },
    ...Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })),
  ];

  const filtered = allUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = Object.entries(ROLE_LABELS).map(([role, label]) => ({
    role: role as Role,
    label,
    count: allUsers.filter((u) => u.role === role).length,
  }));

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <UserMgmtHeader />
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          style={{
            padding: "0.6rem 1.5rem",
            background: "#064e3b",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
            alignSelf: "center",
          }}
        >
          + Add User
        </button>
      </div>

      <RoleStatsGrid
        stats={stats}
        roleFilter={roleFilter}
        onToggle={(role) => setRoleFilter(roleFilter === role ? "ALL" : role)}
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
          totalCount={allUsers.length}
        />
        <UserTable users={filtered} />
      </div>

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default UserManagement;
