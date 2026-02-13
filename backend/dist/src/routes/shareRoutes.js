"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ShareService_1 = require("../services/ShareService");
const router = (0, express_1.Router)();
// Share content to Instagram (with deep link generation)
router.post('/instagram', async (req, res) => {
    try {
        const { contentId, contentType, userId } = req.body;
        const result = await ShareService_1.shareService.shareToInstagram(contentId, contentType, userId);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Generate embed URL
router.get('/embed/:contentType/:contentId', (req, res) => {
    const { contentType, contentId } = req.params;
    const embedUrl = ShareService_1.shareService.generateEmbedUrl(contentType, contentId);
    res.json({ embedUrl });
});
// Track embedded view (analytics)
router.post('/track-view', async (req, res) => {
    try {
        const { contentId, platform } = req.body;
        await ShareService_1.shareService.trackEmbeddedView(contentId, platform);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Track app install from share link
router.post('/track-install/:shareId', async (req, res) => {
    try {
        await ShareService_1.shareService.trackAppInstall(req.params.shareId);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
