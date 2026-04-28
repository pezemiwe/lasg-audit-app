import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Landing from "../pages/Landing";
import DashboardLayout from "../layouts/DashboardLayout";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedRoute from "../components/UI/ProtectedRoute";

const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const Audit = React.lazy(() => import("../pages/Audit"));
const Regulations = React.lazy(() => import("../pages/Regulations"));
const AuditProcedures = React.lazy(() => import("../pages/AuditProcedures"));
const AIAssistant = React.lazy(() => import("../pages/AIAssistant"));
const Mandates = React.lazy(() => import("../pages/Mandates"));
const Zones = React.lazy(() => import("../pages/Zones"));
const Notifications = React.lazy(() => import("../pages/Notifications"));
const Team = React.lazy(() => import("../pages/Team"));
const Assignments = React.lazy(() => import("../pages/Assignments/index"));
const Workpapers = React.lazy(() => import("../pages/Workpapers"));
const Reports = React.lazy(() => import("../pages/Reports"));
const PreAudit = React.lazy(() => import("../pages/PreAudit"));
const AuditPlanning = React.lazy(() => import("../pages/AuditPlanning"));
const AuditDocs = React.lazy(() => import("../pages/AuditDocs"));
const UserManagement = React.lazy(() => import("../pages/UserManagement"));
const AuditTrail = React.lazy(() => import("../pages/AuditTrail"));
const Settings = React.lazy(() => import("../pages/Settings"));

const DocumentPortal = React.lazy(() => import("../pages/DocumentPortal"));
const DocumentSubmission = React.lazy(
  () => import("../pages/DocumentSubmission"),
);
const Questionnaire = React.lazy(() => import("../pages/Questionnaire/index"));
const PostAudit = React.lazy(() => import("../pages/PostAudit"));
const AuditDetail = React.lazy(() => import("../pages/Audit/AuditDetail"));
const AuditOutcomes = React.lazy(() => import("../pages/AuditOutcomes"));
const NotFound = React.lazy(() => import("../pages/NotFound"));
const Unauthorized = React.lazy(() => import("../pages/Unauthorized"));

const PageLoader = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading page"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 200px)",
      color: "#064e3b",
      width: "100%",
    }}
  >
    <div
      aria-hidden="true"
      style={{
        width: "32px",
        height: "32px",
        border: "3px solid #e2e8f0",
        borderTopColor: "#064e3b",
        borderRadius: "50%",
        animation: "rotate 0.6s linear infinite",
      }}
    />
    <span
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
      }}
    >
      Loading
    </span>
  </div>
);

const L = ({
  comp: Comp,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comp: React.LazyExoticComponent<React.ComponentType<any>>;
}) => (
  <Suspense fallback={<PageLoader />}>
    <Comp />
  </Suspense>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/unauthorized" element={<L comp={Unauthorized} />} />

    <Route
      path="/public-regulations"
      element={
        <PublicLayout>
          <L comp={Regulations} />
        </PublicLayout>
      }
    />
    <Route
      path="/public-audit-procedures"
      element={
        <PublicLayout>
          <L comp={AuditProcedures} />
        </PublicLayout>
      }
    />
    <Route path="/ai-assistant" element={<L comp={AIAssistant} />} />
    <Route path="/public-ai-assistant" element={<L comp={AIAssistant} />} />
    <Route path="/ai-audit-procedures" element={<L comp={AIAssistant} />} />
    <Route
      path="/public-ai-audit-procedures"
      element={<L comp={AIAssistant} />}
    />

    <Route element={<DashboardLayout />}>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <L comp={Dashboard} />
          </ProtectedRoute>
        }
      />
      <Route path="/regulations" element={<L comp={Regulations} />} />
      <Route path="/audit-procedures" element={<L comp={AuditProcedures} />} />
      <Route path="/audit" element={<L comp={Audit} />} />
      <Route path="/audits/:id" element={<L comp={AuditDetail} />} />
      <Route path="/mandates" element={<L comp={Mandates} />} />
      <Route path="/zones" element={<L comp={Zones} />} />
      <Route path="/notifications" element={<L comp={Notifications} />} />
      <Route path="/team" element={<L comp={Team} />} />
      <Route path="/assignments" element={<L comp={Assignments} />} />
      <Route path="/workpapers" element={<L comp={Workpapers} />} />
      <Route path="/reports" element={<L comp={Reports} />} />
      <Route path="/pre-audit" element={<L comp={PreAudit} />} />
      <Route path="/audit-planning" element={<L comp={AuditPlanning} />} />
      <Route path="/audit-docs" element={<L comp={AuditDocs} />} />
      <Route
        path="/user-management"
        element={
          <ProtectedRoute
            allowedRoles={["SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"]}
          >
            <L comp={UserManagement} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit-trail"
        element={
          <ProtectedRoute
            allowedRoles={["SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"]}
          >
            <L comp={AuditTrail} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <L comp={Settings} />
          </ProtectedRoute>
        }
      />

      <Route path="/document-portal" element={<L comp={DocumentPortal} />} />
      <Route
        path="/document-submission"
        element={<L comp={DocumentSubmission} />}
      />
      <Route path="/questionnaire" element={<L comp={Questionnaire} />} />
      <Route
        path="/work-programme"
        element={<Navigate to="/audit-planning?tab=programme" replace />}
      />
      <Route path="/post-audit" element={<L comp={PostAudit} />} />
      <Route path="/audit-outcomes" element={<L comp={AuditOutcomes} />} />
    </Route>

    <Route path="*" element={<L comp={NotFound} />} />
  </Routes>
);

export default AppRoutes;
