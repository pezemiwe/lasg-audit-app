import type { FollowUpStatus, User } from "../../../types";

export const userName = (id: string, users: User[]) =>
  users.find((u) => u.id === id)?.name ?? id;

export const followUpVariant = (st: FollowUpStatus) => {
  switch (st) {
    case "Open":
      return "default" as const;
    case "In Progress":
      return "info" as const;
    case "Implemented":
      return "warning" as const;
    case "Verified":
      return "success" as const;
    case "Overdue":
      return "error" as const;
  }
};
