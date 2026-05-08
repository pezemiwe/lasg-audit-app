"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = exports.deleteOne = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const workpapers_service_1 = require("./workpapers.service");
const getAll = async (req, res, next) => {
    try {
        const data = await workpapers_service_1.workpapersService.getAll( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const data = await workpapers_service_1.workpapersService.getById( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getById = getById;
const create = async (req, res, next) => {
    try {
        const data = await workpapers_service_1.workpapersService.create( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const data = await workpapers_service_1.workpapersService.update( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const deleteOne = async (req, res, next) => {
    try {
        const data = await workpapers_service_1.workpapersService.delete( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteOne = deleteOne;
const sign = async (req, res, next) => {
    try {
        const data = await workpapers_service_1.workpapersService.sign( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.sign = sign;
//# sourceMappingURL=workpapers.controller.js.map