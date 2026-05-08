"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const assignments_service_1 = require("./assignments.service");
const getAll = async (req, res, next) => {
    try {
        const data = await assignments_service_1.assignmentsService.getAll( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const data = await assignments_service_1.assignmentsService.getById( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getById = getById;
const create = async (req, res, next) => {
    try {
        const data = await assignments_service_1.assignmentsService.create( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const data = await assignments_service_1.assignmentsService.update( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const deleteOne = async (req, res, next) => {
    try {
        const data = await assignments_service_1.assignmentsService.delete( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteOne = deleteOne;
//# sourceMappingURL=assignments.controller.js.map