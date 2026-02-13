"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WalletService_1 = require("../services/WalletService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All wallet routes require authentication
router.use(auth_1.authMiddleware);
router.get('/:userId', async (req, res) => {
    try {
        const wallet = await WalletService_1.walletService.getOrCreateWallet(req.params.userId);
        res.json(wallet);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:userId/balance', async (req, res) => {
    try {
        const balance = await WalletService_1.walletService.getBalance(req.params.userId);
        res.json({ balance });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/:userId/withdraw', async (req, res) => {
    try {
        const { amount } = req.body;
        const result = await WalletService_1.walletService.withdraw(req.params.userId, amount);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/:userId/history', async (req, res) => {
    try {
        const history = await WalletService_1.walletService.getTransactionHistory(req.params.userId);
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
