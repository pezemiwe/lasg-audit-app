import { CouncilType } from "../../generated/prisma/client";
import * as councilsRepository from "./councils.repository";

export const councilTypeValues = Object.values(CouncilType);
export const listCouncils = councilsRepository.listCouncils;
export const getCouncilById = councilsRepository.getCouncilById;
export const updateCouncil = councilsRepository.updateCouncil;
