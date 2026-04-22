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
          background: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
          animation: "modalScaleIn 0.2s cubic-bezier(0.25,1,0.5,1)",
        }}
      >
        <div
          style={{
            background: isDestructive
              ? "linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)"
              : "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            {isDestructive ? (
              <AlertTriangle size={24} color="rgba(255,255,255,0.9)" />
            ) : (
              <CheckCircle size={24} color="rgba(255,255,255,0.9)" />
            )}
            <div>
              <h2
                id="modal-title"
                style={{
                  color: "white",
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                }}
              >
                {modal.title}
              </h2>
            </div>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close dialog"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              padding: "0.4rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          <p
            id="modal-desc"
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            {modal.message}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            padding: "1rem 1.5rem",
            borderTop: "1px solid #e5e7eb",
            background: "#f9fafb",
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
