import { Router } from 'express';
import { videoService } from '../services/VideoService';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.single('video'), async (req: any, res) => {
    try {
        if (!req.file) throw new Error('No video file provided');
        const video = await videoService.uploadShort(req.body.userId, req.body.title, req.file.path);
        res.status(201).json(video);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/autoclip', authMiddleware, async (req, res) => {
    try {
        await videoService.autoClipStream(req.params.id);
        res.json({ status: 'started' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
