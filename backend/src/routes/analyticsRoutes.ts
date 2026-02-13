import { Router } from 'express';
import { analyticsController } from '../controllers/AnalyticsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/stream/:id', authMiddleware, analyticsController.getStreamData);
router.get('/creator/:userId', authMiddleware, analyticsController.getCreatorData);
router.post('/track', analyticsController.track);

export default router;
