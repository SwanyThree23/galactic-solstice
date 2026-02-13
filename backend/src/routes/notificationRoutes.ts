import { Router } from 'express';
import { notificationService } from '../services/NotificationService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All notification routes require authentication
router.use(authMiddleware);

router.get('/:userId', async (req, res) => {
    try {
        const notifications = await notificationService.getUserNotifications(req.params.userId);
        const unreadCount = await notificationService.getUnreadCount(req.params.userId);
        res.json({ notifications, unreadCount });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { userId, title, message } = req.body;
        const notification = await notificationService.create(userId, title, message);
        res.status(201).json(notification);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/read', async (req, res) => {
    try {
        await notificationService.markAsRead(req.params.id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/read-all/:userId', async (req, res) => {
    try {
        await notificationService.markAllAsRead(req.params.userId);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
