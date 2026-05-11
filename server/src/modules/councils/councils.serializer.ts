import type { Council, User, Zone } from "../../generated/prisma/client";

type CouncilWithRelations = Council & {
  zone?: Zone;
  parentLga?: Council | null;
  lcdas?: Council[];
  users?: Array<Pick<User, "id" | "name" | "email" | "phone" | "role" | "status">>;
};

export function serializeCouncil(council: CouncilWithRelations) {
  const { users: headUsers, ...rest } = council;

  return {
    ...rest,
    holg: headUsers?.[0] ?? null,
  };
}
