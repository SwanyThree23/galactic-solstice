import { Router } from 'express';
import { paymentService } from '../services/PaymentService';

const router = Router();

router.post('/donate', async (req, res) => {
    try {
        const { senderId, receiverId, amount, method } = req.body;
        const donation = await paymentService.processDonation(senderId, receiverId, amount, method);
        res.status(200).json(donation);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/dashboard/:userId', async (req, res) => {
    try {
        const dashboard = await paymentService.getEarningsDashboard(req.params.userId);
        res.json(dashboard);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/payout/:userId', async (req, res) => {
    try {
        const { amount, method } = req.body;
        let success = false;
        if (method === 'paypal') success = await paymentService.initiatePayPalPayout(req.params.userId, amount);
        if (method === 'cashapp') success = await paymentService.initiateCashAppPayout(req.params.userId, amount);
        res.json({ success });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
