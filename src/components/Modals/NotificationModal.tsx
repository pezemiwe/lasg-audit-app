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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className={s.card}
        style={{
          width: "100%",
          maxWidth: isMandateLetter ? "850px" : "550px",
          display: "flex",
          flexDirection: "column",
          gap: "0",
          backgroundColor: "#fff",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={s.cardHeader}
          style={{
            justifyContent: "space-between",
            borderBottom: "1px solid #e2e8f0",
            padding: "1rem 1.5rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <h3 className={s.cardTitle}>{notification.title}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            padding: "1.5rem",
            lineHeight: "1.6",
            color: "#334155",
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
