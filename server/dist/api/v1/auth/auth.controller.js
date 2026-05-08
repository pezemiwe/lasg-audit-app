"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.refreshToken = exports.register = exports.logout = exports.login = void 0;
const auth_service_1 = require("./auth.service");
const login = async (req, res, next) => {
    try {
        const data = await auth_service_1.authService.login( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        const data = await auth_service_1.authService.logout( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.logout = logout;
const register = async (req, res, next) => {
    try {
        const data = await auth_service_1.authService.register( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const refreshToken = async (req, res, next) => {
    try {
        const data = await auth_service_1.authService.refreshToken( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.refreshToken = refreshToken;
const me = async (req, res, next) => {
    try {
        const data = await auth_service_1.authService.me( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.me = me;
//# sourceMappingURL=auth.controller.js.map