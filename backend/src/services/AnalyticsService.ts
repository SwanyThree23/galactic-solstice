import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsService {
    private static instance: AnalyticsService;

    private constructor() { }

    public static getInstance(): AnalyticsService {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }

    async trackEvent(entityType: 'user' | 'stream' | 'video', entityId: string, metric: string, value: number) {
        return await prisma.analyticRecord.create({
            data: {
                entityType,
                entityId,
                metric,
                value
            }
        });
    }

    async getStreamAnalytics(streamId: string) {
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

    async getCreatorStats(userId: string) {
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

export const analyticsService = AnalyticsService.getInstance();
