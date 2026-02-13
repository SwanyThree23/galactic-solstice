import { Router } from 'express';
import { chatService } from '../services/ChatService';

const router = Router();

// Aggregate chat from external platforms (YouTube, Twitch, Facebook)
router.get('/aggregate/:streamId', async (req, res) => {
    try {
        const messages = await chatService.aggregateExternalChat(req.params.streamId);
        res.json({ messages, platforms: ['YouTube', 'Twitch', 'Facebook'] });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// AI-powered chat moderation
router.post('/moderate/:streamId', async (req, res) => {
    try {
        const { messages } = req.body;
        const moderated = await chatService.moderateStreamChat(req.params.streamId, messages);
        res.json({ moderated, filtered: messages.length - moderated.length });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
