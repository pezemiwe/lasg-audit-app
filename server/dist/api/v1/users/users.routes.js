"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../../middleware/authenticate");
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.use(authenticate_1.authenticate);
// TODO: Add route guards / validation middleware per route
//# sourceMappingURL=users.routes.js.map