"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = exports.AnalyticsController = void 0;
const AnalyticsService_1 = require("../services/AnalyticsService");
class AnalyticsController {
    async getStreamData(req, res) {
        const stats = await AnalyticsService_1.analyticsService.getStreamAnalytics(req.params.id);
        res.json(stats);
    }
    async getCreatorData(req, res) {
        const stats = await AnalyticsService_1.analyticsService.getCreatorStats(req.params.userId);
        res.json(stats);
    }
    async track(req, res) {
        const { type, id, metric, value } = req.body;
        await AnalyticsService_1.analyticsService.trackEvent(type, id, metric, value);
        res.status(204).send();
    }
}
exports.AnalyticsController = AnalyticsController;
exports.analyticsController = new AnalyticsController();
