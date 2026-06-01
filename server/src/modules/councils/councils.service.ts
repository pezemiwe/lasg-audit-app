import { CouncilType } from "../../generated/prisma/client";
import { HttpError } from "../../common/errors/httpError";
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

export async function assignHeadOfLocalGovernment(councilId: string, userId: string) {
  const user = await councilsRepository.getUserById(userId);

  if (user.role !== "HEAD_OF_LOCAL_GOVERNMENT") {
    throw new HttpError(400, "Only users with HEAD_OF_LOCAL_GOVERNMENT role can be assigned");
  }

  if (user.status !== "ACTIVE") {
    throw new HttpError(400, "Only active HoLG users can be assigned");
  }

  const council = await councilsRepository.assignHeadOfLocalGovernment(councilId, userId);
  return serializeCouncil(council);
}
