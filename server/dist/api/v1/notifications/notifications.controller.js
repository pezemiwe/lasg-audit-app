"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.markAllRead = exports.markRead = exports.getAll = void 0;
const notifications_service_1 = require("./notifications.service");
const getAll = async (req, res, next) => {
    try {
        const data = await notifications_service_1.notificationsService.getAll( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const markRead = async (req, res, next) => {
    try {
        const data = await notifications_service_1.notificationsService.markRead( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.markRead = markRead;
const markAllRead = async (req, res, next) => {
    try {
        const data = await notifications_service_1.notificationsService.markAllRead( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.markAllRead = markAllRead;
const deleteOne = async (req, res, next) => {
    try {
        const data = await notifications_service_1.notificationsService.delete( /* pass req params */);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteOne = deleteOne;
//# sourceMappingURL=notifications.controller.js.map