"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentsRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../../middleware/authenticate");
exports.documentsRouter = (0, express_1.Router)();
exports.documentsRouter.use(authenticate_1.authenticate);
// TODO: Add route guards / validation middleware per route
//# sourceMappingURL=documents.routes.js.map