"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotificationService_1 = require("../services/NotificationService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All notification routes require authentication
router.use(auth_1.authMiddleware);
router.get('/:userId', async (req, res) => {
    try {
        const notifications = await NotificationService_1.notificationService.getUserNotifications(req.params.userId);
        const unreadCount = await NotificationService_1.notificationService.getUnreadCount(req.params.userId);
        res.json({ notifications, unreadCount });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const { userId, title, message } = req.body;
        const notification = await NotificationService_1.notificationService.create(userId, title, message);
        res.status(201).json(notification);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.patch('/:id/read', async (req, res) => {
    try {
        await NotificationService_1.notificationService.markAsRead(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.patch('/read-all/:userId', async (req, res) => {
    try {
        await NotificationService_1.notificationService.markAllAsRead(req.params.userId);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
