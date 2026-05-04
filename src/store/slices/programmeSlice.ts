import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type {
  AuditProgramme,
  AuditProgrammeSection,
  ProgrammeProcedure,
  FraudFlag,
  CouncilType,
} from "../../types";
import { getSuggestedProcedures } from "../../utils/auditLogic";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type ProgrammeActions = Pick<
  AuditStore,
  | "createProgramme"
  | "submitProgramme"
  | "approveProgramme"
  | "requestProgrammeRevision"
  | "createProgrammeFromTemplate"
  | "generateProgrammeFromRisks"
  | "updateProgrammeProcedure"
  | "getAuditProgramme"
  | "getCouncilsByType"
  | "getLgaCount"
  | "getLcdaCount"
  | "getTotalCouncilCount"
  | "getParentLga"
  | "getChildLcdas"
  | "addFraudFlag"
  | "resolveFraudFlag"
>;

const RISK_KEY_RISKS: Record<string, string[]> = {
  "Revenue & Receipts": [
    "Revenue recognition at inappropriate times (cut-off errors)",
    "Fictitious revenue (existence)",
    "Unrecorded receipts (completeness)",
    "Manipulation of revenue figures to meet targets (fraud)",
  ],
  "Expenditure & Payments": [
    "Expenditure recorded without proper authorisation",
    "Fictitious or inflated payment vouchers",
    "Misclassification of expenditure heads",
    "Unrecorded liabilities at period end",
  ],
  "Payroll & Personnel Costs": [
    "Ghost workers on the payroll",
    "Incorrect salary computation or grade placement",
    "Unauthorised payroll changes",
    "Non-remittance of statutory deductions",
  ],
  "Bank & Cash Management": [
    "Unauthorised bank accounts",
    "Stale or fraudulent reconciling items",
    "Cash handling irregularities",
    "Inadequate controls over bank signatories",
  ],
  "Procurement & Contracts": [
    "Non-compliance with Public Procurement Act",
    "Contract splitting to avoid thresholds",
    "Conflict of interest in contract award",
    "Overpayment for goods/services not delivered",
  ],
  "Fixed Assets & Capital Projects": [
    "Unrecorded or fictitious assets",
    "Assets not physically verified",
    "Improper disposal without authorisation",
    "Capital projects not completed as per contract",
  ],
};

export const buildDefaultKeyRisks = (sectionTitle: string): string[] =>
  RISK_KEY_RISKS[sectionTitle] ?? [
    "Risk of material misstatement in this area",
    "Potential non-compliance with applicable regulations",
    "Fraud risk: manipulation or misrepresentation",
  ];

export const buildDefaultDocNotes = (sectionTitle: string): string =>
  `Document all procedures performed for ${sectionTitle}. Retain copies of key supporting documents (sample selections, confirmations, reconciliations). Cross-reference all evidence to the relevant workpaper.`;

export function createProgrammeActions(
  set: SetFn,
  get: GetFn,
): ProgrammeActions {
  return {
    createProgramme: (data) => {
      const prog: AuditProgramme = { ...data, id: `prog-${uid()}` };
      set((s) => ({ programmes: [...s.programmes, prog] }));
      get().addToast({ type: "success", title: "Audit Programme Created" });
    },

    submitProgramme: (programmeId) =>
      set((s) => ({
        programmes: s.programmes.map((p) =>
          p.id === programmeId
            ? { ...p, status: "Submitted" as const, submittedAt: now() }
            : p,
        ),
      })),

    approveProgramme: (programmeId, approverId) =>
      set((s) => ({
        programmes: s.programmes.map((p) =>
          p.id === programmeId
            ? {
                ...p,
                status: "Approved" as const,
                approvedBy: approverId,
                approvedAt: now(),
              }
            : p,
        ),
      })),

    requestProgrammeRevision: (programmeId) =>
      set((s) => ({
        programmes: s.programmes.map((p) =>
          p.id === programmeId
            ? { ...p, status: "Revision Required" as const }
            : p,
        ),
      })),

    updateProgrammeProcedure: (programmeId, procedureId, updates) =>
      set((s) => ({
        programmes: s.programmes.map((p) =>
          p.id === programmeId
            ? {
                ...p,
                procedures: p.procedures.map((proc) =>
                  proc.id === procedureId ? { ...proc, ...updates } : proc,
                ),
              }
            : p,
        ),
      })),

    getAuditProgramme: (auditId) =>
      get().programmes.find((p) => p.auditId === auditId),

    getCouncilsByType: (type?: CouncilType) => {
      const all = get().lgas;
      if (!type) return all;
      return all.filter((c) => (c.councilType || "LGA") === type);
    },

    getLgaCount: () =>
      get().lgas.filter((c) => !c.councilType || c.councilType === "LGA")
        .length,

    getLcdaCount: () =>
      get().lgas.filter((c) => c.councilType === "LCDA").length,

    getTotalCouncilCount: () => get().lgas.length,

    getParentLga: (lcdaId) => {
      const lcda = get().lgas.find((c) => c.id === lcdaId);
      if (!lcda?.parentLgaId) return undefined;
      return get().lgas.find((c) => c.id === lcda.parentLgaId);
    },

    getChildLcdas: (lgaId) => get().lgas.filter((c) => c.parentLgaId === lgaId),

    createProgrammeFromTemplate: (
      templateId,
      auditId,
      preparedBy,
      objectives,
      scope,
    ) => {
      const templates = get().programmeTemplates;
      const template = templates.find((t) => t.id === templateId);
      if (!template) return;

      const procedures: ProgrammeProcedure[] = template.sections.flatMap(
        (section) =>
          section.procedures.map((proc) => ({
            ...proc,
            id: `proc-${uid()}`,
            status: "Not Started" as const,
            assignedTo: undefined,
            evidenceUploaded: false,
          })),
      );

      const sections: AuditProgrammeSection[] = template.sections.map(
        (sec) => ({
          id: `sec-${uid()}`,
          title: sec.title,
          auditObjectives: [sec.objective],
          riskLevel: sec.riskLevel,
          keyRisks: buildDefaultKeyRisks(sec.title),
          documentationNotes: buildDefaultDocNotes(sec.title),
          sortOrder: sec.sortOrder,
        }),
      );

      const programme: AuditProgramme = {
        id: `prog-${uid()}`,
        auditId,
        templateId,
        objectives,
        scope,
        methodology: template.methodology,
        riskAreas: template.sections.map((s) => s.title),
        sections,
        procedures,
        status: "Draft",
        preparedBy,
      };

      set((s) => ({ programmes: [...s.programmes, programme] }));
      get().addToast({
        type: "success",
        title: "Programme Generated",
        message: `Created from "${template.name}" template with ${procedures.length} procedures`,
      });
    },

    generateProgrammeFromRisks: (auditId, preparedBy) => {
      const s = get();
      const risks = s.riskMatrices.filter((r) => r.auditId === auditId);
      const mat = s.materiality.find((m) => m.auditId === auditId);
      if (risks.length === 0) {
        get().addToast({
          type: "error",
          title: "Cannot Generate Programme",
          message: "Add risk matrix entries first",
        });
        return;
      }
      const existing = s.programmes.find((p) => p.auditId === auditId);
      if (existing) {
        get().addToast({
          type: "info",
          title: "Programme Exists",
          message: "A programme already exists for this audit",
        });
        return;
      }

      const sections: AuditProgrammeSection[] = risks.map((risk, i) => ({
        id: `sec-${uid()}`,
        title: risk.area,
        auditObjectives: [`Obtain reasonable assurance over ${risk.area}`],
        riskLevel: risk.overallRisk,
        riskMatrixRef: risk.id,
        keyRisks: buildDefaultKeyRisks(risk.area),
        documentationNotes: buildDefaultDocNotes(risk.area),
        sortOrder: i + 1,
      }));

      const procedures: ProgrammeProcedure[] = risks.flatMap((risk) =>
        getSuggestedProcedures(risk.area).map((proc) => ({
          id: `proc-${uid()}`,
          area: risk.area,
          procedure: proc,
          status: "Not Started" as const,
        })),
      );

      const programme: AuditProgramme = {
        id: `prog-${uid()}`,
        auditId,
        objectives:
          "Express an opinion on the financial statements and ensure compliance with applicable laws and regulations",
        scope: risks.map((r) => r.area).join(", "),
        methodology:
          "Risk-based audit approach combining substantive and control testing",
        materialityReference: mat
          ? `Overall Materiality: ₦${mat.overallMateriality.toLocaleString()}`
          : undefined,
        riskAreas: risks.map((r) => r.area),
        sections,
        procedures,
        status: "Draft",
        preparedBy,
      };

      set((st) => ({ programmes: [...st.programmes, programme] }));
      get().addToast({
        type: "success",
        title: "Programme Auto-Generated",
        message: `${procedures.length} procedures from ${risks.length} risk areas`,
      });
      get().logActivity({
        userId: preparedBy,
        action: "GENERATE_PROGRAMME",
        details: "Auto-generated audit programme from risk matrix",
        entityType: "audit",
        entityId: auditId,
      });
    },

    addFraudFlag: (data) => {
      const ff: FraudFlag = { ...data, id: `ff-${uid()}`, raisedAt: now() };
      set((s) => ({ fraudFlags: [...s.fraudFlags, ff] }));
      get().addToast({ type: "warning", title: "Fraud Flag Raised" });
    },

    resolveFraudFlag: (id, resolution) =>
      set((s) => ({
        fraudFlags: s.fraudFlags.map((f) =>
          f.id === id
            ? {
                ...f,
                status: "Resolved" as const,
                resolution,
                resolvedAt: now(),
              }
            : f,
        ),
      })),
  };
}
