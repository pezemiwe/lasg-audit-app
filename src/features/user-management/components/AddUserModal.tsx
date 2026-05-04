import React, { useState } from "react";
import { X } from "lucide-react";
import type { Role, AuditType } from "../../../types";
import { useAuditStore } from "../../../store/useAuditStore";
import { ROLE_LABELS } from "../data/roles";

const AUDIT_TYPES: AuditType[] = [
  "Financial",
  "Performance",
  "Compliance",
  "Combined",
];

interface Props {
  onClose: () => void;
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid var(--border)",
  borderRadius: "4px",
  fontSize: "0.875rem",
  background: "var(--bg)",
  color: "var(--text)",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--text-3)",
  marginBottom: "0.35rem",
};

const ROLES_WITH_ZONE: Role[] = [
  "AUDIT_SUPERVISOR",
  "AUDIT_LEAD",
  "TEAM_AUDITOR",
];
const ROLES_WITH_LGA: Role[] = ["HEAD_OF_LOCAL_GOVERNMENT"];
const ROLES_WITH_SPEC: Role[] = [
  "AUDIT_SUPERVISOR",
  "AUDIT_LEAD",
  "TEAM_AUDITOR",
];

const AddUserModal: React.FC<Props> = ({ onClose }) => {
  const store = useAuditStore();
  const zones = store.zones ?? [];
  const lgas = store.lgas ?? [];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("TEAM_AUDITOR");
  const [zoneId, setZoneId] = useState("");
  const [lgaId, setLgaId] = useState("");
  const [specialisations, setSpecialisations] = useState<AuditType[]>([]);
  const [error, setError] = useState("");

  const toggleSpec = (s: AuditType) =>
    setSpecialisations((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Name is required.");
    if (!email.trim() || !email.includes("@"))
      return setError("A valid email is required.");

    store.addUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      phone: phone.trim() || undefined,
      zoneId: ROLES_WITH_ZONE.includes(role) && zoneId ? zoneId : undefined,
      lgaId: ROLES_WITH_LGA.includes(role) && lgaId ? lgaId : undefined,
      specialisations:
        ROLES_WITH_SPEC.includes(role) && specialisations.length > 0
          ? specialisations
          : undefined,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "2rem",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              Add New User
            </h2>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.8rem",
                color: "var(--text-3)",
              }}
            >
              Create a platform account and assign a role.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-3)",
              padding: "0.25rem",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Name */}
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input
                style={fieldStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mrs. Amaka Okonkwo"
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address *</label>
              <input
                type="email"
                style={fieldStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. amaka.okonkwo@lasg.gov.ng"
              />
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Phone</label>
              <input
                style={fieldStyle}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 ..."
              />
            </div>

            {/* Role */}
            <div>
              <label style={labelStyle}>Role *</label>
              <select
                style={fieldStyle}
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as Role);
                  setZoneId("");
                  setLgaId("");
                  setSpecialisations([]);
                }}
              >
                {(Object.entries(ROLE_LABELS) as [Role, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Zone (for supervisors/leads/team) */}
            {ROLES_WITH_ZONE.includes(role) && (
              <div>
                <label style={labelStyle}>Zone</label>
                <select
                  style={fieldStyle}
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                >
                  <option value="">Select Zone...</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* LGA (for HoLG) */}
            {ROLES_WITH_LGA.includes(role) && (
              <div>
                <label style={labelStyle}>Council (LGA / LCDA)</label>
                <select
                  style={fieldStyle}
                  value={lgaId}
                  onChange={(e) => setLgaId(e.target.value)}
                >
                  <option value="">Select Council...</option>
                  {lgas.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                      {l.councilType === "LCDA" ? " (LCDA)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Specialisations */}
            {ROLES_WITH_SPEC.includes(role) && (
              <div>
                <label style={labelStyle}>Specialisations</label>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  {AUDIT_TYPES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSpec(s)}
                      style={{
                        padding: "0.3rem 0.8rem",
                        borderRadius: "4px",
                        border: "1px solid var(--border)",
                        background: specialisations.includes(s)
                          ? "#064e3b"
                          : "var(--bg)",
                        color: specialisations.includes(s)
                          ? "#fff"
                          : "var(--text-2)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p style={{ color: "#dc2626", fontSize: "0.8rem", margin: 0 }}>
                {error}
              </p>
            )}

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
                marginTop: "0.5rem",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "0.5rem 1.25rem",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  background: "none",
                  color: "var(--text-2)",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "0.5rem 1.5rem",
                  border: "none",
                  borderRadius: "4px",
                  background: "#064e3b",
                  color: "#fff",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Add User
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
