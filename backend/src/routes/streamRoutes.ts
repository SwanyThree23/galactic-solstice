import { Router } from 'express';
import { streamService } from '../services/StreamService';
import { aiService } from '../services/AIService';

const prisma = new (require('@prisma/client').PrismaClient)();
const router = Router();

// List all live streams (Discovery feed)
router.get('/', async (req, res) => {
    try {
        const streams = await prisma.stream.findMany({
            where: { isLive: true },
            include: { user: { select: { id: true, username: true, avatar: true } } },
            orderBy: { viewCount: 'desc' },
            take: 50
        });
        res.json(streams);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get single stream by ID
router.get('/:id', async (req, res) => {
    try {
        const stream = await prisma.stream.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { id: true, username: true, avatar: true } },
                guests: true,
                _count: { select: { comments: true, likes: true, donations: true } }
            }
        });
        if (!stream) return res.status(404).json({ error: 'Stream not found' });
        res.json(stream);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Validate private access code
router.post('/:id/validate-access', async (req, res) => {
    try {
        const valid = await streamService.validateAccess(req.params.id, req.body.accessCode);
        res.json({ valid });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const stream = await streamService.createStream(req.body.userId, req.body);
        res.status(201).json(stream);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/metrics', async (req, res) => {
    try {
        const metrics = await streamService.getStreamMetrics(req.params.id);
        res.json(metrics);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/multi-stream', async (req, res) => {
    try {
        await streamService.setupMultiStream(req.params.id, req.body.configs);
        res.status(200).json({ status: 'configured' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/ai-highlights', async (req, res) => {
    try {
        const highlights = await aiService.extractHighlights(req.params.id);
        res.json(highlights);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await streamService.closeStream(req.params.id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
