import { Router } from 'express';
import { aiController } from '../controllers/AiController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/query', authMiddleware, aiController.query);
router.post('/swarm/:id', authMiddleware, aiController.swarm);
router.post('/tts', aiController.tts);

export default router;
