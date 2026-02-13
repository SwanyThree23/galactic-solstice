"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function seed() {
    console.log('🔴 YLIV 4.0 — Seeding database...\n');
    // ── Users ──
    const passwordHash = await bcryptjs_1.default.hash('demo1234', 10);
    const alex = await prisma.user.upsert({
        where: { email: 'alex@seewhy.live' },
        update: {},
        create: {
            username: 'AlexLivo',
            email: 'alex@seewhy.live',
            password: passwordHash,
            isCreator: true,
            bio: 'Streaming the future of YLIV 4.0. 🚀',
            revenue: 2400,
        },
    });
    const viewer = await prisma.user.upsert({
        where: { email: 'viewer@seewhy.live' },
        update: {},
        create: {
            username: 'Viewer_1',
            email: 'viewer@seewhy.live',
            password: passwordHash,
            isCreator: false,
            bio: 'Just watching and vibing.',
        },
    });
    console.log(`  ✅ Users: ${alex.username}, ${viewer.username}`);
    // ── Streams ──
    // Note: Stream requires a unique streamKey
    const streams = await Promise.all([
        prisma.stream.upsert({
            where: { streamKey: 'stream_key_001' },
            update: {},
            create: {
                id: 'stream-001',
                title: 'Elite Strategy Session: YLIV 4.0 Pro',
                description: 'Full capabilities demo of the SeeWhy LIVE platform with 9+ guests and AI director swarm.',
                userId: alex.id,
                isLive: true,
                isPrivate: false,
                viewCount: 2400,
                streamKey: 'stream_key_001',
                rtmpUrl: 'rtmp://ingest.seewhy.live/live/stream-001',
                pushUrl: 'https://vdo.ninja?push=stream-001',
            },
        }),
        prisma.stream.upsert({
            where: { streamKey: 'stream_key_002' },
            update: {},
            create: {
                id: 'stream-002',
                title: 'Music Production — Late Night Beats',
                description: 'Creating beats live, taking viewer song requests. Low-key vibes only.',
                userId: alex.id,
                isLive: false,
                isPrivate: false,
                viewCount: 890,
                streamKey: 'stream_key_002',
                rtmpUrl: 'rtmp://ingest.seewhy.live/live/stream-002',
                pushUrl: 'https://vdo.ninja?push=stream-002',
            },
        }),
    ]);
    console.log(`  ✅ Streams: ${streams.length} created`);
    // ── Wallet ──
    const wallet = await prisma.wallet.upsert({
        where: { userId: alex.id },
        update: {},
        create: {
            userId: alex.id,
            balance: 2160,
            currency: 'USD',
        },
    });
    console.log(`  ✅ Wallet: $${wallet.balance} balance`);
    // ── Notifications ──
    const notifications = await Promise.all([
        prisma.notification.create({
            data: {
                userId: alex.id,
                title: 'New Follower',
                message: 'Viewer_1 started following you.',
                isRead: false,
            },
        }),
        prisma.notification.create({
            data: {
                userId: alex.id,
                title: 'Donation Received',
                message: 'Someone sent you $25.00 via CashApp.',
                isRead: false,
            },
        }),
        prisma.notification.create({
            data: {
                userId: alex.id,
                title: 'Stream Performance',
                message: 'Your last stream hit 2.4K peak viewers — a new record!',
                isRead: true,
            },
        }),
    ]);
    console.log(`  ✅ Notifications: ${notifications.length} created`);
    // ── Donations ──
    // Note: Schema uses 'amount' and relation fields 'sender'/'receiver'
    const donations = await Promise.all([
        prisma.donation.create({
            data: {
                amount: 25.0,
                senderId: viewer.id,
                receiverId: alex.id,
                streamId: streams[0].id,
            },
        }),
        prisma.donation.create({
            data: {
                amount: 10.0,
                senderId: viewer.id,
                receiverId: alex.id,
                streamId: streams[0].id,
            },
        }),
    ]);
    console.log(`  ✅ Donations: ${donations.length} ($${donations.reduce((s, d) => s + d.amount, 0).toFixed(2)} total)`);
    // ── Analytics ──
    await Promise.all([
        prisma.analyticRecord.create({
            data: {
                entityType: 'stream',
                entityId: streams[0].id,
                metric: 'view',
                value: 2400,
            },
        }),
        prisma.analyticRecord.create({
            data: {
                entityType: 'stream',
                entityId: streams[1].id,
                metric: 'view',
                value: 890,
            },
        }),
    ]);
    console.log(`  ✅ Analytics: 2 records`);
    console.log('\n🟢 YLIV 4.0 database seeded successfully!');
    console.log(`\n  Demo Login:`);
    console.log(`    Email:    alex@seewhy.live`);
    console.log(`    Password: demo1234\n`);
}
seed()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
