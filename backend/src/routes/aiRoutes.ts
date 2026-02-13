import { Router } from 'express';
import { aiController } from '../controllers/AiController';

const router = Router();

router.post('/query', aiController.query);
router.post('/swarm/:id', aiController.swarm);
router.post('/tts', aiController.tts);

export default router;
