import React from "react";
import { Navigate } from "react-router-dom";

const WorkProgrammeRedirect: React.FC = () => (
  <Navigate to="/audit-planning?tab=programme" replace />
);

export default WorkProgrammeRedirect;
