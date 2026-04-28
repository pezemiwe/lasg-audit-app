import type { ExceptionSeverity } from "../../../types";

/** ISSAI-aligned severity suggestion based on financial impact (₦). */
export const suggestSeverity = (impact: number): ExceptionSeverity => {
  const overallMateriality = 28_470_000;
  const performanceMateriality = 19_929_000;
  const significantMisstatement = 5_000_000;
  const clearlyTrivial = 1_423_500;
  if (impact > overallMateriality) return "Critical";
  if (impact > performanceMateriality) return "High";
  if (impact > significantMisstatement) return "Medium";
  if (impact < clearlyTrivial) return "Low";
  return "Medium";
};

export const userNameById = (
  id: string,
  users: { id: string; name: string }[],
) => users.find((u) => u.id === id)?.name || id;
