/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFiles: ["<rootDir>/__tests__/setupEnv.ts"],
  moduleNameMapper: {
    ".*/generated/prisma/client$": "<rootDir>/__tests__/prismaClientMock.ts",
  },
  clearMocks: true,
  restoreMocks: true,
  watchman: false,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/generated/**",
    "!src/server.ts",
  ],
};
