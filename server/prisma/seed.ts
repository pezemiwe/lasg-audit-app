import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../src/generated/prisma/client";
import { env } from "../src/config/env";

const adapter = new PrismaPg({ connectionString: env.databaseUrl });
const prisma = new PrismaClient({ adapter });

const password = "password123";

const zones = [
  {
    name: "Ikeja",
    capital: "Ikeja",
    lgas: ["Agege", "Alimosho", "Ifako-Ijaiye", "Ikeja", "Kosofe", "Mushin", "Oshodi-Isolo", "Somolu"],
    lcdas: [
      "Agbado/Oke-Odo",
      "Ayobo-Ipaja",
      "Bariga",
      "Egbe-Idimu",
      "Ejigbo",
      "Igando-Ikotun",
      "Ikosi-Isheri",
      "Isolo",
      "Ojodu",
      "Ojokoro",
      "Onigbongbo",
      "Odi-Olowo/Ojuwoye",
      "Orile-Agege",
      "Agboyi-Ketu",
      "Mosan-Okunola",
    ],
  },
  {
    name: "Lagos Island",
    capital: "Lagos",
    lgas: ["Apapa", "Eti-Osa", "Lagos Island", "Lagos Mainland", "Surulere"],
    lcdas: ["Coker-Aguda", "Iru-Victoria Island", "Itire-Ikate", "Lagos Island East", "Yaba", "Ikoyi-Obalende", "Apapa-Iganmu"],
  },
  {
    name: "Ikorodu",
    capital: "Ikorodu",
    lgas: ["Ikorodu"],
    lcdas: ["Igbogbo-Baiyeku", "Ijede", "Ikorodu North", "Ikorodu West", "Imota"],
  },
  {
    name: "Badagry",
    capital: "Badagry",
    lgas: ["Ajeromi-Ifelodun", "Amuwo-Odofin", "Badagry", "Ojo"],
    lcdas: ["Badagry West", "Ifelodun", "Olorunda", "Oriade", "Oto-Awori", "Iba"],
  },
  {
    name: "Epe",
    capital: "Epe",
    lgas: ["Epe", "Ibeju-Lekki"],
    lcdas: ["Eredo", "Ikosi-Ejinrin", "Lekki", "Ibeju"],
  },
];

const lcdaParentLgas = new Map<string, string>([
  ["Orile-Agege", "Agege"],
  ["Ifelodun", "Ajeromi-Ifelodun"],
  ["Agbado/Oke-Odo", "Alimosho"],
  ["Ayobo-Ipaja", "Alimosho"],
  ["Egbe-Idimu", "Alimosho"],
  ["Mosan-Okunola", "Alimosho"],
  ["Igando-Ikotun", "Alimosho"],
  ["Oriade", "Amuwo-Odofin"],
  ["Apapa-Iganmu", "Apapa"],
  ["Olorunda", "Badagry"],
  ["Badagry West", "Badagry"],
  ["Eredo", "Epe"],
  ["Ikosi-Ejinrin", "Epe"],
  ["Ikoyi-Obalende", "Eti-Osa"],
  ["Iru-Victoria Island", "Eti-Osa"],
  ["Lekki", "Ibeju-Lekki"],
  ["Ojokoro", "Ifako-Ijaiye"],
  ["Onigbongbo", "Ikeja"],
  ["Ojodu", "Ikeja"],
  ["Igbogbo-Baiyeku", "Ikorodu"],
  ["Ijede", "Ikorodu"],
  ["Imota", "Ikorodu"],
  ["Ikorodu North", "Ikorodu"],
  ["Ikorodu West", "Ikorodu"],
  ["Agboyi-Ketu", "Kosofe"],
  ["Ikosi-Isheri", "Kosofe"],
  ["Lagos Island East", "Lagos Island"],
  ["Yaba", "Lagos Mainland"],
  ["Odi-Olowo/Ojuwoye", "Mushin"],
  ["Iba", "Ojo"],
  ["Oto-Awori", "Ojo"],
  ["Ejigbo", "Oshodi-Isolo"],
  ["Isolo", "Oshodi-Isolo"],
  ["Bariga", "Somolu"],
  ["Coker-Aguda", "Surulere"],
  ["Itire-Ikate", "Surulere"],
]);

const documentRequirements = [
  {
    name: "Financial Statements - Current Year",
    description: "Unaudited financial statements for the current audit year.",
    requiredFormat: "Excel",
    category: "Financial Statements",
  },
  {
    name: "Financial Statements - Prior Year",
    description: "Audited financial statements for the prior year.",
    requiredFormat: "Excel",
    category: "Financial Statements",
  },
  {
    name: "Trial Balance - Current Year",
    description: "Unaudited trial balance for the current audit year.",
    requiredFormat: "Excel",
    category: "Trial Balance",
  },
  {
    name: "Trial Balance - Prior Year",
    description: "Audited trial balance for the prior year.",
    requiredFormat: "Excel",
    category: "Trial Balance",
  },
  {
    name: "Approved Budget - Current Year",
    description: "Approved budget for the current fiscal year.",
    requiredFormat: "Excel",
    category: "Budget",
  },
  {
    name: "Approved Budget - Prior Year",
    description: "Approved budget for the prior fiscal year.",
    requiredFormat: "Excel",
    category: "Budget",
  },
  {
    name: "Bank Statements",
    description: "Bank statements for all council accounts covering the audit period.",
    requiredFormat: "PDF",
    category: "Treasury",
  },
  {
    name: "Payroll Records",
    description: "Staff establishment and payroll records for the audit period.",
    requiredFormat: "Excel",
    category: "Payroll",
  },
  {
    name: "Revenue Collection Records",
    description: "IGR collection records, receipts, and revenue schedules.",
    requiredFormat: "Excel/PDF",
    category: "Revenue",
  },
  {
    name: "Capital Project Files",
    description: "Contract documents, project files, and completion certificates.",
    requiredFormat: "PDF",
    category: "Projects",
  },
  {
    name: "Procurement Records",
    description: "Procurement documentation, bid evaluations, and contract awards.",
    requiredFormat: "PDF",
    category: "Procurement",
  },
  {
    name: "Fixed Asset Register",
    description: "Fixed asset register with acquisition details, locations, and values.",
    requiredFormat: "Excel",
    category: "Assets",
  },
  {
    name: "Tenders Board Minutes",
    description: "Minutes of Tenders Board and Finance Committee meetings.",
    requiredFormat: "PDF",
    category: "Governance",
  },
  {
    name: "Internal Audit Reports",
    description: "Internal audit reports and management responses.",
    requiredFormat: "PDF",
    category: "Internal Audit",
  },
  {
    name: "Cash Books and Ledgers",
    description: "Cash books and general ledger records for all council accounts.",
    requiredFormat: "Excel",
    category: "Accounting Records",
  },
  {
    name: "Previous Audit Reports",
    description: "Previous external audit reports and management responses.",
    requiredFormat: "PDF",
    category: "Audit History",
  },
  {
    name: "Payment Vouchers",
    description: "Payment vouchers and supporting expenditure documentation.",
    requiredFormat: "PDF",
    category: "Expenditure",
  },
  {
    name: "Budget Implementation Report",
    description: "Budget performance reports showing actual versus approved expenditure.",
    requiredFormat: "PDF",
    category: "Budget",
  },
  {
    name: "Management Letter Responses",
    description: "Responses to previous audit management letters and outstanding audit queries.",
    requiredFormat: "PDF",
    category: "Audit History",
  },
];

async function upsertUser(data: {
  name: string;
  email: string;
  role: Role;
  phone?: string;
  zoneId?: string;
  councilId?: string;
  specialisations?: string[];
}) {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.upsert({
    where: { email: data.email },
    update: {
      name: data.name,
      role: data.role,
      phone: data.phone,
      zoneId: data.zoneId,
      councilId: data.councilId,
      specialisations: data.specialisations ?? [],
      status: "ACTIVE",
    },
    create: {
      ...data,
      passwordHash,
    },
  });
}

async function main() {
  const zoneRecords = new Map<string, string>();

  for (const [index, requirement] of documentRequirements.entries()) {
    await prisma.documentRequirement.upsert({
      where: { name: requirement.name },
      update: {
        description: requirement.description,
        requiredFormat: requirement.requiredFormat,
        category: requirement.category,
        sortOrder: index + 1,
      },
      create: {
        ...requirement,
        sortOrder: index + 1,
      },
    });
  }

  for (const zone of zones) {
    const zoneRecord = await prisma.zone.upsert({
      where: { name: zone.name },
      update: { capital: zone.capital },
      create: { name: zone.name, capital: zone.capital },
    });

    zoneRecords.set(zone.name, zoneRecord.id);

    for (const name of zone.lgas) {
      await prisma.council.upsert({
        where: { name },
        update: { type: "LGA", zoneId: zoneRecord.id },
        create: { name, type: "LGA", zoneId: zoneRecord.id },
      });
    }

    for (const name of zone.lcdas) {
      const parentLgaName = lcdaParentLgas.get(name);
      const parentLga = parentLgaName
        ? await prisma.council.findUnique({ where: { name: parentLgaName } })
        : null;

      await prisma.council.upsert({
        where: { name },
        update: { type: "LCDA", zoneId: zoneRecord.id, parentLgaId: parentLga?.id },
        create: { name, type: "LCDA", zoneId: zoneRecord.id, parentLgaId: parentLga?.id },
      });
    }
  }

  const ikejaZoneId = zoneRecords.get("Ikeja");
  const lagosIslandZoneId = zoneRecords.get("Lagos Island");
  const mushinCouncil = await prisma.council.findUniqueOrThrow({ where: { name: "Mushin" } });
  const lagosIslandCouncil = await prisma.council.findUniqueOrThrow({
    where: { name: "Lagos Island" },
  });

  await upsertUser({
    name: "Engr. Babatunde Fashola",
    // email: "sysadmin@lasg.gov.ng",
    email: "dewaleolaoye@gmail.com",
    role: "SYSTEM_ADMIN",
    phone: "+234 802 000 0001",
  });

  await upsertUser({
    name: "Hon. Adebayo Oluwaseun",
    // email: "ag@lasg.gov.ng",
    email: "ade@gmail.com",
    role: "STATE_AUDITOR_GENERAL",
    phone: "+234 802 300 0001",
  });

  const supervisor = await upsertUser({
    name: "Mrs. Folashade Adekunle",
    email: "sup.mushin@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    phone: "+234 803 400 0001",
    zoneId: ikejaZoneId,
    specialisations: ["Financial", "Compliance"],
  });

  if (ikejaZoneId) {
    await prisma.zone.update({
      where: { id: ikejaZoneId },
      data: { supervisorId: supervisor.id },
    });
  }

  await upsertUser({
    name: "Alh. Jide Johnson",
    email: "jide.johnson@lasg.gov.ng",
    role: "AUDIT_LEAD",
    phone: "+234 803 123 4567",
    zoneId: lagosIslandZoneId,
    councilId: lagosIslandCouncil.id,
    specialisations: ["Financial", "Compliance"],
  });

  await upsertUser({
    name: "Miss Oluwadamilola Ige (Mushin)",
    email: "auditor.ige@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    phone: "+234 807 800 0001",
    zoneId: ikejaZoneId,
    councilId: mushinCouncil.id,
    specialisations: ["Financial"],
  });

  await upsertUser({
    name: "Mrs. Folake Akinwunmi (HLGA Mushin)",
    email: "hlga.mushin@lasg.gov.ng",
    role: "HEAD_OF_LOCAL_GOVERNMENT",
    phone: "+234 809 999 0001",
    councilId: mushinCouncil.id,
  });

  console.log("Seed complete");
  console.log(`Default password for seeded users: ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
