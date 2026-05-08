"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode ?? 500;
    const message = err.isOperational ? err.message : "Internal Server Error";
    if (process.env.NODE_ENV !== "production") {
        console.error("[error]", err);
    }
    res.status(statusCode).json({ success: false, message });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map