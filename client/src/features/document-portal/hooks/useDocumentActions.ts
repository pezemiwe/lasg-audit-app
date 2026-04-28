import React from "react";
import { useAuditStore } from "../../../store/useAuditStore";
import { saveFile } from "../../../utils/fileStorage";
import { getSmartNotification } from "../../../utils/auditLogic";

type Options = {
  userId: string;
  rejectionReason: string;
  setRejectionReason: (v: string) => void;
};

export const useDocumentActions = ({
  userId,
  rejectionReason,
  setRejectionReason,
}: Options) => {
  const addToast = useAuditStore((st) => st.addToast);
  const openModal = useAuditStore((st) => st.openModal);
  const reviewDocument = useAuditStore((st) => st.reviewDocument);

  const performUpload = async (docId: string, docName: string, file: File) => {
    await saveFile(docId, file);
    const store = useAuditStore.getState();
    store.reviewDocument(docId, "", false);
    const doc = store.documentUploads.find((d) => d.id === docId);
    if (doc) {
      const idx = store.documentUploads.indexOf(doc);
      const updated = [...store.documentUploads];
      updated[idx] = {
        ...doc,
        status: "Uploaded",
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
        version: doc.version + 1,
        reviewedBy: undefined,
        reviewedAt: undefined,
        rejectionReason: undefined,
      };
      useAuditStore.setState({ documentUploads: updated });
    }
    const notif = getSmartNotification("UPLOAD", docName);
    addToast({
      type: "success",
      title: "Document Uploaded",
      message: notif.message,
    });
  };

  const handleFileChange = (
    docId: string,
    event: React.ChangeEvent<HTMLInputElement>,
    docName: string,
  ) => {
    const file = event.target.files?.[0];
    if (file) performUpload(docId, docName, file);
    event.target.value = "";
  };

  const triggerFileUpload = (docId: string) => {
    const input = document.getElementById(`file-input-${docId}`);
    if (input) input.click();
  };

  const handleDelete = (docId: string) => {
    const store = useAuditStore.getState();
    const doc = store.documentUploads.find((d) => d.id === docId);
    if (!doc) return;
    openModal({
      title: "Delete Document",
      message:
        "Are you sure you want to delete this file? The document status will revert to 'Not Uploaded'.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: () => {
        const idx = store.documentUploads.indexOf(doc);
        const updated = [...store.documentUploads];
        updated[idx] = {
          ...doc,
          status: "Not Uploaded",
          fileName: undefined,
          fileSize: undefined,
          uploadedBy: undefined,
          uploadedAt: undefined,
          reviewedBy: undefined,
          reviewedAt: undefined,
          rejectionReason: undefined,
        };
        useAuditStore.setState({ documentUploads: updated });
        addToast({
          type: "info",
          title: "Document Deleted",
          message: "File removed. You can upload a new version.",
        });
      },
    });
  };

  const handleReview = (docId: string, approved: boolean) => {
    if (!approved && !rejectionReason.trim()) {
      addToast({
        type: "error",
        title: "Rejection Reason Required",
        message: "Please provide a reason for rejection",
      });
      return;
    }
    reviewDocument(
      docId,
      userId,
      approved,
      approved ? undefined : rejectionReason,
    );
    setRejectionReason("");
    if (approved) {
      addToast({ type: "success", title: "Document Approved" });
    } else {
      addToast({
        type: "warning",
        title: "Document Rejected",
        message: "LGA will be notified to re-upload",
      });
    }
  };

  return { handleFileChange, triggerFileUpload, handleDelete, handleReview };
};
