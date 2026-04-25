import React from "react";
import s from "../../../styles/pages.module.css";

interface NewRow {
  area: string;
  description: string;
  timelineWeeks: number;
  expectations: string;
}

interface Props {
  newRow: NewRow;
  setNewRow: React.Dispatch<React.SetStateAction<NewRow>>;
  onCancel: () => void;
  onSave: () => void;
}

const AddScopeRowForm: React.FC<Props> = ({
  newRow,
  setNewRow,
  onCancel,
  onSave,
}) => {
  return (
    <div
      style={{
        marginTop: "1.5rem",
        padding: "1.25rem",
        background: "#f8fafc",
        borderRadius: "6px",
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "0.85rem",
          marginBottom: "1rem",
        }}
      >
        Add Scope Area
      </div>
      <div className={s.formGrid}>
        <div className={s.formGroup}>
          <label className={s.formLabel}>Area</label>
          <input
            className={s.formInput}
            value={newRow.area}
            onChange={(e) => setNewRow({ ...newRow, area: e.target.value })}
            placeholder="e.g. Procurement"
          />
        </div>
        <div className={s.formGroup}>
          <label className={s.formLabel}>Timeline (weeks)</label>
          <input
            className={s.formInput}
            type="number"
            min={1}
            value={newRow.timelineWeeks}
            onChange={(e) =>
              setNewRow({
                ...newRow,
                timelineWeeks: parseInt(e.target.value) || 1,
              })
            }
          />
        </div>
        <div className={s.formGroupFull}>
          <label className={s.formLabel}>Description</label>
          <textarea
            className={s.formTextarea}
            value={newRow.description}
            onChange={(e) =>
              setNewRow({
                ...newRow,
                description: e.target.value,
              })
            }
            placeholder="Describe the scope of work for this area"
          />
        </div>
        <div className={s.formGroupFull}>
          <label className={s.formLabel}>Expectations</label>
          <textarea
            className={s.formTextarea}
            value={newRow.expectations}
            onChange={(e) =>
              setNewRow({
                ...newRow,
                expectations: e.target.value,
              })
            }
            placeholder="Describe expectations from the auditee"
          />
        </div>
      </div>
      <div className={s.formActions}>
        <button className={s.btnSecondary} onClick={onCancel}>
          Cancel
        </button>
        <button className={s.btnPrimary} onClick={onSave}>
          Add Row
        </button>
      </div>
    </div>
  );
};

export default AddScopeRowForm;
