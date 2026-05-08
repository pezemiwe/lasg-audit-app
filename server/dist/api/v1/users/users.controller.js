"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.deleteOne = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const users_service_1 = require("./users.service");
const getAll = async (req, res, next) => {
    try {
        const data = await users_service_1.usersService.getAll( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const data = await users_service_1.usersService.getById( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getById = getById;
const create = async (req, res, next) => {
    try {
        const data = await users_service_1.usersService.create( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const data = await users_service_1.usersService.update( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const deleteOne = async (req, res, next) => {
    try {
        const data = await users_service_1.usersService.delete( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteOne = deleteOne;
const changePassword = async (req, res, next) => {
    try {
        const data = await users_service_1.usersService.changePassword( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=users.controller.js.map