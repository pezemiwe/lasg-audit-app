import type { CouncilType } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";

export function listCouncils(filters: { zoneId?: string; type?: CouncilType }) {
  return prisma.council.findMany({
    where: filters,
    include: { zone: true },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
}

export function getCouncilById(id: string) {
  return prisma.council.findUniqueOrThrow({
    where: { id },
    include: {
      zone: true,
      parentLga: true,
      lcdas: { orderBy: { name: "asc" } },
    },
  });
}

export function updateCouncil(
  id: string,
  data: {
    contactName?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
  },
) {
  return prisma.council.update({ where: { id }, data });
}
