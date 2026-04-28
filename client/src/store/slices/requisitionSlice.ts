import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type { DocumentRequisition } from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type RequisitionActions = Pick<
  AuditStore,
  | "generateRequisitions"
  | "addDocumentRequisition"
  | "updateRequisitionStatus"
  | "getAuditRequisitions"
>;

const REQ_DOCS: Record<string, string[]> = {
  "Payroll & Personnel Costs": [
    "Nominal roll — Current FY",
    "Payroll schedules — all months",
    "Biometric register extract",
    "PAYE deduction schedules",
    "LIRS payment receipts",
    "Pension deduction schedules",
    "PFA remittance confirmations",
  ],
  "Revenue & Receipts": [
    "FAAC remittance advice — all months",
    "IGR collection schedule by revenue head",
    "Revenue cashbook / ledger",
  ],
  "Bank & Cash Management": [
    "Bank statements — all accounts FY",
    "Entity account listing (declared)",
    "Cashbook — all accounts",
  ],
  "Procurement & Contracts": [
    "Contract register FY",
    "Payment vouchers — full year",
    "Tender board minutes",
  ],
  "Fixed Assets & Capital Projects": [
    "Fixed asset register",
    "Capital project contract files",
    "Interim Payment Certificates",
  ],
  "Advances & Imprest": ["Advances register FY"],
  "Stores & Inventory": ["Stores ledger / inventory listing"],
  "Grants (UBEC / PHC)": [
    "Grant award letters / disbursement schedules",
    "Grant account bank statements",
    "Grant expenditure listing",
  ],
};

export function createRequisitionActions(
  set: SetFn,
  get: GetFn,
): RequisitionActions {
  return {
    generateRequisitions: (auditId) => {
      const s = get();
      const prog = s.programmes.find((p) => p.auditId === auditId);
      if (!prog) return;
      const existing = s.documentRequisitions.filter(
        (r) => r.auditId === auditId,
      );
      if (existing.length > 0) return;

      const docMap: Record<
        string,
        { doc: string; area: string; procIds: string[] }
      > = {};

      prog.procedures.forEach((proc) => {
        const area = proc.area;
        const docs = REQ_DOCS[area] || [];
        docs.forEach((doc) => {
          const key = `${area}::${doc}`;
          if (!docMap[key]) docMap[key] = { doc, area, procIds: [] };
          docMap[key].procIds.push(proc.id);
        });
      });

      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7);
      const deadlineStr = deadline.toISOString().split("T")[0];
      let idx = 1;
      const reqs: DocumentRequisition[] = Object.values(docMap).map(
        (entry) => ({
          id: uid(),
          auditId,
          ref: `REQ-${String(idx++).padStart(3, "0")}`,
          documentName: entry.doc,
          auditArea: entry.area,
          neededBy: deadlineStr,
          status: "Pending" as const,
          linkedProcedureIds: entry.procIds,
        }),
      );
      set((st) => ({
        documentRequisitions: [...st.documentRequisitions, ...reqs],
      }));
    },

    addDocumentRequisition: (req) =>
      set((s) => ({
        documentRequisitions: [
          ...s.documentRequisitions,
          { ...req, id: uid() },
        ],
      })),

    updateRequisitionStatus: (id, status, fileName, fileUrl) =>
      set((s) => ({
        documentRequisitions: s.documentRequisitions.map((r) =>
          r.id === id
            ? {
                ...r,
                status,
                ...(status === "Issued" ? { issuedAt: now() } : {}),
                ...(status === "Received"
                  ? {
                      receivedAt: now(),
                      receivedFileName: fileName,
                      receivedFileUrl: fileUrl,
                    }
                  : {}),
              }
            : r,
        ),
      })),

    getAuditRequisitions: (auditId) =>
      get().documentRequisitions.filter((r) => r.auditId === auditId),
  };
}
