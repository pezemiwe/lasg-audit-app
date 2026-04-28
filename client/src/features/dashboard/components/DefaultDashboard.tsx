import React from "react";
import type { User } from "../../../types";
import s from "../../../styles/pages.module.css";

interface DefaultDashboardProps {
  user: User;
}

const DefaultDashboard: React.FC<DefaultDashboardProps> = ({ user }) => {
  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Welcome, {user.name}</h1>
          <p className={s.pageSubtitle}>Role: {user.role.replace(/_/g, " ")}</p>
        </div>
      </div>
      <div className={s.card}>
        <div className={s.cardBody}>
          <div className={s.emptyState}>
            <div className={s.emptyTitle}>Dashboard Coming Soon</div>
            <div className={s.emptyDesc}>
              Please check your assigned tasks in the sidebar menu.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultDashboard;
