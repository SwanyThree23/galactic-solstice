"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareService = exports.ShareService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ShareService {
    constructor() { }
    static getInstance() {
        if (!ShareService.instance) {
            ShareService.instance = new ShareService();
        }
        return ShareService.instance;
    }
    generateEmbedUrl(contentType, contentId) {
        return `https://cy.live/embed/${contentType}/${contentId}`;
    }
    async shareToInstagram(contentId, contentType, userId) {
        const embedUrl = this.generateEmbedUrl(contentType, contentId);
        const deepLink = `cy.live/DL/tag/${contentType}/bash/${contentId}`;
        // Here we would integrate with Instagram Graph API
        // For now, we simulate the logic as requested
        await prisma.socialShare.create({
            data: {
                userId,
                platform: 'Instagram',
                contentType,
                contentId,
                shareUrl: embedUrl,
            }
        });
        return { embedUrl, deepLink };
    }
    async trackEmbeddedView(contentId, platform) {
        await prisma.socialShare.updateMany({
            where: { contentId, platform },
            data: {
                embeddedViews: { increment: 1 }
            }
        });
    }
    async trackAppInstall(shareId) {
        await prisma.socialShare.updateMany({
            where: { id: shareId },
            data: {
                appInstalls: { increment: 1 }
            }
        });
    }
}
exports.ShareService = ShareService;
exports.shareService = ShareService.getInstance();
