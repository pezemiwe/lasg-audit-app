import type { DocumentUploadStatus } from "../../../types";

export const docStatusVariant = (status: DocumentUploadStatus) => {
  switch (status) {
    case "Approved":
      return "success" as const;
    case "Uploaded":
      return "info" as const;
    case "Rejected":
      return "error" as const;
    default:
      return "default" as const;
  }
};
