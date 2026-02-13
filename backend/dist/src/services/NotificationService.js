"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class NotificationService {
    constructor() { }
    static getInstance() {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }
    async create(userId, title, message) {
        return await prisma.notification.create({
            data: { userId, title, message }
        });
    }
    async getUserNotifications(userId) {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }
    async getUnreadCount(userId) {
        return await prisma.notification.count({
            where: { userId, isRead: false }
        });
    }
    async markAsRead(notificationId) {
        return await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
    }
    async markAllAsRead(userId) {
        return await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = NotificationService.getInstance();
