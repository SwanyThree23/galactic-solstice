import { Request, Response } from 'express';
import { aiService } from '../services/AIService';

export class AiController {
    async query(req: Request, res: Response) {
        const { model, prompt } = req.body;
        const response = await aiService.generateResponse(model, prompt);
        res.json({ response });
    }

    async swarm(req: Request, res: Response) {
        const actions = await aiService.orchestrateSwarm(req.params.id);
        res.json({ actions });
    }

    async tts(req: Request, res: Response) {
        const url = await aiService.textToSpeech(req.body.text);
        res.json({ url });
    }
}

export const aiController = new AiController();
