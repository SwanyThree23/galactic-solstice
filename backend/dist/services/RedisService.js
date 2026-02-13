"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisService = exports.RedisService = void 0;
const redis_1 = require("redis");
class RedisService {
    constructor() {
        this.client = null;
        this.connected = false;
        this.memoryStore = new Map();
        try {
            this.client = (0, redis_1.createClient)({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
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
        }
        catch {
            this.connected = false;
            console.warn('[Redis] Init failed — using in-memory fallback.');
        }
    }
    static getInstance() {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }
    async incrementViewerCount(streamId) {
        const key = `stream:${streamId}:viewers`;
        if (this.connected && this.client) {
            return await this.client.incr(key);
        }
        const val = parseInt(this.memoryStore.get(key) || '0') + 1;
        this.memoryStore.set(key, val.toString());
        return val;
    }
    async decrementViewerCount(streamId) {
        const key = `stream:${streamId}:viewers`;
        if (this.connected && this.client) {
            return await this.client.decr(key);
        }
        const val = Math.max(0, parseInt(this.memoryStore.get(key) || '0') - 1);
        this.memoryStore.set(key, val.toString());
        return val;
    }
    async getViewerCount(streamId) {
        const key = `stream:${streamId}:viewers`;
        if (this.connected && this.client) {
            const val = await this.client.get(key);
            return parseInt(val || '0');
        }
        return parseInt(this.memoryStore.get(key) || '0');
    }
    async setSession(userId, data) {
        const key = `session:${userId}`;
        const value = JSON.stringify(data);
        if (this.connected && this.client) {
            await this.client.setEx(key, 3600, value);
        }
        else {
            this.memoryStore.set(key, value);
        }
    }
    async getSession(userId) {
        const key = `session:${userId}`;
        if (this.connected && this.client) {
            const val = await this.client.get(key);
            return val ? JSON.parse(val) : null;
        }
        const val = this.memoryStore.get(key);
        return val ? JSON.parse(val) : null;
    }
}
exports.RedisService = RedisService;
exports.redisService = RedisService.getInstance();
