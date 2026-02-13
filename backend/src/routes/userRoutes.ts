import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true, username: true, avatar: true, bio: true,
                isCreator: true, revenue: true, createdAt: true,
                _count: { select: { streams: true, videos: true, donations: true } }
            }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
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
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'yliv_secret');
        res.json({ token, user: { id: user.id, username: user.username } });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

export default router;
