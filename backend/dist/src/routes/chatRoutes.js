"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChatService_1 = require("../services/ChatService");
const router = (0, express_1.Router)();
// Aggregate chat from external platforms (YouTube, Twitch, Facebook)
router.get('/aggregate/:streamId', async (req, res) => {
    try {
        const messages = await ChatService_1.chatService.aggregateExternalChat(req.params.streamId);
        res.json({ messages, platforms: ['YouTube', 'Twitch', 'Facebook'] });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// AI-powered chat moderation
router.post('/moderate/:streamId', async (req, res) => {
    try {
        const { messages } = req.body;
        const moderated = await ChatService_1.chatService.moderateStreamChat(req.params.streamId, messages);
        res.json({ moderated, filtered: messages.length - moderated.length });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
