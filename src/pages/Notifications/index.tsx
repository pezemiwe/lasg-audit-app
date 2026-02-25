import React, { useMemo, useState, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import type { Notification } from "../../types";
import NotificationModal from "../../components/Modals/NotificationModal"; // New Import
import {
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
  Check,
  Bell,
  Eye,
} from "lucide-react";
import s from "../../styles/pages.module.css";

const NotificationItem: React.FC<{
  notification: Notification;
  onRead: (id: string) => void;
  onView: (n: Notification) => void;
}> = ({ notification, onRead, onView }) => {
  const Icon = useMemo(() => {
    switch (notification.type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "error":
        return XCircle;
      case "info":
      default:
        return Info;
    }
  }, [notification.type]);

  const iconColor = useMemo(() => {
    switch (notification.type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      case "info":
      default:
        return "text-blue-500";
    }
  }, [notification.type]);

  return (
    <div
      className={`${s.card} ${!notification.isRead ? "bg-blue-50/50" : ""}`}
      style={{
        padding: "1rem",
        marginBottom: "0.75rem",
        borderLeft: !notification.isRead
          ? "4px solid #3b82f6"
          : "4px solid #e2e8f0",
        position: "relative",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onClick={() => onView(notification)}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div className={`mt-1 ${iconColor}`}>
          <Icon size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4
              style={{
                margin: "0 0 0.25rem 0",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-1)",
              }}
            >
              {notification.title}
            </h4>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-3)",
                  whiteSpace: "nowrap",
                }}
              >
                {new Date(notification.timestamp).toLocaleString()}
              </span>

              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  padding: "0.25rem",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onView(notification);
                }}
                title="View details"
              >
                <Eye size={16} />
              </button>

              {!notification.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRead(notification.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#3b82f6",
                    padding: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "var(--text-2)",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
};

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const notifications = useAuditStore((st) => st.notifications);
  const markNotificationAsRead = useAuditStore(
    (st) => st.markNotificationAsRead,
  );
  const markAllNotificationsAsRead = useAuditStore(
    (st) => st.markAllNotificationsAsRead,
  );

  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useLayoutEffect(() => {
    const state = location.state as { selectedNotifId?: string } | null;
    if (state && state.selectedNotifId) {
      const selectedId = state.selectedNotifId;
      const found = notifications.find((n) => n.id === selectedId);
      if (found) {
        // Clear state first to prevent cascading renders
        window.history.replaceState({}, document.title);
        // Then update both states together
        setSelectedNotif(found);
        setModalOpen(true);
      }
    }
  }, [location.state, notifications]);

  const myNotifications = useMemo(() => {
    return notifications
      .filter((n) => !n.userId || n.userId === user?.id)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
  }, [notifications, user]);

  const unreadCount = myNotifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Notifications Center</h1>
          <p className={s.pageSubtitle}>
            Track system alerts, deadlines, and activity updates
          </p>
        </div>
        <div>
          {unreadCount > 0 && user && (
            <button
              className={s.btnSecondary}
              onClick={() => markAllNotificationsAsRead(user.id)}
            >
              <Check size={14} /> Mark all as read
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "800px" }}>
        {myNotifications.length === 0 ? (
          <div className={s.emptyState}>
            <Bell size={40} className={s.emptyIcon} />
            <div className={s.emptyTitle}>No notifications</div>
            <div className={s.emptyDesc}>
              You're all caught up! New alerts will appear here.
            </div>
          </div>
        ) : (
          myNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onRead={markNotificationAsRead}
              onView={(n) => {
                setSelectedNotif(n);
                setModalOpen(true);
              }}
            />
          ))
        )}
      </div>

      {modalOpen && selectedNotif && (
        <NotificationModal
          isOpen={modalOpen}
          notification={selectedNotif}
          onClose={() => {
            setModalOpen(false);
            setSelectedNotif(null);
          }}
          onMarkAsRead={(id) => markNotificationAsRead(id)}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
