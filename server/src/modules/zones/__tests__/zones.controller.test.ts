import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import { app } from "../../../app";
import { writeActivityLog } from "../../activity/activity.service";
import { getZoneById, listZoneCouncils, listZones, updateZoneSupervisor } from "../zones.service";

const mockCurrentUser = {
  id: "admin-1",
  email: "admin@example.com",
  role: "STATE_AUDITOR_GENERAL",
};

jest.mock("../../../common/middleware/authMiddleware", () => ({
  authenticate: (req: Request, _res: Response, next: NextFunction) => {
    req.user = mockCurrentUser as Request["user"];
    next();
  },
  requireRoles:
    (...roles: string[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
      if (!roles.includes(req.user!.role)) {
        const error = new Error("You do not have permission to perform this action") as Error & {
          statusCode: number;
        };
        error.statusCode = 403;
        return next(error);
      }
      return next();
    },
}));

jest.mock("../zones.service", () => ({
  getZoneById: jest.fn(),
  listZoneCouncils: jest.fn(),
  listZones: jest.fn(),
  updateZoneSupervisor: jest.fn(),
}));

jest.mock("../../activity/activity.service", () => ({
  writeActivityLog: jest.fn(),
}));

const mockedListZones = jest.mocked(listZones);
const mockedGetZoneById = jest.mocked(getZoneById);
const mockedListZoneCouncils = jest.mocked(listZoneCouncils);
const mockedUpdateZoneSupervisor = jest.mocked(updateZoneSupervisor);
const mockedWriteActivityLog = jest.mocked(writeActivityLog);

describe("zones.controller", () => {
  beforeEach(() => {
    mockCurrentUser.role = "STATE_AUDITOR_GENERAL";
    mockedWriteActivityLog.mockResolvedValue(undefined);
  });

  it("lists zones", async () => {
    mockedListZones.mockResolvedValue([{ id: "zone-1", name: "Ikeja", capital: "Ikeja" }] as never);

    const response = await request(app).get("/api/v1/zones");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([expect.objectContaining({ id: "zone-1" })]);
    expect(mockedListZones).toHaveBeenCalled();
  });

  it("gets a zone by id", async () => {
    mockedGetZoneById.mockResolvedValue({ id: "zone-1", name: "Ikeja" } as never);

    const response = await request(app).get("/api/v1/zones/zone-1");

    expect(response.status).toBe(200);
    expect(mockedGetZoneById).toHaveBeenCalledWith("zone-1");
  });

  it("lists councils in a zone", async () => {
    mockedListZoneCouncils.mockResolvedValue([{ id: "council-1", name: "Agege" }] as never);

    const response = await request(app).get("/api/v1/zones/zone-1/councils");

    expect(response.status).toBe(200);
    expect(mockedListZoneCouncils).toHaveBeenCalledWith("zone-1");
  });

  it("updates zone supervisor for allowed roles", async () => {
    mockedUpdateZoneSupervisor.mockResolvedValue({
      id: "zone-1",
      supervisorId: "supervisor-1",
    } as never);

    const response = await request(app)
      .patch("/api/v1/zones/zone-1/supervisors")
      .send({ supervisorId: "supervisor-1" });

    expect(response.status).toBe(200);
    expect(mockedUpdateZoneSupervisor).toHaveBeenCalledWith("zone-1", "supervisor-1");
    expect(mockedWriteActivityLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "ZONE_SUPERVISOR_UPDATED", entityId: "zone-1" }),
    );
  });
});
