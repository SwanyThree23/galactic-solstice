"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiController = exports.AiController = void 0;
const AIService_1 = require("../services/AIService");
class AiController {
    async query(req, res) {
        const { model, prompt } = req.body;
        const response = await AIService_1.aiService.generateResponse(model, prompt);
        res.json({ response });
    }
    async swarm(req, res) {
        const actions = await AIService_1.aiService.orchestrateSwarm(req.params.id);
        res.json({ actions });
    }
    async tts(req, res) {
        const url = await AIService_1.aiService.textToSpeech(req.body.text);
        res.json({ url });
    }
}
exports.AiController = AiController;
exports.aiController = new AiController();
