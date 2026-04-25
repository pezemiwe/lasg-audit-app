export const statusVariant = (status: string) => {
  switch (status) {
    case "Fully Approved":
      return "success" as const;
    case "Pending LGA":
      return "warning" as const;
    case "Changes Requested":
      return "error" as const;
    default:
      return "default" as const;
  }
};
