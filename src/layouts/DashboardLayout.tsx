import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuditStore } from "../store/useAuditStore";
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
  Mail,
  Shield,
  ClipboardList,
  Briefcase,
  Settings,
  Activity,
} from "lucide-react";
import s from "../styles/dashboard.module.css";

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

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

  const mainNav: NavItem[] = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  ];

  const managementNav: NavItem[] = [];
  const workNav: NavItem[] = [];

  if (user.role === "SYSTEM_ADMIN") {
    managementNav.push(
      { to: "/user-management", icon: Users, label: "User Management" },
      { to: "/audit-trail", icon: Activity, label: "Audit Trail" },
      { to: "/settings", icon: Settings, label: "Platform Settings" },
    );
    workNav.push(
      { to: "/mandates", icon: Shield, label: "All Mandates" },
      { to: "/audit", icon: FileText, label: "All Engagements" },
    );
  }

  if (user.role === "STATE_AUDITOR_GENERAL") {
    managementNav.push(
      { to: "/mandates", icon: Shield, label: "Mandates" },
      { to: "/zones", icon: MapPin, label: "Zones" },
      { to: "/notifications", icon: Mail, label: "Notifications" },
    );
    workNav.push({ to: "/audit", icon: FileText, label: "All Engagements" });
  }

  if (user.role === "AUDIT_SUPERVISOR") {
    managementNav.push(
      { to: "/mandates", icon: Shield, label: "Mandates" },
      { to: "/team", icon: Users, label: "Team" },
    );
    workNav.push({ to: "/audit", icon: FileText, label: "Zone Audits" });
  }

  if (user.role === "AUDIT_LEAD") {
    managementNav.push(
      {
        to: "/assignments",
        icon: Briefcase,
        label: "Assignments",
        badge: pendingInvitations || undefined,
      },
      { to: "/team", icon: Users, label: "Build Team" },
    );
    workNav.push({ to: "/audit", icon: FileText, label: "My Audits" });
  }

  if (user.role === "TEAM_AUDITOR") {
    managementNav.push({
      to: "/assignments",
      icon: Briefcase,
      label: "Assignments",
      badge: pendingInvitations || undefined,
    });
    workNav.push({ to: "/audit", icon: ClipboardList, label: "My Tasks" });
  }

  if (user.role === "HEAD_OF_LOCAL_GOVERNMENT") {
    workNav.push(
      { to: "/mandates", icon: Shield, label: "Mandates" },
      { to: "/notifications", icon: Mail, label: "Notifications" },
      { to: "/audit", icon: FileText, label: "Audits" },
    );
  }

  const renderNavItems = (items: NavItem[]) =>
    items.map((item) => (
      <Link
        key={item.to}
        to={item.to}
        title={collapsed ? item.label : undefined}
        className={isActive(item.to) ? s.navLinkActive : s.navLink}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className={s.navIcon} />
        {!collapsed && item.label}
        {item.badge ? <span className={s.navBadge}>{item.badge}</span> : null}
      </Link>
    ));

  return (
    <div className={s.layout}>
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

        <div className={s.userCard}>
          <div className={s.userAvatar}>{initials}</div>
          <div className={s.userInfo}>
            <div className={s.userName}>{user.name}</div>
            <div className={s.userRole}>{roleName}</div>
          </div>
        </div>

        <nav className={s.nav} aria-label="Dashboard navigation">
          <div className={s.navGroup}>
            <div className={s.navGroupLabel}>Main</div>
            {renderNavItems(mainNav)}
          </div>

          {managementNav.length > 0 && (
            <div className={s.navGroup}>
              <div className={s.navGroupLabel}>Management</div>
              {renderNavItems(managementNav)}
            </div>
          )}

          {workNav.length > 0 && (
            <div className={s.navGroup}>
              <div className={s.navGroupLabel}>Work</div>
              {renderNavItems(workNav)}
            </div>
          )}

          <div className={s.navGroup}>
            <div className={s.navGroupLabel}>Reference</div>
            <Link
              to="/regulations"
              title={collapsed ? "Regulations" : undefined}
              className={isActive("/regulations") ? s.navLinkActive : s.navLink}
              onClick={() => setSidebarOpen(false)}
            >
              <BookOpen className={s.navIcon} />
              {!collapsed && "Regulations"}
            </Link>
          </div>
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
          <div className={s.topBarRight}>
            <button className={s.topBarIcon} aria-label="Notifications">
              <Bell size={18} />
              {pendingInvitations > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#dc2626",
                  }}
                />
              )}
            </button>
          </div>
        </header>

        <main className={s.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
