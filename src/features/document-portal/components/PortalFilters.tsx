import React from "react";
import { Search } from "lucide-react";
import type { Mandate, LGA, DocumentUploadStatus } from "../../../types";
import s from "../../../styles/pages.module.css";

type Props = {
  mandates: Mandate[];
  lgas: LGA[];
  isLGA: boolean;
  selectedMandateId: string;
  selectedLgaId: string;
  statusFilter: DocumentUploadStatus | "All";
  searchQuery: string;
  onMandateChange: (v: string) => void;
  onLgaChange: (v: string) => void;
  onStatusChange: (v: DocumentUploadStatus | "All") => void;
  onSearchChange: (v: string) => void;
};

const PortalFilters: React.FC<Props> = ({
  mandates,
  lgas,
  isLGA,
  selectedMandateId,
  selectedLgaId,
  statusFilter,
  searchQuery,
  onMandateChange,
  onLgaChange,
  onStatusChange,
  onSearchChange,
}) => (
  <div className={s.cardHeader}>
    <div className={s.filterBar}>
      <select
        className={s.formSelect}
        value={selectedMandateId}
        onChange={(e) => onMandateChange(e.target.value)}
        style={{ width: 260 }}
      >
        {mandates.map((m) => (
          <option key={m.id} value={m.id}>
            {m.title} ({m.auditYear})
          </option>
        ))}
      </select>
      {!isLGA && (
        <select
          className={s.formSelect}
          value={selectedLgaId}
          onChange={(e) => onLgaChange(e.target.value)}
          style={{ width: 200 }}
        >
          <option value="all">All Councils</option>
          {lgas.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      )}
      <select
        className={s.formSelect}
        value={statusFilter}
        onChange={(e) =>
          onStatusChange(e.target.value as DocumentUploadStatus | "All")
        }
        style={{ width: "160px" }}
      >
        {["All", "Not Uploaded", "Uploaded", "Approved", "Rejected"].map(
          (f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ),
        )}
      </select>
    </div>
    <div className={s.searchContainer}>
      <Search size={14} className={s.searchIcon} />
      <input
        className={s.searchInput}
        placeholder="Search documents..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  </div>
);

export default PortalFilters;
