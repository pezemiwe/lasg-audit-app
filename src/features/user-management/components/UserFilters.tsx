import React from "react";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  roleFilter: string;
  setRoleFilter: (v: string) => void;
  roles: Array<{ value: string; label: string }>;
  shownCount: number;
  totalCount: number;
}

const UserFilters: React.FC<Props> = ({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  roles,
  shownCount,
  totalCount,
}) => {
  return (
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
        {shownCount} of {totalCount} users
      </span>
    </div>
  );
};

export default UserFilters;
