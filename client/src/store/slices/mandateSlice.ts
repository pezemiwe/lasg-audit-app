import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type {
  Mandate,
  LetterStatus,
  NotificationLetter,
  DocumentUpload,
} from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type MandateActions = Pick<
  AuditStore,
  | "createMandate"
  | "publishMandate"
  | "updateMandateStatus"
  | "acceptMandate"
  | "ensureDocumentsExist"
  | "signOffDocuments"
  | "addSupervisor"
  | "removeSupervisor"
  | "assignLead"
  | "generateLetters"
  | "sendLetter"
  | "sendAllLetters"
  | "updateLetterStatus"
>;

const NOTIFICATION_CHECKLIST: string[] = [
  "Audit notification letter prepared",
  "Document request list attached",
  "Letter signed by Auditor-General",
  "Letter delivered to LGA Chairman",
  "Acknowledgement received from LGA",
];

const REQUIRED_DOCS = (
  mandateId: string,
  lgaId: string,
  dueDate: string,
): DocumentUpload[] => [
  {
    id: `doc-${mandateId}-${lgaId}-16`,
    lgaId,
    mandateId,
    documentName: "Financial Statements — Current Year (xlsx)",
    description:
      "Unaudited current year financial statements in Excel format (e.g. Unaudited_Financial_Statement_2026.xlsx)",
    requiredFormat: "Excel",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-17`,
    lgaId,
    mandateId,
    documentName: "Financial Statements — Prior Year (xlsx)",
    description:
      "Audited prior year financial statements in Excel format (e.g. Audited_Financial_Statement_2025.xlsx)",
    requiredFormat: "Excel",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-18`,
    lgaId,
    mandateId,
    documentName: "Trial Balance — Current Year (xlsx)",
    description:
      "Unaudited current year trial balance in Excel format (e.g. Unaudited_Trial_Balance_2026.xlsx)",
    requiredFormat: "Excel",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-19`,
    lgaId,
    mandateId,
    documentName: "Trial Balance — Prior Year (xlsx)",
    description:
      "Audited prior year trial balance in Excel format (e.g. Audited_Trial_Balance_2025.xlsx)",
    requiredFormat: "Excel",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-20`,
    lgaId,
    mandateId,
    documentName: "Approved Budget — Current Year (xlsx)",
    description:
      "Approved budget for the current fiscal year in Excel format (e.g. Approved_Budget_2026.xlsx)",
    requiredFormat: "Excel",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-21`,
    lgaId,
    mandateId,
    documentName: "Approved Budget — Prior Year (xlsx)",
    description:
      "Approved budget for the prior fiscal year in Excel format (e.g. Approved_Budget_2025.xlsx)",
    requiredFormat: "Excel",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-3`,
    lgaId,
    mandateId,
    documentName: "Bank Statements",
    description: "Bank statements for all LGA accounts covering 12 months",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-4`,
    lgaId,
    mandateId,
    documentName: "Staff Establishment and Payroll Records",
    description:
      "Complete staff list with grades, positions, and 12-month payroll records",
    requiredFormat: "Excel",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-5`,
    lgaId,
    mandateId,
    documentName: "Revenue Collection Records",
    description: "IGR collection records, receipts, and revenue schedules",
    requiredFormat: "Excel/PDF",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-6`,
    lgaId,
    mandateId,
    documentName: "Capital Project Files",
    description:
      "Contract documents, project files, and completion certificates for all capital projects",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-7`,
    lgaId,
    mandateId,
    documentName: "Procurement Records",
    description:
      "Procurement documentation, bid evaluations, due process certificates, and contract awards",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-8`,
    lgaId,
    mandateId,
    documentName: "Fixed Asset Register",
    description:
      "Complete fixed asset register with acquisition details, locations, and current values",
    requiredFormat: "Excel",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-9`,
    lgaId,
    mandateId,
    documentName: "Tenders Board Minutes",
    description:
      "Minutes of Tenders Board and Finance Committee meetings for the audit period",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-10`,
    lgaId,
    mandateId,
    documentName: "Internal Audit Reports",
    description:
      "Internal audit reports and management responses for the audit period",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-11`,
    lgaId,
    mandateId,
    documentName: "Cash Books and Ledgers",
    description: "Complete cash books and general ledger for all LGA accounts",
    requiredFormat: "Excel",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-12`,
    lgaId,
    mandateId,
    documentName: "Previous Audit Reports",
    description: "Previous external audit reports and management responses",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-13`,
    lgaId,
    mandateId,
    documentName: "Payment Vouchers",
    description:
      "Payment vouchers and supporting expenditure documentation for the audit period",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-14`,
    lgaId,
    mandateId,
    documentName: "Budget Implementation Report",
    description:
      "Quarterly and annual budget performance reports showing actual versus approved expenditure",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
  {
    id: `doc-${mandateId}-${lgaId}-15`,
    lgaId,
    mandateId,
    documentName: "Management Letter Responses",
    description:
      "LGA responses to previous audit management letters and outstanding audit queries",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 1,
    dueDate,
  },
];

export function createMandateActions(set: SetFn, get: GetFn): MandateActions {
  return {
    createMandate: (data) => {
      const mandate: Mandate = {
        ...data,
        id: `mandate-${uid()}`,
        createdAt: now(),
        status: "Draft",
      };
      set((s) => ({ mandates: [...s.mandates, mandate] }));
      get().logActivity({
        userId: data.createdBy,
        action: "CREATE_MANDATE",
        details: `Created audit mandate: ${mandate.title}`,
        entityType: "mandate",
        entityId: mandate.id,
      });
      get().addToast({
        type: "success",
        title: "Mandate Created",
        message: `"${mandate.title}" saved as draft`,
      });
    },

    publishMandate: (id) => {
      set((s) => ({
        mandates: s.mandates.map((m) =>
          m.id === id
            ? { ...m, status: "Published" as const, publishedAt: now() }
            : m,
        ),
      }));
      const { mandates, users } = get();
      const mandate = mandates.find((m) => m.id === id);
      get().logActivity({
        userId: mandate?.createdBy || "",
        action: "PUBLISH_MANDATE",
        details: `Published audit mandate: ${mandate?.title}`,
        entityType: "mandate",
        entityId: id,
      });
      if (mandate) {
        get().addNotifications(
          users.map((u) => ({
            id: `notif-pub-${id}-${u.id}`,
            userId: u.id,
            type: "info" as const,
            title: "New Audit Mandate Published",
            message: `${mandate.title} has been published and is now active.`,
            isRead: false,
            timestamp: now(),
            relatedEntityId: id,
            relatedEntityType: "mandate" as const,
          })),
        );
      }
      get().addToast({
        type: "success",
        title: "Mandate Published",
        message:
          "The audit mandate is now active and all users have been notified",
      });
    },

    updateMandateStatus: (id, status) =>
      set((s) => ({
        mandates: s.mandates.map((m) => (m.id === id ? { ...m, status } : m)),
      })),

    acceptMandate: (mandateId, lgaId) => {
      set((s) => {
        const existingDocs = s.documentUploads.some(
          (d) => d.mandateId === mandateId && d.lgaId === lgaId,
        );
        const mandate = s.mandates.find((m) => m.id === mandateId);
        const dueDate = mandate?.endDate || new Date().toISOString();
        const requiredDocs = existingDocs
          ? []
          : REQUIRED_DOCS(mandateId, lgaId, dueDate);
        return {
          documentUploads: [...s.documentUploads, ...requiredDocs],
          mandates: s.mandates.map((m) => {
            if (m.id === mandateId) {
              const accepted = m.acceptedByLgas || [];
              if (!accepted.includes(lgaId)) {
                return { ...m, acceptedByLgas: [...accepted, lgaId] };
              }
            }
            return m;
          }),
        };
      });
      get().addToast({
        type: "success",
        title: "Mandate Accepted",
        message:
          "Mandate accepted. Please proceed to the Document Portal to upload required files.",
      });
    },

    ensureDocumentsExist: (mandateId, lgaId) => {
      set((s) => {
        const mandate = s.mandates.find((m) => m.id === mandateId);
        const dueDate = mandate?.endDate || new Date().toISOString();
        const allRequired = REQUIRED_DOCS(mandateId, lgaId, dueDate);
        const existingDocs = s.documentUploads.filter(
          (d) => d.mandateId === mandateId && d.lgaId === lgaId,
        );
        const otherDocs = s.documentUploads.filter(
          (d) => !(d.mandateId === mandateId && d.lgaId === lgaId),
        );
        const requiredNames = allRequired.map((r) => r.documentName);
        const validExisting = existingDocs.filter((d) =>
          requiredNames.includes(d.documentName),
        );
        // Rebuild in REQUIRED_DOCS order so display order matches definition order
        const orderedDocs = allRequired.map(
          (req) =>
            validExisting.find((ex) => ex.documentName === req.documentName) ??
            req,
        );
        const changed =
          existingDocs.length !== orderedDocs.length ||
          orderedDocs.some(
            (d, i) => d.documentName !== existingDocs[i]?.documentName,
          );
        if (!changed) return {};
        return {
          documentUploads: [...otherDocs, ...orderedDocs],
        };
      });
    },

    signOffDocuments: (auditId, userId) => {
      set((s) => {
        const audits = [...s.audits];
        const idx = audits.findIndex((a) => a.id === auditId);
        if (idx >= 0) {
          audits[idx] = {
            ...audits[idx],
            documentsSignedOff: true,
            documentsSignedOffAt: new Date().toISOString(),
            documentsSignedOffBy: userId,
          };
        }
        return { audits };
      });
      get().addToast({
        type: "success",
        title: "Sign-off Complete",
        message: "All requested documents have been signed-off successfully.",
      });
    },

    addSupervisor: (zoneId, supervisorId) => {
      set((s) => ({
        zones: s.zones.map((z) => {
          if (z.id !== zoneId) return z;
          const current = z.supervisorIds || [];
          if (current.includes(supervisorId)) return z;
          return { ...z, supervisorIds: [...current, supervisorId] };
        }),
      }));
      get().addToast({
        type: "success",
        title: "Supervisor Added",
        message: "Supervisor assigned to zone",
      });
    },

    removeSupervisor: (zoneId, supervisorId) =>
      set((s) => ({
        zones: s.zones.map((z) => {
          if (z.id === zoneId && z.supervisorIds) {
            return {
              ...z,
              supervisorIds: z.supervisorIds.filter(
                (id) => id !== supervisorId,
              ),
            };
          }
          return z;
        }),
      })),

    assignLead: (lgaId, leadId, auditId, mandateId) => {
      set((s) => {
        let updatedAudits = [...s.audits];
        const auditExists = updatedAudits.some((a) => a.id === auditId);
        if (auditExists) {
          updatedAudits = updatedAudits.map((a) =>
            a.id === auditId ? { ...a, leadId } : a,
          );
        } else {
          updatedAudits.push({
            id: auditId,
            lgaId,
            type: "Financial",
            year: new Date().getFullYear(),
            status: "Pending",
            mandateId,
            leadId,
            progress: 0,
          });
        }
        return {
          lgas: s.lgas.map((l) =>
            l.id === lgaId ? { ...l, auditLeadId: leadId } : l,
          ),
          audits: updatedAudits,
          users: s.users.map((u) => (u.id === leadId ? { ...u, lgaId } : u)),
        };
      });
      get().sendInvitation({
        userId: leadId,
        role: "AUDIT_LEAD",
        lgaId,
        auditId,
        mandateId,
      });
      get().addToast({
        type: "success",
        title: "Lead Assigned",
        message: "Invitation sent to Audit Lead",
      });
    },

    generateLetters: (mandateId) => {
      const { lgas, letters: existing, mandates } = get();
      const mandate = mandates.find((m) => m.id === mandateId);
      if (!mandate) return;
      const alreadyGenerated = existing.filter(
        (l) => l.mandateId === mandateId,
      );
      const lgaIds = new Set(alreadyGenerated.map((l) => l.lgaId));
      const newLetters: NotificationLetter[] = lgas
        .filter((l) => !lgaIds.has(l.id))
        .map((lga) => {
          const date = new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          const content =
            `**OFFICE OF THE STATE AUDITOR-GENERAL**\nLagos State Government\n\n${date}\n\nThe Chairman,\n${lga.name} Local Government,\nLagos State.\n\n**Attention:** ${lga.contactName || "Council Manager"}\n\n**RE: NOTIFICATION OF AUDIT ENGAGEMENT - ${mandate.title.toUpperCase()} (FY ${mandate.auditYear})**\n\nIn accordance with the provisions of the **Lagos State Audit Law (2015)** and the relevant sections of the **Constitution of the Federal Republic of Nigeria (1999 as amended)**, this letter serves to formally notify you of the commencement of the statutory audit exercise for the ${mandate.auditYear} financial year.\n\n**Scope of Audit:**\n${mandate.scope}\n\n**Audit Period:** ${new Date(mandate.startDate).toLocaleDateString()} to ${new Date(mandate.endDate).toLocaleDateString()}\n\nYours faithfully,\n\n**(Signed)**\n\n**State Auditor-General**\nLagos State`.trim();
          return {
            id: `letter-${uid()}-${lga.id}`,
            lgaId: lga.id,
            mandateId,
            status: "Draft" as LetterStatus,
            checklist: [...NOTIFICATION_CHECKLIST],
            content,
          };
        });
      set((s) => ({ letters: [...s.letters, ...newLetters] }));
      get().addToast({
        type: "success",
        title: "Letters Generated",
        message: `${newLetters.length} notification letters prepared`,
      });
    },

    sendLetter: (letterId) =>
      set((s) => ({
        letters: s.letters.map((l) =>
          l.id === letterId
            ? { ...l, status: "Sent" as LetterStatus, sentAt: now() }
            : l,
        ),
      })),

    sendAllLetters: (mandateId) => {
      set((s) => ({
        letters: s.letters.map((l) =>
          l.mandateId === mandateId && l.status === "Draft"
            ? { ...l, status: "Sent" as LetterStatus, sentAt: now() }
            : l,
        ),
      }));
      get().addToast({
        type: "success",
        title: "All Letters Dispatched",
        message: "Notification letters sent to all Council contacts",
      });
    },

    updateLetterStatus: (letterId, status) =>
      set((s) => ({
        letters: s.letters.map((l) =>
          l.id === letterId
            ? {
                ...l,
                status,
                ...(status === "Acknowledged" ? { acknowledgedAt: now() } : {}),
                ...(status === "Documents Received"
                  ? { documentsReceivedAt: now() }
                  : {}),
              }
            : l,
        ),
      })),
  };
}
