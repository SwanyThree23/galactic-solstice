import { Router } from 'express';
import { shareService } from '../services/ShareService';

const router = Router();

// Share content to Instagram (with deep link generation)
router.post('/instagram', async (req, res) => {
    try {
        const { contentId, contentType, userId } = req.body;
        const result = await shareService.shareToInstagram(contentId, contentType, userId);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Generate embed URL
router.get('/embed/:contentType/:contentId', (req, res) => {
    const { contentType, contentId } = req.params;
    const embedUrl = shareService.generateEmbedUrl(contentType, contentId);
    res.json({ embedUrl });
});

// Track embedded view (analytics)
router.post('/track-view', async (req, res) => {
    try {
        const { contentId, platform } = req.body;
        await shareService.trackEmbeddedView(contentId, platform);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Track app install from share link
router.post('/track-install/:shareId', async (req, res) => {
    try {
        await shareService.trackAppInstall(req.params.shareId);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
