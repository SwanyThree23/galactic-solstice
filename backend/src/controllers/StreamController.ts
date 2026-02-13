import { Request, Response } from 'express';
import { streamService } from '../services/StreamService';
import { aiService } from '../services/AIService';

export class StreamController {
    async create(req: Request, res: Response) {
        const stream = await streamService.createStream(req.body.userId, req.body);
        return res.status(201).json(stream);
    }

    async getMetrics(req: Request, res: Response) {
        const metrics = await streamService.getStreamMetrics(req.params.id);
        return res.json(metrics);
    }

    async getAIHighlights(req: Request, res: Response) {
        const highlights = await aiService.extractHighlights(req.params.id);
        return res.json(highlights);
    }

    async stop(req: Request, res: Response) {
        await streamService.closeStream(req.params.id);
        return res.status(204).send();
    }
}

export const streamController = new StreamController();
