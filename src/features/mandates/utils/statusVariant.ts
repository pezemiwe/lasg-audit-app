import type { MandateStatus } from "../../../types";

export const statusVariant = (st: MandateStatus) => {
  switch (st) {
    case "Draft":
      return "default" as const;
    case "Published":
      return "info" as const;
    case "Active":
      return "success" as const;
    case "Completed":
      return "gold" as const;
  }
};
