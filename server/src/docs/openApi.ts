export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "LASG Audit Automation Platform API",
    version: "0.1.0",
    description:
      "Phase 1 backend API for authentication, users, roles, zones, councils, and activity.",
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Local development",
    },
  ],
  tags: [
    { name: "Auth" },
    { name: "Users" },
    { name: "Roles" },
    { name: "Zones" },
    { name: "Councils" },
    { name: "Activity" },
    { name: "Health" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Role: {
        type: "string",
        enum: [
          "SYSTEM_ADMIN",
          "STATE_AUDITOR_GENERAL",
          "AUDIT_SUPERVISOR",
          "AUDIT_LEAD",
          "TEAM_AUDITOR",
          "HEAD_OF_LOCAL_GOVERNMENT",
        ],
      },
      UserStatus: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      },
      CouncilType: {
        type: "string",
        enum: ["LGA", "LCDA"],
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string", nullable: true },
          role: { $ref: "#/components/schemas/Role" },
          status: { $ref: "#/components/schemas/UserStatus" },
          zoneId: { type: "string", nullable: true },
          councilId: { type: "string", nullable: true },
          specialisations: {
            type: "array",
            items: { type: "string" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Zone: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          capital: { type: "string" },
          supervisorId: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Council: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          type: { $ref: "#/components/schemas/CouncilType" },
          zoneId: { type: "string" },
          parentLgaId: { type: "string", nullable: true },
          contactName: { type: "string", nullable: true },
          contactEmail: { type: "string", nullable: true },
          contactPhone: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ActivityLog: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string", nullable: true },
          action: { type: "string" },
          entityType: { type: "string" },
          entityId: { type: "string", nullable: true },
          details: { type: "object", nullable: true },
          ipAddress: { type: "string", nullable: true },
          userAgent: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          status: { type: "number", example: 200 },
          message: { type: "string", example: "Successful" },
          data: { nullable: true },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "number", example: 400 },
          message: { type: "string" },
          data: { nullable: true },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Authentication is required or token is invalid",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Forbidden: {
        description: "Authenticated user does not have permission",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      ValidationError: {
        description: "Validation failed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",
        servers: [{ url: "http://localhost:5000" }],
        responses: {
          "200": {
            description: "Server is healthy",
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Authenticated session",
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the current authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Issue a password reset token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Reset token issued when account exists" },
        },
      },
    },
    "/auth/new-password": {
      post: {
        tags: ["Auth"],
        summary: "Set a new password with reset token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "password"],
                properties: {
                  token: { type: "string" },
                  password: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Password updated successfully" },
          "400": { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "role", in: "query", schema: { $ref: "#/components/schemas/Role" } },
          {
            name: "status",
            in: "query",
            schema: { $ref: "#/components/schemas/UserStatus" },
          },
          { name: "zoneId", in: "query", schema: { type: "string" } },
          { name: "councilId", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "role"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                  role: { $ref: "#/components/schemas/Role" },
                  phone: { type: "string" },
                  zoneId: { type: "string" },
                  councilId: { type: "string" },
                  specialisations: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Created user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "User",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Updated user" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Deactivate user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "204": { description: "User deactivated" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/users/{id}/status": {
      patch: {
        tags: ["Users"],
        summary: "Update user status",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Updated user" },
        },
      },
    },
    "/users/{id}/password": {
      patch: {
        tags: ["Users"],
        summary: "Set user password as system admin",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Password updated" },
        },
      },
    },
    "/roles": {
      get: {
        tags: ["Roles"],
        summary: "List platform roles",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Roles",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Role" },
                },
              },
            },
          },
        },
      },
    },
    "/zones": {
      get: {
        tags: ["Zones"],
        summary: "List zones",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Zones",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Zone" },
                },
              },
            },
          },
        },
      },
    },
    "/zones/{id}": {
      get: {
        tags: ["Zones"],
        summary: "Get zone by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Zone" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/zones/{id}/councils": {
      get: {
        tags: ["Zones"],
        summary: "List councils in a zone",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "Councils",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Council" },
                },
              },
            },
          },
        },
      },
    },
    "/zones/{id}/supervisors": {
      patch: {
        tags: ["Zones"],
        summary: "Assign or clear zone supervisor",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  supervisorId: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Updated zone" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/councils": {
      get: {
        tags: ["Councils"],
        summary: "List councils",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "zoneId", in: "query", schema: { type: "string" } },
          { name: "type", in: "query", schema: { $ref: "#/components/schemas/CouncilType" } },
        ],
        responses: {
          "200": {
            description: "Councils",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Council" },
                },
              },
            },
          },
        },
      },
    },
    "/councils/{id}": {
      get: {
        tags: ["Councils"],
        summary: "Get council by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Council" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Councils"],
        summary: "Update council contact details",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Updated council" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/activity": {
      get: {
        tags: ["Activity"],
        summary: "List activity entries",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "userId", in: "query", schema: { type: "string" } },
          { name: "entityType", in: "query", schema: { type: "string" } },
          { name: "entityId", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Audit log entries",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ActivityLog" },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/activity/{id}": {
      get: {
        tags: ["Activity"],
        summary: "Get activity entry by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Audit log entry" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },
} as const;
