import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import { app } from "../../../app";
import { writeActivityLog } from "../../activity/activity.service";
import {
  acceptMandate,
  completeMandate,
  createMandate,
  deleteMandate,
  getMandate,
  getMandateAcceptanceSummary,
  listMandateCouncils,
  listMandatesWithFilters,
  publishMandate,
  rejectMandate,
  updateMandate,
} from "../mandates.service";

const mockCurrentUser = {
  id: "sag-1",
  email: "sag@example.com",
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

jest.mock("../mandates.service", () => ({
  acceptMandate: jest.fn(),
  auditTypeValues: ["FINANCIAL", "PERFORMANCE", "COMPLIANCE", "COMBINED"],
  completeMandate: jest.fn(),
  createMandate: jest.fn(),
  deleteMandate: jest.fn(),
  getMandate: jest.fn(),
  getMandateAcceptanceSummary: jest.fn(),
  listMandateCouncils: jest.fn(),
  listMandatesWithFilters: jest.fn(),
  mandateCouncilStatusValues: ["PENDING", "ACCEPTED", "REJECTED"],
  mandateStatusValues: ["DRAFT", "PUBLISHED", "ACTIVE", "COMPLETED"],
  normalizeMandateCouncilStatus: jest.fn((value: string) => value.toUpperCase()),
  publishMandate: jest.fn(),
  rejectMandate: jest.fn(),
  updateMandate: jest.fn(),
}));

jest.mock("../../activity/activity.service", () => ({
  writeActivityLog: jest.fn(),
}));

const mockedListMandates = jest.mocked(listMandatesWithFilters);
const mockedGetMandate = jest.mocked(getMandate);
const mockedPublishMandate = jest.mocked(publishMandate);
const mockedAcceptMandate = jest.mocked(acceptMandate);
const mockedRejectMandate = jest.mocked(rejectMandate);
const mockedListMandateCouncils = jest.mocked(listMandateCouncils);
const mockedWriteActivityLog = jest.mocked(writeActivityLog);

describe("mandates.controller", () => {
  beforeEach(() => {
    mockCurrentUser.role = "STATE_AUDITOR_GENERAL";
    mockedWriteActivityLog.mockResolvedValue(undefined);
  });

  it("lists mandates with status filter", async () => {
    mockedListMandates.mockResolvedValue([{ id: "mandate-1", status: "DRAFT" }] as never);

    const response = await request(app).get("/api/v1/mandates").query({ status: "DRAFT" });

    expect(response.status).toBe(200);
    expect(mockedListMandates).toHaveBeenCalledWith(
      expect.objectContaining({ id: "sag-1", role: "STATE_AUDITOR_GENERAL" }),
      { status: "DRAFT" },
    );
  });

  it("rejects invalid mandate status filter", async () => {
    const response = await request(app).get("/api/v1/mandates").query({ status: "BAD_STATUS" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(mockedListMandates).not.toHaveBeenCalled();
  });

  it("gets a mandate by id", async () => {
    mockedGetMandate.mockResolvedValue({ id: "mandate-1", title: "Annual Audit" } as never);

    const response = await request(app).get("/api/v1/mandates/mandate-1");

    expect(response.status).toBe(200);
    expect(mockedGetMandate).toHaveBeenCalledWith(
      "mandate-1",
      expect.objectContaining({ id: "sag-1" }),
    );
  });

  it("publishes a mandate and writes an activity log", async () => {
    mockedPublishMandate.mockResolvedValue({ id: "mandate-1", status: "PUBLISHED" } as never);

    const response = await request(app).patch("/api/v1/mandates/mandate-1/publish");

    expect(response.status).toBe(200);
    expect(mockedPublishMandate).toHaveBeenCalledWith("mandate-1");
    expect(mockedWriteActivityLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "MANDATE_PUBLISHED", entityId: "mandate-1" }),
    );
  });

  it("accepts a mandate for head of local government role", async () => {
    mockCurrentUser.role = "HEAD_OF_LOCAL_GOVERNMENT";
    mockedAcceptMandate.mockResolvedValue({
      mandateId: "mandate-1",
      councilId: "council-1",
      status: "ACCEPTED",
    } as never);

    const response = await request(app).patch("/api/v1/mandates/mandate-1/accept");

    expect(response.status).toBe(200);
    expect(mockedAcceptMandate).toHaveBeenCalledWith(
      "mandate-1",
      expect.objectContaining({ role: "HEAD_OF_LOCAL_GOVERNMENT" }),
    );
  });

  it("rejects a mandate with optional reason for head of local government role", async () => {
    mockCurrentUser.role = "HEAD_OF_LOCAL_GOVERNMENT";
    mockedRejectMandate.mockResolvedValue({
      mandateId: "mandate-1",
      councilId: "council-1",
      status: "REJECTED",
    } as never);

    const response = await request(app)
      .patch("/api/v1/mandates/mandate-1/reject")
      .send({ rejectionReason: "Incomplete documentation" });

    expect(response.status).toBe(200);
    expect(mockedRejectMandate).toHaveBeenCalledWith(
      "mandate-1",
      expect.objectContaining({ role: "HEAD_OF_LOCAL_GOVERNMENT" }),
      "Incomplete documentation",
    );
  });

  it("lists mandate councils with status filter", async () => {
    mockedListMandateCouncils.mockResolvedValue([
      { id: "mc-1", councilId: "council-1", status: "ACCEPTED" },
    ] as never);

    const response = await request(app)
      .get("/api/v1/mandates/mandate-1/councils")
      .query({ status: "ACCEPTED" });

    expect(response.status).toBe(200);
    expect(mockedListMandateCouncils).toHaveBeenCalledWith(
      "mandate-1",
      expect.objectContaining({ id: "sag-1" }),
      { status: "ACCEPTED" },
    );
  });
});

void createMandate;
void updateMandate;
void deleteMandate;
void completeMandate;
void getMandateAcceptanceSummary;
