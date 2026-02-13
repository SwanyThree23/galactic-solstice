import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationService {
    private static instance: NotificationService;

    private constructor() { }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    async create(userId: string, title: string, message: string) {
        return await prisma.notification.create({
            data: { userId, title, message }
        });
    }

    async getUserNotifications(userId: string) {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }

    async getUnreadCount(userId: string): Promise<number> {
        return await prisma.notification.count({
            where: { userId, isRead: false }
        });
    }

    async markAsRead(notificationId: string) {
        return await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
    }

    async markAllAsRead(userId: string) {
        return await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    }
}

export const notificationService = NotificationService.getInstance();
