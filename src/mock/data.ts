import type {
  Zone,
  LGA,
  User,
  Mandate,
  Audit,
  Task,
  Invitation,
  NotificationLetter,
  Workpaper,
  AuditReport,
  AuditProgramme,
  AuditProgrammeSection,
  ActivityLog,
  RiskMatrix,
  MaterialityThreshold,
  InternalControlTest,
  SubstantiveTest,
  FraudFlag,
  ScopeAgreement,
  QuestionnaireQuestion,
  QuestionnaireResponse,
  DocumentUpload,
  StageApproval,
  ProgrammeTemplate,
  AuditJournal,
  AuditComment,
  FinancialStatementItem,
  CompletionChecklistItem,
  AuditWorkpaper,
} from "../types";

export const ZONES: Zone[] = [
  {
    id: "zone-1",
    name: "Ikeja",
    supervisorIds: ["user-sup-ikeja", "user-sup-6"],
    lgas: [
      "lga-1",
      "lga-2",
      "lga-3",
      "lga-4",
      "lga-5",
      "lga-6",
      "lga-7",
      "lga-8",
      "lcda-1",
      "lcda-2",
      "lcda-3",
      "lcda-4",
      "lcda-5",
      "lcda-6",
      "lcda-7",
      "lcda-8",
      "lcda-9",
      "lcda-10",
      "lcda-11",
      "lcda-12",
      "lcda-13",
      "lcda-14",
      "lcda-15",
    ],
  },
  {
    id: "zone-4",
    name: "Badagry",
    supervisorIds: ["user-sup-badagry"],
    lgas: [
      "lga-9",
      "lga-10",
      "lga-11",
      "lga-12",
      "lcda-28",
      "lcda-29",
      "lcda-30",
      "lcda-31",
      "lcda-32",
      "lcda-33",
    ],
  },
  {
    id: "zone-3",
    name: "Ikorodu",
    supervisorIds: ["user-sup-ikorodu", "user-sup-8"],
    lgas: ["lga-13", "lcda-23", "lcda-24", "lcda-25", "lcda-26", "lcda-27"],
  },
  {
    id: "zone-2",
    name: "Lagos Island",
    supervisorIds: ["user-sup-lagos", "user-sup-7"],
    lgas: [
      "lga-14",
      "lga-15",
      "lga-16",
      "lga-17",
      "lga-18",
      "lcda-16",
      "lcda-17",
      "lcda-18",
      "lcda-19",
      "lcda-20",
      "lcda-21",
      "lcda-22",
    ],
  },
  {
    id: "zone-5",
    name: "Epe",
    supervisorIds: ["user-sup-epe"],
    lgas: ["lga-19", "lga-20", "lcda-34", "lcda-35", "lcda-36", "lcda-37"],
  },
];

export const LGAS: LGA[] = [
  {
    id: "lga-1",
    name: "Ikeja",
    zoneId: "zone-1",
    contactName: "Mr Kayode Fashola",
    contactEmail: "ikeja@lasg.gov.ng",
    contactPhone: "+234 801 234 5001",
  },
  {
    id: "lga-2",
    name: "Alimosho",
    zoneId: "zone-1",
    contactName: "Chief Oluwaseun Adeyemi",
    contactEmail: "alimosho@lasg.gov.ng",
    contactPhone: "+234 801 234 5002",
  },
  {
    id: "lga-3",
    name: "Agege",
    zoneId: "zone-1",
    contactName: "Alhaji Mustapha Bello",
    contactEmail: "agege@lasg.gov.ng",
    contactPhone: "+234 801 234 5003",
  },
  {
    id: "lga-4",
    name: "Mushin",
    zoneId: "zone-1",
    contactName: "Mrs Folake Akinwunmi",
    contactEmail: "mushin@lasg.gov.ng",
    contactPhone: "+234 801 234 5004",
  },
  {
    id: "lga-5",
    name: "Oshodi-Isolo",
    zoneId: "zone-1",
    contactName: "Alh. Ibrahim Suleiman",
    contactEmail: "oshodi@lasg.gov.ng",
    contactPhone: "+234 801 234 5005",
  },
  {
    id: "lga-6",
    name: "Kosofe",
    zoneId: "zone-1",
    contactName: "Engr. Babajide Olatunde",
    contactEmail: "kosofe@lasg.gov.ng",
    contactPhone: "+234 801 234 5006",
  },
  {
    id: "lga-7",
    name: "Somolu",
    zoneId: "zone-1",
    contactName: "Hon. Gbolahan Bagostowe",
    contactEmail: "somolu@lasg.gov.ng",
    contactPhone: "+234 801 234 5007",
  },
  {
    id: "lga-8",
    name: "Ifako-Ijaiye",
    zoneId: "zone-1",
    contactName: "Mrs Aduke Ogundimu",
    contactEmail: "ifako@lasg.gov.ng",
    contactPhone: "+234 801 234 5008",
  },

  {
    id: "lga-9",
    name: "Badagry",
    zoneId: "zone-4",
    contactName: "Prince Akran Menu-Toyon",
    contactEmail: "badagry@lasg.gov.ng",
    contactPhone: "+234 801 234 5009",
  },
  {
    id: "lga-10",
    name: "Ojo",
    zoneId: "zone-4",
    contactName: "Chief Rasulu Idowu",
    contactEmail: "ojo@lasg.gov.ng",
    contactPhone: "+234 801 234 5010",
  },
  {
    id: "lga-11",
    name: "Amuwo-Odofin",
    zoneId: "zone-4",
    contactName: "Engr. Valentine Buraimoh",
    contactEmail: "amuwo@lasg.gov.ng",
    contactPhone: "+234 801 234 5011",
  },
  {
    id: "lga-12",
    name: "Ajeromi-Ifelodun",
    zoneId: "zone-4",
    contactName: "Hon. Fatai Ayoola",
    contactEmail: "ajeromi@lasg.gov.ng",
    contactPhone: "+234 801 234 5012",
  },

  {
    id: "lga-13",
    name: "Ikorodu",
    zoneId: "zone-3",
    contactName: "Hon. Wasiu Adeshina",
    contactEmail: "ikorodu@lasg.gov.ng",
    contactPhone: "+234 801 234 5013",
  },

  {
    id: "lga-14",
    name: "Lagos Island",
    zoneId: "zone-2",
    contactName: "Prince Tijani Olusi",
    contactEmail: "lagosisland@lasg.gov.ng",
    contactPhone: "+234 801 234 5014",
  },
  {
    id: "lga-15",
    name: "Lagos Mainland",
    zoneId: "zone-2",
    contactName: "Mrs Omolola Essien",
    contactEmail: "mainland@lasg.gov.ng",
    contactPhone: "+234 801 234 5015",
  },
  {
    id: "lga-16",
    name: "Apapa",
    zoneId: "zone-2",
    contactName: "Hon. Idowu Sebanjo",
    contactEmail: "apapa@lasg.gov.ng",
    contactPhone: "+234 801 234 5016",
  },
  {
    id: "lga-17",
    name: "Eti-Osa",
    zoneId: "zone-2",
    contactName: "Hon. Saheed Bankole",
    contactEmail: "etiosa@lasg.gov.ng",
    contactPhone: "+234 801 234 5017",
  },
  {
    id: "lga-18",
    name: "Surulere",
    zoneId: "zone-2",
    contactName: "Hon. Sulaimon Yusuf",
    contactEmail: "surulere@lasg.gov.ng",
    contactPhone: "+234 801 234 5018",
  },

  {
    id: "lga-19",
    name: "Epe",
    zoneId: "zone-5",
    contactName: "Princess Surah Animashaun",
    contactEmail: "epe@lasg.gov.ng",
    contactPhone: "+234 801 234 5019",
  },
  {
    id: "lga-20",
    name: "Ibeju-Lekki",
    zoneId: "zone-5",
    contactName: "Hon. Abdullah Sesan",
    contactEmail: "ibejulekki@lasg.gov.ng",
    contactPhone: "+234 801 234 5020",
  },

  /* ─── LCDAs (37 Local Council Development Areas) ─── */

  // Zone 1 — Ikeja (15 LCDAs)
  {
    id: "lcda-1",
    name: "Orile-Agege",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-3",
    contactName: "Hon. Taiwo Adebisi",
    contactEmail: "orileagege@lasg.gov.ng",
    contactPhone: "+234 801 234 6001",
  },
  {
    id: "lcda-2",
    name: "Agbado/Oke-Odo",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-2",
    contactName: "Alh. Saheed Oguntayo",
    contactEmail: "agbado@lasg.gov.ng",
    contactPhone: "+234 801 234 6002",
  },
  {
    id: "lcda-3",
    name: "Ayobo-Ipaja",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-2",
    contactName: "Hon. Lateef Adeniyi",
    contactEmail: "ayobo@lasg.gov.ng",
    contactPhone: "+234 801 234 6003",
  },
  {
    id: "lcda-4",
    name: "Egbe-Idimu",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-2",
    contactName: "Mrs. Bose Aregbesola",
    contactEmail: "egbeidimu@lasg.gov.ng",
    contactPhone: "+234 801 234 6004",
  },
  {
    id: "lcda-5",
    name: "Igando-Ikotun",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-2",
    contactName: "Hon. Akeem Adesanya",
    contactEmail: "igando@lasg.gov.ng",
    contactPhone: "+234 801 234 6005",
  },
  {
    id: "lcda-6",
    name: "Mosan-Okunola",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-2",
    contactName: "Chief Olusola Bankole",
    contactEmail: "mosan@lasg.gov.ng",
    contactPhone: "+234 801 234 6006",
  },
  {
    id: "lcda-7",
    name: "Ojokoro",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-8",
    contactName: "Hon. Hammed Idowu",
    contactEmail: "ojokoro@lasg.gov.ng",
    contactPhone: "+234 801 234 6007",
  },
  {
    id: "lcda-8",
    name: "Ojodu",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-1",
    contactName: "Dr. Folarin Ogunsanwo",
    contactEmail: "ojodu@lasg.gov.ng",
    contactPhone: "+234 801 234 6008",
  },
  {
    id: "lcda-9",
    name: "Onigbongbo",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-1",
    contactName: "Mrs. Yetunde Arobieke",
    contactEmail: "onigbongbo@lasg.gov.ng",
    contactPhone: "+234 801 234 6009",
  },
  {
    id: "lcda-10",
    name: "Agboyi-Ketu",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-6",
    contactName: "Hon. Dele Oshinowo",
    contactEmail: "agboyiketu@lasg.gov.ng",
    contactPhone: "+234 801 234 6010",
  },
  {
    id: "lcda-11",
    name: "Ikosi-Isheri",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-6",
    contactName: "Alh. Abdulrazaq Balogun",
    contactEmail: "ikosiisheri@lasg.gov.ng",
    contactPhone: "+234 801 234 6011",
  },
  {
    id: "lcda-12",
    name: "Odi-Olowo/Ojuwoye",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-4",
    contactName: "Hon. Rasak Ajala",
    contactEmail: "odiolowo@lasg.gov.ng",
    contactPhone: "+234 801 234 6012",
  },
  {
    id: "lcda-13",
    name: "Ejigbo",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-5",
    contactName: "Mrs. Monsurat Olowu",
    contactEmail: "ejigbo@lasg.gov.ng",
    contactPhone: "+234 801 234 6013",
  },
  {
    id: "lcda-14",
    name: "Isolo",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-5",
    contactName: "Hon. Shamsudeen Olaleye",
    contactEmail: "isolo@lasg.gov.ng",
    contactPhone: "+234 801 234 6014",
  },
  {
    id: "lcda-15",
    name: "Bariga",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-7",
    contactName: "Hon. Kolade Alabi",
    contactEmail: "bariga@lasg.gov.ng",
    contactPhone: "+234 801 234 6015",
  },

  // Zone 2 — Lagos Island (7 LCDAs)
  {
    id: "lcda-16",
    name: "Apapa-Iganmu",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-16",
    contactName: "Engr. Olumuyiwa Gbadegesin",
    contactEmail: "apapaiganmu@lasg.gov.ng",
    contactPhone: "+234 801 234 6016",
  },
  {
    id: "lcda-17",
    name: "Iru/Victoria Island",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-17",
    contactName: "Hon. Mobolaji Johnson",
    contactEmail: "iruvictoria@lasg.gov.ng",
    contactPhone: "+234 801 234 6017",
  },
  {
    id: "lcda-18",
    name: "Ikoyi-Obalende",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-17",
    contactName: "Chief Funsho Martins",
    contactEmail: "ikoyiobalende@lasg.gov.ng",
    contactPhone: "+234 801 234 6018",
  },
  {
    id: "lcda-19",
    name: "Lagos Island East",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-14",
    contactName: "Alh. Kamal Bashua",
    contactEmail: "lagosislandeast@lasg.gov.ng",
    contactPhone: "+234 801 234 6019",
  },
  {
    id: "lcda-20",
    name: "Yaba",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-15",
    contactName: "Dr. Jide Soyombo",
    contactEmail: "yaba@lasg.gov.ng",
    contactPhone: "+234 801 234 6020",
  },
  {
    id: "lcda-21",
    name: "Coker-Aguda",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-18",
    contactName: "Hon. Abdulahi Raji",
    contactEmail: "cokeraguda@lasg.gov.ng",
    contactPhone: "+234 801 234 6021",
  },
  {
    id: "lcda-22",
    name: "Itire-Ikate",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-18",
    contactName: "Mrs. Kudirat Ahmed",
    contactEmail: "itireikate@lasg.gov.ng",
    contactPhone: "+234 801 234 6022",
  },

  // Zone 3 — Ikorodu (5 LCDAs)
  {
    id: "lcda-23",
    name: "Igbogbo-Bayeku",
    zoneId: "zone-3",
    councilType: "LCDA",
    parentLgaId: "lga-13",
    contactName: "Hon. Olusesan Daini",
    contactEmail: "igbogbo@lasg.gov.ng",
    contactPhone: "+234 801 234 6023",
  },
  {
    id: "lcda-24",
    name: "Ijede",
    zoneId: "zone-3",
    councilType: "LCDA",
    parentLgaId: "lga-13",
    contactName: "Alh. Mufutau Bello",
    contactEmail: "ijede@lasg.gov.ng",
    contactPhone: "+234 801 234 6024",
  },
  {
    id: "lcda-25",
    name: "Imota",
    zoneId: "zone-3",
    councilType: "LCDA",
    parentLgaId: "lga-13",
    contactName: "Hon. Idris Aregbe",
    contactEmail: "imota@lasg.gov.ng",
    contactPhone: "+234 801 234 6025",
  },
  {
    id: "lcda-26",
    name: "Ikorodu North",
    zoneId: "zone-3",
    councilType: "LCDA",
    parentLgaId: "lga-13",
    contactName: "Chief Adeola Banjo",
    contactEmail: "ikorodunorth@lasg.gov.ng",
    contactPhone: "+234 801 234 6026",
  },
  {
    id: "lcda-27",
    name: "Ikorodu West",
    zoneId: "zone-3",
    councilType: "LCDA",
    parentLgaId: "lga-13",
    contactName: "Mrs. Mojirade Kadiri",
    contactEmail: "ikoroduwest@lasg.gov.ng",
    contactPhone: "+234 801 234 6027",
  },

  // Zone 4 — Badagry (6 LCDAs)
  {
    id: "lcda-28",
    name: "Ifelodun",
    zoneId: "zone-4",
    councilType: "LCDA",
    parentLgaId: "lga-12",
    contactName: "Hon. Shehu Danjuma",
    contactEmail: "ifelodun@lasg.gov.ng",
    contactPhone: "+234 801 234 6028",
  },
  {
    id: "lcda-29",
    name: "Oriade",
    zoneId: "zone-4",
    councilType: "LCDA",
    parentLgaId: "lga-11",
    contactName: "Chief Sunday Adeola",
    contactEmail: "oriade@lasg.gov.ng",
    contactPhone: "+234 801 234 6029",
  },
  {
    id: "lcda-30",
    name: "Badagry West",
    zoneId: "zone-4",
    councilType: "LCDA",
    parentLgaId: "lga-9",
    contactName: "Hon. Joseph Akintunde",
    contactEmail: "badagrywest@lasg.gov.ng",
    contactPhone: "+234 801 234 6030",
  },
  {
    id: "lcda-31",
    name: "Olorunda",
    zoneId: "zone-4",
    councilType: "LCDA",
    parentLgaId: "lga-9",
    contactName: "Mrs. Kehinde Bamgbose",
    contactEmail: "olorunda@lasg.gov.ng",
    contactPhone: "+234 801 234 6031",
  },
  {
    id: "lcda-32",
    name: "Iba",
    zoneId: "zone-4",
    councilType: "LCDA",
    parentLgaId: "lga-10",
    contactName: "Engr. Wahab Olatunji",
    contactEmail: "iba@lasg.gov.ng",
    contactPhone: "+234 801 234 6032",
  },
  {
    id: "lcda-33",
    name: "Oto-Awori",
    zoneId: "zone-4",
    councilType: "LCDA",
    parentLgaId: "lga-10",
    contactName: "Alh. Ismail Akinpelu",
    contactEmail: "otoawori@lasg.gov.ng",
    contactPhone: "+234 801 234 6033",
  },

  // Zone 5 — Epe (4 LCDAs)
  {
    id: "lcda-34",
    name: "Eredo",
    zoneId: "zone-5",
    councilType: "LCDA",
    parentLgaId: "lga-19",
    contactName: "Hon. Adebayo Afuye",
    contactEmail: "eredo@lasg.gov.ng",
    contactPhone: "+234 801 234 6034",
  },
  {
    id: "lcda-35",
    name: "Ikosi-Ejinrin",
    zoneId: "zone-5",
    councilType: "LCDA",
    parentLgaId: "lga-19",
    contactName: "Chief Adekunle Ayoka",
    contactEmail: "ikosiejinrin@lasg.gov.ng",
    contactPhone: "+234 801 234 6035",
  },
  {
    id: "lcda-36",
    name: "Lekki",
    zoneId: "zone-5",
    councilType: "LCDA",
    parentLgaId: "lga-20",
    contactName: "Mrs. Ronke Shobowale",
    contactEmail: "lekki@lasg.gov.ng",
    contactPhone: "+234 801 234 6036",
  },
  {
    id: "lcda-37",
    name: "Ibeju",
    zoneId: "zone-5",
    councilType: "LCDA",
    parentLgaId: "lga-20",
    contactName: "Hon. Tajudeen Olorunlogbon",
    contactEmail: "ibeju@lasg.gov.ng",
    contactPhone: "+234 801 234 6037",
  },
];

import { ADDITIONAL_SUPERVISORS } from "./moreUsers";

export const MOCK_USERS: User[] = [
  ...ADDITIONAL_SUPERVISORS,
  {
    id: "user-sysadmin",
    name: "Engr. Babatunde Fashola",
    email: "sysadmin@lasg.gov.ng",
    role: "SYSTEM_ADMIN",
    phone: "+234 802 000 0001",
  },
  {
    id: "user-ag",
    name: "Hon. Adebayo Oluwaseun",
    email: "ag@lasg.gov.ng",
    role: "STATE_AUDITOR_GENERAL",
    phone: "+234 802 300 0001",
  },
  {
    id: "user-sup-ikeja",
    name: "Mrs. Folashade Adekunle",
    email: "sup.ikeja@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-1",
    specialisations: ["Financial", "Compliance"],
    phone: "+234 803 400 0001",
  },
  {
    id: "user-sup-lagos",
    name: "Mr. Chukwuemeka Okafor",
    email: "sup.lagos@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-2",
    specialisations: ["Financial", "Performance"],
    phone: "+234 803 400 0002",
  },
  {
    id: "user-sup-ikorodu",
    name: "Alh. Muritala Ajibade",
    email: "sup.ikorodu@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-3",
    specialisations: ["Compliance"],
    phone: "+234 803 400 0003",
  },
  {
    id: "user-sup-badagry",
    name: "Mrs. Oluwabunmi Akintola",
    email: "sup.badagry@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-4",
    specialisations: ["Financial", "Performance"],
    phone: "+234 803 400 0004",
  },
  {
    id: "user-sup-epe",
    name: "Dr. Oluwatobi Fashanu",
    email: "sup.epe@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-5",
    specialisations: ["Performance", "Compliance"],
    phone: "+234 803 400 0005",
  },
  {
    id: "user-sup-6",
    name: "Mrs. Biola Adebayo",
    email: "sup.adebayo@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-1",
    specialisations: ["Financial"],
    phone: "+234 803 400 0006",
  },
  {
    id: "user-sup-7",
    name: "Mr. Tunde Bakare",
    email: "sup.bakare@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-2",
    specialisations: ["Compliance", "Financial"],
    phone: "+234 803 400 0007",
  },
  {
    id: "user-sup-8",
    name: "Dr. Chioma Okonkwo",
    email: "sup.okonkwo@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-3",
    specialisations: ["Performance"],
    phone: "+234 803 400 0008",
  },
  {
    id: "user-lead-1",
    name: "Mr. Adewale Ogunjobi",
    email: "lead.ogunjobi@lasg.gov.ng",
    role: "AUDIT_LEAD",
    lgaId: "lga-4",
    specialisations: ["Financial"],
    workload: 1,
    experience: ["lga-4", "lga-1"],
    phone: "+234 805 600 0001",
  },
  {
    id: "user-lead-2",
    name: "Mrs. Adetola Bakare",
    email: "lead.bakare@lasg.gov.ng",
    role: "AUDIT_LEAD",
    specialisations: ["Performance", "Compliance"],
    workload: 0,
    experience: ["lga-2", "lga-5"],
    phone: "+234 805 600 0002",
  },
  {
    id: "user-lead-3",
    name: "Mr. Chinedu Onyekachi",
    email: "lead.onyekachi@lasg.gov.ng",
    role: "AUDIT_LEAD",
    specialisations: ["Financial", "Compliance"],
    workload: 0,
    experience: ["lga-9", "lga-13"],
    phone: "+234 805 600 0003",
  },
  {
    id: "user-lead-4",
    name: "Mrs. Funmilayo Adeleke",
    email: "lead.adeleke@lasg.gov.ng",
    role: "AUDIT_LEAD",
    specialisations: ["Financial", "Performance"],
    workload: 1,
    experience: ["lga-12"],
    phone: "+234 805 600 0004",
  },
  {
    id: "user-lead-5",
    name: "Mr. Babatunde Salami",
    email: "lead.salami@lasg.gov.ng",
    role: "AUDIT_LEAD",
    specialisations: ["Compliance"],
    workload: 0,
    experience: ["lga-17", "lga-18"],
    phone: "+234 805 600 0005",
  },
  {
    id: "user-auditor-1",
    name: "Miss Oluwadamilola Ige (Ikeja)",
    email: "auditor.ige@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-4",
    specialisations: ["Financial"],
    workload: 1,
    experience: ["lga-4"],
    phone: "+234 807 800 0001",
  },
  {
    id: "user-auditor-2",
    name: "Mr. Emeka Nwankwo (Agege)",
    email: "auditor.nwankwo@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-1",
    specialisations: ["Financial", "Compliance"],
    workload: 0,
    experience: ["lga-1", "lga-3"],
    phone: "+234 807 800 0002",
  },
  {
    id: "user-auditor-3",
    name: "Mrs. Aisha Mohammed (Ajeromi-Ifelodun)",
    email: "auditor.mohammed@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-9",
    specialisations: ["Performance"],
    workload: 0,
    experience: ["lga-9"],
    phone: "+234 807 800 0003",
  },
  {
    id: "user-auditor-4",
    name: "Mr. Tochukwu Eze (Eti-Osa)",
    email: "auditor.eze@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-12",
    specialisations: ["Financial", "Performance"],
    workload: 1,
    experience: ["lga-12", "lga-13"],
    phone: "+234 807 800 0004",
  },
  {
    id: "user-auditor-5",
    name: "Miss Bukola Adesanya (Alimosho)",
    email: "auditor.adesanya@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-2",
    specialisations: ["Compliance"],
    workload: 0,
    experience: [],
    phone: "+234 807 800 0005",
  },
  {
    id: "user-auditor-6",
    name: "Mr. Olumide Fashola (Kosofe)",
    email: "auditor.fashola@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-5",
    specialisations: ["Financial"],
    workload: 0,
    experience: ["lga-5", "lga-7"],
    phone: "+234 807 800 0006",
  },
  {
    id: "user-auditor-7",
    name: "Mrs. Ngozi Adichie (Lagos Mainland)",
    email: "auditor.adichie@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-14",
    specialisations: ["Performance", "Compliance"],
    workload: 0,
    experience: ["lga-14"],
    phone: "+234 807 800 0007",
  },
  {
    id: "user-auditor-8",
    name: "Mr. Yusuf Abdullahi (Ikorodu)",
    email: "auditor.abdullahi@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-17",
    specialisations: ["Financial", "Compliance"],
    workload: 0,
    experience: ["lga-17"],
    phone: "+234 807 800 0008",
  },
  {
    id: "user-auditor-9",
    name: "Miss Chisom Obi (Surulere)",
    email: "auditor.obi@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-16",
    specialisations: ["Financial", "Performance"],
    workload: 0,
    experience: ["lga-16"],
    phone: "+234 807 800 0009",
  },
  {
    id: "user-auditor-10",
    name: "Mr. Seun Adeyemi (Badagry)",
    email: "auditor.adeyemi@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-18",
    specialisations: ["Compliance"],
    workload: 0,
    experience: ["lga-18"],
    phone: "+234 807 800 0010",
  },
  {
    id: "user-hlga-ikeja",
    name: "Dr. Mojeed Balogun (HLGA Ikeja)",
    email: "hlga.ikeja@lasg.gov.ng",
    role: "HEAD_OF_LOCAL_GOVERNMENT",
    lgaId: "lga-1",
    phone: "+234 809 999 0001",
  },
  {
    id: "user-hlga-lagos",
    name: "Hon. Prince Tijani Olusi (HLGA Lagos Island)",
    email: "hlga.lagos@lasg.gov.ng",
    role: "HEAD_OF_LOCAL_GOVERNMENT",
    lgaId: "lga-14",
    phone: "+234 809 999 0014",
  },
];

export const AVAILABLE_SUPERVISORS: User[] = MOCK_USERS.filter(
  (u) => u.role === "AUDIT_SUPERVISOR",
);

export const AVAILABLE_LEADS: User[] = MOCK_USERS.filter(
  (u) => u.role === "AUDIT_LEAD",
);

export const AVAILABLE_AUDITORS: User[] = MOCK_USERS.filter(
  (u) => u.role === "TEAM_AUDITOR",
);

export const TASK_LIBRARY = [
  {
    id: "task-lib-1",
    title: "Revenue Collection Review",
    description:
      "Review revenue collection records including IGR, taxes, levies and other internally generated revenue streams",
  },
  {
    id: "task-lib-2",
    title: "Payroll Verification",
    description:
      "Verify payroll records against staff establishment, confirm salary payments and deductions",
  },
  {
    id: "task-lib-3",
    title: "Budget & Expenditure Analysis",
    description:
      "Analyse approved budget vs actual expenditure, identify variances and unauthorised spending",
  },
  {
    id: "task-lib-4",
    title: "Site Visit & Physical Inspection",
    description:
      "Conduct physical verification of capital projects, assets and infrastructure",
  },
  {
    id: "task-lib-5",
    title: "Compliance Documentation Review",
    description:
      "Review adherence to Public Finance Management Act, procurement laws and financial regulations",
  },
  {
    id: "task-lib-6",
    title: "Bank Reconciliation Review",
    description: "Reconcile bank statements with cashbooks and ledger entries",
  },
  {
    id: "task-lib-7",
    title: "Asset Register Verification",
    description:
      "Verify fixed asset register against physical assets and procurement records",
  },
  {
    id: "task-lib-8",
    title: "Procurement Process Audit",
    description:
      "Review procurement documentation, bid evaluations, and contract awards for compliance",
  },
  {
    id: "task-lib-9",
    title: "Cash Count & Treasury Inspection",
    description: "Conduct surprise cash counts and inspect treasury operations",
  },
  {
    id: "task-lib-10",
    title: "Grant & Subvention Tracking",
    description:
      "Trace federal and state grants, allocations and subventions to ensure proper utilisation",
  },
];

export const NOTIFICATION_CHECKLIST = [
  "Annual Financial Statements (preceding 3 years)",
  "Approved Budget (current and preceding year)",
  "Bank Statements for all accounts (12 months)",
  "Staff Establishment and Payroll Records",
  "Revenue Collection Records and Receipts",
  "Capital Project Files and Contract Documents",
  "Procurement Records and Due Process Certificates",
  "Fixed Asset Register",
  "Minutes of Tenders Board / Finance Committee Meetings",
  "Internal Audit Reports",
  "Previous External Audit Reports and Management Responses",
  "Cash Books and Ledgers",
];

export const SEED_MANDATES: Mandate[] = [
  {
    id: "mandate-1",
    title: "Annual Audit of Local Government Accounts — FY 2025",
    auditYear: 2025,
    scope:
      "Comprehensive audit of all 57 Councils (20 LGAs and 37 LCDAs) covering financial statements, compliance, and performance indicators",
    objectives:
      "To provide independent assurance on the accuracy of financial statements, compliance with applicable laws and regulations, and the economy, efficiency and effectiveness of Council operations",
    timelines: "March 2026 – September 2026",
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    auditTypes: ["Financial", "Compliance"],
    status: "Published",
    createdAt: "2026-01-15T09:00:00Z",
    publishedAt: "2026-01-20T14:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-2",
    title: "Special Audit of Procurement Practices — FY 2025",
    auditYear: 2025,
    scope:
      "Targeted review of procurement activities and contract awards across high-risk LGAs to ensure adherence to Public Procurement Law.",
    objectives:
      "Evaluate compliance with due process, assess value for money in contract execution, and identify potential irregularities.",
    timelines: "April 2026 – July 2026",
    startDate: "2026-04-01",
    endDate: "2026-07-31",
    auditTypes: ["Compliance", "Performance"],
    status: "Draft",
    createdAt: "2026-02-10T11:30:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-3",
    title: "Performance Audit of Primary Healthcare Delivery — FY 2024",
    auditYear: 2024,
    scope:
      "Assessment of healthcare service delivery, infrastructure, and resource utilization in Primary Healthcare Centers (PHCs).",
    objectives:
      "Determine the efficiency and effectiveness of PHC operations and patient care outcomes.",
    timelines: "January 2025 – June 2025",
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    auditTypes: ["Performance"],
    status: "Active",
    createdAt: "2025-01-05T09:00:00Z",
    publishedAt: "2025-01-15T10:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-4",
    title: "Financial Audit of IGR Collection Systems — FY 2023",
    auditYear: 2023,
    scope:
      "Audit of Internally Generated Revenue (IGR) collection, remittance, and accounting systems.",
    objectives:
      "Verify the completeness and accuracy of reported revenue and assess control weaknesses in collection processes.",
    timelines: "August 2024 – December 2024",
    startDate: "2024-08-01",
    endDate: "2024-12-31",
    auditTypes: ["Financial"],
    status: "Completed",
    createdAt: "2024-07-20T08:45:00Z",
    publishedAt: "2024-08-01T09:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-5",
    title: "Compliance Audit of Pension & Gratuity Payments — FY 2024",
    auditYear: 2024,
    scope:
      "Review of pension administration and gratuity disbursements to retirees.",
    objectives:
      "Ensure timely and accurate payments to eligible beneficiaries and compliance with pension laws.",
    timelines: "September 2024 - November 2024",
    startDate: "2024-09-01",
    endDate: "2024-11-30",
    auditTypes: ["Compliance"],
    status: "Completed",
    createdAt: "2024-08-15T14:20:00Z",
    publishedAt: "2024-09-01T10:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-6",
    title: "Routine Audit of Local Government Education Authorities — FY 2025",
    auditYear: 2025,
    scope:
      "Examination of financial records and administrative processes of LGEAs.",
    objectives:
      "Assess financial management and administrative efficiency in education authorities.",
    timelines: "May 2026 - August 2026",
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    auditTypes: ["Financial", "Compliance"],
    status: "Draft",
    createdAt: "2026-02-18T16:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-7",
    title: "Financial Sustainability Review of Market Boards — FY 2025",
    auditYear: 2025,
    scope: "Review of revenue generation and expenditure of market boards.",
    objectives:
      "Assess financial sustainability and identify opportunities for revenue enhancement.",
    timelines: "June 2026 - September 2026",
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    auditTypes: ["Financial", "Performance"],
    status: "Published",
    createdAt: "2026-01-25T11:00:00Z",
    publishedAt: "2026-02-01T09:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-8",
    title: "Environmental Impact Assessment of LGA Projects — FY 2024",
    auditYear: 2024,
    scope:
      "Audit of environmental compliance for major infrastructure projects undertaken by LGAs.",
    objectives:
      "Ensure projects meet environmental standards and assess impact on local communities.",
    timelines: "February 2025 - August 2025",
    startDate: "2025-02-01",
    endDate: "2025-08-31",
    auditTypes: ["Compliance", "Performance"],
    status: "Active",
    createdAt: "2025-01-10T14:00:00Z",
    publishedAt: "2025-01-20T10:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-9",
    title: "Forensic Audit of Payroll Systems — FY 2022",
    auditYear: 2022,
    scope:
      "Detailed forensic examination of payroll data to identify ghost workers and irregularities.",
    objectives:
      "Eliminate payroll fraud and improve personnel cost management.",
    timelines: "September 2023 - December 2023",
    startDate: "2023-09-01",
    endDate: "2023-12-31",
    auditTypes: ["Financial", "Compliance"],
    status: "Completed",
    createdAt: "2023-08-01T09:00:00Z",
    publishedAt: "2023-08-15T12:00:00Z",
    createdBy: "user-ag",
  },
];

export const SEED_AUDITS: Audit[] = [
  {
    id: "audit-1",
    lgaId: "lga-4",
    type: "Financial",
    year: 2025,
    status: "Fieldwork",
    mandateId: "mandate-1",
    leadId: "user-lead-1",
    teamIds: ["user-auditor-1", "user-auditor-2"],
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    phaseTimelines: {
      Engagement: { startDate: "2026-03-01", endDate: "2026-03-15" },
      Planning: { startDate: "2026-03-16", endDate: "2026-03-31" },
      "Risk Assessment": { startDate: "2026-03-20", endDate: "2026-04-05" },
      Fieldwork: { startDate: "2026-04-06", endDate: "2026-06-30" },
      "Quality Review": { startDate: "2026-07-01", endDate: "2026-07-31" },
      Reporting: { startDate: "2026-08-01", endDate: "2026-09-15" },
      "Post-Audit": { startDate: "2026-09-16", endDate: "2026-09-30" },
    },
    progress: 45,
    entryMeetingDate: "2026-03-01",
    entryMeetingNotes:
      "Entry meeting held with Chairman, CFO and Treasurer. Scope confirmed. Document submission deadline set for 7 March 2026.",
  },
  {
    id: "audit-2",
    lgaId: "lga-1",
    type: "Financial",
    year: 2025,
    status: "Planning",
    mandateId: "mandate-1",
    leadId: "user-lead-2",
    teamIds: ["user-auditor-5"],
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    phaseTimelines: {
      Engagement: { startDate: "2026-03-01", endDate: "2026-03-15" },
      Planning: { startDate: "2026-03-16", endDate: "2026-03-31" },
    },
    progress: 15,
  },
  {
    id: "audit-3",
    lgaId: "lga-12",
    type: "Compliance",
    year: 2025,
    status: "Review",
    mandateId: "mandate-1",
    leadId: "user-lead-4",
    teamIds: ["user-auditor-4"],
    startDate: "2026-03-10",
    endDate: "2026-09-30",
    phaseTimelines: {
      Engagement: { startDate: "2026-03-10", endDate: "2026-03-20" },
      Planning: { startDate: "2026-03-21", endDate: "2026-04-05" },
      "Risk Assessment": { startDate: "2026-03-28", endDate: "2026-04-10" },
      Fieldwork: { startDate: "2026-04-11", endDate: "2026-06-30" },
      "Quality Review": { startDate: "2026-07-01", endDate: "2026-07-31" },
    },
    progress: 80,
    entryMeetingDate: "2026-03-10",
    entryMeetingNotes:
      "Meeting attended by Director of Finance and Head of Procurement. Focus areas: procurement compliance and internal controls.",
  },
  {
    id: "audit-4",
    lgaId: "lga-9",
    type: "Financial",
    year: 2025,
    status: "Completed",
    mandateId: "mandate-1",
    leadId: "user-lead-3",
    teamIds: ["user-auditor-3"],
    startDate: "2026-03-05",
    endDate: "2026-06-20",
    phaseTimelines: {
      Engagement: { startDate: "2026-03-05", endDate: "2026-03-15" },
      Planning: { startDate: "2026-03-16", endDate: "2026-03-31" },
      "Risk Assessment": { startDate: "2026-03-22", endDate: "2026-04-04" },
      Fieldwork: { startDate: "2026-04-05", endDate: "2026-05-31" },
      "Quality Review": { startDate: "2026-06-01", endDate: "2026-06-15" },
      Reporting: { startDate: "2026-06-16", endDate: "2026-06-20" },
      "Post-Audit": { startDate: "2026-06-21", endDate: "2026-07-05" },
    },
    progress: 100,
    entryMeetingDate: "2026-03-05",
    entryMeetingNotes:
      "Introductory meeting held. All documents made available. Bank statements and payroll records confirmed received.",
  },
  {
    id: "audit-5",
    lgaId: "lga-16",
    type: "Performance",
    year: 2025,
    status: "Planning",
    mandateId: "mandate-1",
    leadId: "user-lead-2",
    teamIds: ["user-auditor-9"],
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    phaseTimelines: {
      Engagement: { startDate: "2026-03-01", endDate: "2026-03-10" },
      Planning: { startDate: "2026-03-11", endDate: "2026-04-10" },
    },
    progress: 10,
  },
  {
    id: "audit-6",
    lgaId: "lga-17",
    type: "Compliance",
    year: 2025,
    status: "Fieldwork",
    mandateId: "mandate-1",
    leadId: "user-lead-5",
    teamIds: ["user-auditor-8"],
    startDate: "2026-03-12",
    endDate: "2026-06-30",
    phaseTimelines: {
      Engagement: { startDate: "2026-03-12", endDate: "2026-03-22" },
      Planning: { startDate: "2026-03-23", endDate: "2026-04-05" },
      "Risk Assessment": { startDate: "2026-03-28", endDate: "2026-04-08" },
      Fieldwork: { startDate: "2026-04-09", endDate: "2026-06-15" },
    },
    progress: 35,
    entryMeetingDate: "2026-03-12",
    entryMeetingNotes:
      "Entry meeting with LG management. Procurement files and contract documents to be made available by 19 March 2026.",
  },
  {
    id: "audit-7",
    lgaId: "lga-19",
    type: "Performance",
    year: 2024,
    status: "Fieldwork",
    mandateId: "mandate-3",
    leadId: "user-lead-4",
    teamIds: ["user-auditor-4"],
    startDate: "2024-09-01",
    endDate: "2024-11-30",
    phaseTimelines: {
      Engagement: { startDate: "2024-09-01", endDate: "2024-09-15" },
      Planning: { startDate: "2024-09-16", endDate: "2024-09-30" },
      "Risk Assessment": { startDate: "2024-09-22", endDate: "2024-10-05" },
      Fieldwork: {
        startDate: "2024-10-01",
        // End date dynamically set to 2 days from now to test warning
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
    },
    progress: 60,
    entryMeetingDate: "2025-02-10",
    entryMeetingNotes:
      "Review of PHC infrastructure commenced. Initial site visits to 5 PHCs completed.",
  },
  {
    id: "audit-8",
    lgaId: "lga-20",
    type: "Performance",
    year: 2024,
    status: "Reporting",
    mandateId: "mandate-3",
    leadId: "user-lead-5",
    teamIds: ["user-auditor-9"],
    startDate: "2024-08-01",
    endDate: "2024-12-31",
    phaseTimelines: {
      Engagement: { startDate: "2024-08-01", endDate: "2024-08-15" },
      Planning: { startDate: "2024-08-16", endDate: "2024-08-31" },
      "Risk Assessment": { startDate: "2024-08-20", endDate: "2024-09-05" },
      Fieldwork: { startDate: "2024-09-06", endDate: "2024-09-30" },
      Reporting: {
        startDate: "2024-10-01",
        // End date 5 days ago to force escalation
        endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
    },
    progress: 90,
  },
  {
    id: "audit-9",
    lgaId: "lga-4",
    type: "Financial",
    year: 2023,
    status: "Completed",
    mandateId: "mandate-4",
    leadId: "user-lead-1",
    teamIds: ["user-auditor-1", "user-auditor-2"],
    startDate: "2024-08-01",
    endDate: "2024-11-30",
    progress: 100,
    entryMeetingDate: "2024-08-10",
    entryMeetingNotes:
      "IGR systems audit initiated. Revenue officers interviewed.",
  },
  {
    id: "audit-10",
    lgaId: "lga-1",
    type: "Financial",
    year: 2023,
    status: "Completed",
    mandateId: "mandate-4",
    leadId: "user-lead-2",
    teamIds: ["user-auditor-5"],
    startDate: "2024-08-05",
    endDate: "2024-12-05",
    progress: 100,
  },
  {
    id: "audit-11",
    lgaId: "lga-9",
    type: "Performance",
    year: 2024,
    status: "Fieldwork",
    mandateId: "mandate-8",
    leadId: "user-lead-3",
    teamIds: ["user-auditor-3"],
    startDate: "2025-02-15",
    progress: 55,
    entryMeetingDate: "2025-02-18",
    entryMeetingNotes:
      "Site inspection of 3 LGA projects completed. EIA reports reviewed.",
  },
  {
    id: "audit-12",
    lgaId: "lga-19",
    type: "Financial",
    year: 2022,
    status: "Completed",
    mandateId: "mandate-9",
    leadId: "user-lead-5",
    teamIds: ["user-auditor-8"],
    startDate: "2023-09-01",
    endDate: "2023-11-30",
    progress: 100,
    entryMeetingDate: "2023-09-05",
    entryMeetingNotes: "Payroll officer grilled on ghost worker allegations.",
  },
  {
    id: "audit-13",
    lgaId: "lga-13",
    type: "Compliance",
    year: 2022,
    status: "Completed",
    mandateId: "mandate-9",
    leadId: "user-lead-3",
    teamIds: ["user-auditor-3"],
    startDate: "2023-09-10",
    endDate: "2023-12-10",
    progress: 100,
    entryMeetingDate: "2023-09-12",
    entryMeetingNotes:
      "Head of Personnel attended. Verification exercise planned.",
  },
  // Additional Sample Audits for Professional Roadmap Data
  {
    id: "audit-past-1",
    lgaId: "lga-5", // Kosofe
    type: "Financial",
    year: 2023,
    status: "Completed",
    mandateId: "mandate-4", // IGR 2023
    leadId: "user-lead-3",
    teamIds: ["user-auditor-6"],
    startDate: "2023-08-01",
    endDate: "2023-12-15",
    phaseTimelines: {
      Engagement: { startDate: "2023-08-01", endDate: "2023-08-15" },
      Planning: { startDate: "2023-08-16", endDate: "2023-08-31" },
      Fieldwork: { startDate: "2023-09-01", endDate: "2023-11-15" },
      "Quality Review": { startDate: "2023-11-16", endDate: "2023-11-30" },
      Reporting: { startDate: "2023-12-01", endDate: "2023-12-15" },
      "Post-Audit": { startDate: "2023-12-16", endDate: "2023-12-31" },
    },
    progress: 100,
  },
  {
    id: "audit-past-2",
    lgaId: "lga-1", // Ikeja
    type: "Compliance",
    year: 2022,
    status: "Completed",
    mandateId: "mandate-9", // Payroll 2022
    leadId: "user-lead-1",
    teamIds: ["user-auditor-1"],
    startDate: "2023-09-01",
    endDate: "2023-12-20",
    phaseTimelines: {
      Engagement: { startDate: "2023-09-01", endDate: "2023-09-10" },
      Planning: { startDate: "2023-09-11", endDate: "2023-09-25" },
      Fieldwork: { startDate: "2023-09-26", endDate: "2023-11-10" },
      "Quality Review": { startDate: "2023-11-11", endDate: "2023-11-30" },
      Reporting: { startDate: "2023-12-01", endDate: "2023-12-20" },
      "Post-Audit": { startDate: "2023-12-21", endDate: "2024-01-10" },
    },
    progress: 100,
  },
  {
    id: "audit-late",
    lgaId: "lga-19",
    type: "Financial",
    year: 2024,
    status: "Fieldwork",
    mandateId: "mandate-2",
    leadId: "user-lead-1",
    teamIds: ["user-auditor-1"],
    startDate: "2026-01-10",
    endDate: "2026-02-20",
    phaseTimelines: {
      Engagement: { startDate: "2026-01-10", endDate: "2026-01-20" },
      Planning: { startDate: "2026-01-21", endDate: "2026-01-31" },
      Fieldwork: { startDate: "2026-02-01", endDate: "2026-02-20" },
    },
    progress: 35,
    entryMeetingDate: "2026-01-15",
    entryMeetingNotes:
      "Audit delayed due to uncooperative staff. Escalation required.",
  },
];

export const SEED_TASKS: Task[] = [
  {
    id: "task-1",
    auditId: "audit-1",
    title: "Revenue Collection Review",
    description: "Review IGR collections for FY 2025",
    assignedTo: "user-auditor-1",
    status: "In Progress",
    dueDate: "2026-04-15",
  },
  {
    id: "task-2",
    auditId: "audit-1",
    title: "Payroll Verification",
    description: "Verify payroll records against staff establishment",
    assignedTo: "user-auditor-2",
    status: "Pending",
    dueDate: "2026-04-20",
  },
  {
    id: "task-3",
    auditId: "audit-1",
    title: "Budget & Expenditure Analysis",
    description: "Analyse approved budget vs actual expenditure",
    assignedTo: "user-auditor-1",
    status: "Pending",
    dueDate: "2026-04-25",
  },
  {
    id: "task-4",
    auditId: "audit-3",
    title: "Procurement Process Audit",
    description: "Review procurement documentation for Eti-Osa",
    assignedTo: "user-auditor-4",
    status: "Review",
    dueDate: "2026-04-10",
  },
  {
    id: "task-5",
    auditId: "audit-4",
    title: "Bank Reconciliation Review",
    description: "Reconcile bank statements with cashbooks",
    status: "Completed",
    dueDate: "2026-05-01",
    completedAt: "2026-04-28",
  },
];

export const SEED_INVITATIONS: Invitation[] = [
  {
    id: "inv-1",
    userId: "user-lead-1",
    role: "AUDIT_LEAD",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    auditId: "audit-1",
    status: "Accepted",
    sentAt: "2026-02-15T10:00:00Z",
    expiresAt: "2026-02-17T10:00:00Z",
    acceptedAt: "2026-02-15T14:30:00Z",
  },
  {
    id: "inv-2",
    userId: "user-auditor-1",
    role: "TEAM_AUDITOR",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    auditId: "audit-1",
    status: "Accepted",
    sentAt: "2026-02-16T09:00:00Z",
    expiresAt: "2026-02-18T09:00:00Z",
    acceptedAt: "2026-02-16T11:00:00Z",
    tasks: ["task-1", "task-3"],
  },
];

export const SEED_LETTERS: NotificationLetter[] = [
  {
    id: "notif-Escalation",
    lgaId: "lga-19",
    mandateId: "mandate-1",
    type: "Audit Notification",
    date: "2026-02-21",
    status: "Sent",
    title: "URGENT: Audit Timeline Exceeded - Escalation Notice",
    content:
      "Notice of non-compliance with audit timeline. The fieldwork phase for 2024 Financial Audit was due for completion by 20 Feb 2026. Immediate explanation required.",
    checklist: [],
  },
];

export const SEED_WORKPAPERS: Workpaper[] = [
  {
    id: "wp-1",
    auditId: "audit-1",
    taskId: "task-1",
    title: "IGR Collections Working Schedule",
    uploadedBy: "user-auditor-1",
    uploadedAt: "2026-03-20T14:00:00Z",
    status: "Submitted",
    fileName: "IGR_Collections_WP_2025.xlsx",
    fileSize: "2.4 MB",
  },
];

export const SEED_REPORTS: AuditReport[] = [
  {
    id: "report-1",
    auditId: "audit-4",
    title: "Financial Audit Report — Ajeromi-Ifelodun LGA FY 2025",
    type: "Final",
    status: "Approved",
    preparedBy: "user-lead-3",
    submittedAt: "2026-06-15T09:00:00Z",
    reviewedBy: "user-sup-lagos",
    reviewedAt: "2026-06-18T16:00:00Z",
    findings: [
      {
        id: "f-1",
        title: "Unreconciled Bank Balances",
        description:
          "Bank balances showed a variance of N12.5M between cashbook and bank statements",
        severity: "High",
        recommendation: "Conduct monthly reconciliation",
        status: "Addressed",
      },
      {
        id: "f-2",
        title: "Procurement Irregularities",
        description:
          "3 contracts exceeding N5M awarded without due process certification",
        severity: "Critical",
        recommendation:
          "Obtain retrospective due process certification and implement controls",
        status: "Open",
      },
    ],
  },
];

/* ─── Risk-area sections for seed programme ─── */
const SEED_SECTIONS: AuditProgrammeSection[] = [
  {
    id: "sec-revenue",
    title: "Revenue",
    auditObjectives: [
      "To ensure that revenue is accurately recorded, exists, and is complete.",
      "To confirm that revenue recognition is in accordance with IPSAS and applicable accounting standards.",
      "To verify that cut-off procedures are appropriate.",
      "To assess the risk of material misstatement due to fraud or error.",
    ],
    riskLevel: "High",
    keyRisks: [
      "Revenue recognition at inappropriate times (cut-off errors)",
      "Fictitious sales/receipts (existence)",
      "Unrecorded revenue (completeness)",
      "Manipulation of revenue to meet targets (fraud risk)",
    ],
    documentationNotes:
      "Document all procedures performed, evidence obtained, and conclusions reached. Retain copies of revenue schedules, bank tellers, receipt books, and reconciliation workpapers.",
    sortOrder: 1,
  },
  {
    id: "sec-payroll",
    title: "Payroll",
    auditObjectives: [
      "To confirm that payroll expenditure relates only to bona fide employees.",
      "To verify that salaries are accurately computed and properly authorised.",
      "To ensure statutory deductions are correctly calculated and remitted.",
    ],
    riskLevel: "Critical",
    keyRisks: [
      "Ghost workers on the payroll",
      "Incorrect salary computation or grade placement",
      "Unauthorised payroll changes (additions, promotions, terminations)",
      "Non-remittance of statutory deductions (PAYE, Pension, NHF)",
    ],
    documentationNotes:
      "Document all payroll testing. Retain nominal roll / payroll reconciliation, sample personnel files, biometric cross-reference, and statutory deduction verification schedules.",
    sortOrder: 2,
  },
  {
    id: "sec-assets",
    title: "Assets",
    auditObjectives: [
      "To verify the existence, completeness, and proper valuation of fixed assets.",
      "To confirm that capital project expenditure is properly authorised and accounted for.",
      "To ensure asset disposals are properly approved and proceeds recorded.",
    ],
    riskLevel: "Medium",
    keyRisks: [
      "Unrecorded or fictitious assets",
      "Assets not physically verified or without identification tags",
      "Improper disposal without authorisation",
      "Capital projects not completed as per contract specifications",
    ],
    documentationNotes:
      "Retain asset register extracts, physical verification reports, photographs, disposal approval documents, and asset reconciliation schedules.",
    sortOrder: 3,
  },
  {
    id: "sec-expenditure",
    title: "Expenditure",
    auditObjectives: [
      "To verify that all expenditure is properly authorised and supported by adequate documentation.",
      "To confirm expenditure is correctly classified and within approved budget provisions.",
      "To assess completeness of liabilities at period end.",
    ],
    riskLevel: "High",
    keyRisks: [
      "Expenditure recorded without proper authorisation",
      "Fictitious or inflated payment vouchers",
      "Misclassification of expenditure heads",
      "Unrecorded liabilities at period end (completeness)",
    ],
    documentationNotes:
      "Retain payment voucher samples, LPOs, quotations, budget variance analysis, post-period payment listings, and creditors schedules.",
    sortOrder: 4,
  },
];

export const SEED_PROGRAMMES: AuditProgramme[] = [
  {
    id: "prog-2",
    auditId: "audit-2",
    objectives:
      "To express an opinion on the financial statements and procurement compliance of Alimosho LGA",
    scope:
      "All financial transactions with a focus on procurement processes and revenue receipts for FY 2025",
    riskAreas: ["Procurement & Contracts", "Revenue & Receipts"],
    sections: [
      {
        id: "sec-201",
        title: "Procurement & Contracts",
        auditObjectives: [
          "Verify compliance with Public Procurement Law",
          "Ensure value for money",
        ],
        riskLevel: "Critical",
        keyRisks: [
          "Non-compliance with Public Procurement Act",
          "Overpayment for goods/services not delivered",
        ],
        documentationNotes:
          "Document all contracts sampled and their compliance status.",
        sortOrder: 1,
      },
      {
        id: "sec-202",
        title: "Revenue & Receipts",
        auditObjectives: ["Verify completeness of revenue recorded"],
        riskLevel: "High",
        keyRisks: [
          "Unrecorded receipts (completeness)",
          "Fictitious revenue (existence)",
        ],
        documentationNotes: "Agree all revenue summaries to bank statements.",
        sortOrder: 2,
      },
    ],
    procedures: [
      {
        id: "proc-p1",
        area: "Procurement & Contracts",
        procedure:
          "Select a sample of 25 capital contracts and verify the tender process and approvals.",
        assertion: "Rights & Obligations",
        assignedTo: "user-auditor-5",
        status: "Not Started",
      },
      {
        id: "proc-r2",
        area: "Revenue & Receipts",
        procedure:
          "Perform analytical procedures on monthly IGR trends to identify unusual fluctuations.",
        assertion: "Completeness",
        assignedTo: "user-lead-2",
        status: "Not Started",
      },
    ],
    status: "Draft",
    preparedBy: "user-lead-2",
  },
  {
    id: "prog-1",
    auditId: "audit-1",
    objectives:
      "To express an opinion on the financial statements of Mushin LGA for FY 2025",
    scope:
      "All financial transactions, assets, liabilities and equity for the period 1 January to 31 December 2025",
    riskAreas: ["Revenue", "Payroll", "Assets", "Expenditure"],
    sections: SEED_SECTIONS,
    procedures: [
      /* ── Revenue procedures ── */
      {
        id: "proc-r1",
        area: "Revenue",
        procedure:
          "Obtain and review the schedule of all IGR sources; agree totals to the trial balance and financial statements.",
        assertion: "Completeness",
        natureOfTest: "Substantive",
        expectedEvidence:
          "Revenue schedule, trial balance, financial statements",
        sampleSize: "100% of sources",
        assignedTo: "user-auditor-1",
        status: "In Progress",
        evidenceUploaded: true,
        workpaperRef: "WP-REV-01",
      },
      {
        id: "proc-r2",
        area: "Revenue",
        procedure:
          "Select a sample of revenue receipts and trace from point of collection through to bank lodgement.",
        assertion: "Existence/Occurrence",
        natureOfTest: "Substantive",
        expectedEvidence: "Receipt books, bank tellers, bank statements",
        sampleSize: "30-50 transactions",
        assignedTo: "user-auditor-1",
        status: "In Progress",
        evidenceUploaded: false,
        workpaperRef: "WP-REV-02",
      },
      {
        id: "proc-r3",
        area: "Revenue",
        procedure:
          "Perform analytical review comparing current period revenue to prior year and budget estimates; investigate variances >10%.",
        assertion: "Accuracy/Valuation",
        natureOfTest: "Analytical",
        expectedEvidence: "Comparative revenue analysis workpaper",
        assignedTo: "user-auditor-1",
        status: "Not Started",
        workpaperRef: "WP-REV-03",
      },
      {
        id: "proc-r4",
        area: "Revenue",
        procedure:
          "Test design and operating effectiveness of controls over revenue collection, receipting, and bank lodgement.",
        assertion: "Completeness",
        natureOfTest: "Control",
        expectedEvidence: "Walkthrough documentation, control test results",
        assignedTo: "user-auditor-1",
        status: "Not Started",
        workpaperRef: "WP-REV-04",
      },
      {
        id: "proc-r5",
        area: "Revenue",
        procedure:
          "Review revenue disclosures in the financial statements for compliance with applicable IPSAS standards.",
        assertion: "Presentation & Disclosure",
        natureOfTest: "Inspection",
        expectedEvidence: "Financial statements, disclosure checklist",
        assignedTo: "user-auditor-1",
        status: "Not Started",
        workpaperRef: "WP-REV-05",
      },
      /* ── Payroll procedures ── */
      {
        id: "proc-p1",
        area: "Payroll",
        procedure:
          "Reconcile the nominal roll to the payroll register; identify discrepancies between HR records and payroll listing.",
        assertion: "Existence/Occurrence",
        natureOfTest: "Substantive",
        expectedEvidence:
          "Nominal roll, payroll register, reconciliation schedule",
        assignedTo: "user-auditor-2",
        status: "In Progress",
        evidenceUploaded: false,
        workpaperRef: "WP-PAY-01",
      },
      {
        id: "proc-p2",
        area: "Payroll",
        procedure:
          "Cross-reference payroll data with biometric attendance records; flag personnel on payroll but absent from biometric system.",
        assertion: "Existence/Occurrence",
        natureOfTest: "Analytical",
        expectedEvidence:
          "Biometric data export, payroll listing, exception report",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-PAY-02",
      },
      {
        id: "proc-p3",
        area: "Payroll",
        procedure:
          "Select sample of personnel files and verify: (a) valid appointment letters, (b) correct grade level, (c) accurate salary computation.",
        assertion: "Accuracy/Valuation",
        natureOfTest: "Substantive",
        expectedEvidence: "Personnel files, salary structure table",
        sampleSize: "25-40 personnel files",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-PAY-03",
      },
      {
        id: "proc-p4",
        area: "Payroll",
        procedure:
          "Verify statutory deductions (PAYE, Pension, NHF) are correctly computed and remitted within statutory timelines.",
        assertion: "Accuracy/Valuation",
        natureOfTest: "Substantive",
        expectedEvidence:
          "Deduction schedules, remittance receipts, PFA confirmations",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-PAY-04",
      },
      /* ── Assets procedures ── */
      {
        id: "proc-a1",
        area: "Assets",
        procedure:
          "Obtain the asset register and agree totals to financial statements; test a sample of asset additions and disposals.",
        assertion: "Completeness",
        natureOfTest: "Substantive",
        expectedEvidence:
          "Asset register, financial statements, purchase invoices",
        sampleSize: "20-30 assets",
        assignedTo: "user-auditor-1",
        status: "Not Started",
        workpaperRef: "WP-AST-01",
      },
      {
        id: "proc-a2",
        area: "Assets",
        procedure:
          "Physically verify a sample of high-value assets; confirm existence, condition, location, and identification tags.",
        assertion: "Existence/Occurrence",
        natureOfTest: "Inspection",
        expectedEvidence: "Physical verification report, asset tag photos",
        sampleSize: "20 assets",
        assignedTo: "user-auditor-1",
        status: "Not Started",
        workpaperRef: "WP-AST-02",
      },
      {
        id: "proc-a3",
        area: "Assets",
        procedure:
          "Review asset disposal procedures for proper authorisation, competitive bidding, and proceeds tracing to council accounts.",
        assertion: "Rights & Obligations",
        natureOfTest: "Substantive",
        expectedEvidence:
          "Disposal approval, tender documents, receipt vouchers",
        assignedTo: "user-auditor-1",
        status: "Not Started",
        workpaperRef: "WP-AST-03",
      },
      /* ── Expenditure procedures ── */
      {
        id: "proc-e1",
        area: "Expenditure",
        procedure:
          "Select sample of payment vouchers and verify: (a) proper authorisation, (b) adequate supporting documents, (c) correct budget classification.",
        assertion: "Existence/Occurrence",
        natureOfTest: "Substantive",
        expectedEvidence: "Payment vouchers, LPOs, quotations, approval memos",
        sampleSize: "50-80 vouchers",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-EXP-01",
      },
      {
        id: "proc-e2",
        area: "Expenditure",
        procedure:
          "Perform budget vs actual analysis across all expenditure heads; investigate variances exceeding 15% or any budget overruns.",
        assertion: "Accuracy/Valuation",
        natureOfTest: "Analytical",
        expectedEvidence: "Budget variance analysis workpaper",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-EXP-02",
      },
      {
        id: "proc-e3",
        area: "Expenditure",
        procedure:
          "Test controls over the expenditure cycle: segregation of requisition, approval, payment, and recording functions.",
        assertion: "Rights & Obligations",
        natureOfTest: "Control",
        expectedEvidence: "Walkthrough notes, organisational chart",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-EXP-03",
      },
      {
        id: "proc-e4",
        area: "Expenditure",
        procedure:
          "Search for unrecorded liabilities by examining post-period payments and outstanding commitments at year end.",
        assertion: "Completeness",
        natureOfTest: "Substantive",
        expectedEvidence: "Post-period payment list, creditors schedule",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-EXP-04",
      },
    ],
    status: "Approved",
    preparedBy: "Mr. Adewale Ogunjobi",
    submittedAt: "2026-02-28T10:00:00Z",
    approvedBy: "Mrs. Folashade Adekunle",
    approvedAt: "2026-03-01T09:00:00Z",
  },
];

/* ─── Standardised Audit Work Programme Templates ─── */

export const PROGRAMME_TEMPLATES: ProgrammeTemplate[] = [
  {
    id: "tpl-financial",
    name: "Financial Audit Programme",
    auditType: "Financial",
    description:
      "Standardised audit work programme for the financial audit of LGA/LCDA accounts in accordance with ISSAI, ISA and IPSAS standards.",
    methodology:
      "Risk-based audit approach combining tests of controls with substantive procedures. Emphasis on assertion-level testing, analytical procedures, and corroborative inquiry per ISA 500/530.",
    sections: [
      {
        title: "Revenue & Receipts",
        objective:
          "To confirm that all revenue is completely and accurately recorded, properly classified, and lodged intact to designated bank accounts.",
        riskLevel: "High",
        sortOrder: 1,
        procedures: [
          {
            area: "Revenue & Receipts",
            procedure:
              "Obtain and review the schedule of all IGR sources; agree totals to the trial balance and financial statements.",
            assertion: "Completeness",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Revenue schedule, trial balance, financial statements",
            sampleSize: "100% of sources",
          },
          {
            area: "Revenue & Receipts",
            procedure:
              "Select a sample of revenue receipts and trace from point of collection through to bank lodgement, verifying amounts and timeliness.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Substantive",
            expectedEvidence: "Receipt books, bank tellers, bank statements",
            sampleSize: "30-50 transactions",
          },
          {
            area: "Revenue & Receipts",
            procedure:
              "Perform analytical review comparing current period revenue to prior year and budget estimates; investigate significant variances (>10%).",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence: "Comparative revenue analysis workpaper",
          },
          {
            area: "Revenue & Receipts",
            procedure:
              "Test the design and operating effectiveness of controls over revenue collection, receipting, and bank lodgement processes.",
            assertion: "Completeness",
            natureOfTest: "Control",
            expectedEvidence: "Walkthrough documentation, control test results",
          },
          {
            area: "Revenue & Receipts",
            procedure:
              "Confirm revenue sharing allocations (FAAC, VAT, Statutory) by obtaining independent confirmation from JAAC and reconciling to council records.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Substantive",
            expectedEvidence: "JAAC allocation letters, bank credit advices",
          },
        ],
      },
      {
        title: "Expenditure & Payments",
        objective:
          "To verify that all expenditure is properly authorised, supported by adequate documentation, correctly classified, and within approved budget provisions.",
        riskLevel: "High",
        sortOrder: 2,
        procedures: [
          {
            area: "Expenditure & Payments",
            procedure:
              "Select sample of payment vouchers and verify: (a) proper authorisation per approval hierarchy, (b) adequate supporting documents, (c) correct budget classification.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Payment vouchers, LPOs, quotations, approval memos",
            sampleSize: "50-80 vouchers",
          },
          {
            area: "Expenditure & Payments",
            procedure:
              "Perform budget vs actual analysis across all expenditure heads; investigate variances exceeding 15% or any budget overruns.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence: "Budget variance analysis workpaper",
          },
          {
            area: "Expenditure & Payments",
            procedure:
              "Test controls over the expenditure cycle: segregation of requisition, approval, payment, and recording functions.",
            assertion: "Rights & Obligations",
            natureOfTest: "Control",
            expectedEvidence: "Walkthrough notes, organisational chart",
          },
          {
            area: "Expenditure & Payments",
            procedure:
              "Search for unrecorded liabilities by examining post-period payments and outstanding commitments at year end.",
            assertion: "Completeness",
            natureOfTest: "Substantive",
            expectedEvidence: "Post-period payment list, creditors schedule",
          },
          {
            area: "Expenditure & Payments",
            procedure:
              "Vouch all expenditure items above materiality threshold to original source documents and confirm delivery of goods/services.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Delivery notes, completion certificates, inspection reports",
            sampleSize: "All items above N5M",
          },
        ],
      },
      {
        title: "Payroll & Personnel Costs",
        objective:
          "To confirm that payroll expenditure relates only to bona fide employees, is accurately computed, properly authorised, and correctly classified.",
        riskLevel: "Critical",
        sortOrder: 3,
        procedures: [
          {
            area: "Payroll & Personnel Costs",
            procedure:
              "Reconcile the nominal roll to the payroll register; identify any discrepancies between HR records and payroll listing.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Nominal roll, payroll register, reconciliation schedule",
          },
          {
            area: "Payroll & Personnel Costs",
            procedure:
              "Cross-reference payroll data with biometric attendance records; flag personnel appearing on payroll but absent from biometric system.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Analytical",
            expectedEvidence:
              "Biometric data export, payroll listing, exception report",
          },
          {
            area: "Payroll & Personnel Costs",
            procedure:
              "Select sample of personnel files and verify: (a) valid appointment letters, (b) correct grade level and step, (c) accurate salary computation.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Substantive",
            expectedEvidence: "Personnel files, salary structure table",
            sampleSize: "25-40 personnel files",
          },
          {
            area: "Payroll & Personnel Costs",
            procedure:
              "Test controls over payroll changes (new hires, terminations, promotions, pay adjustments) for proper authorisation.",
            assertion: "Completeness",
            natureOfTest: "Control",
            expectedEvidence: "Change authorisation forms, board resolutions",
          },
          {
            area: "Payroll & Personnel Costs",
            procedure:
              "Verify statutory deductions (PAYE, Pension, NHF) are correctly computed and remitted to appropriate agencies within statutory timelines.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Deduction schedules, remittance receipts, PFA confirmations",
          },
        ],
      },
      {
        title: "Bank & Cash Management",
        objective:
          "To confirm that all bank accounts are properly authorised, balances are accurately stated, and cash handling procedures are adequate.",
        riskLevel: "High",
        sortOrder: 4,
        procedures: [
          {
            area: "Bank & Cash Management",
            procedure:
              "Obtain list of all bank accounts; confirm each account is properly authorised and obtain independent bank confirmations for all accounts.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Substantive",
            expectedEvidence: "Bank mandate list, bank confirmation letters",
          },
          {
            area: "Bank & Cash Management",
            procedure:
              "Re-perform bank reconciliation for all accounts as at year end; investigate all reconciling items older than 30 days.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Bank statements, cashbooks, reconciliation statements",
          },
          {
            area: "Bank & Cash Management",
            procedure:
              "Conduct surprise cash count of treasury and imprest holders; reconcile physical cash to records.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Inspection",
            expectedEvidence: "Cash count certificate, imprest register",
          },
          {
            area: "Bank & Cash Management",
            procedure:
              "Test controls over bank signatories, transfer limits, and dual authorisation requirements.",
            assertion: "Rights & Obligations",
            natureOfTest: "Control",
            expectedEvidence: "Bank mandate, signatory list, transaction logs",
          },
        ],
      },
      {
        title: "Procurement & Contracts",
        objective:
          "To verify that procurement activities comply with the Public Procurement Act, due process requirements are met, and value for money is achieved.",
        riskLevel: "High",
        sortOrder: 5,
        procedures: [
          {
            area: "Procurement & Contracts",
            procedure:
              "Select sample of contracts and verify: (a) competitive bidding where required, (b) due process certification, (c) Tenders Board approval.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Bid documents, evaluation reports, due process certificates",
            sampleSize: "All contracts above N5M + sample below",
          },
          {
            area: "Procurement & Contracts",
            procedure:
              "Review contract register for completeness; verify all awarded contracts are captured with correct values and contractor details.",
            assertion: "Completeness",
            natureOfTest: "Substantive",
            expectedEvidence: "Contract register, award letters",
          },
          {
            area: "Procurement & Contracts",
            procedure:
              "Test for contract splitting by analysing related contracts awarded to same vendor or for similar scope within close timeframes.",
            assertion: "Presentation & Disclosure",
            natureOfTest: "Analytical",
            expectedEvidence:
              "Contract analysis workpaper, vendor payment history",
          },
          {
            area: "Procurement & Contracts",
            procedure:
              "For capital projects, conduct physical inspection of selected projects; compare with contract specifications and milestone claims.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Observation",
            expectedEvidence:
              "Site inspection reports, photographs, engineers' certificates",
            sampleSize: "5-10 projects",
          },
        ],
      },
      {
        title: "Fixed Assets & Capital Projects",
        objective:
          "To verify the existence, completeness, and proper valuation of fixed assets, and that capital project expenditure is properly authorised and accounted for.",
        riskLevel: "Medium",
        sortOrder: 6,
        procedures: [
          {
            area: "Fixed Assets & Capital Projects",
            procedure:
              "Obtain the asset register and agree totals to the financial statements; test a sample of asset additions and disposals during the period.",
            assertion: "Completeness",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Asset register, financial statements, purchase invoices, disposal approvals",
            sampleSize: "20-30 assets",
          },
          {
            area: "Fixed Assets & Capital Projects",
            procedure:
              "Physically verify a sample of high-value assets from the register; confirm existence, condition, location, and identification tags.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Inspection",
            expectedEvidence: "Physical verification report, asset tag photos",
            sampleSize: "20 assets",
          },
          {
            area: "Fixed Assets & Capital Projects",
            procedure:
              "Test completeness by selecting assets observed during site visits not found in register (reverse testing).",
            assertion: "Completeness",
            natureOfTest: "Observation",
            expectedEvidence: "Reverse verification schedule",
          },
          {
            area: "Fixed Assets & Capital Projects",
            procedure:
              "Review asset disposal procedures for proper authorisation, competitive bidding, and proceeds tracing to council accounts.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Disposal approval, tender documents, receipt vouchers",
          },
        ],
      },
    ],
  },
  {
    id: "tpl-compliance",
    name: "Compliance Audit Programme",
    auditType: "Compliance",
    description:
      "Standardised programme for assessing compliance with applicable laws, regulations, and internal policies governing LGA/LCDA operations.",
    methodology:
      "Criteria-based audit approach testing compliance with the Constitution (S.7), Local Government Law, Public Finance Management Act, Public Procurement Act, Financial Regulations, and applicable circulars.",
    sections: [
      {
        title: "Financial Regulations Compliance",
        objective:
          "To assess compliance with Financial Regulations, Treasury Circulars, and extant financial management directives.",
        riskLevel: "High",
        sortOrder: 1,
        procedures: [
          {
            area: "Financial Regulations Compliance",
            procedure:
              "Obtain and review copies of all applicable financial regulations and circulars; confirm awareness and availability at council level.",
            assertion: "Rights & Obligations",
            natureOfTest: "Inquiry",
            expectedEvidence:
              "Copies of regulations, staff acknowledgement records",
          },
          {
            area: "Financial Regulations Compliance",
            procedure:
              "Test a sample of financial transactions for compliance with: approval thresholds, documentation requirements, and recording timelines.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence: "Transaction files, approval records",
            sampleSize: "40-60 transactions",
          },
          {
            area: "Financial Regulations Compliance",
            procedure:
              "Review the operation of the internal audit function: reporting lines, scope of work, and follow-up on recommendations.",
            assertion: "Completeness",
            natureOfTest: "Inquiry",
            expectedEvidence:
              "Internal audit reports, terms of reference, organogram",
          },
          {
            area: "Financial Regulations Compliance",
            procedure:
              "Assess the maintenance of proper books of accounts including cashbooks, ledgers, and votes book as required by regulations.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Inspection",
            expectedEvidence: "Accounting records, cashbooks, vote book",
          },
        ],
      },
      {
        title: "Procurement Law Compliance",
        objective:
          "To evaluate adherence to the Public Procurement Act and Bureau of Public Procurement guidelines.",
        riskLevel: "Critical",
        sortOrder: 2,
        procedures: [
          {
            area: "Procurement Law Compliance",
            procedure:
              "Map the council's procurement process against the requirements of the Public Procurement Act; document all deviations.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Process mapping document, PPA requirements checklist",
          },
          {
            area: "Procurement Law Compliance",
            procedure:
              "Verify that all procurement above the threshold was competitively tendered and received Due Process certification prior to award.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Tender documents, due process certificates, award letters",
            sampleSize: "All contracts above threshold",
          },
          {
            area: "Procurement Law Compliance",
            procedure:
              "Examine the composition and minutes of the Tenders Board to confirm proper constitution and decision-making procedures.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Inspection",
            expectedEvidence: "Tenders Board minutes, membership list",
          },
          {
            area: "Procurement Law Compliance",
            procedure:
              "Test for prohibited practices: sole sourcing without justification, contract splitting, conflict of interest declarations.",
            assertion: "Rights & Obligations",
            natureOfTest: "Analytical",
            expectedEvidence:
              "Vendor analysis, COI declarations, contract timeline analysis",
          },
        ],
      },
      {
        title: "Human Resource & Payroll Compliance",
        objective:
          "To confirm that staff recruitment, posting, promotion, and payroll processes comply with Public Service Rules and establishment guidelines.",
        riskLevel: "High",
        sortOrder: 3,
        procedures: [
          {
            area: "HR & Payroll Compliance",
            procedure:
              "Verify that recruitment follows established procedures: advertisement, interview panel, offer/acceptance documentation.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Recruitment files, advertisement clippings, panel reports",
            sampleSize: "All hires in audit period",
          },
          {
            area: "HR & Payroll Compliance",
            procedure:
              "Test pension and PAYE remittance compliance: correct computation, timely deduction, and prompt remittance to statutory agencies.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Deduction schedules, remittance receipts, penalty notices",
          },
          {
            area: "HR & Payroll Compliance",
            procedure:
              "Review promotions and grade-level changes for compliance with Public Service Rules and approval requirements.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Promotion letters, board minutes, establishment records",
          },
        ],
      },
      {
        title: "Statutory Reporting & Accountability",
        objective:
          "To assess whether the council meets its statutory obligation to prepare and submit financial statements and respond to audit queries.",
        riskLevel: "Medium",
        sortOrder: 4,
        procedures: [
          {
            area: "Statutory Reporting & Accountability",
            procedure:
              "Confirm that annual financial statements are prepared within the statutory time frame and conform to the prescribed format.",
            assertion: "Presentation & Disclosure",
            natureOfTest: "Inspection",
            expectedEvidence: "Financial statements, submission receipts",
          },
          {
            area: "Statutory Reporting & Accountability",
            procedure:
              "Review status of prior-year audit recommendations and Public Accounts Committee (PAC) directives; document implementation status.",
            assertion: "Completeness",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Prior audit reports, PAC directives, status tracker",
          },
          {
            area: "Statutory Reporting & Accountability",
            procedure:
              "Verify that quarterly returns to the State Ministry of Local Government are prepared and submitted as required.",
            assertion: "Cut-off",
            natureOfTest: "Inspection",
            expectedEvidence: "Quarterly returns, submission acknowledgements",
          },
        ],
      },
    ],
  },
  {
    id: "tpl-performance",
    name: "Performance Audit Programme",
    auditType: "Performance",
    description:
      "Standardised programme for evaluating the economy, efficiency, and effectiveness of council programmes, projects, and service delivery.",
    methodology:
      "Value-for-money approach applying the 3Es framework (Economy, Efficiency, Effectiveness) per ISSAI 3000/3100 standards. Combines quantitative analysis with qualitative assessment of outcomes.",
    sections: [
      {
        title: "Economy Assessment",
        objective:
          "To evaluate whether council resources were acquired at the lowest cost consistent with the required quality and quantity.",
        riskLevel: "High",
        sortOrder: 1,
        procedures: [
          {
            area: "Economy Assessment",
            procedure:
              "Compare unit costs of goods and services procured against market benchmarks and prices obtained by comparable councils.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence: "Price comparison schedule, market survey data",
          },
          {
            area: "Economy Assessment",
            procedure:
              "Analyse personnel costs as a percentage of total expenditure; benchmark against recommended ratios and comparable councils.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence: "Personnel cost analysis workpaper",
          },
          {
            area: "Economy Assessment",
            procedure:
              "Review major contract awards for evidence of competitive pricing and cost negotiation.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Substantive",
            expectedEvidence: "Bid comparison sheets, negotiation records",
            sampleSize: "10 largest contracts",
          },
        ],
      },
      {
        title: "Efficiency Assessment",
        objective:
          "To assess whether outputs (services, projects) are maximised relative to the resources (inputs) consumed.",
        riskLevel: "Medium",
        sortOrder: 2,
        procedures: [
          {
            area: "Efficiency Assessment",
            procedure:
              "Calculate and analyse key efficiency ratios: revenue collection cost ratio, administrative cost ratio, project completion rate.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence: "Ratio analysis workpaper, financial data",
          },
          {
            area: "Efficiency Assessment",
            procedure:
              "Review project timelines and budgets for selected capital projects; calculate time and cost overruns as a percentage.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence:
              "Project files, milestone reports, variation orders",
            sampleSize: "5-10 projects",
          },
          {
            area: "Efficiency Assessment",
            procedure:
              "Assess the utilisation of council assets (vehicles, equipment, buildings) through usage logs and maintenance records.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Inspection",
            expectedEvidence:
              "Vehicle logbooks, equipment usage records, maintenance logs",
          },
        ],
      },
      {
        title: "Effectiveness Assessment",
        objective:
          "To evaluate whether programmes and projects achieved their intended outcomes and delivered value to the community.",
        riskLevel: "High",
        sortOrder: 3,
        procedures: [
          {
            area: "Effectiveness Assessment",
            procedure:
              "Identify key performance indicators (KPIs) for major council programmes; compare actual results against targets and prior-year performance.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence:
              "Programme KPI reports, budget targets, prior-year data",
          },
          {
            area: "Effectiveness Assessment",
            procedure:
              "Conduct beneficiary assessment for selected community projects through interviews and site visits.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Inquiry",
            expectedEvidence:
              "Interview notes, beneficiary feedback forms, site visit reports",
            sampleSize: "3-5 community projects",
          },
          {
            area: "Effectiveness Assessment",
            procedure:
              "Review service delivery standards and citizen complaint records; assess responsiveness and resolution rates.",
            assertion: "Completeness",
            natureOfTest: "Inspection",
            expectedEvidence:
              "Complaint registers, resolution records, service charters",
          },
          {
            area: "Effectiveness Assessment",
            procedure:
              "Evaluate the quality and sustainability of completed capital projects through physical inspection and engineering assessment.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Observation",
            expectedEvidence:
              "Inspection reports, photographs, engineering certificates",
            sampleSize: "5-8 projects",
          },
        ],
      },
    ],
  },
];

/* ─── Audit Journals (ISA Deliverable) ─── */

export const SEED_AUDIT_JOURNALS: AuditJournal[] = [
  {
    id: "aj-1",
    auditId: "audit-1",
    journalNumber: "AJE-001",
    type: "Adjusting",
    description:
      "To correct under-accrual of salary arrears for Q4 2025 — 47 staff members with confirmed outstanding entitlements per HR records.",
    entries: [
      {
        account: "Personnel Costs — Salary Arrears",
        debit: 15_450_000,
        credit: 0,
      },
      {
        account: "Accrued Liabilities — Staff Costs",
        debit: 0,
        credit: 15_450_000,
      },
    ],
    netEffect: 15_450_000,
    affectedArea: "Payroll & Personnel Costs",
    preparedBy: "user-auditor-1",
    reviewedBy: "user-lead-1",
    status: "Agreed",
    createdAt: "2026-03-10T09:00:00Z",
    workpaperRef: "WP-PAY-03",
  },
  {
    id: "aj-2",
    auditId: "audit-1",
    journalNumber: "AJE-002",
    type: "Adjusting",
    description:
      "To write down impaired capital project costs — Community Health Centre project abandoned at 35% completion.",
    entries: [
      {
        account: "Impairment Loss — Capital Projects",
        debit: 28_700_000,
        credit: 0,
      },
      {
        account: "Work-in-Progress — Capital Projects",
        debit: 0,
        credit: 28_700_000,
      },
    ],
    netEffect: 28_700_000,
    affectedArea: "Fixed Assets & Capital Projects",
    preparedBy: "user-auditor-2",
    reviewedBy: "user-lead-1",
    status: "Proposed",
    createdAt: "2026-03-11T10:30:00Z",
    workpaperRef: "WP-AST-05",
  },
  {
    id: "aj-3",
    auditId: "audit-1",
    journalNumber: "RJE-001",
    type: "Reclassifying",
    description:
      "To reclassify capital grant incorrectly posted to recurrent revenue — SUBEB Education Grant FY2025.",
    entries: [
      { account: "Recurrent Revenue — Grants", debit: 42_000_000, credit: 0 },
      { account: "Capital Revenue — Grants", debit: 0, credit: 42_000_000 },
    ],
    netEffect: 0,
    affectedArea: "Revenue & Receipts",
    preparedBy: "user-auditor-1",
    status: "Posted",
    createdAt: "2026-03-12T14:00:00Z",
    workpaperRef: "WP-REV-02",
  },
  {
    id: "aj-4",
    auditId: "audit-1",
    journalNumber: "AJE-003",
    type: "Adjusting",
    description:
      "To record unrecorded creditors identified from post-year-end payment testing (12 invoices dated prior to year end).",
    entries: [
      {
        account: "Works & Maintenance Expenditure",
        debit: 8_350_000,
        credit: 0,
      },
      {
        account: "Accounts Payable — Trade Creditors",
        debit: 0,
        credit: 8_350_000,
      },
    ],
    netEffect: 8_350_000,
    affectedArea: "Expenditure & Payments",
    preparedBy: "user-auditor-2",
    status: "Draft",
    createdAt: "2026-03-13T11:00:00Z",
  },
  {
    id: "aj-5",
    auditId: "audit-1",
    journalNumber: "PJE-001",
    type: "Passed",
    description:
      "Unadjusted difference: Minor classification variance in stationery vs office supplies below clearly trivial threshold.",
    entries: [
      { account: "Office Supplies", debit: 125_000, credit: 0 },
      { account: "Stationery Expense", debit: 0, credit: 125_000 },
    ],
    netEffect: 0,
    affectedArea: "Expenditure & Payments",
    preparedBy: "user-lead-1",
    status: "Waived",
    createdAt: "2026-03-14T09:30:00Z",
    workpaperRef: "WP-EXP-08",
  },
];

/* ─── Audit Comments / Management Letter Points (ISA Deliverable) ─── */

export const SEED_AUDIT_COMMENTS: AuditComment[] = [
  {
    id: "ac-1",
    auditId: "audit-1",
    referenceNumber: "MC-2025-001",
    title: "Inadequate Bank Reconciliation Procedures",
    observation:
      "Bank reconciliation statements for 3 of 7 council bank accounts were not prepared for 4 consecutive months (August–November 2025). Outstanding items on remaining reconciliations included stale cheques older than 6 months totalling ₦12.4M.",
    criteria:
      "Financial Regulation 1606 requires monthly reconciliation of all bank accounts. ISA 330 mandates testing of reconciliation controls.",
    cause:
      "Vacancy in treasury reconciliation officer position since June 2025 with no interim cover arranged.",
    effect:
      "Increased risk of undetected errors or misappropriation in bank transactions. ₦12.4M in stale items may represent unrealisable amounts.",
    recommendation:
      "Management should (1) immediately fill the reconciliation officer vacancy, (2) complete all outstanding reconciliations within 30 days, (3) investigate and write off confirmed stale items with proper approval.",
    managementResponse:
      "Noted. Recruitment process initiated. All reconciliations will be brought up to date by end of Q1 2026.",
    severity: "High",
    status: "Agreed",
    responsibleParty: "Treasurer",
    targetDate: "2026-06-30",
    preparedBy: "user-auditor-1",
    reviewedBy: "user-lead-1",
    createdAt: "2026-03-08T10:00:00Z",
  },
  {
    id: "ac-2",
    auditId: "audit-1",
    referenceNumber: "MC-2025-002",
    title: "Non-Compliance with Procurement Due Process",
    observation:
      "8 out of 15 contracts sampled (53%) above ₦5M threshold lacked Due Process certification from the Bureau of Public Procurement prior to award. Total value of non-compliant contracts: ₦187M.",
    criteria:
      "Public Procurement Act 2007, Sections 16 & 28 require prior certification for all contracts above threshold.",
    cause:
      "Pressure to meet project delivery timelines led to bypassing the certification process. Lack of internal monitoring mechanism for procurement compliance.",
    effect:
      "Council exposed to legal liability. Value for money not assured for ₦187M in expenditure. Potential for fraud or collusion.",
    recommendation:
      "Management should (1) enforce mandatory Due Process certification as a pre-condition for payment, (2) implement a procurement compliance checklist in the ERP system, (3) conduct compliance training for all procurement officers.",
    severity: "Critical",
    status: "Discussed",
    responsibleParty: "Head of Procurement",
    targetDate: "2026-07-31",
    preparedBy: "user-auditor-2",
    reviewedBy: "user-lead-1",
    createdAt: "2026-03-09T14:00:00Z",
  },
  {
    id: "ac-3",
    auditId: "audit-1",
    referenceNumber: "MC-2025-003",
    title: "Weak Controls Over IGR Collection",
    observation:
      "Manual receipt books still in use for 40% of IGR collection points. No reconciliation between receipt books and bank deposits at 6 out of 10 revenue collection points.",
    criteria:
      "Lagos State Revenue Administration Law requires electronic receipting. Financial Regulation 406 requires daily reconciliation of collections.",
    cause:
      "Incomplete rollout of the automated revenue collection platform. Budget constraints delayed procurement of POS devices at satellite offices.",
    effect:
      "Revenue leakage estimated at ₦15-25M annually based on analytical comparison with comparable councils. ₦8.2M variance between receipts issued and bank lodgements remains unexplained.",
    recommendation:
      "Complete the electronic receipting rollout across all collection points. Investigate the ₦8.2M unexplained variance and hold responsible officers accountable.",
    severity: "High",
    status: "Agreed",
    responsibleParty: "Revenue Manager",
    targetDate: "2026-09-30",
    preparedBy: "user-lead-1",
    createdAt: "2026-03-10T09:00:00Z",
  },
  {
    id: "ac-4",
    auditId: "audit-1",
    referenceNumber: "MC-2025-004",
    title: "Ghost Worker Indicators in Payroll Data",
    observation:
      "Biometric cross-reference analysis identified 12 employees on the payroll who have no biometric attendance records for 6+ consecutive months. Combined annual salary cost: ₦18.6M. Additionally, 3 employees have identical bank account numbers for salary remittance.",
    criteria:
      "Civil Service Rules require regular attendance monitoring. ISA 240 requires assessment of fraud indicators.",
    cause:
      "Biometric attendance system not linked to payroll processing. Manual payroll preparation without automated validation checks.",
    effect:
      "Potential payroll fraud exposure of up to ₦18.6M per annum. Identical bank accounts may indicate ghost workers or diversion of funds.",
    recommendation:
      "Immediately suspend salary payments for flagged employees pending physical verification. Integrate biometric system with payroll module. Refer findings to anti-corruption unit for investigation.",
    managementResponse:
      "Payments suspended for investigation. Full verification exercise to be conducted within 60 days.",
    severity: "Critical",
    status: "Reported",
    responsibleParty: "Head of HR / Internal Audit",
    targetDate: "2026-05-31",
    preparedBy: "user-auditor-2",
    reviewedBy: "user-lead-1",
    createdAt: "2026-03-11T11:00:00Z",
  },
  {
    id: "ac-5",
    auditId: "audit-1",
    referenceNumber: "MC-2025-005",
    title: "Fixed Asset Register Deficiencies",
    observation:
      "Asset register last updated in March 2024. Physical verification revealed 23 assets not in register (reverse testing) and 15 register items could not be physically located. No depreciation schedule maintained.",
    criteria:
      "IPSAS 17 requires maintenance of complete and accurate asset registers with systematic depreciation. Financial Regulation 2601 requires annual asset verification.",
    cause:
      "No dedicated asset management officer. Last comprehensive asset verification conducted 3 years ago.",
    effect:
      "Financial statements may be materially misstated for property, plant and equipment. Risk of asset theft or misuse undetected.",
    recommendation:
      "Commission a comprehensive asset verification and update the register. Appoint a dedicated asset management officer. Implement depreciation policy per IPSAS 17.",
    severity: "Medium",
    status: "Draft",
    responsibleParty: "Stores Officer / Accounting",
    preparedBy: "user-auditor-1",
    createdAt: "2026-03-12T15:00:00Z",
  },
];

/* ─── Financial Statements Tracking (ISA Deliverable) ─── */

export const SEED_FINANCIAL_STATEMENTS: FinancialStatementItem[] = [
  {
    id: "fs-1",
    auditId: "audit-1",
    statementType: "Statement of Financial Position",
    status: "Adjusted",
    draftReceivedDate: "2026-02-15",
    adjustmentsCount: 3,
    adjustmentsAmount: 52_500_000,
    reviewedBy: "user-lead-1",
    notes:
      "3 adjustments agreed: salary arrears accrual (₦15.45M), project impairment (₦28.7M), unrecorded creditors (₦8.35M).",
  },
  {
    id: "fs-2",
    auditId: "audit-1",
    statementType: "Statement of Financial Performance",
    status: "Adjusted",
    draftReceivedDate: "2026-02-15",
    adjustmentsCount: 2,
    adjustmentsAmount: 57_450_000,
    reviewedBy: "user-lead-1",
    notes:
      "Revenue reclassification (₦42M) and expenditure accrual adjustments applied.",
  },
  {
    id: "fs-3",
    auditId: "audit-1",
    statementType: "Cash Flow Statement",
    status: "Under Review",
    draftReceivedDate: "2026-02-20",
    adjustmentsCount: 0,
    adjustmentsAmount: 0,
    notes:
      "Awaiting final adjustments to the income statement before cash flow can be finalised.",
  },
  {
    id: "fs-4",
    auditId: "audit-1",
    statementType: "Statement of Changes in Net Assets/Equity",
    status: "Received",
    draftReceivedDate: "2026-02-20",
    adjustmentsCount: 0,
    adjustmentsAmount: 0,
    notes: "Draft received; to be reviewed once adjustments are finalised.",
  },
  {
    id: "fs-5",
    auditId: "audit-1",
    statementType: "Notes to the Financial Statements",
    status: "Under Review",
    draftReceivedDate: "2026-02-25",
    adjustmentsCount: 1,
    adjustmentsAmount: 0,
    reviewedBy: "user-auditor-1",
    notes:
      "Disclosure of related party transactions incomplete. Additional note required for contingent liabilities (pending litigation).",
  },
  {
    id: "fs-6",
    auditId: "audit-1",
    statementType: "Budget vs Actual Comparison",
    status: "Final",
    draftReceivedDate: "2026-02-10",
    adjustmentsCount: 0,
    adjustmentsAmount: 0,
    reviewedBy: "user-lead-1",
    finalDate: "2026-03-05",
    notes:
      "Budget comparison statement agrees to approved estimates and actual figures. Significant variances in capital expenditure (62% utilisation) documented.",
  },
];

/* ─── Completion Checklist (ISA Standard) ─── */

export const SEED_COMPLETION_CHECKLIST: CompletionChecklistItem[] = [
  {
    id: "cc-1",
    auditId: "audit-1",
    section: "Going Concern",
    item: "Assess entity's ability to continue as going concern for 12 months from reporting date",
    completed: true,
    completedBy: "user-lead-1",
    completedAt: "2026-03-12T10:00:00Z",
    reference: "WP-PLAN-01",
  },
  {
    id: "cc-2",
    auditId: "audit-1",
    section: "Going Concern",
    item: "Obtain management's going concern assessment and supporting budgets/forecasts",
    completed: true,
    completedBy: "user-lead-1",
    completedAt: "2026-03-12T10:30:00Z",
    reference: "WP-PLAN-01",
  },
  {
    id: "cc-3",
    auditId: "audit-1",
    section: "Subsequent Events",
    item: "Perform subsequent events review procedures up to date of audit report",
    completed: true,
    completedBy: "user-auditor-1",
    completedAt: "2026-03-14T09:00:00Z",
    reference: "WP-COMP-02",
  },
  {
    id: "cc-4",
    auditId: "audit-1",
    section: "Subsequent Events",
    item: "Inquire of management regarding events after reporting period",
    completed: true,
    completedBy: "user-auditor-1",
    completedAt: "2026-03-14T09:30:00Z",
  },
  {
    id: "cc-5",
    auditId: "audit-1",
    section: "Management Representations",
    item: "Obtain signed management representation letter",
    completed: false,
    notes: "Draft sent; awaiting HLGA signature",
  },
  {
    id: "cc-6",
    auditId: "audit-1",
    section: "Management Representations",
    item: "Ensure all specific representations required by audit findings are included",
    completed: false,
  },
  {
    id: "cc-7",
    auditId: "audit-1",
    section: "Analytical Review",
    item: "Perform final overall analytical review of financial statements",
    completed: true,
    completedBy: "user-lead-1",
    completedAt: "2026-03-15T14:00:00Z",
    reference: "WP-COMP-03",
  },
  {
    id: "cc-8",
    auditId: "audit-1",
    section: "Independence & Ethics",
    item: "Confirm team independence and document any threats/safeguards",
    completed: true,
    completedBy: "user-lead-1",
    completedAt: "2026-02-15T08:00:00Z",
    reference: "WP-ADMIN-01",
  },
  {
    id: "cc-9",
    auditId: "audit-1",
    section: "Quality Control",
    item: "Engagement Quality Review (EQR) completed by independent partner",
    completed: false,
    notes: "Scheduled for final review week",
  },
  {
    id: "cc-10",
    auditId: "audit-1",
    section: "File Assembly",
    item: "Assemble audit file within 60 days of audit report date per ISA 230",
    completed: false,
  },
  {
    id: "cc-11",
    auditId: "audit-1",
    section: "Communication with Governance",
    item: "Communicate significant matters to those charged with governance (ISA 260)",
    completed: true,
    completedBy: "user-lead-1",
    completedAt: "2026-03-10T16:00:00Z",
    reference: "WP-COMP-05",
  },
  {
    id: "cc-12",
    auditId: "audit-1",
    section: "Laws & Regulations",
    item: "Consider impact of non-compliance with laws and regulations (ISA 250)",
    completed: true,
    completedBy: "user-auditor-2",
    completedAt: "2026-03-13T11:00:00Z",
    reference: "WP-COMP-06",
  },
  {
    id: "cc-13",
    auditId: "audit-1",
    section: "Related Parties",
    item: "Evaluate related party transactions and disclosures (ISA 550)",
    completed: true,
    completedBy: "user-auditor-1",
    completedAt: "2026-03-13T14:00:00Z",
    reference: "WP-COMP-07",
  },
  {
    id: "cc-14",
    auditId: "audit-1",
    section: "Related Parties",
    item: "Review council members' interests register for undisclosed relationships",
    completed: false,
    notes: "Register requested from Council Secretary",
  },
];

/* ─── Audit Workpapers Index (ISA Standard) ─── */

export const SEED_AUDIT_WORKPAPERS: AuditWorkpaper[] = [
  {
    id: "awp-1",
    auditId: "audit-1",
    reference: "WP-ADMIN-01",
    title: "Engagement Acceptance & Independence",
    category: "Permanent File",
    section: "Administration",
    preparedBy: "user-lead-1",
    preparedAt: "2026-02-10T09:00:00Z",
    reviewedBy: "user-sup-ikeja",
    reviewedAt: "2026-02-12T10:00:00Z",
    status: "Final",
  },
  {
    id: "awp-2",
    auditId: "audit-1",
    reference: "WP-PLAN-01",
    title: "Planning Memorandum & Strategy",
    category: "Planning Memorandum",
    section: "Planning",
    preparedBy: "user-lead-1",
    preparedAt: "2026-02-15T09:00:00Z",
    reviewedBy: "user-sup-ikeja",
    reviewedAt: "2026-02-18T10:00:00Z",
    status: "Final",
  },
  {
    id: "awp-3",
    auditId: "audit-1",
    reference: "WP-PLAN-02",
    title: "Risk Assessment & Materiality Calculation",
    category: "Planning Memorandum",
    section: "Planning",
    preparedBy: "user-lead-1",
    preparedAt: "2026-02-16T09:00:00Z",
    reviewedBy: "user-sup-ikeja",
    reviewedAt: "2026-02-19T10:00:00Z",
    status: "Final",
  },
  {
    id: "awp-4",
    auditId: "audit-1",
    reference: "WP-REV-01",
    title: "Revenue — Lead Schedule",
    category: "Lead Schedule",
    section: "Revenue & Receipts",
    preparedBy: "user-auditor-1",
    preparedAt: "2026-03-01T09:00:00Z",
    reviewedBy: "user-lead-1",
    reviewedAt: "2026-03-03T10:00:00Z",
    status: "Reviewed",
  },
  {
    id: "awp-5",
    auditId: "audit-1",
    reference: "WP-REV-02",
    title: "Revenue — IGR Substantive Tests",
    category: "Supporting Schedule",
    section: "Revenue & Receipts",
    preparedBy: "user-auditor-1",
    preparedAt: "2026-03-02T09:00:00Z",
    status: "Prepared",
    crossReferences: ["WP-REV-01"],
  },
  {
    id: "awp-6",
    auditId: "audit-1",
    reference: "WP-REV-03",
    title: "Revenue — FAAC/VAT Allocation Confirmations",
    category: "Confirmation",
    section: "Revenue & Receipts",
    preparedBy: "user-auditor-1",
    preparedAt: "2026-03-03T09:00:00Z",
    status: "Prepared",
    crossReferences: ["WP-REV-01"],
  },
  {
    id: "awp-7",
    auditId: "audit-1",
    reference: "WP-EXP-01",
    title: "Expenditure — Lead Schedule",
    category: "Lead Schedule",
    section: "Expenditure & Payments",
    preparedBy: "user-auditor-2",
    preparedAt: "2026-03-01T09:00:00Z",
    reviewedBy: "user-lead-1",
    reviewedAt: "2026-03-04T10:00:00Z",
    status: "Reviewed",
  },
  {
    id: "awp-8",
    auditId: "audit-1",
    reference: "WP-EXP-02",
    title: "Expenditure — Vouching Results",
    category: "Supporting Schedule",
    section: "Expenditure & Payments",
    preparedBy: "user-auditor-2",
    preparedAt: "2026-03-05T09:00:00Z",
    status: "Prepared",
    crossReferences: ["WP-EXP-01"],
  },
  {
    id: "awp-9",
    auditId: "audit-1",
    reference: "WP-PAY-01",
    title: "Payroll — Lead Schedule",
    category: "Lead Schedule",
    section: "Payroll & Personnel",
    preparedBy: "user-auditor-2",
    preparedAt: "2026-03-04T09:00:00Z",
    reviewedBy: "user-lead-1",
    reviewedAt: "2026-03-06T10:00:00Z",
    status: "Reviewed",
  },
  {
    id: "awp-10",
    auditId: "audit-1",
    reference: "WP-PAY-03",
    title: "Payroll — Biometric Cross-Reference Analysis",
    category: "Analytical Procedure",
    section: "Payroll & Personnel",
    preparedBy: "user-auditor-2",
    preparedAt: "2026-03-06T09:00:00Z",
    status: "Prepared",
    crossReferences: ["WP-PAY-01"],
    notes: "12 exceptions identified. See Audit Comment MC-2025-004.",
  },
  {
    id: "awp-11",
    auditId: "audit-1",
    reference: "WP-BNK-01",
    title: "Bank & Cash — Lead Schedule",
    category: "Lead Schedule",
    section: "Bank & Cash",
    preparedBy: "user-auditor-1",
    preparedAt: "2026-03-05T09:00:00Z",
    status: "Prepared",
  },
  {
    id: "awp-12",
    auditId: "audit-1",
    reference: "WP-BNK-02",
    title: "Bank Confirmations & Reconciliations",
    category: "Reconciliation",
    section: "Bank & Cash",
    preparedBy: "user-auditor-1",
    preparedAt: "2026-03-06T09:00:00Z",
    status: "Draft",
    notes: "Awaiting 2 bank confirmations.",
  },
  {
    id: "awp-13",
    auditId: "audit-1",
    reference: "WP-AST-01",
    title: "Fixed Assets — Lead Schedule",
    category: "Lead Schedule",
    section: "Fixed Assets",
    preparedBy: "user-auditor-1",
    preparedAt: "2026-03-07T09:00:00Z",
    status: "Prepared",
  },
  {
    id: "awp-14",
    auditId: "audit-1",
    reference: "WP-AST-05",
    title: "Capital Projects — Physical Verification Report",
    category: "Supporting Schedule",
    section: "Fixed Assets",
    preparedBy: "user-auditor-2",
    preparedAt: "2026-03-08T09:00:00Z",
    status: "Prepared",
    crossReferences: ["WP-AST-01"],
    notes: "1 abandoned project identified – AJE-002 raised.",
  },
  {
    id: "awp-15",
    auditId: "audit-1",
    reference: "WP-COMP-01",
    title: "Completion Memorandum",
    category: "Completion Memorandum",
    section: "Completion",
    preparedBy: "user-lead-1",
    preparedAt: "2026-03-15T09:00:00Z",
    status: "Draft",
  },
  {
    id: "awp-16",
    auditId: "audit-1",
    reference: "WP-COMP-05",
    title: "Communication with Those Charged with Governance",
    category: "Minutes & Correspondence",
    section: "Completion",
    preparedBy: "user-lead-1",
    preparedAt: "2026-03-10T16:00:00Z",
    status: "Prepared",
  },
  {
    id: "awp-17",
    auditId: "audit-1",
    reference: "WP-REP-01",
    title: "Management Letter (Draft)",
    category: "Representation Letter",
    section: "Reporting",
    preparedBy: "user-lead-1",
    preparedAt: "2026-03-14T09:00:00Z",
    status: "Draft",
    notes: "5 audit comments included. Awaiting management responses.",
  },
];

export const SEED_ACTIVITY_LOG: ActivityLog[] = [
  {
    id: "log-1",
    userId: "user-ag",
    action: "CREATE_MANDATE",
    details: "Created audit mandate for FY 2025",
    timestamp: "2026-01-15T09:00:00Z",
    entityType: "mandate",
    entityId: "mandate-1",
  },
  {
    id: "log-2",
    userId: "user-ag",
    action: "PUBLISH_MANDATE",
    details: "Published audit mandate for FY 2025",
    timestamp: "2026-01-20T14:00:00Z",
    entityType: "mandate",
    entityId: "mandate-1",
  },
  {
    id: "log-3",
    userId: "user-ag",
    action: "ASSIGN_SUPERVISOR",
    details: "Assigned Mrs. Folashade Adekunle to Ikeja Zone",
    timestamp: "2026-02-01T10:00:00Z",
    entityType: "zone",
    entityId: "zone-1",
  },
  {
    id: "log-4",
    userId: "user-sup-ikeja",
    action: "ASSIGN_LEAD",
    details: "Assigned Mr. Adewale Ogunjobi to Mushin LGA",
    timestamp: "2026-02-15T10:00:00Z",
    entityType: "lga",
    entityId: "lga-4",
  },
  {
    id: "log-5",
    userId: "user-lead-1",
    action: "ACCEPT_ASSIGNMENT",
    details: "Accepted assignment for Mushin LGA audit",
    timestamp: "2026-02-15T14:30:00Z",
    entityType: "invitation",
    entityId: "inv-1",
  },
  {
    id: "log-6",
    userId: "user-lead-1",
    action: "BUILD_TEAM",
    details: "Added Miss Oluwadamilola Ige to audit team",
    timestamp: "2026-02-16T09:00:00Z",
    entityType: "audit",
    entityId: "audit-1",
  },
  {
    id: "log-7",
    userId: "user-auditor-1",
    action: "ACCEPT_ASSIGNMENT",
    details: "Accepted assignment for Mushin LGA audit",
    timestamp: "2026-02-16T11:00:00Z",
    entityType: "invitation",
    entityId: "inv-2",
  },
  {
    id: "log-8",
    userId: "user-lead-1",
    action: "SUBMIT_PROGRAMME",
    details: "Submitted audit programme for review",
    timestamp: "2026-02-28T10:00:00Z",
    entityType: "programme",
    entityId: "prog-1",
  },
];

export const SEED_RISK_MATRICES: RiskMatrix[] = [
  {
    id: "risk-1",
    auditId: "audit-1",
    area: "Expenditure & Payroll (Ghost Workers)",
    inherentRisk: "Critical",
    controlRisk: "High",
    detectionRisk: "Medium",
    overallRisk: "Critical",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-1",
    createdAt: "2026-02-20T10:00:00Z",
  },
  {
    id: "risk-2",
    auditId: "audit-1",
    area: "Inter-Governmental Transfers (SUBEB)",
    inherentRisk: "High",
    controlRisk: "Medium",
    detectionRisk: "Medium",
    overallRisk: "High",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-1",
    createdAt: "2026-02-20T10:30:00Z",
  },
  {
    id: "risk-3",
    auditId: "audit-1",
    area: "Procurement & Capital Expenditure",
    inherentRisk: "Critical",
    controlRisk: "High",
    detectionRisk: "Medium",
    overallRisk: "Critical",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-1",
    createdAt: "2026-02-20T11:00:00Z",
  },
  {
    id: "risk-4",
    auditId: "audit-1",
    area: "Completeness of IGR",
    inherentRisk: "High",
    controlRisk: "High",
    detectionRisk: "Medium",
    overallRisk: "High",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-1",
    createdAt: "2026-02-20T11:30:00Z",
  },
  {
    id: "risk-5",
    auditId: "audit-1",
    area: "Unretired Advances (Intangible Assets)",
    inherentRisk: "High",
    controlRisk: "Medium",
    detectionRisk: "Low",
    overallRisk: "High",
    mitigationPlan: "",
    status: "Mitigated",
    preparedBy: "user-lead-1",
    createdAt: "2026-02-20T12:00:00Z",
  },
  {
    id: "risk-6",
    auditId: "audit-1",
    area: "Budget Overruns & Unapproved Expenditure",
    inherentRisk: "Medium",
    controlRisk: "High",
    detectionRisk: "Low",
    overallRisk: "Medium",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-1",
    createdAt: "2026-02-20T12:30:00Z",
  },
  {
    id: "risk-7",
    auditId: "audit-2",
    area: "Expenditure & Payroll (Ghost Workers)",
    inherentRisk: "High",
    controlRisk: "Low",
    detectionRisk: "Medium",
    overallRisk: "Medium",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-2",
    createdAt: "2026-03-20T10:00:00Z",
  },
  {
    id: "risk-8",
    auditId: "audit-2",
    area: "Completeness of IGR",
    inherentRisk: "Critical",
    controlRisk: "High",
    detectionRisk: "Medium",
    overallRisk: "Critical",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-2",
    createdAt: "2026-03-20T11:00:00Z",
  },
  {
    id: "risk-new-1",
    auditId: "audit-1",
    area: "IT & Systems Security",
    inherentRisk: "High",
    controlRisk: "High",
    detectionRisk: "Low",
    overallRisk: "Critical",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-1",
    createdAt: "2026-02-21T09:00:00Z",
  },
  {
    id: "risk-new-2",
    auditId: "audit-1",
    area: "Market Administration",
    inherentRisk: "Medium",
    controlRisk: "High",
    detectionRisk: "Medium",
    overallRisk: "High",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-1",
    createdAt: "2026-02-21T10:15:00Z",
  },
  {
    id: "risk-new-3",
    auditId: "audit-1",
    area: "Environmental Services",
    inherentRisk: "Medium",
    controlRisk: "High",
    detectionRisk: "Medium",
    overallRisk: "High",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-1",
    createdAt: "2026-02-21T11:30:00Z",
  },
  {
    id: "risk-new-4",
    auditId: "audit-1",
    area: "Pension Administration",
    inherentRisk: "Low",
    controlRisk: "Medium",
    detectionRisk: "Low",
    overallRisk: "Medium",
    mitigationPlan: "",
    status: "Mitigated",
    preparedBy: "user-lead-1",
    createdAt: "2026-02-21T13:45:00Z",
  },
  {
    id: "risk-new-5",
    auditId: "audit-1",
    area: "Vehicle & Transport",
    inherentRisk: "Medium",
    controlRisk: "Medium",
    detectionRisk: "High",
    overallRisk: "Medium",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-1",
    createdAt: "2026-02-21T15:00:00Z",
  },
  {
    id: "risk-6",
    auditId: "audit-3",
    area: "Procurement Compliance",
    inherentRisk: "High",
    controlRisk: "High",
    detectionRisk: "Medium",
    overallRisk: "Critical",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-4",
    createdAt: "2026-03-08T09:00:00Z",
  },
  // Expanded Professional Risk Matrix for other LGAs
  {
    id: "risk-7",
    auditId: "audit-2", // Alimosho
    area: "Environment & Waste Management",
    inherentRisk: "High",
    controlRisk: "High",
    detectionRisk: "Medium",
    overallRisk: "Critical",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-2",
    createdAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "risk-8",
    auditId: "audit-4", // Badagry
    area: "Tourism Revenue Leakage",
    inherentRisk: "High",
    controlRisk: "Medium",
    detectionRisk: "High",
    overallRisk: "Critical",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-3",
    createdAt: "2026-03-06T14:30:00Z",
  },
  {
    id: "risk-9",
    auditId: "audit-5", // Apapa
    area: "Port Ancillary Revenue",
    inherentRisk: "High",
    controlRisk: "High",
    detectionRisk: "Low",
    overallRisk: "High",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-2",
    createdAt: "2026-03-07T09:15:00Z",
  },
  {
    id: "risk-10",
    auditId: "audit-6", // Eti-Osa
    area: "Land Use Charge & Tenement Rates",
    inherentRisk: "Medium",
    controlRisk: "Medium",
    detectionRisk: "Medium",
    overallRisk: "Medium",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-5",
    createdAt: "2026-03-12T11:00:00Z",
  },
  {
    id: "risk-11",
    auditId: "audit-3", // Ajeromi-Ifelodun
    area: "Market Stall Fees",
    inherentRisk: "High",
    controlRisk: "High",
    detectionRisk: "High",
    overallRisk: "Critical",
    mitigationPlan: "",
    status: "Open",
    preparedBy: "user-lead-4",
    createdAt: "2026-03-15T13:45:00Z",
  },
];

export const SEED_MATERIALITY: MaterialityThreshold[] = [
  {
    id: "mat-1",
    auditId: "audit-1",
    overallMateriality: 37500000,
    performanceMateriality: 26250000,
    clearlyTrivialThreshold: 1312500,
    basis: "Surplus / (Deficit)",
    basisAmount: 750000000,
    percentage: 5,
    preparedBy: "user-lead-1",
    approvedBy: "user-sup-ikeja",
    createdAt: "2026-02-22T10:00:00Z",
  },
  {
    id: "mat-2",
    auditId: "audit-2",
    overallMateriality: 125000000,
    performanceMateriality: 87500000,
    clearlyTrivialThreshold: 4375000,
    basis: "Surplus / (Deficit)",
    basisAmount: 2500000000,
    percentage: 5,
    preparedBy: "user-lead-2",
    approvedBy: "user-sup-ikeja",
    createdAt: "2026-03-21T09:00:00Z",
  },
  {
    id: "mat-3",
    auditId: "audit-3",
    overallMateriality: 21250000,
    performanceMateriality: 14875000,
    clearlyTrivialThreshold: 743750,
    basis: "Surplus / (Deficit)",
    basisAmount: 425000000,
    percentage: 5,
    preparedBy: "user-lead-4",
    createdAt: "2026-03-09T14:00:00Z",
  },
];

export const SEED_CONTROL_TESTS: InternalControlTest[] = [
  {
    id: "ctrl-1",
    auditId: "audit-1",
    controlArea: "Revenue Collection",
    controlDescription:
      "All revenue collections are receipted and lodged intact to bank daily",
    testProcedure:
      "Select 30 revenue transactions and trace from receipt to bank lodgement",
    result: "Partially Effective",
    weakness:
      "3 instances noted where collections were not lodged same-day. Delay of 2–5 days observed in 10% of sample.",
    recommendation:
      "Enforce daily lodgement policy. Management should issue circular reiterating the requirement.",
    testedBy: "user-auditor-1",
    testedAt: "2026-03-15T14:00:00Z",
  },
  {
    id: "ctrl-2",
    auditId: "audit-1",
    controlArea: "Payroll Processing",
    controlDescription:
      "Payroll is prepared by Finance Officer, reviewed by CFO, approved by Chairman before payment",
    testProcedure:
      "Test 6 months of payroll for authorisation signatures and compare against staff list",
    result: "Effective",
    testedBy: "user-auditor-2",
    testedAt: "2026-03-16T10:00:00Z",
  },
  {
    id: "ctrl-3",
    auditId: "audit-1",
    controlArea: "Expenditure Authorisation",
    controlDescription:
      "All payments must be supported by payment vouchers approved at appropriate authority levels",
    testProcedure:
      "Vouch 50 payment transactions against approved vouchers and supporting documents",
    result: "Ineffective",
    weakness:
      "12 payments totalling N4.2M found without adequate supporting documentation. 4 payments lacked authorised vouchers.",
    recommendation:
      "Implement pre-payment documentation checklist. Enforce no-document-no-payment policy.",
    testedBy: "user-auditor-1",
    testedAt: "2026-03-17T09:30:00Z",
  },
  {
    id: "ctrl-4",
    auditId: "audit-1",
    controlArea: "Bank Reconciliation",
    controlDescription:
      "Bank accounts are reconciled monthly by the Accountant and reviewed by CFO",
    testProcedure:
      "Review 12 months of bank reconciliation statements for evidence of preparation and review",
    result: "Partially Effective",
    weakness:
      "Reconciliations for April and July 2025 were not prepared. No review evidence on 5 of 10 completed reconciliations.",
    recommendation:
      "Ensure monthly reconciliations are completed by 5th of the following month. CFO to formally review and sign off.",
    testedBy: "user-auditor-2",
    testedAt: "2026-03-18T11:00:00Z",
  },
  {
    id: "ctrl-5",
    auditId: "audit-1",
    controlArea: "Fixed Assets Management",
    controlDescription:
      "Asset register is updated quarterly and assets are physically verified annually",
    testProcedure:
      "Review asset register completeness, trace additions to procurement documents, physical spot check of 20 assets",
    result: "Ineffective",
    weakness:
      "Asset register not updated since January 2025. 6 of 20 physically verified assets not reflected in register. 2 assets found disposed without proper authorisation.",
    recommendation:
      "Update asset register immediately. Conduct full asset verification exercise. Obtain board approval for all disposals.",
    testedBy: "user-auditor-1",
    testedAt: "2026-03-19T14:30:00Z",
  },
];

export const SEED_SUBSTANTIVE_TESTS: SubstantiveTest[] = [
  {
    id: "sub-1",
    auditId: "audit-1",
    area: "Revenue",
    procedure:
      "Vouch all IGR receipts to bank statements and confirm completeness of revenue recorded",
    populationSize: 1840,
    sampleSize: 92,
    exceptionCount: 7,
    exceptionAmount: 2340000,
    conclusion:
      "Revenue is materially stated. Exceptions relate to timing differences in lodgements. N2.34M in unreconciled differences noted — below materiality threshold.",
    performedBy: "user-auditor-1",
    performedAt: "2026-03-22T16:00:00Z",
    evidenceFiles: [
      {
        name: "Revenue Schedule",
        url: "#",
        type: "xlsx",
        size: "2.4 MB",
        uploadedAt: "2026-03-22T16:05:00Z",
        uploadedBy: "user-auditor-1",
      },
      {
        name: "Bank Statement - Jan-Mar",
        url: "#",
        type: "pdf",
        size: "1.2 MB",
        uploadedAt: "2026-03-22T16:06:00Z",
        uploadedBy: "user-auditor-1",
      },
    ],
    status: "Completed",
  },
  {
    id: "sub-2",
    auditId: "audit-1",
    area: "Payroll",
    procedure:
      "Analytical review and verification of payroll — ghost worker analysis using biometric data cross-reference",
    populationSize: 4200,
    sampleSize: 210,
    exceptionCount: 3,
    exceptionAmount: 1560000,
    conclusion:
      "3 staff members on payroll not confirmed by biometric system. Monthly salaries totalling N520,000 paid to unverified staff. Requires further investigation.",
    performedBy: "user-auditor-2",
    performedAt: "2026-03-25T10:00:00Z",
    evidenceFiles: [
      {
        name: "Payroll Analysis - Ghost Workers",
        url: "#",
        type: "xlsx",
        size: "3.5 MB",
        uploadedAt: "2026-03-25T10:35:00Z",
        uploadedBy: "user-auditor-2",
      },
    ],
    status: "Escalated",
  },
  {
    id: "sub-3",
    auditId: "audit-1",
    area: "Expenditure",
    procedure:
      "Test payment vouchers for authorisation, supporting documents, and budget compliance",
    populationSize: 3620,
    sampleSize: 181,
    exceptionCount: 16,
    exceptionAmount: 8940000,
    conclusion:
      "Exceptions constitute 4.9% of sample value. Key issues: missing supporting documents (N3.2M), unapproved expenditure (N2.8M), budget overruns (N2.94M). Material exceptions identified.",
    performedBy: "user-auditor-1",
    performedAt: "2026-03-28T14:00:00Z",
    status: "Completed",
  },
  {
    id: "sub-4",
    auditId: "audit-1",
    area: "Bank",
    procedure:
      "Re-perform bank reconciliations and confirm balances directly with banks",
    populationSize: 12,
    sampleSize: 12,
    exceptionCount: 2,
    exceptionAmount: 12500000,
    conclusion:
      "Unreconciled differences of N12.5M identified across 2 accounts. Bank confirmations received — balances agree with bank records but cashbook variances require explanation.",
    performedBy: "user-auditor-2",
    performedAt: "2026-03-30T09:00:00Z",
    status: "Completed",
  },
  {
    id: "sub-5",
    auditId: "audit-1",
    area: "Procurement",
    procedure:
      "Review procurement files, verify due process certificates, confirm compliance with Public Procurement Act 2007",
    populationSize: 48,
    sampleSize: 24,
    exceptionCount: 6,
    exceptionAmount: 45000000,
    conclusion:
      "6 contracts totalling N45M awarded without competitive bidding. 3 contracts exceeding N5M threshold lack due process certification. Significant non-compliance noted.",
    performedBy: "user-auditor-2",
    performedAt: "2026-04-02T15:00:00Z",
    status: "Completed",
  },
];

export const SEED_FRAUD_FLAGS: FraudFlag[] = [
  {
    id: "fraud-1",
    auditId: "audit-1",
    indicator: "Ghost Workers on Payroll",
    description:
      "3 staff members on the payroll could not be matched to the biometric attendance system. Salaries of N520,000/month paid for 12 months to these personnel.",
    area: "Payroll",
    raisedBy: "user-auditor-2",
    raisedAt: "2026-03-25T11:00:00Z",
    severity: "Critical",
    status: "Under Investigation",
  },
  {
    id: "fraud-2",
    auditId: "audit-1",
    indicator: "Unapproved Asset Disposals",
    description:
      "2 vehicles removed from asset register without board approval or disposal proceeds traced to any LGA account. Registration numbers: LSD 234 CG and LSD 567 DF.",
    area: "Capital Assets",
    raisedBy: "user-auditor-1",
    raisedAt: "2026-03-19T15:30:00Z",
    severity: "High",
    status: "Escalated",
  },
  {
    id: "fraud-3",
    auditId: "audit-1",
    indicator: "Split Procurement to Avoid Threshold",
    description:
      "N18M project split into 4 contracts of N4.5M each, all awarded to same vendor on same date, bypassing the competitive bidding threshold requirement of N5M for open tendering.",
    area: "Procurement",
    raisedBy: "user-auditor-2",
    raisedAt: "2026-04-02T16:00:00Z",
    severity: "Critical",
    status: "Open",
  },
  {
    id: "fraud-4",
    auditId: "audit-3",
    indicator: "Fictitious Vendors",
    description:
      "3 vendors in the payment records have same phone numbers registered to different company names. Payments totalling N7.2M made.",

    area: "Procurement",
    raisedBy: "user-auditor-4",
    raisedAt: "2026-03-28T10:00:00Z",
    severity: "High",
    status: "Under Investigation",
  },
  {
    id: "fraud-5",
    auditId: "audit-1",
    indicator: "Budget Overrun",
    description:
      "Expenditure on 'Office Maintenance' exceeded the approved budget by 150% (N12M vs N4.8M). No supplementary budget approval found.",
    area: "Expenditure",
    raisedBy: "user-auditor-1",
    raisedAt: "2026-04-05T09:15:00Z",
    severity: "High",
    status: "Open",
  },
  {
    id: "fraud-6",
    auditId: "audit-2",
    indicator: "Unremitted PAYE",
    description:
      "PAYE deductions for Jan-Mar 2026 totalling N8.5M have not been remitted to the State internal revenue service.",
    area: "Revenue",
    raisedBy: "user-auditor-3",
    raisedAt: "2026-04-01T14:20:00Z",
    severity: "Critical",
    status: "Escalated",
  },
  {
    id: "fraud-7",
    auditId: "audit-4",
    indicator: "Missing Revenue Receipts",
    description:
      "Market tolls collected for 3 weeks in February are unaccounted for. Receipt booklets #4501-#4600 are missing.",
    area: "Revenue",
    raisedBy: "user-auditor-2",
    raisedAt: "2026-03-30T10:45:00Z",
    severity: "High",
    status: "Open",
  },
];

export const SEED_SCOPE_AGREEMENTS: ScopeAgreement[] = [
  {
    id: "scope-1",
    auditId: "audit-1",
    lgaId: "lga-4",
    status: "Fully Approved",
    createdBy: "user-lead-1",
    createdAt: "2026-02-25T09:00:00Z",
    totalWeeks: 16,
    rows: [
      {
        id: "sr-1",
        area: "Cash Management & Treasury",
        description:
          "Review of all treasury operations, cash handling procedures, vault security, and daily lodgement practices",
        timelineWeeks: 3,
        expectations: "Working paper on treasury operations with test results",
        auditorSignOff: {
          name: "Mr. Adewale Ogunjobi",
          timestamp: "2026-02-26T10:00:00Z",
        },
        lgaSignOff: {
          name: "Mrs Folake Akinwunmi",
          timestamp: "2026-02-27T14:00:00Z",
        },
      },
      {
        id: "sr-2",
        area: "Revenue Collection (IGR)",
        description:
          "Verification of all internally generated revenue streams, collection points, and bank lodgements",
        timelineWeeks: 3,
        expectations: "Revenue completeness report and reconciliation schedule",
        auditorSignOff: {
          name: "Mr. Adewale Ogunjobi",
          timestamp: "2026-02-26T10:00:00Z",
        },
        lgaSignOff: {
          name: "Mrs Folake Akinwunmi",
          timestamp: "2026-02-27T14:00:00Z",
        },
      },
      {
        id: "sr-3",
        area: "Procurement & Contracts",
        description:
          "Review of procurement processes, due process compliance, contract awards, and value for money assessment",
        timelineWeeks: 4,
        expectations: "Procurement compliance matrix and exception report",
        auditorSignOff: {
          name: "Mr. Adewale Ogunjobi",
          timestamp: "2026-02-26T10:00:00Z",
        },
        lgaSignOff: {
          name: "Mrs Folake Akinwunmi",
          timestamp: "2026-02-27T14:00:00Z",
        },
      },
      {
        id: "sr-4",
        area: "Payroll & Personnel",
        description:
          "Verification of staff establishment, payroll accuracy, ghost worker analysis, and pension deductions",
        timelineWeeks: 3,
        expectations:
          "Payroll verification report with biometric cross-reference results",
        auditorSignOff: {
          name: "Mr. Adewale Ogunjobi",
          timestamp: "2026-02-26T10:00:00Z",
        },
        lgaSignOff: {
          name: "Mrs Folake Akinwunmi",
          timestamp: "2026-02-27T14:00:00Z",
        },
      },
      {
        id: "sr-5",
        area: "Capital Projects & Fixed Assets",
        description:
          "Physical verification of capital projects, review of asset register, and disposal procedures",
        timelineWeeks: 3,
        expectations:
          "Asset verification report and project completion certificates",
        auditorSignOff: {
          name: "Mr. Adewale Ogunjobi",
          timestamp: "2026-02-26T10:00:00Z",
        },
        lgaSignOff: {
          name: "Mrs Folake Akinwunmi",
          timestamp: "2026-02-27T14:00:00Z",
        },
      },
    ],
  },
  {
    id: "scope-2",
    auditId: "audit-2",
    lgaId: "lga-1",
    status: "Pending LGA",
    createdBy: "user-lead-2",
    createdAt: "2026-03-01T09:00:00Z",
    totalWeeks: 14,
    rows: [
      {
        id: "sr-6",
        area: "Financial Statements Review",
        description:
          "Comprehensive review of annual financial statements for accuracy and IPSAS compliance",
        timelineWeeks: 4,
        expectations: "Financial statement analysis report",
        auditorSignOff: {
          name: "Mrs. Adetola Bakare",
          timestamp: "2026-03-02T10:00:00Z",
        },
      },
      {
        id: "sr-7",
        area: "Budget Implementation",
        description:
          "Analysis of approved budget vs actual expenditure across all budget lines",
        timelineWeeks: 3,
        expectations:
          "Budget variance report with explanations for material variances",
        auditorSignOff: {
          name: "Mrs. Adetola Bakare",
          timestamp: "2026-03-02T10:00:00Z",
        },
      },
      {
        id: "sr-8",
        area: "Internal Controls Assessment",
        description:
          "Evaluation of design and operating effectiveness of key internal controls",
        timelineWeeks: 4,
        expectations: "Internal control deficiency report and recommendations",
      },
      {
        id: "sr-9",
        area: "Compliance Testing",
        description:
          "Test compliance with Public Finance Management Act and applicable regulations",
        timelineWeeks: 3,
        expectations: "Compliance testing results and exceptions noted",
      },
    ],
  },
];

export const SEED_QUESTIONNAIRE_QUESTIONS: QuestionnaireQuestion[] = [
  // ═══ Understanding the Entity (ISA 315) ═══
  {
    id: "q-1",
    section: "Understanding the Entity",
    question: "What is the LGA's organizational structure?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Well-defined with clear reporting lines",
        value: "well_defined",
      },
      {
        label: "Partially defined — some gaps in reporting lines",
        value: "partial",
      },
      { label: "Poorly defined — no formal organogram", value: "poor" },
    ],
  },
  {
    id: "q-2",
    section: "Understanding the Entity",
    question: "What are the LGA's primary funding sources?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Federal Allocation", value: "federal_allocation" },
      { label: "State Allocation", value: "state_allocation" },
      { label: "Internally Generated Revenue", value: "igr" },
      { label: "Grants & Donor Funding", value: "grants" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "q-3",
    section: "Understanding the Entity",
    question:
      "Has the LGA's organizational chart been reviewed and confirmed current?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Current and comprehensive", value: "yes_current" },
      { label: "Yes — Available but outdated", value: "yes_outdated" },
      { label: "No — Organizational chart not available", value: "no" },
    ],
  },
  {
    id: "q-4",
    section: "Understanding the Entity",
    question:
      "What is the approximate total staff strength (permanent + casual)?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Under 500", value: "under_500" },
      { label: "500 – 1,000", value: "500_1000" },
      { label: "1,000 – 2,000", value: "1000_2000" },
      { label: "Over 2,000", value: "over_2000" },
    ],
  },
  {
    id: "q-5",
    section: "Understanding the Entity",
    question:
      "Has the LGA undergone significant structural or leadership changes in the last 24 months?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Major leadership change", value: "yes_major" },
      { label: "Yes — Minor restructuring only", value: "yes_minor" },
      { label: "No — Stable structure", value: "no" },
    ],
  },
  {
    id: "q-6",
    section: "Understanding the Entity",
    question:
      "How does the current year's approved budget compare to the previous year?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Increased by more than 20%", value: "increase_20plus" },
      { label: "Increased by 5–20%", value: "increase_5_20" },
      { label: "Roughly the same (±5%)", value: "same" },
      { label: "Decreased", value: "decreased" },
    ],
  },
  {
    id: "q-7",
    section: "Understanding the Entity",
    question: "Are the LGA's enabling law/bye-laws reviewed and up to date?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Reviewed within the last 3 years", value: "yes_recent" },
      { label: "No — Last reviewed over 5 years ago", value: "no_old" },
      { label: "Unknown — Not verified", value: "unknown" },
    ],
  },
  {
    id: "q-8",
    section: "Understanding the Entity",
    question: "How does the LGA receive and account for JAAC allocations?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Direct credit to dedicated account with proper reconciliation",
        value: "dedicated_reconciled",
      },
      {
        label: "Direct credit but reconciliation is irregular",
        value: "dedicated_irregular",
      },
      { label: "Commingled with other funds", value: "commingled" },
    ],
  },

  // ═══ Key Accounting Systems ═══
  {
    id: "q-9",
    section: "Key Accounting Systems",
    question: "Does the LGA use accounting software for financial management?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Fully automated", value: "yes_full" },
      { label: "Yes — Partially automated", value: "yes_partial" },
      { label: "No — Manual system only", value: "no" },
    ],
  },
  {
    id: "q-10",
    section: "Key Accounting Systems",
    question: "How is revenue collected and receipted?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label:
          "Centralized with pre-numbered receipts and daily reconciliation",
        value: "centralized_good",
      },
      {
        label: "Decentralized collection points with periodic reconciliation",
        value: "decentralized",
      },
      { label: "No formal receipt system in place", value: "no_system" },
    ],
  },
  {
    id: "q-11",
    section: "Key Accounting Systems",
    question: "How is the payroll processed?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Automated payroll system with biometric verification",
        value: "automated_biometric",
      },
      {
        label: "Automated payroll without biometric verification",
        value: "automated_no_bio",
      },
      { label: "Manual payroll processing", value: "manual" },
    ],
  },
  {
    id: "q-12",
    section: "Key Accounting Systems",
    question: "What accounting basis does the LGA adopt?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Cash Basis (IPSAS Cash)", value: "cash" },
      { label: "Accrual Basis (IPSAS Accrual)", value: "accrual" },
      { label: "Modified Cash Basis", value: "modified_cash" },
      { label: "Modified Accrual Basis", value: "modified_accrual" },
    ],
  },
  {
    id: "q-13",
    section: "Key Accounting Systems",
    question: "Are bank reconciliation statements prepared regularly?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Monthly, by a preparer with independent reviewer",
        value: "yes_monthly",
      },
      { label: "Yes — Quarterly", value: "yes_quarterly" },
      { label: "Irregularly — No fixed schedule", value: "irregular" },
      { label: "No — Not performed", value: "no" },
    ],
  },
  {
    id: "q-14",
    section: "Key Accounting Systems",
    question: "How are petty cash advances controlled?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Imprest system with approved limits and prompt retirement",
        value: "imprest_good",
      },
      {
        label: "Imprest system but retirements are frequently delayed",
        value: "imprest_delayed",
      },
      { label: "No formal petty cash controls", value: "no_controls" },
    ],
  },
  {
    id: "q-15",
    section: "Key Accounting Systems",
    question: "Are audited accounts for the last three fiscal years available?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — All three years available and filed", value: "yes_all" },
      { label: "Yes — Partially (1-2 years only)", value: "yes_partial" },
      { label: "No — Accounts are in arrears", value: "no" },
    ],
  },

  // ═══ Internal Control Environment (ISA 315/330) ═══
  {
    id: "q-16",
    section: "Internal Control Environment",
    question: "Rate the overall internal control environment of the LGA.",
    type: "risk-scoring",
    required: true,
    options: [
      { label: "Strong — Well-designed and operating effectively", value: "1" },
      { label: "Adequate — Generally effective with minor gaps", value: "2" },
      {
        label: "Moderate — Some significant weaknesses identified",
        value: "3",
      },
      { label: "Weak — Multiple material weaknesses present", value: "4" },
      {
        label: "Very Weak — Controls are largely absent or ineffective",
        value: "5",
      },
    ],
  },
  {
    id: "q-17",
    section: "Internal Control Environment",
    question: "Is there a functional internal audit unit within the LGA?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Active and reports regularly", value: "yes_active" },
      { label: "Yes — Exists but not fully functional", value: "yes_limited" },
      { label: "No — No internal audit function", value: "no" },
    ],
  },
  {
    id: "q-18",
    section: "Internal Control Environment",
    question:
      "Is segregation of duties maintained for financial transactions (authorisation, custody, recording)?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Fully segregated across all functions",
        value: "yes_full",
      },
      { label: "Partially — Some functions are combined", value: "partial" },
      { label: "No — Inadequate segregation", value: "no" },
    ],
  },
  {
    id: "q-19",
    section: "Internal Control Environment",
    question: "Is there a documented financial regulations manual in use?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Current and actively followed", value: "yes_current" },
      { label: "Yes — Available but compliance is weak", value: "yes_weak" },
      { label: "No — No documented financial manual", value: "no" },
    ],
  },
  {
    id: "q-20",
    section: "Internal Control Environment",
    question: "How are fixed assets recorded and managed?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Complete asset register maintained and reconciled annually",
        value: "complete",
      },
      {
        label: "Register exists but is incomplete or outdated",
        value: "incomplete",
      },
      { label: "No formal fixed asset register", value: "none" },
    ],
  },
  {
    id: "q-21",
    section: "Internal Control Environment",
    question:
      "Are there unresolved audit queries from the previous audit cycle?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "No — All prior queries resolved", value: "all_resolved" },
      { label: "Yes — Some queries remain unresolved", value: "some_pending" },
      {
        label: "Yes — Majority of queries remain unresolved",
        value: "most_pending",
      },
    ],
  },
  {
    id: "q-22",
    section: "Internal Control Environment",
    question: "Rate the effectiveness of the IT general controls environment.",
    type: "risk-scoring",
    required: true,
    options: [
      { label: "Strong — Robust IT controls in place", value: "1" },
      { label: "Adequate — Basic controls with some gaps", value: "2" },
      { label: "Moderate — Significant IT weaknesses", value: "3" },
      { label: "Weak — Minimal or no IT controls", value: "4" },
    ],
  },

  // ═══ Risk Assessment (ISA 315/330) ═══
  {
    id: "q-23",
    section: "Risk Assessment",
    question:
      "Rate the overall risk of material misstatement for the LGA's financial statements.",
    type: "risk-scoring",
    required: true,
    options: [
      { label: "Low", value: "1" },
      { label: "Medium-Low", value: "2" },
      { label: "Medium", value: "3" },
      { label: "Medium-High", value: "4" },
      { label: "High", value: "5" },
    ],
  },
  {
    id: "q-24",
    section: "Risk Assessment",
    question:
      "Have any fraud or irregularity indicators been identified during the preliminary review?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Specific indicators identified", value: "yes" },
      { label: "No — No indicators at this stage", value: "no" },
      {
        label: "Inconclusive — Further investigation needed",
        value: "inconclusive",
      },
    ],
  },
  {
    id: "q-25",
    section: "Risk Assessment",
    question:
      "Are there any identified related-party transactions or conflicts of interest?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Significant related-party transactions noted",
        value: "yes_significant",
      },
      { label: "Yes — Minor related-party matters noted", value: "yes_minor" },
      { label: "No — None identified", value: "no" },
    ],
  },
  {
    id: "q-26",
    section: "Risk Assessment",
    question: "Are there ongoing litigation cases or contingent liabilities?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Significant financial exposure",
        value: "yes_significant",
      },
      { label: "Yes — Minor or immaterial exposure", value: "yes_minor" },
      { label: "No — None identified", value: "no" },
    ],
  },
  {
    id: "q-27",
    section: "Risk Assessment",
    question:
      "Has the LGA been subject to any special investigations or forensic audits in the last 5 years?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Resulted in recoveries or sanctions",
        value: "yes_sanctions",
      },
      { label: "Yes — Cleared without findings", value: "yes_cleared" },
      { label: "No", value: "no" },
      { label: "Not aware", value: "unknown" },
    ],
  },
  {
    id: "q-28",
    section: "Risk Assessment",
    question:
      "What is the assessment of management integrity and control consciousness?",
    type: "risk-scoring",
    required: true,
    options: [
      { label: "High — Strong tone at the top", value: "1" },
      { label: "Adequate — Generally cooperative", value: "2" },
      { label: "Moderate — Some concerns noted", value: "3" },
      { label: "Low — Significant integrity concerns", value: "4" },
    ],
  },
  {
    id: "q-29",
    section: "Risk Assessment",
    question:
      "How frequent are significant changes in personnel or accounting systems?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Frequent — Multiple changes yearly", value: "frequent" },
      { label: "Occasional — Some changes", value: "occasional" },
      { label: "Rare — Systems and personnel are stable", value: "rare" },
    ],
  },
  {
    id: "q-30",
    section: "Risk Assessment",
    question:
      "Do you have formal mechanisms in place to assess fraud risks proactively?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Regular formal assessments", value: "yes_formal" },
      { label: "Yes — Informal assessments only", value: "yes_informal" },
      { label: "No — No mechanism in place", value: "no" },
    ],
  },
  {
    id: "q-31",
    section: "Risk Assessment",
    question:
      "Is there a documented business continuity or disaster recovery plan?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Documented and regularly tested", value: "yes_tested" },
      { label: "Yes — Documented but rarely tested", value: "yes_untested" },
      { label: "No — No formal plan", value: "no" },
    ],
  },
  {
    id: "q-32",
    section: "Risk Assessment",
    question:
      "Are external compliance and regulatory requirements consistently met on time?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Consistently met on time", value: "yes" },
      { label: "Partially — Occasional delays or issues", value: "partial" },
      { label: "No — Frequent delays or compliance failures", value: "no" },
    ],
  },

  // ═══ Additional: Understanding the Entity ═══
  {
    id: "q-ue-1",
    section: "Understanding the Entity",
    question:
      "How many council wards does the LGA have, and is ward-level financial reporting available?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Ward-level reports are produced and consolidated",
        value: "ward_reports",
      },
      {
        label: "Wards exist but no separate financial reports are produced",
        value: "no_reports",
      },
      {
        label: "Ward structure is unclear or not formally defined",
        value: "unclear",
      },
    ],
  },
  {
    id: "q-ue-2",
    section: "Understanding the Entity",
    question:
      "Has the LGA entered into any Public-Private Partnerships (PPPs) or joint ventures during the audit period?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — With documented agreements and reporting",
        value: "yes_documented",
      },
      {
        label: "Yes — Informal arrangements not fully documented",
        value: "yes_informal",
      },
      { label: "No", value: "no" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "q-ue-3",
    section: "Understanding the Entity",
    question:
      "Are the LGA's annual budgets publicly disclosed and submitted to the relevant state authority on time?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Always submitted on time and publicly available",
        value: "yes_timely",
      },
      {
        label: "Partially — Submitted late or not publicly disclosed",
        value: "partial",
      },
      {
        label: "No — Budget submissions are consistently delayed",
        value: "no",
      },
    ],
  },
  {
    id: "q-ue-4",
    section: "Understanding the Entity",
    question:
      "Does the LGA have a Medium-Term Expenditure Framework (MTEF) or development plan aligned to its budget?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — MTEF is in place and budget-aligned", value: "yes_mtef" },
      {
        label: "Partially — Plans exist but not integrated with budget",
        value: "partial",
      },
      { label: "No — No formal MTEF or development plan", value: "no" },
    ],
  },

  // ═══ Additional: Key Accounting Systems ═══
  {
    id: "q-kas-1",
    section: "Key Accounting Systems",
    question:
      "Is there a documented chart of accounts aligned to IPSAS/PSAS standards?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Fully aligned and consistently applied",
        value: "yes_aligned",
      },
      { label: "Yes — Exists but partially applied", value: "yes_partial" },
      { label: "No — No formal chart of accounts in use", value: "no" },
    ],
  },
  {
    id: "q-kas-2",
    section: "Key Accounting Systems",
    question:
      "How are journal vouchers authorised and reviewed before posting?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Dual authorisation by preparer and independent reviewer",
        value: "dual_auth",
      },
      { label: "Authorised by one officer only", value: "single_auth" },
      { label: "No formal authorisation process", value: "no_auth" },
    ],
  },
  {
    id: "q-kas-3",
    section: "Key Accounting Systems",
    question:
      "Are staff and project advances regularly retired within the stipulated period?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — All advances retired on time", value: "yes_all" },
      {
        label: "Partially — Some advances remain outstanding beyond due date",
        value: "partial",
      },
      { label: "No — Significant unretired advances exist", value: "no" },
    ],
  },
  {
    id: "q-kas-4",
    section: "Key Accounting Systems",
    question:
      "Is there a functional stores or inventory management system for LGA assets and consumables?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Full stores management with periodic stock-taking",
        value: "yes_full",
      },
      { label: "Yes — Exists but not effectively managed", value: "yes_weak" },
      { label: "No — No formal stores management", value: "no" },
    ],
  },

  // ═══ Additional: Internal Control Environment ═══
  {
    id: "q-ice-1",
    section: "Internal Control Environment",
    question:
      "Does the LGA conduct periodic formal risk assessments to identify and mitigate operational risks?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Conducted at least annually with documented outcomes",
        value: "yes_annual",
      },
      {
        label: "Yes — Informally, without documented outputs",
        value: "yes_informal",
      },
      { label: "No — No formal risk assessment process", value: "no" },
    ],
  },
  {
    id: "q-ice-2",
    section: "Internal Control Environment",
    question:
      "Are there documented expenditure approval thresholds (e.g., Treasurer, Chairman, Council) enforced in practice?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Documented and consistently enforced",
        value: "yes_enforced",
      },
      {
        label: "Yes — Documented but inconsistently applied",
        value: "yes_weak",
      },
      { label: "No — No formal approval thresholds in place", value: "no" },
    ],
  },
  {
    id: "q-ice-3",
    section: "Internal Control Environment",
    question:
      "Is there a documented anti-corruption or whistleblower policy accessible to all staff?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label:
          "Yes — Policy exists, staff are aware, and complaints channel is active",
        value: "yes_active",
      },
      {
        label: "Yes — Policy exists but staff awareness is low",
        value: "yes_low_awareness",
      },
      { label: "No — No such policy exists", value: "no" },
    ],
  },
  {
    id: "q-ice-4",
    section: "Internal Control Environment",
    question:
      "How frequently are surprise cash counts or unannounced control checks conducted?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Monthly or more frequently", value: "monthly" },
      { label: "Quarterly", value: "quarterly" },
      { label: "Annually or less", value: "annually" },
      { label: "Never — No such checks are conducted", value: "never" },
    ],
  },

  // ═══ Additional: Risk Assessment ═══
  {
    id: "q-ra-1",
    section: "Risk Assessment",
    question:
      "Are there significant areas of non-compliance with the LGA's Appropriation Law or approved budget lines?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Multiple significant breaches identified",
        value: "yes_significant",
      },
      { label: "Yes — Minor deviations with explanations", value: "yes_minor" },
      {
        label: "No — Expenditures are within appropriated limits",
        value: "no",
      },
    ],
  },
  {
    id: "q-ra-2",
    section: "Risk Assessment",
    question:
      "Are Budget Implementation Reports (BIRs) prepared and submitted to relevant oversight bodies?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Prepared quarterly and submitted on time",
        value: "yes_timely",
      },
      {
        label: "Yes — Prepared but not submitted or submitted late",
        value: "yes_late",
      },
      { label: "No — BIRs are not prepared", value: "no" },
    ],
  },

  // ═══ Information Security ═══
  {
    id: "q-37",
    section: "Information Security",
    question: "Rate the maturity of the LGA's cybersecurity measures.",
    type: "risk-scoring",
    required: true,
    options: [
      { label: "Mature — Comprehensive security framework", value: "1" },
      { label: "Developing — Basic protections in place", value: "2" },
      { label: "Minimal — Significant gaps", value: "3" },
      { label: "Non-existent — No cybersecurity measures", value: "4" },
    ],
  },
  {
    id: "q-38",
    section: "Information Security",
    question:
      "Are there formal IT policies covering acceptable use, passwords, and data protection?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Documented and enforced", value: "yes_enforced" },
      {
        label: "Yes — Documented but not actively enforced",
        value: "yes_not_enforced",
      },
      { label: "No — No formal IT policies", value: "no" },
    ],
  },
  {
    id: "q-is-1",
    section: "Information Security",
    question:
      "Is access to financial systems controlled through role-based permissions and unique user accounts?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label:
          "Yes — Role-based access with unique accounts and regular reviews",
        value: "yes_rbac",
      },
      {
        label: "Partially — Some shared accounts or unreviewed access rights",
        value: "partial",
      },
      { label: "No — No formal access controls in place", value: "no" },
    ],
  },
  {
    id: "q-is-2",
    section: "Information Security",
    question:
      "Are backups of financial data performed regularly and stored securely (off-site or cloud)?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Daily or weekly backups with secure off-site storage",
        value: "yes_regular",
      },
      {
        label: "Yes — Backups exist but not tested or stored off-site",
        value: "yes_weak",
      },
      { label: "No — No regular backup process", value: "no" },
    ],
  },
  {
    id: "q-is-3",
    section: "Information Security",
    question:
      "Have there been any cybersecurity incidents, data breaches, or system failures in the last 3 years?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Major incident with significant data or financial impact",
        value: "yes_major",
      },
      { label: "Yes — Minor incidents that were resolved", value: "yes_minor" },
      { label: "No — No known incidents", value: "no" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "q-is-4",
    section: "Information Security",
    question:
      "Is there a qualified ICT officer or dedicated IT governance unit responsible for systems management?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Dedicated ICT unit with qualified staff",
        value: "yes_dedicated",
      },
      {
        label: "Yes — Shared responsibility with limited IT expertise",
        value: "yes_shared",
      },
      { label: "No — No dedicated IT function", value: "no" },
    ],
  },
  {
    id: "q-is-5",
    section: "Information Security",
    question:
      "Are staff trained on data protection, phishing awareness, and IT security best practices?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Regular structured training conducted",
        value: "yes_regular",
      },
      {
        label: "Yes — Occasional or informal training only",
        value: "yes_occasional",
      },
      { label: "No — No IT security training provided", value: "no" },
    ],
  },
];

export const SEED_QUESTIONNAIRE_RESPONSES: QuestionnaireResponse[] = [
  {
    id: "qr-1",
    auditId: "audit-1",
    questionId: "q-1",
    section: "Understanding the Entity",
    answer: "well_defined",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-02T10:00:00Z",
  },
  {
    id: "qr-2",
    auditId: "audit-1",
    questionId: "q-2",
    section: "Understanding the Entity",
    answer: "federal_allocation,state_allocation,igr",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-02T10:15:00Z",
  },
  {
    id: "qr-3",
    auditId: "audit-1",
    questionId: "q-9",
    section: "Key Accounting Systems",
    answer: "yes_partial",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-02T11:00:00Z",
  },
  {
    id: "qr-4",
    auditId: "audit-1",
    questionId: "q-16",
    section: "Internal Control Environment",
    answer: "3",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T09:00:00Z",
  },
  {
    id: "qr-5",
    auditId: "audit-1",
    questionId: "q-23",
    section: "Risk Assessment",
    answer: "4",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T09:30:00Z",
  },
  {
    id: "qr-6",
    auditId: "audit-1",
    questionId: "q-24",
    section: "Risk Assessment",
    answer: "inconclusive",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T09:35:00Z",
  },
  {
    id: "qr-7",
    auditId: "audit-1",
    questionId: "q-25",
    section: "Risk Assessment",
    answer: "yes_minor",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T09:40:00Z",
  },
  {
    id: "qr-8",
    auditId: "audit-1",
    questionId: "q-28",
    section: "Risk Assessment",
    answer: "3",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T09:45:00Z",
  },
  {
    id: "qr-9",
    auditId: "audit-1",
    questionId: "q-29",
    section: "Risk Assessment",
    answer: "occasional",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T09:50:00Z",
  },
  {
    id: "qr-10",
    auditId: "audit-1",
    questionId: "q-17",
    section: "Internal Control Environment",
    answer: "yes_limited",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T10:00:00Z",
  },
  {
    id: "qr-11",
    auditId: "audit-1",
    questionId: "q-20",
    section: "Fixed Assets",
    answer: "incomplete",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T10:05:00Z",
  },
  // audit-3 questionnaire responses
  {
    id: "qr-12",
    auditId: "audit-3",
    questionId: "q-16",
    section: "Internal Control Environment",
    answer: "4",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:00:00Z",
  },
  {
    id: "qr-13",
    auditId: "audit-3",
    questionId: "q-23",
    section: "Risk Assessment",
    answer: "5",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:10:00Z",
  },
  {
    id: "qr-14",
    auditId: "audit-3",
    questionId: "q-24",
    section: "Risk Assessment",
    answer: "yes",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:15:00Z",
  },
  {
    id: "qr-15",
    auditId: "audit-3",
    questionId: "q-25",
    section: "Risk Assessment",
    answer: "yes_significant",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:20:00Z",
  },
  {
    id: "qr-16",
    auditId: "audit-3",
    questionId: "q-17",
    section: "Internal Control Environment",
    answer: "no",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:25:00Z",
  },
  {
    id: "qr-17",
    auditId: "audit-3",
    questionId: "q-20",
    section: "Fixed Assets",
    answer: "none",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:30:00Z",
  },
  {
    id: "qr-18",
    auditId: "audit-3",
    questionId: "q-28",
    section: "Risk Assessment",
    answer: "4",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:35:00Z",
  },
  {
    id: "qr-19",
    auditId: "audit-3",
    questionId: "q-29",
    section: "Risk Assessment",
    answer: "frequent",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:40:00Z",
  },
];

export const SEED_DOCUMENT_UPLOADS: DocumentUpload[] = [
  {
    id: "doc-1",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    documentName: "Annual Financial Statements",
    description:
      "Complete audited or unaudited financial statements for the preceding 3 fiscal years",
    requiredFormat: "PDF",
    status: "Approved",
    fileName: "Mushin_AFS_2023_2025.pdf",
    fileSize: "12.4 MB",
    uploadedBy: "user-hlga-ikeja",
    uploadedAt: "2026-02-05T14:00:00Z",
    reviewedBy: "user-lead-1",
    reviewedAt: "2026-02-06T10:00:00Z",
    version: 1,
    dueDate: "2026-02-28",
  },
  {
    id: "doc-2",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    documentName: "Approved Budget",
    description: "Current and preceding year approved budget documents",
    requiredFormat: "PDF",
    status: "Approved",
    fileName: "Mushin_Budget_2024_2025.pdf",
    fileSize: "8.1 MB",
    uploadedBy: "user-hlga-ikeja",
    uploadedAt: "2026-02-06T09:00:00Z",
    reviewedBy: "user-lead-1",
    reviewedAt: "2026-02-07T11:00:00Z",
    version: 1,
    dueDate: "2026-02-28",
  },
  {
    id: "doc-3",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    documentName: "Bank Statements",
    description: "Bank statements for all LGA accounts covering 12 months",
    requiredFormat: "PDF",
    status: "Uploaded",
    fileName: "Mushin_BankStatements_Jan_Dec_2025.pdf",
    fileSize: "24.7 MB",
    uploadedBy: "user-hlga-ikeja",
    uploadedAt: "2026-02-10T16:00:00Z",
    version: 1,
    dueDate: "2026-02-28",
  },
  {
    id: "doc-4",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    documentName: "Staff Establishment and Payroll Records",
    description:
      "Complete staff list with grades, positions, and 12-month payroll records",
    requiredFormat: "Excel",
    status: "Rejected",
    fileName: "Mushin_Payroll_2025.xlsx",
    fileSize: "5.2 MB",
    uploadedBy: "user-hlga-ikeja",
    uploadedAt: "2026-02-08T11:00:00Z",
    reviewedBy: "user-lead-1",
    reviewedAt: "2026-02-09T14:00:00Z",
    rejectionReason:
      "Payroll data is incomplete. Missing months of October, November and December 2025. Please re-upload with complete 12-month records.",
    version: 1,
    dueDate: "2026-02-28",
  },
  {
    id: "doc-5",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    documentName: "Revenue Collection Records",
    description: "IGR collection records, receipts, and revenue schedules",
    requiredFormat: "Excel/PDF",
    status: "Not Uploaded",
    version: 0,
    dueDate: "2026-02-28",
  },
  {
    id: "doc-6",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    documentName: "Capital Project Files",
    description:
      "Contract documents, project files, and completion certificates for all capital projects",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 0,
    dueDate: "2026-02-28",
  },
  {
    id: "doc-7",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    documentName: "Procurement Records",
    description:
      "Procurement documentation, bid evaluations, due process certificates, and contract awards",
    requiredFormat: "PDF",
    status: "Uploaded",
    fileName: "Mushin_Procurement_2025.pdf",
    fileSize: "18.3 MB",
    uploadedBy: "user-hlga-ikeja",
    uploadedAt: "2026-02-12T09:00:00Z",
    version: 1,
    dueDate: "2026-02-28",
  },
  {
    id: "doc-8",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    documentName: "Fixed Asset Register",
    description:
      "Complete fixed asset register with acquisition details, locations, and current values",
    requiredFormat: "Excel",
    status: "Not Uploaded",
    version: 0,
    dueDate: "2026-02-28",
  },
  {
    id: "doc-9",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    documentName: "Tenders Board Minutes",
    description:
      "Minutes of Tenders Board and Finance Committee meetings for the audit period",
    requiredFormat: "PDF",
    status: "Approved",
    fileName: "Mushin_TendersMinutes_2025.pdf",
    fileSize: "6.8 MB",
    uploadedBy: "user-hlga-ikeja",
    uploadedAt: "2026-02-07T15:00:00Z",
    reviewedBy: "user-lead-1",
    reviewedAt: "2026-02-08T09:00:00Z",
    version: 1,
    dueDate: "2026-02-28",
  },
  {
    id: "doc-10",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    documentName: "Internal Audit Reports",
    description:
      "Internal audit reports and management responses for the audit period",
    requiredFormat: "PDF",
    status: "Uploaded",
    fileName: "Mushin_InternalAudit_2025.pdf",
    fileSize: "4.1 MB",
    uploadedBy: "user-hlga-ikeja",
    uploadedAt: "2026-02-11T10:00:00Z",
    version: 1,
    dueDate: "2026-02-28",
  },
  {
    id: "doc-11",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    documentName: "Cash Books and Ledgers",
    description: "Complete cash books and general ledger for all LGA accounts",
    requiredFormat: "Excel",
    status: "Not Uploaded",
    version: 0,
    dueDate: "2026-02-28",
  },
  {
    id: "doc-12",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    documentName: "Previous Audit Reports",
    description: "Previous external audit reports and management responses",
    requiredFormat: "PDF",
    status: "Approved",
    fileName: "Mushin_PrevAudit_2024.pdf",
    fileSize: "3.2 MB",
    uploadedBy: "user-hlga-ikeja",
    uploadedAt: "2026-02-05T16:00:00Z",
    reviewedBy: "user-lead-1",
    reviewedAt: "2026-02-06T11:00:00Z",
    version: 1,
    dueDate: "2026-02-28",
  },
  {
    id: "doc-13",
    lgaId: "lga-1",
    mandateId: "mandate-1",
    documentName: "Annual Financial Statements",
    description:
      "Complete audited or unaudited financial statements for the preceding 3 fiscal years",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 0,
    dueDate: "2026-03-15",
  },
  {
    id: "doc-14",
    lgaId: "lga-1",
    mandateId: "mandate-1",
    documentName: "Approved Budget",
    description: "Current and preceding year approved budget documents",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 0,
    dueDate: "2026-03-15",
  },
  {
    id: "doc-15",
    lgaId: "lga-1",
    mandateId: "mandate-1",
    documentName: "Bank Statements",
    description: "Bank statements for all LGA accounts covering 12 months",
    requiredFormat: "PDF",
    status: "Not Uploaded",
    version: 0,
    dueDate: "2026-03-15",
  },
];

export const SEED_STAGE_APPROVALS: StageApproval[] = [
  {
    id: "sa-1",
    auditId: "audit-1",
    stage: "Pre-Audit",
    status: "Approved",
    submittedBy: "user-lead-1",
    submittedAt: "2026-02-28T10:00:00Z",
    reviewedBy: "user-sup-ikeja",
    reviewedAt: "2026-03-01T09:00:00Z",
    comments:
      "Pre-audit activities completed satisfactorily. Proceed to planning.",
  },
  {
    id: "sa-2",
    auditId: "audit-1",
    stage: "Planning",
    status: "Approved",
    submittedBy: "user-lead-1",
    submittedAt: "2026-03-05T14:00:00Z",
    reviewedBy: "user-sup-ikeja",
    reviewedAt: "2026-03-06T10:00:00Z",
    comments:
      "Audit plan is comprehensive. Risk areas properly identified. Approved to commence fieldwork.",
  },
  {
    id: "sa-3",
    auditId: "audit-1",
    stage: "Fieldwork",
    status: "Pending",
    submittedBy: "user-lead-1",
    submittedAt: "2026-04-05T16:00:00Z",
  },
  {
    id: "sa-4",
    auditId: "audit-2",
    stage: "Pre-Audit",
    status: "Approved",
    submittedBy: "user-lead-2",
    submittedAt: "2026-03-01T11:00:00Z",
    reviewedBy: "user-sup-ikeja",
    reviewedAt: "2026-03-02T09:30:00Z",
  },
  {
    id: "sa-5",
    auditId: "audit-3",
    stage: "Pre-Audit",
    status: "Approved",
    submittedBy: "user-lead-4",
    submittedAt: "2026-03-08T11:00:00Z",
    reviewedBy: "user-sup-badagry",
    reviewedAt: "2026-03-09T09:00:00Z",
    comments: "Approved.",
  },
  {
    id: "sa-6",
    auditId: "audit-3",
    stage: "Planning",
    status: "Approved",
    submittedBy: "user-lead-4",
    submittedAt: "2026-03-12T10:00:00Z",
    reviewedBy: "user-sup-badagry",
    reviewedAt: "2026-03-13T14:00:00Z",
  },
  {
    id: "sa-7",
    auditId: "audit-3",
    stage: "Fieldwork",
    status: "Approved",
    submittedBy: "user-lead-4",
    submittedAt: "2026-04-10T09:00:00Z",
    reviewedBy: "user-sup-badagry",
    reviewedAt: "2026-04-11T10:00:00Z",
    comments: "Fieldwork complete. Good documentation. Proceed to reporting.",
  },
  {
    id: "sa-8",
    auditId: "audit-2",
    stage: "Pre-Audit",
    status: "Changes Requested",
    submittedBy: "user-lead-2",
    submittedAt: "2026-03-01T14:00:00Z",
    reviewedBy: "user-sup-ikeja",
    reviewedAt: "2026-03-02T10:00:00Z",
    comments:
      "Entry meeting notes are incomplete. Please document the agreed document submission timeline and add the LGA's feedback on scope areas.",
  },
];

import type { Notification } from "../types";

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    userId: "user-ag",
    title: "Document Approved",
    message:
      "Financial Statements for Mushin LGA have been approved by the Supervisor.",
    type: "success",
    isRead: false,
    timestamp: "2026-03-10T09:00:00Z",
    link: "/audit/audit-1",
    relatedEntityId: "doc-1",
    relatedEntityType: "document",
  },
  {
    id: "notif-2",
    userId: "user-ag",
    title: "New Mandate Published",
    message:
      "The Annual Audit of Local Government Accounts — FY 2025 is now active.",
    type: "info",
    isRead: true,
    timestamp: "2026-01-20T14:05:00Z",
    link: "/mandates",
    relatedEntityId: "mandate-1",
    relatedEntityType: "mandate",
  },
  {
    id: "notif-3",
    userId: "user-sup-ikeja",
    title: "Pending Approval",
    message: "Pre-Audit stage approval requested for Agege LGA Audit.",
    type: "warning",
    isRead: false,
    timestamp: "2026-03-01T11:05:00Z",
    link: "/audit/audit-2",
    relatedEntityId: "audit-2",
    relatedEntityType: "audit",
  },
  {
    id: "notif-4",
    userId: "user-lead-1",
    title: "Audit Assigned",
    message:
      "You have been assigned as Lead Auditor for Mushin LGA Financial Audit.",
    type: "info",
    isRead: false,
    timestamp: "2026-02-15T10:00:00Z",
    link: "/audit/audit-1",
    relatedEntityId: "audit-1",
    relatedEntityType: "audit",
  },
  {
    id: "notif-5",
    userId: "user-ag",
    title: "Report Submitted",
    message:
      "Final Audit Report for Badagry LGA has been submitted for review.",
    type: "warning",
    isRead: false,
    timestamp: "2026-03-15T16:30:00Z",
    link: "/audit/audit-4",
    relatedEntityId: "audit-4",
    relatedEntityType: "report",
  },
  {
    id: "notif-6",
    userId: "user-ag",
    title: "System Update",
    message: "The platform will undergo maintenance on Saturday at 2 AM.",
    type: "info",
    isRead: false,
    timestamp: "2026-03-18T08:00:00Z",
    relatedEntityType: "system",
  },
];
