"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VideoService_1 = require("../services/VideoService");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/upload', auth_1.authMiddleware, upload.single('video'), async (req, res) => {
    try {
        if (!req.file)
            throw new Error('No video file provided');
        const video = await VideoService_1.videoService.uploadShort(req.body.userId, req.body.title, req.file.path);
        res.status(201).json(video);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/:id/autoclip', auth_1.authMiddleware, async (req, res) => {
    try {
        await VideoService_1.videoService.autoClipStream(req.params.id);
        res.json({ status: 'started' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
