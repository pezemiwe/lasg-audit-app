export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "LASG Audit Automation Platform API",
    version: "0.1.0",
    description:
      "Backend API for authentication, users, roles, zones, councils, mandates, and activity.",
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
    { name: "Mandates" },
    { name: "Audits" },
    { name: "Document Requirements" },
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
      AuditType: {
        type: "string",
        enum: ["FINANCIAL", "PERFORMANCE", "COMPLIANCE", "COMBINED"],
      },
      MandateStatus: {
        type: "string",
        enum: ["DRAFT", "PUBLISHED", "ACTIVE", "COMPLETED"],
      },
      MandateTargetMode: {
        type: "string",
        enum: ["ALL_COUNCILS", "SELECTED_COUNCILS"],
      },
      MandateCouncilStatus: {
        type: "string",
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
      },
      AuditStatus: {
        type: "string",
        enum: [
          "PENDING",
          "PRE_AUDIT",
          "PLANNING",
          "FIELDWORK",
          "REVIEW",
          "REPORTING",
          "POST_AUDIT",
          "COMPLETED",
        ],
      },
      DocumentRequirementStatus: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE"],
      },
      DocumentRequirement: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          requiredFormat: { type: "string" },
          category: { type: "string", nullable: true },
          sortOrder: { type: "integer" },
          status: { $ref: "#/components/schemas/DocumentRequirementStatus" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AuditDocumentStatus: {
        type: "string",
        enum: ["NOT_UPLOADED", "UPLOADED", "REVIEWED", "APPROVED", "REJECTED"],
      },
      AuditDocument: {
        type: "object",
        properties: {
          id: { type: "string" },
          auditId: { type: "string" },
          documentRequirementId: { type: "string", nullable: true },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          requiredFormat: { type: "string" },
          category: { type: "string", nullable: true },
          sortOrder: { type: "integer" },
          status: { $ref: "#/components/schemas/AuditDocumentStatus" },
          fileUrl: { type: "string", nullable: true },
          originalFileName: { type: "string", nullable: true },
          mimeType: { type: "string", nullable: true },
          fileSize: { type: "integer", nullable: true },
          uploadedById: { type: "string", nullable: true },
          uploadedAt: { type: "string", format: "date-time", nullable: true },
          reviewedById: { type: "string", nullable: true },
          reviewedAt: { type: "string", format: "date-time", nullable: true },
          rejectionReason: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Audit: {
        type: "object",
        properties: {
          id: { type: "string" },
          mandateId: { type: "string" },
          mandateCouncilId: { type: "string" },
          councilId: { type: "string" },
          zoneId: { type: "string" },
          title: { type: "string" },
          year: { type: "integer" },
          auditTypes: {
            type: "array",
            items: { $ref: "#/components/schemas/AuditType" },
          },
          status: { $ref: "#/components/schemas/AuditStatus" },
          progress: { type: "integer", minimum: 0, maximum: 100 },
          startDate: { type: "string", format: "date-time", nullable: true },
          endDate: { type: "string", format: "date-time", nullable: true },
          leadId: { type: "string", nullable: true },
          startedAt: { type: "string", format: "date-time", nullable: true },
          completedAt: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
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
      Mandate: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          year: { type: "number" },
          description: { type: "string" },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
          scope: { type: "string" },
          objectives: { type: "array", items: { type: "string" } },
          auditTypes: { type: "array", items: { $ref: "#/components/schemas/AuditType" } },
          signatureUrl: { type: "string" },
          targetMode: { $ref: "#/components/schemas/MandateTargetMode" },
          status: { $ref: "#/components/schemas/MandateStatus" },
          createdById: { type: "string" },
          publishedAt: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
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
    "/mandates": {
      get: {
        tags: ["Mandates"],
        summary: "List mandates visible to the authenticated user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { $ref: "#/components/schemas/MandateStatus" },
            example: "PUBLISHED",
          },
        ],
        responses: {
          "200": {
            description: "Mandates",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Mandate" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Mandates"],
        summary: "Create draft mandate",
        description:
          "State Auditor-General only. targetMode is derived by the server: selected council IDs produce SELECTED_COUNCILS, otherwise ALL_COUNCILS.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: [
                  "title",
                  "year",
                  "description",
                  "startDate",
                  "endDate",
                  "scope",
                  "objectives",
                  "auditTypes",
                  "signature",
                ],
                properties: {
                  title: { type: "string" },
                  year: { type: "integer", example: 2026 },
                  description: { type: "string" },
                  startDate: { type: "string", format: "date" },
                  endDate: { type: "string", format: "date" },
                  scope: { type: "string" },
                  objectives: {
                    type: "string",
                    description: "JSON array string or comma-separated values",
                    example: "[\"Review IPSAS compliance\",\"Assess internal controls\"]",
                  },
                  auditTypes: {
                    type: "string",
                    description: "JSON array string or comma-separated values",
                    example: "[\"FINANCIAL\",\"COMPLIANCE\"]",
                  },
                  targetCouncilIds: {
                    type: "string",
                    description: "Optional JSON array string or comma-separated council IDs",
                  },
                  signature: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Created mandate" },
          "400": { $ref: "#/components/responses/ValidationError" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/mandates/{id}": {
      get: {
        tags: ["Mandates"],
        summary: "Get mandate by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Mandate" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Mandates"],
        summary: "Update draft mandate",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Updated mandate" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
      delete: {
        tags: ["Mandates"],
        summary: "Delete draft mandate",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Deleted mandate" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/mandates/{id}/publish": {
      patch: {
        tags: ["Mandates"],
        summary: "Publish draft mandate",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Published mandate" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/mandates/{id}/accept": {
      patch: {
        tags: ["Mandates"],
        summary: "Accept mandate for HoLG council",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Accepted mandate" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/mandates/{id}/reject": {
      patch: {
        tags: ["Mandates"],
        summary: "Reject mandate for HoLG council",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  rejectionReason: { type: "string", maxLength: 1000 },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Rejected mandate" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/mandates/{id}/complete": {
      patch: {
        tags: ["Mandates"],
        summary: "Complete active mandate",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Completed mandate" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/mandates/{id}/councils": {
      get: {
        tags: ["Mandates"],
        summary: "List councils targeted by a mandate",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Mandate councils" },
        },
      },
    },
    "/mandates/{id}/acceptance": {
      get: {
        tags: ["Mandates"],
        summary: "List mandate council acceptance records",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          {
            name: "acceptanceStatus",
            in: "query",
            schema: { $ref: "#/components/schemas/MandateCouncilStatus" },
            description: "Defaults to ACCEPTED when omitted.",
            examples: {
              accepted: { value: "ACCEPTED" },
              pending: { value: "PENDING" },
              rejected: { value: "REJECTED" },
            },
          },
        ],
        responses: {
          "200": { description: "Mandate acceptance records" },
        },
      },
    },
    "/mandates/{id}/acceptance/summary": {
      get: {
        tags: ["Mandates"],
        summary: "Get mandate acceptance summary",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Mandate acceptance summary" },
        },
      },
    },
    "/audits": {
      get: {
        tags: ["Audits"],
        summary: "List audits visible to the authenticated user",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "status", in: "query", schema: { $ref: "#/components/schemas/AuditStatus" } },
          { name: "mandateId", in: "query", schema: { type: "string" } },
          { name: "councilId", in: "query", schema: { type: "string" } },
          { name: "zoneId", in: "query", schema: { type: "string" } },
          { name: "leadId", in: "query", schema: { type: "string" } },
          { name: "year", in: "query", schema: { type: "integer", example: 2026 } },
        ],
        responses: {
          "200": {
            description: "Audits",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Audit" },
                },
              },
            },
          },
        },
      },
    },
    "/audits/{id}": {
      get: {
        tags: ["Audits"],
        summary: "Get audit by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Audit" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/audits/{auditId}/documents": {
      get: {
        tags: ["Audits"],
        summary: "List documents required for an audit",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "auditId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Audit documents",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AuditDocument" },
                },
              },
            },
          },
        },
      },
    },
    "/audits/{auditId}/documents/{documentId}/upload": {
      post: {
        tags: ["Audits"],
        summary: "Upload a document for an audit checklist item",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "auditId", in: "path", required: true, schema: { type: "string" } },
          { name: "documentId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Uploaded audit document" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/audit-documents/{id}/review": {
      patch: {
        tags: ["Audits"],
        summary: "Mark uploaded audit document as reviewed",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Reviewed audit document" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/audit-documents/{id}/approve": {
      patch: {
        tags: ["Audits"],
        summary: "Approve uploaded audit document",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Approved audit document" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/audit-documents/{id}/reject": {
      patch: {
        tags: ["Audits"],
        summary: "Reject uploaded audit document",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rejectionReason"],
                properties: {
                  rejectionReason: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Rejected audit document" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/document-requirements": {
      get: {
        tags: ["Document Requirements"],
        summary: "List document requirements",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { $ref: "#/components/schemas/DocumentRequirementStatus" },
          },
        ],
        responses: {
          "200": {
            description: "Document requirements",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/DocumentRequirement" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Document Requirements"],
        summary: "Create document requirement",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Created document requirement" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/document-requirements/{id}": {
      get: {
        tags: ["Document Requirements"],
        summary: "Get document requirement by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Document requirement" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Document Requirements"],
        summary: "Update document requirement",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Updated document requirement" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
      delete: {
        tags: ["Document Requirements"],
        summary: "Deactivate document requirement",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Deactivated document requirement" },
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
