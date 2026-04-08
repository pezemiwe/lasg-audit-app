import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Landing from "../pages/Landing";
import DashboardLayout from "../layouts/DashboardLayout";
import PublicLayout from "../layouts/PublicLayout";

const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const Audit = React.lazy(() => import("../pages/Audit"));
const Regulations = React.lazy(() => import("../pages/Regulations"));
const AIAssistant = React.lazy(() => import("../pages/AIAssistant"));
const Mandates = React.lazy(() => import("../pages/Mandates"));
const Zones = React.lazy(() => import("../pages/Zones"));
const Notifications = React.lazy(() => import("../pages/Notifications"));
const Team = React.lazy(() => import("../pages/Team"));
const Assignments = React.lazy(() => import("../pages/Assignments"));
const Workpapers = React.lazy(() => import("../pages/Workpapers"));
const Reports = React.lazy(() => import("../pages/Reports"));
const PreAudit = React.lazy(() => import("../pages/PreAudit"));
const AuditPlanning = React.lazy(() => import("../pages/AuditPlanning"));
const Fieldwork = React.lazy(() => import("../pages/Fieldwork"));
const AuditDocs = React.lazy(() => import("../pages/AuditDocs"));
const UserManagement = React.lazy(() => import("../pages/UserManagement"));
const AuditTrail = React.lazy(() => import("../pages/AuditTrail"));
const Settings = React.lazy(() => import("../pages/Settings"));
const ScopeAgreement = React.lazy(() => import("../pages/ScopeAgreement"));
const DocumentPortal = React.lazy(() => import("../pages/DocumentPortal"));
const Questionnaire = React.lazy(() => import("../pages/Questionnaire"));
const PostAudit = React.lazy(() => import("../pages/PostAudit"));
const AuditDetail = React.lazy(() => import("../pages/Audit/AuditDetail"));

const PageLoader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 200px)", // Ensure it takes up mostly full height
      color: "#064e3b",
      width: "100%",
    }}
  >
    <div
      style={{
        width: "32px",
        height: "32px",
        border: "3px solid #e2e8f0",
        borderTopColor: "#064e3b",
        borderRadius: "50%",
        animation: "rotate 0.6s linear infinite",
      }}
    />
  </div>
);

const L = ({ comp: Comp }: { comp: React.LazyExoticComponent<React.FC> }) => (
  <Suspense fallback={<PageLoader />}>
    <Comp />
  </Suspense>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />

    <Route
      path="/public-regulations"
      element={
        <PublicLayout>
          <L comp={Regulations} />
        </PublicLayout>
      }
    />
    <Route path="/ai-assistant" element={<L comp={AIAssistant} />} />
    <Route path="/public-ai-assistant" element={<L comp={AIAssistant} />} />

    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<L comp={Dashboard} />} />
      <Route path="/regulations" element={<L comp={Regulations} />} />
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
      <Route path="/fieldwork" element={<L comp={Fieldwork} />} />
      <Route path="/audit-docs" element={<L comp={AuditDocs} />} />
      <Route path="/user-management" element={<L comp={UserManagement} />} />
      <Route path="/audit-trail" element={<L comp={AuditTrail} />} />
      <Route path="/settings" element={<L comp={Settings} />} />
      <Route path="/scope-agreement" element={<L comp={ScopeAgreement} />} />
      <Route path="/document-portal" element={<L comp={DocumentPortal} />} />
      <Route path="/questionnaire" element={<L comp={Questionnaire} />} />
      <Route
        path="/work-programme"
        element={<Navigate to="/audit-planning?tab=programme" replace />}
      />
      <Route path="/post-audit" element={<L comp={PostAudit} />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
