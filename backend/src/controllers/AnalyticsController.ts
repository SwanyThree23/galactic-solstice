import { Request, Response } from 'express';
import { analyticsService } from '../services/AnalyticsService';

export class AnalyticsController {
    async getStreamData(req: Request, res: Response) {
        const stats = await analyticsService.getStreamAnalytics(req.params.id);
        res.json(stats);
    }

    async getCreatorData(req: Request, res: Response) {
        const stats = await analyticsService.getCreatorStats(req.params.userId);
        res.json(stats);
    }

    async track(req: Request, res: Response) {
        const { type, id, metric, value } = req.body;
        await analyticsService.trackEvent(type, id, metric, value);
        res.status(204).send();
    }
}

export const analyticsController = new AnalyticsController();
