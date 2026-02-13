"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletService = exports.WalletService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class WalletService {
    constructor() { }
    static getInstance() {
        if (!WalletService.instance) {
            WalletService.instance = new WalletService();
        }
        return WalletService.instance;
    }
    async getOrCreateWallet(userId) {
        let wallet = await prisma.wallet.findUnique({ where: { userId } });
        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: { userId, balance: 0, currency: 'USD' }
            });
        }
        return wallet;
    }
    async getBalance(userId) {
        const wallet = await this.getOrCreateWallet(userId);
        return wallet.balance;
    }
    async withdraw(userId, amount) {
        const wallet = await this.getOrCreateWallet(userId);
        if (wallet.balance < amount) {
            throw new Error('Insufficient balance');
        }
        const updated = await prisma.wallet.update({
            where: { userId },
            data: { balance: { decrement: amount } }
        });
        return { success: true, newBalance: updated.balance };
    }
    async getTransactionHistory(userId) {
        const received = await prisma.donation.findMany({
            where: { receiverId: userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        const sent = await prisma.donation.findMany({
            where: { senderId: userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        return { received, sent };
    }
}
exports.WalletService = WalletService;
exports.walletService = WalletService.getInstance();
