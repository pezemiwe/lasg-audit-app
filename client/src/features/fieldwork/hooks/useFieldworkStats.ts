import { useMemo } from "react";
import type {
  ProcedureExecution,
  FieldworkException,
  MaterialityThreshold,
} from "../../../types";

export const useFieldworkStats = (
  executions: ProcedureExecution[],
  exceptions: FieldworkException[],
  materiality: MaterialityThreshold | undefined,
) => {
  const stats = useMemo(() => {
    const total = executions.length;
    return {
      total,
      cleared: executions.filter((e) => e.status === "Cleared").length,
      inProgress: executions.filter((e) => e.status === "In Progress").length,
      notStarted: executions.filter((e) => e.status === "Not Started").length,
      locked: executions.filter((e) => e.status === "Locked").length,
      submitted: executions.filter((e) => e.status === "Submitted").length,
      excRaised: executions.filter((e) => e.status === "Exception Raised")
        .length,
      budgetedHours: executions.reduce((s, e) => s + e.budgetedHours, 0),
      loggedHours: executions.reduce((s, e) => s + e.loggedHours, 0),
    };
  }, [executions]);

  const excStats = useMemo(() => {
    const threshold = materiality?.overallMateriality || 0;
    return {
      critical: exceptions.filter((e) => e.severity === "Critical").length,
      high: exceptions.filter((e) => e.severity === "High").length,
      medium: exceptions.filter((e) => e.severity === "Medium").length,
      low: exceptions.filter((e) => e.severity === "Low").length,
      total: exceptions.length,
      totalImpact: exceptions.reduce((s, e) => s + e.financialImpact, 0),
      aboveMateriality: materiality
        ? exceptions.filter((e) => e.financialImpact > threshold).length
        : 0,
    };
  }, [exceptions, materiality]);

  return { stats, excStats };
};
