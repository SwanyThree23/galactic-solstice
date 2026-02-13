import { createClient, RedisClientType } from 'redis';

export class RedisService {
    private static instance: RedisService;
    private client: RedisClientType | null = null;
    private connected = false;
    private memoryStore = new Map<string, string>();

    private constructor() {
        try {
            this.client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
            this.client.on('error', () => {
                console.warn('[Redis] Connection failed — using in-memory fallback.');
                this.connected = false;
            });
            this.client.connect()
                .then(() => {
                    this.connected = true;
                    console.log('[Redis] Connected successfully.');
                })
                .catch(() => {
                    this.connected = false;
                    console.warn('[Redis] Not available — using in-memory store.');
                });
        } catch {
            this.connected = false;
            console.warn('[Redis] Init failed — using in-memory fallback.');
        }
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    async incrementViewerCount(streamId: string): Promise<number> {
        const key = `stream:${streamId}:viewers`;
        if (this.connected && this.client) {
            return await this.client.incr(key);
        }
        const val = parseInt(this.memoryStore.get(key) || '0') + 1;
        this.memoryStore.set(key, val.toString());
        return val;
    }

    async decrementViewerCount(streamId: string): Promise<number> {
        const key = `stream:${streamId}:viewers`;
        if (this.connected && this.client) {
            return await this.client.decr(key);
        }
        const val = Math.max(0, parseInt(this.memoryStore.get(key) || '0') - 1);
        this.memoryStore.set(key, val.toString());
        return val;
    }

    async getViewerCount(streamId: string): Promise<number> {
        const key = `stream:${streamId}:viewers`;
        if (this.connected && this.client) {
            const val = await this.client.get(key);
            return parseInt(val || '0');
        }
        return parseInt(this.memoryStore.get(key) || '0');
    }

    async setSession(userId: string, data: any): Promise<void> {
        const key = `session:${userId}`;
        const value = JSON.stringify(data);
        if (this.connected && this.client) {
            await this.client.setEx(key, 3600, value);
        } else {
            this.memoryStore.set(key, value);
        }
    }

    async getSession(userId: string): Promise<any | null> {
        const key = `session:${userId}`;
        if (this.connected && this.client) {
            const val = await this.client.get(key);
            return val ? JSON.parse(val) : null;
        }
        const val = this.memoryStore.get(key);
        return val ? JSON.parse(val) : null;
    }
}

export const redisService = RedisService.getInstance();
