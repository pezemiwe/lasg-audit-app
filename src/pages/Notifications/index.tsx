import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../../components/UI/StatusBadge";
import type { LetterStatus } from "../../types";
import {
  Mail,
  Send,
  SendHorizonal,
  CheckCircle,
  FileText,
  Clock,
  Eye,
  ChevronLeft,
  Package,
} from "lucide-react";
import s from "../../styles/pages.module.css";

const letterStatusVariant = (st: LetterStatus) => {
  switch (st) {
    case "Draft":
      return "default" as const;
    case "Sent":
      return "info" as const;
    case "Acknowledged":
      return "success" as const;
    case "Documents Received":
      return "gold" as const;
  }
};

const letterStatusIcon = (st: LetterStatus) => {
  switch (st) {
    case "Draft":
      return s.letterIconDraft;
    case "Sent":
      return s.letterIconSent;
    case "Acknowledged":
      return s.letterIconAck;
    case "Documents Received":
      return s.letterIconDocs;
  }
};

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const mandates = useAuditStore((st) => st.mandates);
  const letters = useAuditStore((st) => st.letters);
  const lgas = useAuditStore((st) => st.lgas);
  const generateLetters = useAuditStore((st) => st.generateLetters);
  const sendLetter = useAuditStore((st) => st.sendLetter);
  const sendAllLetters = useAuditStore((st) => st.sendAllLetters);
  const updateLetterStatus = useAuditStore((st) => st.updateLetterStatus);
  const openModal = useAuditStore((st) => st.openModal);
  const addToast = useAuditStore((st) => st.addToast);

  const [selectedMandateId, setSelectedMandateId] = useState<string>(
    mandates.find((m) => m.status === "Published" || m.status === "Active")
      ?.id ||
      mandates[0]?.id ||
      "",
  );
  const [detailLetterId, setDetailLetterId] = useState<string | null>(null);
  const [filter, setFilter] = useState<LetterStatus | "All">("All");

  const mandateLetters = useMemo(() => {
    const list = letters.filter((l) => l.mandateId === selectedMandateId);
    if (user?.role === "HEAD_OF_LOCAL_GOVERNMENT" && user.lgaId) {
      return list.filter((l) => l.lgaId === user.lgaId);
    }
    return list;
  }, [letters, selectedMandateId, user]);

  const filtered = useMemo(() => {
    if (filter === "All") return mandateLetters;
    return mandateLetters.filter((l) => l.status === filter);
  }, [mandateLetters, filter]);

  const detailLetter = useMemo(
    () => letters.find((l) => l.id === detailLetterId),
    [letters, detailLetterId],
  );

  const getLga = (id: string) => lgas.find((l) => l.id === id);

  const handleGenerate = () => {
    openModal({
      title: "Generate Notification Letters",
      message: `This will generate notification letters for all 20 LGAs under the selected mandate. Each letter will include the standard document checklist.`,
      confirmText: "Generate Letters",
      variant: "info",
      onConfirm: () => generateLetters(selectedMandateId),
    });
  };

  const handleSendAll = () => {
    const drafts = mandateLetters.filter((l) => l.status === "Draft").length;
    openModal({
      title: "Dispatch All Letters",
      message: `Send ${drafts} notification letter${drafts !== 1 ? "s" : ""} to their respective LGA contacts? Recipients will receive formal audit notification with the document requirement checklist.`,
      confirmText: "Send All",
      variant: "info",
      onConfirm: () => sendAllLetters(selectedMandateId),
    });
  };

  const handleSendOne = (letterId: string, lgaName: string) => {
    openModal({
      title: "Send Notification Letter",
      message: `Dispatch the audit notification letter to ${lgaName}?`,
      confirmText: "Send",
      variant: "info",
      onConfirm: () => {
        sendLetter(letterId);
        addToast({
          type: "success",
          title: "Letter Sent",
          message: `Notification sent to ${lgaName}`,
        });
      },
    });
  };

  const handleStatusUpdate = (letterId: string, status: LetterStatus) => {
    updateLetterStatus(letterId, status);
    addToast({
      type: "success",
      title: "Status Updated",
      message: `Letter marked as "${status}"`,
    });
  };

  const draftCount = mandateLetters.filter((l) => l.status === "Draft").length;
  const ackCount = mandateLetters.filter(
    (l) => l.status === "Acknowledged",
  ).length;
  const docsCount = mandateLetters.filter(
    (l) => l.status === "Documents Received",
  ).length;

  if (detailLetter) {
    const lga = getLga(detailLetter.lgaId);
    return (
      <div>
        <button
          className={s.btnSecondary}
          style={{ marginBottom: "1.5rem" }}
          onClick={() => setDetailLetterId(null)}
        >
          <ChevronLeft size={16} /> Back to Letters
        </button>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Notification Letter — {lga?.name}</h1>
            <p className={s.pageSubtitle}>
              Contact: {lga?.contactName} · {lga?.contactEmail}
            </p>
          </div>
          <StatusBadge
            label={detailLetter.status}
            variant={letterStatusVariant(detailLetter.status)}
            size="md"
          />
        </div>

        <div className={s.gridTwoCols}>
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Letter Status</h3>
            </div>
            <div className={s.cardBody}>
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Status</div>
                <div className={s.detailValue}>
                  <StatusBadge
                    label={detailLetter.status}
                    variant={letterStatusVariant(detailLetter.status)}
                  />
                </div>
              </div>
              {detailLetter.sentAt && (
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Sent</div>
                  <div className={s.detailValue}>
                    {new Date(detailLetter.sentAt).toLocaleString("en-NG")}
                  </div>
                </div>
              )}
              {detailLetter.acknowledgedAt && (
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Acknowledged</div>
                  <div className={s.detailValue}>
                    {new Date(detailLetter.acknowledgedAt).toLocaleString(
                      "en-NG",
                    )}
                  </div>
                </div>
              )}
              {detailLetter.documentsReceivedAt && (
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Docs Received</div>
                  <div className={s.detailValue}>
                    {new Date(detailLetter.documentsReceivedAt).toLocaleString(
                      "en-NG",
                    )}
                  </div>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  paddingTop: "1rem",
                }}
              >
                {detailLetter.status === "Draft" &&
                  user?.role === "STATE_AUDITOR_GENERAL" && (
                    <button
                      className={s.btnPrimary}
                      onClick={() => {
                        sendLetter(detailLetter.id);
                        addToast({ type: "success", title: "Letter Sent" });
                      }}
                    >
                      <Send size={14} /> Send Letter
                    </button>
                  )}
                {detailLetter.status === "Sent" &&
                  user?.role === "HEAD_OF_LOCAL_GOVERNMENT" && (
                    <button
                      className={s.btnGold}
                      onClick={() =>
                        handleStatusUpdate(detailLetter.id, "Acknowledged")
                      }
                    >
                      <CheckCircle size={14} /> Acknowledge Receipt
                    </button>
                  )}
                {detailLetter.status === "Sent" &&
                  user?.role === "STATE_AUDITOR_GENERAL" && (
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-3)",
                        fontStyle: "italic",
                      }}
                    >
                      <Clock size={14} /> Awaiting LGA acknowledgment…
                    </span>
                  )}
                {detailLetter.status === "Acknowledged" &&
                  user?.role === "HEAD_OF_LOCAL_GOVERNMENT" && (
                    <button
                      className={s.btnPrimary}
                      onClick={() => {
                        const fileInput = document.createElement("input");
                        fileInput.type = "file";
                        fileInput.accept = ".pdf,.doc,.docx,.xls,.xlsx";
                        fileInput.multiple = true;
                        fileInput.onchange = (e) => {
                          const target = e.target as HTMLInputElement;
                          if (target.files && target.files.length > 0) {
                            addToast({
                              type: "success",
                              title: "Documents Uploaded",
                              message: `Successfully uploaded ${target.files.length} file(s): ${target.files[0].name}${target.files.length > 1 ? ` +${target.files.length - 1} more` : ""}`,
                            });
                            handleStatusUpdate(
                              detailLetter.id,
                              "Documents Received",
                            );
                          }
                        };
                        fileInput.click();
                      }}
                    >
                      <Package size={14} /> Upload Required Documents
                    </button>
                  )}
                {detailLetter.status === "Acknowledged" &&
                  user?.role === "STATE_AUDITOR_GENERAL" && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontSize: "0.8rem",
                        color: "#16a34a",
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle size={14} /> LGA acknowledged — awaiting
                      document upload
                    </span>
                  )}
                {detailLetter.status === "Documents Received" &&
                  user?.role === "STATE_AUDITOR_GENERAL" && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontSize: "0.8rem",
                        color: "#7c3aed",
                        fontWeight: 600,
                      }}
                    >
                      <Package size={14} /> Documents received from LGA — ready
                      for pre-audit review
                    </span>
                  )}
              </div>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Document Checklist</h3>
            </div>
            <div className={s.cardBody}>
              {detailLetter.checklist.map((item, idx) => (
                <div key={idx} className={s.checklistItem}>
                  <input
                    type="checkbox"
                    id={`checklist-${idx}`}
                    checked={detailLetter.status === "Documents Received"}
                    readOnly
                  />
                  <label htmlFor={`checklist-${idx}`}>{item}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Notification Letters</h1>
          <p className={s.pageSubtitle}>
            Generate and dispatch audit notification letters to all 20 LGAs
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {mandateLetters.length === 0 &&
          user?.role === "STATE_AUDITOR_GENERAL" ? (
            <button className={s.btnPrimary} onClick={handleGenerate}>
              <FileText size={14} /> Generate Letters
            </button>
          ) : (
            draftCount > 0 &&
            user?.role === "STATE_AUDITOR_GENERAL" && (
              <button className={s.btnGold} onClick={handleSendAll}>
                <SendHorizonal size={14} /> Send All ({draftCount})
              </button>
            )
          )}
        </div>
      </div>

      {mandates.length > 1 && (
        <div
          className={s.formGroup}
          style={{ maxWidth: "400px", marginBottom: "1.5rem" }}
        >
          <label className={s.formLabel} htmlFor="mandate-select">
            Select Mandate
          </label>
          <select
            id="mandate-select"
            className={s.formSelect}
            value={selectedMandateId}
            onChange={(e) => setSelectedMandateId(e.target.value)}
          >
            {mandates.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} (FY {m.auditYear})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <Mail size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total Letters</div>
            <div className={s.kpiValue}>{mandateLetters.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Draft</div>
            <div className={s.kpiValue}>{draftCount}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Acknowledged</div>
            <div className={s.kpiValue}>{ackCount}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <Package size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Docs Received</div>
            <div className={s.kpiValue}>{docsCount}</div>
          </div>
        </div>
      </div>

      {mandateLetters.length > 0 && (
        <>
          <div className={s.filterBar} style={{ marginBottom: "1.5rem" }}>
            {(
              [
                "All",
                "Draft",
                "Sent",
                "Acknowledged",
                "Documents Received",
              ] as const
            ).map((f) => (
              <button
                key={f}
                className={filter === f ? s.filterChipActive : s.filterChip}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {filtered.map((letter) => {
            const lga = getLga(letter.lgaId);
            const IconClass = letterStatusIcon(letter.status);
            const StatusIcon =
              letter.status === "Draft"
                ? FileText
                : letter.status === "Sent"
                  ? Send
                  : letter.status === "Acknowledged"
                    ? CheckCircle
                    : Package;

            return (
              <div key={letter.id} className={s.letterCard}>
                <div className={s.letterInfo}>
                  <div className={IconClass}>
                    <StatusIcon size={18} />
                  </div>
                  <div>
                    <div className={s.letterName}>
                      {lga?.name || letter.lgaId}
                    </div>
                    <div className={s.letterSub}>
                      {lga?.contactName}
                      {letter.sentAt &&
                        ` · Sent ${new Date(letter.sentAt).toLocaleDateString("en-NG")}`}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <StatusBadge
                    label={letter.status}
                    variant={letterStatusVariant(letter.status)}
                  />
                  {letter.status === "Draft" &&
                    user?.role === "STATE_AUDITOR_GENERAL" && (
                      <button
                        className={`${s.btnPrimary} ${s.btnSmall}`}
                        onClick={() =>
                          handleSendOne(letter.id, lga?.name || "")
                        }
                      >
                        <Send size={12} /> Send
                      </button>
                    )}
                  <button
                    className={s.btnIcon}
                    aria-label="View letter details"
                    onClick={() => setDetailLetterId(letter.id)}
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {mandateLetters.length === 0 && (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <Mail size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No notification letters yet</div>
              <div className={s.emptyDesc}>
                Generate notification letters for the selected mandate to begin
                the formal audit notification process.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
