"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.exportReport = exports.generate = exports.getById = exports.getAll = void 0;
const reports_service_1 = require("./reports.service");
const getAll = async (req, res, next) => {
    try {
        const data = await reports_service_1.reportsService.getAll( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const data = await reports_service_1.reportsService.getById( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getById = getById;
const generate = async (req, res, next) => {
    try {
        const data = await reports_service_1.reportsService.generate( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.generate = generate;
const exportReport = async (req, res, next) => {
    try {
        const data = await reports_service_1.reportsService.export( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.exportReport = exportReport;
const deleteOne = async (req, res, next) => {
    try {
        const data = await reports_service_1.reportsService.delete( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteOne = deleteOne;
//# sourceMappingURL=reports.controller.js.map