"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const authenticate_1 = require("../../../middleware/authenticate");
exports.authRouter = (0, express_1.Router)();
// Public routes
exports.authRouter.post("/login", auth_controller_1.login);
exports.authRouter.post("/register", auth_controller_1.register);
exports.authRouter.post("/refresh", auth_controller_1.refreshToken);
// Protected routes
exports.authRouter.post("/logout", authenticate_1.authenticate, auth_controller_1.logout);
exports.authRouter.get("/me", authenticate_1.authenticate, auth_controller_1.me);
//# sourceMappingURL=auth.routes.js.map