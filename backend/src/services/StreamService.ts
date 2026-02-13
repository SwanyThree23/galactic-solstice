import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

/**
 * Enhanced StreamService for YLIV 4.0
 * Features: RTMP multi-streaming, Private Access Codes, 
 * Paywall logic, and 20 Xeron Latency WebRTC.
 */
export class StreamService {
    private static instance: StreamService;

    private constructor() { }

    public static getInstance(): StreamService {
        if (!StreamService.instance) {
            StreamService.instance = new StreamService();
        }
        return StreamService.instance;
    }

    async createStream(userId: string, data: { title: string; isPrivate?: boolean; accessCode?: string; paywallPrice?: number }): Promise<any> {
        const streamKey = `yliv_prod_${Math.random().toString(36).substring(7)}`;
        const rtmpUrl = `rtmp://rtmp.cy.live/live/${streamKey}`;
        const pushUrl = `https://vdo.ninja/?push=${streamKey}&latency=20`;

        return await prisma.$transaction(async (tx) => {
            const stream = await tx.stream.create({
                data: {
                    userId,
                    title: data.title,
                    streamKey,
                    pushUrl,
                    rtmpUrl,
                    isLive: true,
                    isPrivate: data.isPrivate || false,
                    password: data.accessCode || null, // Private access code
                }
            });

            if (data.paywallPrice) {
                await tx.paywall.create({
                    data: {
                        streamId: stream.id,
                        price: data.paywallPrice
                    }
                });
            }

            return stream;
        });
    }

    async setupMultiStream(streamId: string, configs: { platform: string; rtmpUrl: string; streamKey: string }[]): Promise<void> {
        await prisma.multiStreamConfig.createMany({
            data: configs.map(c => ({
                streamId,
                platform: c.platform,
                rtmpUrl: c.rtmpUrl,
                streamKey: c.streamKey,
                isActive: true
            }))
        });

        console.log(`[RTMP] Multi-streaming initialized for ${streamId} to ${configs.length} platforms.`);
    }

    async validateAccess(streamId: string, providedCode: string): Promise<boolean> {
        const stream = await prisma.stream.findUnique({
            where: { id: streamId }
        });

        if (!stream?.isPrivate) return true;
        return stream.password === providedCode;
    }

    async getStreamMetrics(streamId: string): Promise<any> {
        const stream = await prisma.stream.findUnique({
            where: { id: streamId },
            include: {
                _count: {
                    select: { comments: true, likes: true, donations: true }
                }
            }
        });

        const retention = await prisma.retentionMetric.findMany({
            where: { streamId },
            orderBy: { minute: 'asc' }
        });

        return {
            viewCount: stream?.viewCount || 0,
            engagement: stream?._count,
            retention,
            latencyTarget: '20 xerons'
        };
    }

    async closeStream(streamId: string): Promise<void> {
        await prisma.stream.update({
            where: { id: streamId },
            data: { isLive: false }
        });
    }
}

export const streamService = StreamService.getInstance();
