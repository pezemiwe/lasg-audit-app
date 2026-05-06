import { prisma } from "../../config/prisma";

export function listZones() {
  return prisma.zone.findMany({
    include: {
      supervisor: {
        select: { id: true, name: true, email: true, role: true },
      },
      _count: { select: { councils: true } },
    },
    orderBy: { name: "asc" },
  });
}

export function getZoneById(id: string) {
  return prisma.zone.findUniqueOrThrow({
    where: { id },
    include: {
      supervisor: {
        select: { id: true, name: true, email: true, role: true },
      },
      councils: { orderBy: [{ type: "asc" }, { name: "asc" }] },
    },
  });
}

export function listZoneCouncils(zoneId: string) {
  return prisma.council.findMany({
    where: { zoneId },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
}

export function updateZoneSupervisor(id: string, supervisorId: string | null) {
  return prisma.zone.update({
    where: { id },
    data: { supervisorId },
    include: {
      supervisor: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
}
