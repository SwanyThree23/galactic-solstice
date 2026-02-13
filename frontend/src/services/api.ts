import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('yliv_token');
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
            localStorage.removeItem('yliv_token');
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
};

// ── Stream API ──
export const streamApi = {
    create: (data: { title: string; isPrivate?: boolean; accessCode?: string; paywallPrice?: number }) =>
        api.post('/streams/create', data),
    getMetrics: (id: string) =>
        api.get(`/streams/${id}/metrics`),
    close: (id: string) =>
        api.post(`/streams/${id}/close`),
    setupMultiStream: (id: string, configs: { platform: string; rtmpUrl: string; streamKey: string }[]) =>
        api.post(`/streams/${id}/multistream`, { configs }),
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
        api.post('/analytics/track', { entityType, entityId, metric, value }),
    getStreamAnalytics: (streamId: string) =>
        api.get(`/analytics/stream/${streamId}`),
    getCreatorStats: (userId: string) =>
        api.get(`/analytics/creator/${userId}`),
};

// ── AI API ──
export const aiApi = {
    orchestrateSwarm: (streamId: string) =>
        api.post(`/ai/swarm/${streamId}`),
    getHighlights: (streamId: string) =>
        api.get(`/ai/highlights/${streamId}`),
};

// ── Video API ──
export const videoApi = {
    upload: (formData: FormData) =>
        api.post('/videos/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    autoClip: (streamId: string) =>
        api.post(`/videos/${streamId}/autoclip`),
};

export default api;
