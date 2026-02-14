import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('seewhy_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('seewhy_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ── User API ──
export const userApi = {
    login: (email: string, password: string) =>
        api.post('/users/login', { email, password }),
    register: (username: string, email: string, password: string) =>
        api.post('/users/register', { username, email, password }),
    getProfile: (id: string) =>
        api.get(`/users/profile/${id}`),
    getVideos: (id: string) =>
        api.get(`/users/${id}/videos`),
    getMe: () =>
        api.get('/users/me'),
    updateProfile: (id: string, data: any) =>
        api.patch(`/users/profile/${id}`, data),
};

// ── Stream API ──
export const streamApi = {
    list: () =>
        api.get('/streams'),
    get: (id: string) =>
        api.get(`/streams/${id}`),
    create: (data: { userId: string; title: string; isPrivate?: boolean; accessCode?: string; paywallPrice?: number }) =>
        api.post('/streams', data),
    getMetrics: (id: string) =>
        api.get(`/streams/${id}/metrics`),
    close: (id: string) =>
        api.delete(`/streams/${id}`),
    validateAccess: (id: string, accessCode: string) =>
        api.post(`/streams/${id}/validate-access`, { accessCode }),
    setupMultiStream: (id: string, configs: { platform: string; rtmpUrl: string; streamKey: string }[]) =>
        api.post(`/streams/${id}/multi-stream`, { configs }),
    getAIHighlights: (id: string) =>
        api.post(`/streams/${id}/ai-highlights`),
};

// ── Payment API ──
export const paymentApi = {
    donate: (senderId: string, receiverId: string, amount: number, method: string) =>
        api.post('/payments/donate', { senderId, receiverId, amount, method }),
    getDashboard: (userId: string) =>
        api.get(`/payments/dashboard/${userId}`),
    payout: (userId: string, amount: number, method: string) =>
        api.post(`/payments/payout/${userId}`, { amount, method }),
};

// ── Analytics API ──
export const analyticsApi = {
    trackEvent: (entityType: string, entityId: string, metric: string, value: number) =>
        api.post('/analytics/track', { type: entityType, id: entityId, metric, value }),
    getStreamAnalytics: (streamId: string) =>
        api.get(`/analytics/stream/${streamId}`),
    getCreatorStats: (userId: string) =>
        api.get(`/analytics/creator/${userId}`),
};

// ── AI API ──
export const aiApi = {
    query: (model: string, prompt: string) =>
        api.post('/ai/query', { model, prompt }),
    orchestrateSwarm: (streamId: string) =>
        api.post(`/ai/swarm/${streamId}`),
    tts: (text: string) =>
        api.post('/ai/tts', { text }),
};

// ── Video API ──
export const videoApi = {
    upload: (formData: FormData) =>
        api.post('/videos/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    autoClip: (streamId: string) =>
        api.post(`/videos/${streamId}/autoclip`),
};

// ── Chat API ──
export const chatApi = {
    aggregate: (streamId: string) =>
        api.get(`/chat/aggregate/${streamId}`),
    moderate: (streamId: string, messages: any[]) =>
        api.post(`/chat/moderate/${streamId}`, { messages }),
};

// ── Share API ──
export const shareApi = {
    shareToInstagram: (contentId: string, contentType: string, userId: string) =>
        api.post('/share/instagram', { contentId, contentType, userId }),
    getEmbedUrl: (contentType: string, contentId: string) =>
        api.get(`/share/embed/${contentType}/${contentId}`),
    trackView: (contentId: string, platform: string) =>
        api.post('/share/track-view', { contentId, platform }),
    trackInstall: (shareId: string) =>
        api.post(`/share/track-install/${shareId}`),
};

// ── Notification API ──
export const notificationApi = {
    getAll: (userId: string) =>
        api.get(`/notifications/${userId}`),
    create: (userId: string, title: string, message: string) =>
        api.post('/notifications', { userId, title, message }),
    markRead: (id: string) =>
        api.patch(`/notifications/${id}/read`),
    markAllRead: (userId: string) =>
        api.patch(`/notifications/read-all/${userId}`),
};

// ── Wallet API ──
export const walletApi = {
    get: (userId: string) =>
        api.get(`/wallet/${userId}`),
    getBalance: (userId: string) =>
        api.get(`/wallet/${userId}/balance`),
    withdraw: (userId: string, amount: number) =>
        api.post(`/wallet/${userId}/withdraw`, { amount }),
    getHistory: (userId: string) =>
        api.get(`/wallet/${userId}/history`),
};

export default api;
