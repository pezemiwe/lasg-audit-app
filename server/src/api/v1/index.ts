import { Router } from "express";
import { authRouter } from "./auth/auth.routes";
import { usersRouter } from "./users/users.routes";
import { auditsRouter } from "./audits/audits.routes";
import { assignmentsRouter } from "./assignments/assignments.routes";
import { notificationsRouter } from "./notifications/notifications.routes";
import { documentsRouter } from "./documents/documents.routes";
import { reportsRouter } from "./reports/reports.routes";
import { workpapersRouter } from "./workpapers/workpapers.routes";

export const apiV1Router = Router();

apiV1Router.use("/auth", authRouter);
apiV1Router.use("/users", usersRouter);
apiV1Router.use("/audits", auditsRouter);
apiV1Router.use("/assignments", assignmentsRouter);
apiV1Router.use("/notifications", notificationsRouter);
apiV1Router.use("/documents", documentsRouter);
apiV1Router.use("/reports", reportsRouter);
apiV1Router.use("/workpapers", workpapersRouter);
