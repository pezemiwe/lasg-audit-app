// Auto-generated mock data for full-scale testing across all 57 Councils.
// - 1 HEAD_OF_LOCAL_GOVERNMENT per council (57 total)
// - 1 AUDIT_LEAD per LGA (20 total) — pre-assigned to the LGA via `auditLeadId`
// - 3 TEAM_AUDITORS per LGA (60 total)
// - 1 Audit per council attached to the active FY2025 mandate (`mandate-1`)
//
// This module performs in-place mutation on the exported `LGAS` array to attach
// a default `auditLeadId` per LGA so dashboards (e.g. SupervisorDashboard) and
// counters reflect the seeded assignments without requiring runtime actions.

import type { User, Audit, AuditType, AuditStatus } from "../types";
import { LGAS } from "./zones";

// -- Helpers ---------------------------------------------------------------

const FIRST_NAMES_M = [
  "Adewale",
  "Babatunde",
  "Chinedu",
  "Damola",
  "Emeka",
  "Femi",
  "Gbenga",
  "Hakeem",
  "Ibrahim",
  "Jide",
  "Kunle",
  "Lekan",
  "Muyiwa",
  "Niyi",
  "Olumide",
  "Tunde",
  "Segun",
  "Wale",
  "Yusuf",
  "Tobi",
];

const FIRST_NAMES_F = [
  "Adaeze",
  "Bisola",
  "Chioma",
  "Damilola",
  "Eniola",
  "Folake",
  "Gloria",
  "Halima",
  "Ifeoma",
  "Jumoke",
  "Kemi",
  "Lola",
  "Modupe",
  "Ngozi",
  "Omolara",
  "Patricia",
  "Ronke",
  "Sade",
  "Tope",
  "Yemisi",
];

const LAST_NAMES = [
  "Adebayo",
  "Adeleke",
  "Afolabi",
  "Akinola",
  "Balogun",
  "Bankole",
  "Eze",
  "Fagbemi",
  "Hassan",
  "Ibrahim",
  "Johnson",
  "Lawal",
  "Mohammed",
  "Nwosu",
  "Obi",
  "Ojo",
  "Okafor",
  "Okoye",
  "Olatunji",
  "Olawale",
  "Olayinka",
  "Onyeka",
  "Owolabi",
  "Salami",
  "Suleiman",
  "Tijani",
  "Uche",
  "Williams",
  "Yusuf",
  "Zubair",
];

const TITLES_M = ["Mr.", "Engr.", "Alh.", "Dr.", "Hon.", "Chief"];
const TITLES_F = ["Mrs.", "Miss", "Dr.", "Hon.", "Chief", "Princess"];

const SPECIALISATIONS: AuditType[][] = [
  ["Financial"],
  ["Compliance"],
  ["Performance"],
  ["Financial", "Compliance"],
  ["Performance", "Compliance"],
  ["Financial", "Performance"],
  ["Combined"],
];

// Deterministic pseudo-random based on seed string so data is stable
const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const pick = <T>(arr: T[], seed: string, salt = 0): T =>
  arr[(hash(seed) + salt) % arr.length];

const slug = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const buildName = (
  seed: string,
  gender: "M" | "F",
): { name: string; first: string; last: string } => {
  const titles = gender === "M" ? TITLES_M : TITLES_F;
  const firsts = gender === "M" ? FIRST_NAMES_M : FIRST_NAMES_F;
  const title = pick(titles, seed, 1);
  const first = pick(firsts, seed, 2);
  const last = pick(LAST_NAMES, seed, 3);
  return { name: `${title} ${first} ${last}`, first, last };
};

const buildEmail = (first: string, last: string, councilSlug: string): string =>
  `${first.toLowerCase()}.${last.toLowerCase()}.${councilSlug}@lasg.gov.ng`;

// -- HLGAs (Heads of Local Government) -------------------------------------

const HLGAS: User[] = LGAS.map((council, idx) => {
  const gender: "M" | "F" = idx % 3 === 0 ? "F" : "M";
  const seed = `hlga-${council.id}`;
  const { name } = buildName(seed, gender);
  const councilSlug = slug(council.name);
  return {
    id: `user-hlga-${council.id}`,
    name: `${name} (HLGA ${council.name})`,
    email: `hlga.${councilSlug}@lasg.gov.ng`,
    role: "HEAD_OF_LOCAL_GOVERNMENT",
    lgaId: council.id,
    phone: `+234 809 ${String(900 + idx).padStart(3, "0")} ${String(
      1000 + idx,
    ).padStart(4, "0")}`,
  };
});

// -- Audit Leads (one per LGA, plus pool extras) ---------------------------

const PRIMARY_LGAS = LGAS.filter(
  (l) => !l.councilType || l.councilType === "LGA",
);

const GENERATED_LEADS: User[] = PRIMARY_LGAS.map((lga, idx) => {
  const gender: "M" | "F" = idx % 2 === 0 ? "M" : "F";
  const seed = `lead-${lga.id}`;
  const { name, first, last } = buildName(seed, gender);
  const councilSlug = slug(lga.name);
  return {
    id: `user-glead-${lga.id}`,
    name,
    email: buildEmail(first, last, councilSlug),
    role: "AUDIT_LEAD",
    lgaId: lga.id,
    zoneId: lga.zoneId,
    specialisations: pick(SPECIALISATIONS, seed, 4),
    workload: idx % 3,
    experience: [lga.id],
    phone: `+234 805 ${String(700 + idx).padStart(3, "0")} ${String(
      2000 + idx,
    ).padStart(4, "0")}`,
  };
});

// Bench pool of unassigned leads available for new assignments
const BENCH_LEADS: User[] = Array.from({ length: 8 }, (_, idx) => {
  const seed = `bench-lead-${idx}`;
  const gender: "M" | "F" = idx % 2 === 0 ? "F" : "M";
  const { name, first, last } = buildName(seed, gender);
  return {
    id: `user-glead-bench-${idx + 1}`,
    name,
    email: buildEmail(first, last, `bench${idx + 1}`),
    role: "AUDIT_LEAD",
    specialisations: pick(SPECIALISATIONS, seed, 5),
    workload: 0,
    experience: [],
    phone: `+234 805 880 ${String(1000 + idx).padStart(4, "0")}`,
  };
});

// -- Team Auditors (3 per LGA) ---------------------------------------------

const GENERATED_AUDITORS: User[] = PRIMARY_LGAS.flatMap((lga, lgaIdx) =>
  Array.from({ length: 3 }, (_, slot) => {
    const seed = `auditor-${lga.id}-${slot}`;
    const gender: "M" | "F" = (lgaIdx + slot) % 2 === 0 ? "F" : "M";
    const { name, first, last } = buildName(seed, gender);
    const councilSlug = slug(lga.name);
    return {
      id: `user-gauditor-${lga.id}-${slot + 1}`,
      name: `${name} (${lga.name})`,
      email: buildEmail(first, last, `${councilSlug}-${slot + 1}`),
      role: "TEAM_AUDITOR",
      lgaId: lga.id,
      zoneId: lga.zoneId,
      specialisations: pick(SPECIALISATIONS, seed, 6),
      workload: slot,
      experience: [lga.id],
      phone: `+234 807 ${String(700 + lgaIdx).padStart(3, "0")} ${String(
        slot + 1,
      ).padStart(4, "0")}`,
    } as User;
  }),
);

// -- Mutate LGAS in place to set default auditLeadId -----------------------
// Each LGA gets the primary lead for that LGA. LCDAs share the lead from
// their parent LGA so supervisor dashboards count meaningful coverage.

const LEAD_BY_LGA_ID = new Map<string, string>();
GENERATED_LEADS.forEach((lead) => {
  if (lead.lgaId) LEAD_BY_LGA_ID.set(lead.lgaId, lead.id);
});

LGAS.forEach((council) => {
  if (council.auditLeadId) return;
  const targetLgaId = council.parentLgaId || council.id;
  const leadId = LEAD_BY_LGA_ID.get(targetLgaId);
  if (leadId) council.auditLeadId = leadId;
});

// -- Generated Audits — one per council under FY2025 mandate ---------------

const STATUS_CYCLE: AuditStatus[] = [
  "Pre-Audit",
  "Planning",
  "Fieldwork",
  "Review",
  "Reporting",
  "Post-Audit",
  "Completed",
];

const TYPE_CYCLE: AuditType[] = [
  "Financial",
  "Compliance",
  "Performance",
  "Combined",
];

const PROGRESS_BY_STATUS: Record<AuditStatus, number> = {
  Pending: 0,
  "Pre-Audit": 5,
  Planning: 20,
  Fieldwork: 50,
  Review: 75,
  Reporting: 90,
  "Post-Audit": 95,
  Completed: 100,
};

// Assign 8 LCDAs to bench leads so every bench lead has at least one audit
const LCDA_TO_BENCH_LEAD = new Map<string, string>();
const LCDA_COUNCILS = LGAS.filter((c) => c.parentLgaId);
LCDA_COUNCILS.slice(0, 8).forEach((lcda, i) => {
  LCDA_TO_BENCH_LEAD.set(lcda.id, `user-glead-bench-${i + 1}`);
});

export const GENERATED_AUDITS: Audit[] = LGAS.map((council, idx) => {
  const status = STATUS_CYCLE[idx % STATUS_CYCLE.length];
  const type = TYPE_CYCLE[idx % TYPE_CYCLE.length];
  const targetLgaId = council.parentLgaId || council.id;
  const benchLeadId = LCDA_TO_BENCH_LEAD.get(council.id);
  const leadId =
    benchLeadId || LEAD_BY_LGA_ID.get(targetLgaId) || "user-glead-lga-1";
  const auditorsForLga = GENERATED_AUDITORS.filter(
    (a) => a.lgaId === targetLgaId,
  )
    .slice(0, 2)
    .map((a) => a.id);

  return {
    id: `gen-audit-${council.id}`,
    lgaId: council.id,
    type,
    year: 2025,
    status,
    mandateId: "mandate-1",
    leadId,
    teamIds: auditorsForLga,
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    progress: PROGRESS_BY_STATUS[status],
  } as Audit;
});

// -- Final Aggregations ----------------------------------------------------

export const GENERATED_USERS: User[] = [
  ...HLGAS,
  ...GENERATED_LEADS,
  ...BENCH_LEADS,
  ...GENERATED_AUDITORS,
];
