"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.deleteOne = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const audits_service_1 = require("./audits.service");
const getAll = async (req, res, next) => {
    try {
        const data = await audits_service_1.auditsService.getAll( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const data = await audits_service_1.auditsService.getById( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getById = getById;
const create = async (req, res, next) => {
    try {
        const data = await audits_service_1.auditsService.create( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const data = await audits_service_1.auditsService.update( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const deleteOne = async (req, res, next) => {
    try {
        const data = await audits_service_1.auditsService.delete( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteOne = deleteOne;
const updateStatus = async (req, res, next) => {
    try {
        const data = await audits_service_1.auditsService.updateStatus( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.updateStatus = updateStatus;
//# sourceMappingURL=audits.controller.js.map