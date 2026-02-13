import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ShareService {
  private static instance: ShareService;

  private constructor() {}

  public static getInstance(): ShareService {
    if (!ShareService.instance) {
      ShareService.instance = new ShareService();
    }
    return ShareService.instance;
  }

  generateEmbedUrl(contentType: string, contentId: string): string {
    return `https://cy.live/embed/${contentType}/${contentId}`;
  }

  async shareToInstagram(contentId: string, contentType: string, userId: string): Promise<{ embedUrl: string; deepLink: string }> {
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

  async trackEmbeddedView(contentId: string, platform: string): Promise<void> {
    await prisma.socialShare.updateMany({
      where: { contentId, platform },
      data: {
        embeddedViews: { increment: 1 }
      }
    });
  }

  async trackAppInstall(shareId: string): Promise<void> {
    await prisma.socialShare.updateMany({
      where: { id: shareId },
      data: {
        appInstalls: { increment: 1 }
      }
    });
  }
}

export const shareService = ShareService.getInstance();
