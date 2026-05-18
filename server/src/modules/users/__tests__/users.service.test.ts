import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { createUser } from "../users.service";
import * as usersRepository from "../users.repository";

jest.mock("../users.repository", () => ({
  councilExists: jest.fn(),
  createUser: jest.fn(),
  zoneExists: jest.fn(),
}));

const mockedCouncilExists = jest.mocked(usersRepository.councilExists);
const mockedCreateUser = jest.mocked(usersRepository.createUser);
const mockedZoneExists = jest.mocked(usersRepository.zoneExists);

describe("users.service", () => {
  beforeEach(() => {
    mockedCouncilExists.mockResolvedValue(true);
    mockedZoneExists.mockResolvedValue(true);
    mockedCreateUser.mockResolvedValue({
      id: "user-1",
      name: "New User",
      email: "new@example.com",
      phone: null,
      role: "TEAM_AUDITOR",
      status: "ACTIVE",
      zoneId: null,
      councilId: null,
      specialisations: [],
      passwordHash: "hashed-password",
      createdAt: new Date("2026-05-01T10:00:00.000Z"),
      updatedAt: new Date("2026-05-01T10:00:00.000Z"),
    } as never);
  });

  it("rejects a create request when zoneId does not exist", async () => {
    mockedZoneExists.mockResolvedValue(false);

    await expect(
      createUser({
        name: "New User",
        email: "new@example.com",
        password: "password123",
        role: "TEAM_AUDITOR",
        zoneId: "missing-zone",
      }),
    ).rejects.toMatchObject({
      message: "zoneId must reference an existing zone",
      statusCode: 400,
    });

    expect(mockedZoneExists).toHaveBeenCalledWith("missing-zone");
    expect(mockedCreateUser).not.toHaveBeenCalled();
  });

  it("rejects a create request when zoneId is invalid", async () => {
    mockedZoneExists.mockResolvedValue(false);

    await expect(
      createUser({
        name: "New User",
        email: "new@example.com",
        password: "password123",
        role: "TEAM_AUDITOR",
        zoneId: "",
      }),
    ).rejects.toMatchObject({
      message: "zoneId must reference an existing zone",
      statusCode: 400,
    });

    expect(mockedZoneExists).toHaveBeenCalledWith("");
    expect(mockedCreateUser).not.toHaveBeenCalled();
  });

  it("rejects a create request when councilId does not exist", async () => {
    mockedCouncilExists.mockResolvedValue(false);

    await expect(
      createUser({
        name: "New User",
        email: "new@example.com",
        password: "password123",
        role: "TEAM_AUDITOR",
        councilId: "missing-council",
      }),
    ).rejects.toMatchObject({
      message: "councilId must reference an existing council",
      statusCode: 400,
    });

    expect(mockedCouncilExists).toHaveBeenCalledWith("missing-council");
    expect(mockedCreateUser).not.toHaveBeenCalled();
  });

  it("rejects a create request when councilId is invalid", async () => {
    mockedCouncilExists.mockResolvedValue(false);

    await expect(
      createUser({
        name: "New User",
        email: "new@example.com",
        password: "password123",
        role: "TEAM_AUDITOR",
        councilId: "",
      }),
    ).rejects.toMatchObject({
      message: "councilId must reference an existing council",
      statusCode: 400,
    });

    expect(mockedCouncilExists).toHaveBeenCalledWith("");
    expect(mockedCreateUser).not.toHaveBeenCalled();
  });
});
