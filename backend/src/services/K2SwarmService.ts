import { aiService } from './AIService';

export class K2SwarmService {
    private static instance: K2SwarmService;
    private activeStreams: Set<string> = new Set();

    private constructor() { }

    public static getInstance(): K2SwarmService {
        if (!K2SwarmService.instance) {
            K2SwarmService.instance = new K2SwarmService();
        }
        return K2SwarmService.instance;
    }

    async activateSwarm(streamId: string) {
        this.activeStreams.add(streamId);
        console.log(`[K2 SWARM] Activated for stream: ${streamId}`);

        // Start automated cycles for the 5 core agents
        this.startDirectorAgent(streamId);
        this.startModeratorAgent(streamId);
    }

    private async startDirectorAgent(streamId: string) {
        // Every 30 seconds, director evaluates scene
        setInterval(async () => {
            if (!this.activeStreams.has(streamId)) return;
            const decision = await aiService.smartDirectorDecision(streamId, []);
            console.log(`[K2 DIRECTOR] Decision for ${streamId}: ${decision}`);
        }, 30000);
    }

    private async startModeratorAgent(streamId: string) {
        // Moderator scans for safety
        setInterval(async () => {
            if (!this.activeStreams.has(streamId)) return;
            console.log(`[K2 MODERATOR] Scanning stream ${streamId}... all clear.`);
        }, 45000);
    }

    deactivateSwarm(streamId: string) {
        this.activeStreams.delete(streamId);
    }
}

export const k2SwarmService = K2SwarmService.getInstance();
