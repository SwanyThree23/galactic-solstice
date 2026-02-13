"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoService = exports.VideoService = void 0;
const client_1 = require("@prisma/client");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const prisma = new client_1.PrismaClient();
class VideoService {
    constructor() { }
    static getInstance() {
        if (!VideoService.instance) {
            VideoService.instance = new VideoService();
        }
        return VideoService.instance;
    }
    async uploadShort(userId, title, filePath) {
        // Process video with FFMPEG (ensure it's portrait, optimized)
        const processedPath = `uploads/processed_${Date.now()}.mp4`;
        return new Promise((resolve, reject) => {
            (0, fluent_ffmpeg_1.default)(filePath)
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
    async autoClipStream(streamId) {
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
exports.VideoService = VideoService;
exports.videoService = VideoService.getInstance();
