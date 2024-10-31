import { Request, Response } from 'express';
import {StatsService} from "./stats.service";

const statsService = new StatsService();

export class StatsController {
    async getStats(req: Request, res: Response) {
        const userId = req.body.userId;
        console.log(userId);
        if (!await statsService.isUserAdmin(userId)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        try {
            const stats = await statsService.getStats();
            res.json(stats);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}