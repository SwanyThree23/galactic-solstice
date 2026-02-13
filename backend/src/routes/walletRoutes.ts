import { Router } from 'express';
import { walletService } from '../services/WalletService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All wallet routes require authentication
router.use(authMiddleware);

router.get('/:userId', async (req, res) => {
    try {
        const wallet = await walletService.getOrCreateWallet(req.params.userId);
        res.json(wallet);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:userId/balance', async (req, res) => {
    try {
        const balance = await walletService.getBalance(req.params.userId);
        res.json({ balance });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:userId/withdraw', async (req, res) => {
    try {
        const { amount } = req.body;
        const result = await walletService.withdraw(req.params.userId, amount);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:userId/history', async (req, res) => {
    try {
        const history = await walletService.getTransactionHistory(req.params.userId);
        res.json(history);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
