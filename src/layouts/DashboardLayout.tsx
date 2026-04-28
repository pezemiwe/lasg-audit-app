import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Outlet,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuditStore } from "../store/useAuditStore";
import { checkDeadlinesAndGenerateNotifications } from "../utils/timelineLogic";
import type { Notification } from "../types";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Users,
  BookOpen,
  Bell,
  Menu,
  X,
  MapPin,
  Shield,
  ClipboardList,
  Briefcase,
  Settings,
  Activity,
  Check,
  ChevronRight,
  FileCheck,
  FolderOpen,
  ClipboardCheck,
} from "lucide-react";
import s from "../styles/dashboard.module.css";
import MessagingWidget from "../components/UI/MessagingWidget";
import GovernmentBanner from "../components/UI/GovernmentBanner";
import ErrorBoundary from "../components/UI/ErrorBoundary";

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  disabled?: boolean;
}

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    return stored ? JSON.parse(stored) : false;
  });
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [collapseButtonY, setCollapseButtonY] = useState(0);
  const [showCollapseButton, setShowCollapseButton] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const collapsed = sidebarCollapsed;
  const handleSidebarMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (sidebarRef.current) {
      const rect = sidebarRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      setCollapseButtonY(y);
      setShowCollapseButton(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    setShowCollapseButton(false);
  };

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);
  const invitations = useAuditStore((st) => st.invitations);
  const audits = useAuditStore((st) => st.audits);
  const mandates = useAuditStore((st) => st.mandates);
  const documentUploads = useAuditStore((st) => st.documentUploads);
  const notifications = useAuditStore((st) => st.notifications);
  const addNotifications = useAuditStore((st) => st.addNotifications);
  const markNotificationAsRead = useAuditStore(
    (st) => st.markNotificationAsRead,
  );
  const markAllNotificationsAsRead = useAuditStore(
    (st) => st.markAllNotificationsAsRead,
  );

  useEffect(() => {
    const newNotifs = checkDeadlinesAndGenerateNotifications(
      audits,
      notifications,
    );

    if (newNotifs.length > 0) {
      const trulyNew = newNotifs.filter(
        (n) =>
          !notifications.some(
            (existing) =>
              existing.message === n.message && existing.userId === n.userId,
          ),
      );

      if (trulyNew.length > 0) {
        const notifsToAdd: Array<
          Omit<Notification, "id" | "isRead" | "timestamp">
        > = trulyNew.map((notification) => ({
          userId: notification.userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          link: notification.link,
          relatedEntityId: notification.relatedEntityId,
          relatedEntityType: notification.relatedEntityType,
        }));
        addNotifications(notifsToAdd);
      }
    }
  }, [audits, notifications, addNotifications]);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifRef]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const myNotifications = React.useMemo(
    () =>
      user && notifications
        ? notifications
            .filter((n) => !n.userId || n.userId === user.id)
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
            )
        : [],
    [notifications, user],
  );

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const unreadCount = myNotifications.filter((n) => !n.isRead).length;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const roleName = user.role.replace(/_/g, " ");
  const isActive = (path: string) => location.pathname === path;

  const pendingInvitations = invitations.filter(
    (i) => i.userId === user.id && i.status === "Pending",
  ).length;

  const dbLink = {
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  };
  const regLink = { to: "/regulations", icon: BookOpen, label: "Regulations" };
  const procLink = {
    to: "/audit-procedures",
    icon: ClipboardCheck,
    label: "Audit Procedures",
  };

  interface NavGroup {
    label: string;
    items: NavItem[];
  }
  const navGroups: NavGroup[] = [];

  navGroups.push({
    label: "Overview",
    items: [dbLink],
  });

  if (user.role === "STATE_AUDITOR_GENERAL") {
    navGroups.push({
      label: "Oversight",
      items: [
        { to: "/mandates", icon: Shield, label: "Mandates" },
        { to: "/zones", icon: MapPin, label: "Zones" },
        { to: "/audit-outcomes", icon: FileCheck, label: "Audit Outcomes" },
      ],
    });
    navGroups.push({
      label: "Administration",
      items: [
        {
          to: "/notifications",
          icon: Bell,
          label: "Notifications",
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
      ],
    });
  } else if (user.role === "AUDIT_SUPERVISOR") {
    navGroups.push({
      label: "My Work",
      items: [
        { to: "/audit", icon: FileText, label: "Zone Audits" },
        { to: "/team", icon: Users, label: "Team" },
        { to: "/audit-outcomes", icon: FileCheck, label: "Audit Outcomes" },
      ],
    });
    navGroups.push({
      label: "Administration",
      items: [
        {
          to: "/notifications",
          icon: Bell,
          label: "Notifications",
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
      ],
    });
  } else if (user.role === "AUDIT_LEAD") {
    navGroups.push({
      label: "My Work",
      items: [
        {
          to: "/assignments",
          icon: Briefcase,
          label: "Assignments",
          badge: pendingInvitations || undefined,
        },
        { to: "/audit", icon: FileText, label: "My Audits" },
        { to: "/team", icon: Users, label: "Team" },
        { to: "/audit-outcomes", icon: FileCheck, label: "Audit Outcomes" },
      ],
    });
    navGroups.push({
      label: "Administration",
      items: [
        {
          to: "/notifications",
          icon: Bell,
          label: "Notifications",
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
      ],
    });
  } else if (user.role === "TEAM_AUDITOR") {
    navGroups.push({
      label: "My Work",
      items: [
        {
          to: "/assignments",
          icon: Briefcase,
          label: "Assignments",
          badge: pendingInvitations || undefined,
        },
        { to: "/audit", icon: FileText, label: "My Audits" },
      ],
    });
    navGroups.push({
      label: "Administration",
      items: [
        {
          to: "/notifications",
          icon: Bell,
          label: "Notifications",
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
      ],
    });
  } else if (user.role === "HEAD_OF_LOCAL_GOVERNMENT") {
    // Check if the HoLG has accepted any mandate
    const hasAcceptedMandate = user.lgaId
      ? mandates.some((m) => m.acceptedByLgas?.includes(user.lgaId!))
      : false;

    // Count pending (not uploaded) documents for this LGA
    const pendingDocCount =
      hasAcceptedMandate && user.lgaId
        ? documentUploads.filter(
            (d) =>
              d.lgaId === user.lgaId &&
              (d.status === "Not Uploaded" || d.status === "Rejected"),
          ).length
        : 0;

    navGroups.push({
      label: "Engagements",
      items: [
        {
          to: "/mandates",
          icon: Shield,
          label: "Active Mandates",
        },
        {
          to: "/document-portal",
          icon: FolderOpen,
          label: "Document Portal",
          disabled: !hasAcceptedMandate,
          badge: pendingDocCount || undefined,
        },
        {
          to: "/questionnaire",
          icon: ClipboardList,
          label: "Questionnaire",
          disabled: !hasAcceptedMandate,
        },
        {
          to: "/audit",
          icon: FileText,
          label: "My Audits",
          disabled: !hasAcceptedMandate,
        },
      ],
    });
    navGroups.push({
      label: "Administration",
      items: [
        {
          to: "/notifications",
          icon: Bell,
          label: "Notifications",
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
      ],
    });
  } else if (user.role === "SYSTEM_ADMIN") {
    navGroups.push({
      label: "Administration",
      items: [
        { to: "/user-management", icon: Users, label: "User Management" },
        { to: "/audit-trail", icon: Activity, label: "Audit Trail" },
        { to: "/settings", icon: Settings, label: "Platform Settings" },
      ],
    });
    navGroups.push({
      label: "Oversight",
      items: [
        { to: "/mandates", icon: Shield, label: "Mandates" },
        { to: "/audit", icon: FileText, label: "Audits" },
        { to: "/audit-outcomes", icon: FileCheck, label: "Audit Outcomes" },
      ],
    });
  }

  navGroups.push({
    label: "Reference",
    items: [regLink, procLink],
  });

  const renderNavItems = (items: NavItem[]) =>
    items.map((item) =>
      item.disabled ? (
        <span
          key={item.to}
          title={item.label}
          className={s.navLink}
          style={{ opacity: 0.4, pointerEvents: "none", cursor: "not-allowed" }}
        >
          <item.icon className={s.navIcon} />
          {!collapsed && item.label}
          {item.badge ? <span className={s.navBadge}>{item.badge}</span> : null}
        </span>
      ) : (
        <Link
          key={item.to}
          to={item.to}
          title={item.label}
          className={isActive(item.to) ? s.navLinkActive : s.navLink}
          onClick={() => setSidebarOpen(false)}
        >
          <item.icon className={s.navIcon} />
          {!collapsed && item.label}
          {item.badge ? <span className={s.navBadge}>{item.badge}</span> : null}
        </Link>
      ),
    );

  return (
    <div className={s.layout}>
      <GovernmentBanner />
      {sidebarOpen && (
        <div
          className={s.overlay}
          onClick={() => setSidebarOpen(false)}
          role="presentation"
        />
      )}

      <aside
        ref={sidebarRef}
        onMouseMove={handleSidebarMouseMove}
        onMouseLeave={handleSidebarMouseLeave}
        className={`${s.sidebar} ${sidebarOpen ? s.sidebarOpen : ""} ${
          collapsed ? s.sidebarCollapsed : ""
        }`}
      >
        <div className={s.sidebarBrand}>
          <img
            src="/seal_lagos.png"
            alt="Lagos State Seal"
            className={s.sidebarSeal}
          />
          <div className={s.sidebarBrandText}>
            <div className={s.sidebarTitle}>LASG Audit</div>
            <div className={s.sidebarSubtitle}>Automation Platform</div>
          </div>
        </div>

        <div className={s.userCard} title={`${user.name} (${roleName})`}>
          <div className={s.userAvatar}>{initials}</div>
          <div className={s.userInfo}>
            <div className={s.userName}>{user.name}</div>
            <div className={s.userRole}>{roleName}</div>
          </div>
        </div>

        <nav className={s.nav} aria-label="Dashboard navigation">
          {navGroups.map((group, index) => (
            <div key={index} className={s.navGroup}>
              <div className={s.navGroupLabel}>{group.label}</div>
              {renderNavItems(group.items)}
            </div>
          ))}
        </nav>

        <div className={s.sidebarFooter}>
          <button
            onClick={handleLogout}
            className={s.logoutBtn}
            title="Sign Out"
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Dynamic Collapse Button */}
        {showCollapseButton && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block"
            style={{
              position: "absolute",
              right: 0,
              top: `${collapseButtonY}px`,
              transform: "translateX(50%) translateY(-50%)",
              width: "6px",
              height: "32px",
              borderRadius: "100px",
              backgroundColor: "#6b7280",
              border: "none",
              cursor: "pointer",
              zIndex: 9999,
              transition: "all 0.3s ease",
            }}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          />
        )}
      </aside>

      <div className={`${s.main} ${collapsed ? s.mainCollapsed : ""}`}>
        <header className={s.topBar}>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <button
              className={s.menuBtn}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h2 className={s.topBarTitle}>Lagos State Audit Platform</h2>
          </div>
          <div className={s.topBarRight} ref={notifRef}>
            {/* <button
              className={s.topBarIcon}
              aria-label="Messages"
              onClick={() => setIsMessagingOpen(true)}
            >
              <MessageSquare size={18} />
            </button> */}
            <div style={{ position: "relative" }}>
              <button
                className={s.topBarIcon}
                aria-label="Notifications"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#dc2626",
                      border: "1px solid white",
                    }}
                  />
                )}
              </button>

              {notificationOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "120%",
                    right: 0,
                    width: "360px",
                    background: "white",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    border: "1px solid #e2e8f0",
                    zIndex: 50,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderBottom: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsAsRead(user.id)}
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Check size={14} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      maxHeight: "380px",
                      overflowY: "auto",
                    }}
                  >
                    {myNotifications.length === 0 ? (
                      <div
                        style={{
                          padding: "2rem",
                          textAlign: "center",
                          color: "#64748b",
                          fontSize: "0.875rem",
                        }}
                      >
                        No notifications
                      </div>
                    ) : (
                      myNotifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          style={{
                            padding: "0.75rem 1rem",
                            borderBottom: "1px solid #f1f5f9",
                            backgroundColor: notif.isRead ? "white" : "#f0f9ff",
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                          className="hover:bg-slate-50"
                          onClick={() => {
                            // Mark as read immediately
                            markNotificationAsRead(notif.id);

                            // Navigate to notifications page and open modal via state
                            const state = { selectedNotifId: notif.id };
                            navigate("/notifications", { state });
                            setNotificationOpen(false);
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "0.25rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: "#334155",
                              }}
                            >
                              {notif.title}
                            </span>
                            <span
                              style={{
                                fontSize: "0.7rem",
                                color: "#94a3b8",
                              }}
                            >
                              {new Date(notif.timestamp).toLocaleDateString(
                                "en-GB",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "#64748b",
                              lineHeight: "1.4",
                              margin: 0,
                            }}
                          >
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div
                    style={{
                      padding: "0.75rem",
                      borderTop: "1px solid #e2e8f0",
                      backgroundColor: "#f8fafc",
                      textAlign: "center",
                    }}
                  >
                    <button
                      onClick={() => {
                        navigate("/notifications");
                        setNotificationOpen(false);
                      }}
                      style={{
                        fontSize: "0.85rem",
                        color: "#0f172a",
                        fontWeight: 500,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        gap: "0.25rem",
                      }}
                    >
                      View All Notifications <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className={s.content}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
      <MessagingWidget
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
