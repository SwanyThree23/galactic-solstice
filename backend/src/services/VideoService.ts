import { PrismaClient } from '@prisma/client';
import ffmpeg from 'fluent-ffmpeg';

const prisma = new PrismaClient();

export class VideoService {
    private static instance: VideoService;

    private constructor() { }

    public static getInstance(): VideoService {
        if (!VideoService.instance) {
            VideoService.instance = new VideoService();
        }
        return VideoService.instance;
    }

    async uploadShort(userId: string, title: string, filePath: string): Promise<any> {
        // Process video with FFMPEG (ensure it's portrait, optimized)
        const processedPath = `uploads/processed_${Date.now()}.mp4`;

        return new Promise((resolve, reject) => {
            ffmpeg(filePath)
                .size('720x1280') // Portrait for TikTok-style
                .save(processedPath)
                .on('end', async () => {
                    const video = await prisma.video.create({
                        data: {
                            userId,
                            title,
                            url: processedPath,
                            isShort: true
                        }
                    });
                    resolve(video);
                })
                .on('error', reject);
        });
    }

    async autoClipStream(streamId: string): Promise<void> {
        console.log(`Starting 10min auto-clipping for stream ${streamId}`);
        await prisma.clippingLog.create({
            data: {
                streamId,
                status: 'processing'
            }
        });
        // Clipping logic would invoke an AI agent to find moments
    }
}

export const videoService = VideoService.getInstance();
