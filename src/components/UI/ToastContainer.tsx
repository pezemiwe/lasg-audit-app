import React from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    text: "#15803d",
    icon: "#16a34a",
  },
  error: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", icon: "#dc2626" },
  warning: {
    bg: "#fffbeb",
    border: "#fde68a",
    text: "#92400e",
    icon: "#d97706",
  },
  info: { bg: "#f0f9ff", border: "#bae6fd", text: "#075985", icon: "#0284c7" },
};

const ToastContainer: React.FC = () => {
  const toasts = useAuditStore((s) => s.toasts);
  const removeToast = useAuditStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        maxWidth: "420px",
        width: "100%",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        const colors = colorMap[toast.type];
        return (
          <div
            key={toast.id}
            role="alert"
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              padding: "1rem 1.25rem",
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
              animation: "toastSlideIn 0.3s cubic-bezier(0.25,1,0.5,1)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Icon
              size={20}
              color={colors.icon}
              style={{ flexShrink: 0, marginTop: "1px" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: colors.text,
                  marginBottom: toast.message ? "0.25rem" : 0,
                }}
              >
                {toast.title}
              </div>
              {toast.message && (
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: colors.text,
                    opacity: 0.85,
                    lineHeight: 1.5,
                  }}
                >
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: colors.text,
                opacity: 0.5,
                padding: "2px",
                flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
