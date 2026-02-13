import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    console.log('🔴 YLIV 4.0 — Seeding database...\n');

    // ── Users ──
    const passwordHash = await bcrypt.hash('demo1234', 10);

    const alex = await prisma.user.upsert({
        where: { email: 'alex@seewhy.live' },
        update: {},
        create: {
            username: 'AlexLivo',
            email: 'alex@seewhy.live',
            password: passwordHash,
            isCreator: true,
            bio: 'Streaming the future of YLIV 4.0. 🚀',
            totalRevenue: 2400,
            verified: true,
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
    const streams = await Promise.all([
        prisma.stream.upsert({
            where: { id: 'stream-001' },
            update: {},
            create: {
                id: 'stream-001',
                title: 'Elite Strategy Session: YLIV 4.0 Pro',
                description: 'Full capabilities demo of the SeeWhy LIVE platform with 9+ guests and AI director swarm.',
                userId: alex.id,
                status: 'live',
                isPrivate: false,
                viewerCount: 2400,
                rtmpUrl: 'rtmp://ingest.seewhy.live/live/stream-001',
                pushUrl: 'https://vdo.ninja?push=stream-001',
            },
        }),
        prisma.stream.upsert({
            where: { id: 'stream-002' },
            update: {},
            create: {
                id: 'stream-002',
                title: 'Music Production — Late Night Beats',
                description: 'Creating beats live, taking viewer song requests. Low-key vibes only.',
                userId: alex.id,
                status: 'ended',
                isPrivate: false,
                viewerCount: 890,
                rtmpUrl: 'rtmp://ingest.seewhy.live/live/stream-002',
                pushUrl: 'https://vdo.ninja?push=stream-002',
            },
        }),
        prisma.stream.upsert({
            where: { id: 'stream-003' },
            update: {},
            create: {
                id: 'stream-003',
                title: 'Private Subscriber Stream — VIP Only',
                description: 'Exclusive content for VIP subscribers.',
                userId: alex.id,
                status: 'scheduled',
                isPrivate: true,
                accessCode: 'VIP-2026',
                viewerCount: 0,
                rtmpUrl: 'rtmp://ingest.seewhy.live/live/stream-003',
                pushUrl: 'https://vdo.ninja?push=stream-003',
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
            totalEarned: 2400,
            totalWithdrawn: 240,
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
                read: false,
            },
        }),
        prisma.notification.create({
            data: {
                userId: alex.id,
                title: 'Donation Received',
                message: 'Someone sent you $25.00 via CashApp.',
                read: false,
            },
        }),
        prisma.notification.create({
            data: {
                userId: alex.id,
                title: 'Stream Performance',
                message: 'Your last stream hit 2.4K peak viewers — a new record!',
                read: true,
            },
        }),
        prisma.notification.create({
            data: {
                userId: alex.id,
                title: 'AI Director Report',
                message: 'K2 Swarm auto-switched scenes 14 times during your last stream.',
                read: true,
            },
        }),
    ]);

    console.log(`  ✅ Notifications: ${notifications.length} created`);

    // ── Donations ──
    const donations = await Promise.all([
        prisma.donation.create({
            data: {
                amount: 25.0,
                method: 'cashapp',
                senderId: viewer.id,
                receiverId: alex.id,
                streamId: streams[0].id,
            },
        }),
        prisma.donation.create({
            data: {
                amount: 10.0,
                method: 'paypal',
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
                type: 'stream_view',
                data: JSON.stringify({ streamId: streams[0].id, viewers: 2400, peakViewers: 2847, avgWatchTime: 262 }),
                userId: alex.id,
            },
        }),
        prisma.analyticRecord.create({
            data: {
                type: 'stream_view',
                data: JSON.stringify({ streamId: streams[1].id, viewers: 890, peakViewers: 1100, avgWatchTime: 185 }),
                userId: alex.id,
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
