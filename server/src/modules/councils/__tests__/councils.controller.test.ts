import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import { app } from "../../../app";
import { writeActivityLog } from "../../activity/activity.service";
import { getCouncilById, listCouncils, updateCouncil } from "../councils.service";

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

jest.mock("../councils.service", () => ({
  councilTypeValues: ["LGA", "LCDA"],
  getCouncilById: jest.fn(),
  listCouncils: jest.fn(),
  updateCouncil: jest.fn(),
}));

jest.mock("../../activity/activity.service", () => ({
  writeActivityLog: jest.fn(),
}));

const mockedListCouncils = jest.mocked(listCouncils);
const mockedGetCouncilById = jest.mocked(getCouncilById);
const mockedUpdateCouncil = jest.mocked(updateCouncil);
const mockedWriteActivityLog = jest.mocked(writeActivityLog);

describe("councils.controller", () => {
  beforeEach(() => {
    mockCurrentUser.role = "STATE_AUDITOR_GENERAL";
    mockedWriteActivityLog.mockResolvedValue(undefined);
  });

  it("lists councils with filters", async () => {
    mockedListCouncils.mockResolvedValue([{ id: "council-1", name: "Agege", type: "LGA" }] as never);

    const response = await request(app)
      .get("/api/v1/councils")
      .query({ zoneId: "zone-1", type: "LGA" });

    expect(response.status).toBe(200);
    expect(mockedListCouncils).toHaveBeenCalledWith({ zoneId: "zone-1", type: "LGA" });
  });

  it("rejects invalid council type filter", async () => {
    const response = await request(app).get("/api/v1/councils").query({ type: "BAD_TYPE" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(mockedListCouncils).not.toHaveBeenCalled();
  });

  it("gets a council by id", async () => {
    mockedGetCouncilById.mockResolvedValue({ id: "council-1", name: "Agege" } as never);

    const response = await request(app).get("/api/v1/councils/council-1");

    expect(response.status).toBe(200);
    expect(mockedGetCouncilById).toHaveBeenCalledWith("council-1");
  });

  it("updates council contact details", async () => {
    mockedUpdateCouncil.mockResolvedValue({
      id: "council-1",
      contactEmail: "contact@example.com",
    } as never);

    const response = await request(app).put("/api/v1/councils/council-1").send({
      contactName: "Contact Person",
      contactEmail: "contact@example.com",
      contactPhone: "08000000000",
    });

    expect(response.status).toBe(200);
    expect(mockedUpdateCouncil).toHaveBeenCalledWith("council-1", {
      contactName: "Contact Person",
      contactEmail: "contact@example.com",
      contactPhone: "08000000000",
    });
    expect(mockedWriteActivityLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "COUNCIL_UPDATED", entityId: "council-1" }),
    );
  });
});
