import { Router } from 'express';
import { analyticsController } from '../controllers/AnalyticsController';

const router = Router();

router.get('/stream/:id', analyticsController.getStreamData);
router.get('/creator/:userId', analyticsController.getCreatorData);
router.post('/track', analyticsController.track);

export default router;
