"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = exports.AnalyticsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AnalyticsService {
    constructor() { }
    static getInstance() {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }
    async trackEvent(entityType, entityId, metric, value) {
        return await prisma.analyticRecord.create({
            data: {
                entityType,
                entityId,
                metric,
                value
            }
        });
    }
    async getStreamAnalytics(streamId) {
        const views = await prisma.analyticRecord.findMany({
            where: { entityId: streamId, metric: 'view' },
            orderBy: { timestamp: 'asc' }
        });
        const retention = await prisma.retentionMetric.findMany({
            where: { streamId },
            orderBy: { minute: 'asc' }
        });
        const revenue = await prisma.donation.aggregate({
            where: { streamId },
            _sum: { amount: true }
        });
        return {
            totalViews: views.length,
            viewHistory: views,
            retentionData: retention,
            revenueGenerated: revenue._sum.amount || 0
        };
    }
    async getCreatorStats(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: { streams: true, videos: true }
                }
            }
        });
        const earnings = await prisma.donation.aggregate({
            where: { receiverId: userId },
            _sum: { amount: true }
        });
        return {
            totalStreams: user?._count.streams,
            totalVideos: user?._count.videos,
            lifetimeEarnings: earnings._sum.amount || 0,
            revenueSplit: '90/10'
        };
    }
}
exports.AnalyticsService = AnalyticsService;
exports.analyticsService = AnalyticsService.getInstance();
