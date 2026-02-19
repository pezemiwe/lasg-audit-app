import React, { useEffect, useRef } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { X, AlertTriangle, CheckCircle } from "lucide-react";

const ConfirmModal: React.FC = () => {
  const modal = useAuditStore((s) => s.modal);
  const closeModal = useAuditStore((s) => s.closeModal);
  const overlayRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modal.isOpen && confirmRef.current) {
      confirmRef.current.focus();
    }
  }, [modal.isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modal.isOpen) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [modal.isOpen, closeModal]);

  if (!modal.isOpen) return null;

  const isDestructive = modal.variant === "danger";

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      onClick={(e) => {
        if (e.target === overlayRef.current) closeModal();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          boxShadow:
            "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
          maxWidth: "480px",
          width: "90%",
          animation: "modalScaleIn 0.2s cubic-bezier(0.25,1,0.5,1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            padding: "1.5rem 1.5rem 0",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: isDestructive ? "#fef2f2" : "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isDestructive ? (
              <AlertTriangle size={20} color="#dc2626" />
            ) : (
              <CheckCircle size={20} color="#16a34a" />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              id="modal-title"
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#111827",
              }}
            >
              {modal.title}
            </h2>
            <p
              id="modal-desc"
              style={{
                margin: "0.5rem 0 0",
                fontSize: "0.875rem",
                color: "#6b7280",
                lineHeight: 1.6,
              }}
            >
              {modal.message}
            </p>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close dialog"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              padding: "4px",
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            padding: "1.5rem",
          }}
        >
          <button
            onClick={closeModal}
            style={{
              padding: "0.625rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              background: "#fff",
              color: "#374151",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={() => {
              modal.onConfirm?.();
              closeModal();
            }}
            style={{
              padding: "0.625rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              borderRadius: "4px",
              background: isDestructive ? "#dc2626" : "#064e3b",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {modal.confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
