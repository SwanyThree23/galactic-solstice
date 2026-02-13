import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WalletService {
    private static instance: WalletService;

    private constructor() { }

    public static getInstance(): WalletService {
        if (!WalletService.instance) {
            WalletService.instance = new WalletService();
        }
        return WalletService.instance;
    }

    async getOrCreateWallet(userId: string) {
        let wallet = await prisma.wallet.findUnique({ where: { userId } });
        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: { userId, balance: 0, currency: 'USD' }
            });
        }
        return wallet;
    }

    async getBalance(userId: string): Promise<number> {
        const wallet = await this.getOrCreateWallet(userId);
        return wallet.balance;
    }

    async withdraw(userId: string, amount: number): Promise<{ success: boolean; newBalance: number }> {
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

    async getTransactionHistory(userId: string) {
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

export const walletService = WalletService.getInstance();
