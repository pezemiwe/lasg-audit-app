// src/mock/moreUsers.ts
import type { User } from "../types";

export const ADDITIONAL_SUPERVISORS: User[] = [
  {
    id: "user-sup-new-1",
    name: "Mr. Tunde Bakare",
    email: "t.bakare@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-1",
    specialisations: ["Financial"],
    phone: "+234 803 555 0101",
  },
  {
    id: "user-sup-new-2",
    name: "Mrs. Chioma Okonkwo",
    email: "c.okonkwo@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-2",
    specialisations: ["Performance", "Combined"],
    phone: "+234 803 555 0102",
  },
  {
    id: "user-sup-new-3",
    name: "Alh. Yusuf Musa",
    email: "y.musa@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-3",
    specialisations: ["Compliance"],
    phone: "+234 803 555 0103",
  },
  {
    id: "user-sup-new-4",
    name: "Dr. Kemi Adeydju",
    email: "k.adeydju@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-4",
    specialisations: ["Combined"],
    phone: "+234 803 555 0104",
  },
  {
    id: "user-sup-new-5",
    name: "Mr. Segun Oladipo",
    email: "s.oladipo@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-5",
    specialisations: ["Financial"],
    phone: "+234 803 555 0105",
  },
  {
    id: "user-sup-new-6",
    name: "Mrs. Bola Tinudade",
    email: "b.tinudade@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-1",
    specialisations: ["Performance"],
    phone: "+234 803 555 0106",
  },
];
