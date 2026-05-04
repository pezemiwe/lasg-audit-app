// src/components/Modals/NotificationModal.tsx
import React from "react";
import type { Notification } from "../../types";
import { X } from "lucide-react";
import s from "../../styles/pages.module.css";
import MandateLetter from "../Content/MandateLetter";
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
  onMarkAsRead: (id: string) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notification,
  onMarkAsRead,
}) => {
  if (!isOpen || !notification) return null;

  const isMandateLetter =
    notification.relatedEntityType === "mandate" ||
    notification.title.toLowerCase().includes("mandate") ||
    notification.title.toLowerCase().includes("engagement");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2rem 1rem",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: isMandateLetter ? "850px" : "550px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                color: "white",
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: 700,
              }}
            >
              {notification.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            padding: "1.5rem 2rem",
            lineHeight: "1.6",
            color: "#334155",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              color: "#64748b",
              marginBottom: "1rem",
            }}
          >
            Received on {new Date(notification.timestamp).toLocaleString()}
          </div>
          <p style={{ whiteSpace: "pre-line", marginBottom: "1.5rem" }}>
            {notification.message}
          </p>

          {isMandateLetter && <MandateLetter notification={notification} />}
        </div>

        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            backgroundColor: "#f8fafc",
          }}
        >
          <button
            className={s.btnSecondary}
            onClick={() => {
              if (!notification.isRead) {
                onMarkAsRead(notification.id);
              }
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
