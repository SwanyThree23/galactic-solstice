import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true, username: true, avatar: true, bio: true,
                isCreator: true, revenue: true, walletAddress: true, createdAt: true,
                _count: { select: { streams: true, videos: true, donations: true } }
            }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get current user (me)
router.get('/me', authMiddleware, async (req: any, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const { password, ...safeUser } = user;
        res.json(safeUser);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile
router.patch('/profile/:id', authMiddleware, async (req: any, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ error: 'Unauthorized to update this profile' });
    }

    try {
        const { username, bio, avatar, isCreator } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { username, bio, avatar, isCreator }
        });
        const { password, ...safeUser } = user;
        res.json(safeUser);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's videos
router.get('/:id/videos', async (req, res) => {
    try {
        const videos = await prisma.video.findMany({
            where: { userId: req.params.id },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        res.json(videos);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        });
        res.status(201).json({ id: user.id, username: user.username });
    } catch (e) {
        res.status(400).json({ error: 'Username or email already exists' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
            { id: user.id, username: user.username, isCreator: user.isCreator },
            process.env.JWT_SECRET || 'yliv_secret',
            { expiresIn: '7d' }
        );
        const { password: _, ...userData } = user;
        res.json({ token, user: userData });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

export default router;
