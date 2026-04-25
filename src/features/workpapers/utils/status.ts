export const wpStatusVariant = (st: string) => {
  switch (st) {
    case "Draft":
      return "default" as const;
    case "Submitted":
      return "info" as const;
    case "Reviewed":
      return "warning" as const;
    case "Approved":
      return "success" as const;
    case "Revision Required":
      return "error" as const;
    default:
      return "default" as const;
  }
};
