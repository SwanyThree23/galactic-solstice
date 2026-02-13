import { Router } from 'express';
import streamRoutes from './streamRoutes';
import userRoutes from './userRoutes';
import paymentRoutes from './paymentRoutes';
import videoRoutes from './videoRoutes';
import analyticsRoutes from './analyticsRoutes';
import aiRoutes from './aiRoutes';

const router = Router();

router.use('/streams', streamRoutes);
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes);
router.use('/videos', videoRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);

export default router;
