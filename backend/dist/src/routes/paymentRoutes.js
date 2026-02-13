"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PaymentService_1 = require("../services/PaymentService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/donate', async (req, res) => {
    try {
        const { senderId, receiverId, amount, method } = req.body;
        const donation = await PaymentService_1.paymentService.processDonation(senderId, receiverId, amount, method);
        res.status(200).json(donation);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/dashboard/:userId', auth_1.authMiddleware, async (req, res) => {
    try {
        const dashboard = await PaymentService_1.paymentService.getEarningsDashboard(req.params.userId);
        res.json(dashboard);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/payout/:userId', auth_1.authMiddleware, async (req, res) => {
    try {
        const { amount, method } = req.body;
        let success = false;
        if (method === 'paypal')
            success = await PaymentService_1.paymentService.initiatePayPalPayout(req.params.userId, amount);
        if (method === 'cashapp')
            success = await PaymentService_1.paymentService.initiateCashAppPayout(req.params.userId, amount);
        res.json({ success });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
