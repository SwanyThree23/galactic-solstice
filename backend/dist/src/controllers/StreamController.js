"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamController = exports.StreamController = void 0;
const StreamService_1 = require("../services/StreamService");
const AIService_1 = require("../services/AIService");
class StreamController {
    async create(req, res) {
        const stream = await StreamService_1.streamService.createStream(req.body.userId, req.body);
        return res.status(201).json(stream);
    }
    async getMetrics(req, res) {
        const metrics = await StreamService_1.streamService.getStreamMetrics(req.params.id);
        return res.json(metrics);
    }
    async getAIHighlights(req, res) {
        const highlights = await AIService_1.aiService.extractHighlights(req.params.id);
        return res.json(highlights);
    }
    async stop(req, res) {
        await StreamService_1.streamService.closeStream(req.params.id);
        return res.status(204).send();
    }
}
exports.StreamController = StreamController;
exports.streamController = new StreamController();
