"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const AIService_1 = require("./AIService");
class SocketService {
    constructor(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: '*',
            }
        });
        this.setupHandlers();
    }
    setupHandlers() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            socket.on('join_stream', (streamId) => {
                socket.join(`stream_${streamId}`);
                console.log(`Socket ${socket.id} joined stream ${streamId}`);
            });
            // Director Controls
            socket.on('director_mute_guest', ({ streamId, guestId }) => {
                this.io.to(`stream_${streamId}`).emit('guest_muted', { guestId });
            });
            socket.on('director_remove_guest', ({ streamId, guestId }) => {
                this.io.to(`stream_${streamId}`).emit('guest_removed', { guestId });
            });
            socket.on('director_switch_scene', ({ streamId, layout }) => {
                this.io.to(`stream_${streamId}`).emit('scene_changed', { layout });
            });
            // AI Swarm Integration
            socket.on('ai_suggest_action', async (streamId) => {
                const suggestion = await AIService_1.aiService.orchestrateSwarm(streamId);
                socket.emit('ai_suggestion', suggestion);
            });
            // Real-time Chat
            socket.on('send_message', (data) => {
                this.io.to(`stream_${data.streamId}`).emit('receive_message', data);
            });
            // Payment Notifications
            socket.on('donation_received', (data) => {
                this.io.to(`stream_${data.streamId}`).emit('alert_donation', data);
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }
    emitAnalyticsUpdate(streamId, metrics) {
        this.io.to(`stream_${streamId}`).emit('metrics_update', metrics);
    }
}
exports.SocketService = SocketService;
