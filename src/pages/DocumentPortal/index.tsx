/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import type { DocumentUploadStatus } from "../../types";
import { FolderOpen } from "lucide-react";
import s from "../../styles/pages.module.css";
import DocumentDetailView from "../../features/document-portal/components/DocumentDetailView";
import DocumentTable from "../../features/document-portal/components/DocumentTable";
import PortalKpiRow from "../../features/document-portal/components/PortalKpiRow";
import PortalFilters from "../../features/document-portal/components/PortalFilters";
import {
  PortalSignOffBar,
  PortalActionRequiredBanner,
} from "../../features/document-portal/components/PortalSignOff";
import { useDocumentActions } from "../../features/document-portal/hooks/useDocumentActions";

const DocumentPortalPage: React.FC<{
  auditId?: string;
  embedded?: boolean;
}> = ({ auditId, embedded }) => {
  const { user } = useAuth();
  const mandates = useAuditStore((st) => st.mandates);
  const lgas = useAuditStore((st) => st.lgas);
  const audits = useAuditStore((st) => st.audits);
  const documentUploads = useAuditStore((st) => st.documentUploads);
  const openModal = useAuditStore((st) => st.openModal);
  const ensureDocumentsExist = useAuditStore((st) => st.ensureDocumentsExist);

  const parentAudit = auditId ? audits.find((a) => a.id === auditId) : null;
  const parentLgaId = parentAudit?.lgaId;

  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  const [selectedMandateId, setSelectedMandateId] = useState<string>(
    mandates.find((m) => m.status === "Published" || m.status === "Active")
      ?.id ||
      mandates[0]?.id ||
      "",
  );
  const [selectedLgaId, setSelectedLgaId] = useState<string>(
    parentLgaId || "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    DocumentUploadStatus | "All"
  >("All");
  const [detailDocId, setDetailDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const isAdmin =
    user?.role === "STATE_AUDITOR_GENERAL" ||
    user?.role === "AUDIT_SUPERVISOR" ||
    user?.role === "AUDIT_LEAD" ||
    user?.role === "SYSTEM_ADMIN";

  const canApprove =
    user?.role === "AUDIT_LEAD" || user?.role === "AUDIT_SUPERVISOR";

  const isLGA = user?.role === "HEAD_OF_LOCAL_GOVERNMENT";

  React.useEffect(() => {
    if (!selectedMandateId) return;
    if (isLGA && user?.lgaId) {
      ensureDocumentsExist(selectedMandateId, user.lgaId);
    } else if (!isLGA && selectedLgaId !== "all") {
      // Admin/lead users: ensure the selected LGA has the full document set
      ensureDocumentsExist(selectedMandateId, selectedLgaId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMandateId, user?.lgaId, selectedLgaId]);

  const filteredDocs = useMemo(() => {
    let docs = documentUploads.filter((d) => d.mandateId === selectedMandateId);
    if (isLGA && user?.lgaId) {
      docs = docs.filter((d) => d.lgaId === user.lgaId);
    } else if (selectedLgaId !== "all") {
      docs = docs.filter((d) => d.lgaId === selectedLgaId);
    }
    if (statusFilter !== "All") {
      docs = docs.filter((d) => d.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.documentName.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q),
      );
    }
    return docs;
  }, [
    documentUploads,
    selectedMandateId,
    selectedLgaId,
    statusFilter,
    searchQuery,
    isLGA,
    user,
  ]);

  const allMandateDocs = useMemo(
    () => documentUploads.filter((d) => d.mandateId === selectedMandateId),
    [documentUploads, selectedMandateId],
  );

  // LGA-scoped count for the "Showing X of Y" footer — scoped to the selected LGA
  // (or the logged-in LGA user's own LGA) rather than the cross-LGA mandate total.
  const scopedDocsCount = useMemo(() => {
    const lgaId =
      isLGA && user?.lgaId
        ? user.lgaId
        : selectedLgaId !== "all"
          ? selectedLgaId
          : null;
    if (lgaId) return allMandateDocs.filter((d) => d.lgaId === lgaId).length;
    return allMandateDocs.length;
  }, [allMandateDocs, isLGA, user, selectedLgaId]);

  const kpis = useMemo(() => {
    const target =
      isLGA && user?.lgaId
        ? allMandateDocs.filter((d) => d.lgaId === user.lgaId)
        : allMandateDocs;
    return {
      total: target.length,
      uploaded: target.filter((d) => d.status === "Uploaded").length,
      approved: target.filter((d) => d.status === "Approved").length,
      rejected: target.filter((d) => d.status === "Rejected").length,
      notUploaded: target.filter((d) => d.status === "Not Uploaded").length,
    };
  }, [allMandateDocs, isLGA, user]);

  const detailDoc = documentUploads.find((d) => d.id === detailDocId);

  const { handleFileChange, triggerFileUpload, handleDelete, handleReview } =
    useDocumentActions({
      userId: user?.id || "",
      rejectionReason,
      setRejectionReason,
    });

  if (detailDoc) {
    const lga = lgas.find((l) => l.id === detailDoc.lgaId);
    return (
      <DocumentDetailView
        detailDoc={detailDoc}
        lga={lga}
        isLGA={isLGA}
        isAdmin={isAdmin}
        canApprove={canApprove}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        previewDoc={previewDoc}
        setPreviewDoc={setPreviewDoc}
        onBack={() => {
          setDetailDocId(null);
          setRejectionReason("");
        }}
        onTriggerUpload={triggerFileUpload}
        onDelete={handleDelete}
        onReview={handleReview}
      />
    );
  }

  const scopedAudit =
    canApprove && selectedLgaId !== "all"
      ? audits.find(
          (a) => a.mandateId === selectedMandateId && a.lgaId === selectedLgaId,
        )
      : null;

  const docsForLga = scopedAudit
    ? allMandateDocs.filter((d) => d.lgaId === selectedLgaId)
    : [];

  const allUploadedOrApproved =
    docsForLga.length > 0 &&
    docsForLga.every((d) => d.status === "Approved" || d.status === "Uploaded");

  const showActionBanner =
    !!scopedAudit &&
    docsForLga.length > 0 &&
    allUploadedOrApproved &&
    !scopedAudit.documentsSignedOff;

  return (
    <div>
      {!embedded && (
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Document Upload Portal</h1>
            <p className={s.pageSubtitle}>
              {isLGA
                ? "Submit required audit documents and track review status"
                : "Review and manage council document submissions across all mandates"}
            </p>
          </div>
          <span className={s.pageBadge}>
            <FolderOpen size={12} /> Document Portal
          </span>
        </div>
      )}

      {showActionBanner && <PortalActionRequiredBanner />}

      <PortalKpiRow {...kpis} />

      {scopedAudit && (
        <PortalSignOffBar
          signedOff={!!scopedAudit.documentsSignedOff}
          canSignOff={allUploadedOrApproved}
          onSignOff={() => {
            if (
              window.confirm(
                "Are you sure you want to sign-off and attest that all required documents have been received for this audit? This action cannot be undone.",
              )
            ) {
              useAuditStore
                .getState()
                .signOffDocuments(scopedAudit.id, user!.id);
            }
          }}
        />
      )}

      <div className={s.card}>
        <PortalFilters
          mandates={mandates}
          lgas={lgas}
          isLGA={isLGA}
          selectedMandateId={selectedMandateId}
          selectedLgaId={selectedLgaId}
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          onMandateChange={setSelectedMandateId}
          onLgaChange={setSelectedLgaId}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearchQuery}
        />
        <DocumentTable
          filteredDocs={filteredDocs}
          allMandateDocsCount={scopedDocsCount}
          lgas={lgas}
          isLGA={isLGA}
          isAdmin={isAdmin}
          canApprove={canApprove}
          embedded={embedded}
          searchQuery={searchQuery}
          onOpenDetail={setDetailDocId}
          onTriggerUpload={triggerFileUpload}
          onDelete={handleDelete}
          onFileChange={handleFileChange}
          onApprove={(doc, lgaName) =>
            openModal({
              title: "Approve Document",
              message: `Approve "${doc.documentName}" from ${lgaName}?`,
              confirmText: "Approve",
              variant: "info",
              onConfirm: () => handleReview(doc.id, true),
            })
          }
        />
      </div>
    </div>
  );
};

export default DocumentPortalPage;
