import { CouncilType } from "../../generated/prisma/client";
import * as councilsRepository from "./councils.repository";
import { serializeCouncil } from "./councils.serializer";

export const councilTypeValues = Object.values(CouncilType);

export async function listCouncils(filters: Parameters<typeof councilsRepository.listCouncils>[0]) {
  const councils = await councilsRepository.listCouncils(filters);
  return councils.map(serializeCouncil);
}

export async function getCouncilById(id: string) {
  const council = await councilsRepository.getCouncilById(id);
  return serializeCouncil(council);
}

export const updateCouncil = councilsRepository.updateCouncil;
