"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
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
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (error) {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        });
        res.status(201).json({ id: user.id, username: user.username });
    }
    catch (e) {
        res.status(400).json({ error: 'Username or email already exists' });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && await bcryptjs_1.default.compare(password, user.password)) {
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || 'yliv_secret');
        res.json({ token, user: { id: user.id, username: user.username } });
    }
    else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});
exports.default = router;
