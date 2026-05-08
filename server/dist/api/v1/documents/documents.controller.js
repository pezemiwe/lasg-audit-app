"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.download = exports.upload = exports.getById = exports.getAll = void 0;
const documents_service_1 = require("./documents.service");
const getAll = async (req, res, next) => {
    try {
        const data = await documents_service_1.documentsService.getAll( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const data = await documents_service_1.documentsService.getById( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getById = getById;
const upload = async (req, res, next) => {
    try {
        const data = await documents_service_1.documentsService.upload( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.upload = upload;
const download = async (req, res, next) => {
    try {
        const data = await documents_service_1.documentsService.download( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.download = download;
const deleteOne = async (req, res, next) => {
    try {
        const data = await documents_service_1.documentsService.delete( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteOne = deleteOne;
//# sourceMappingURL=documents.controller.js.map