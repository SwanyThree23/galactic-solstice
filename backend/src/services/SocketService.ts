import { Server } from 'socket.io';
import http from 'http';
import { aiService } from './AIService';

export class SocketService {
    private io: Server;

    constructor(server: http.Server) {
        this.io = new Server(server, {
            cors: {
                origin: '*',
            }
        });

        this.setupHandlers();

        // Connect AI Service to the broadcast engine
        aiService.setBroadcaster(this.broadcastToStream.bind(this));
    }

    private setupHandlers() {
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
                const suggestion = await aiService.orchestrateSwarm(streamId);
                socket.emit('ai_suggestion', suggestion);
            });

            // Real-time Chat
            socket.on('send_message', async (data) => {
                const isSafe = await aiService.moderateMessage(data.streamId, socket.id, data.text);

                if (isSafe) {
                    this.io.to(`stream_${data.streamId}`).emit('receive_message', data);
                } else {
                    socket.emit('receive_message', {
                        id: 'system',
                        user: 'K2 Moderator',
                        text: '⚠️ Your message was flagged as unsafe by the AI Director.',
                        isSystem: true
                    });
                }
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

    public emitAnalyticsUpdate(streamId: string, metrics: any) {
        this.io.to(`stream_${streamId}`).emit('metrics_update', metrics);
    }

    public broadcastToStream(streamId: string, event: string, data: any) {
        this.io.to(`stream_${streamId}`).emit(event, data);
    }
}
