import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        try {
            const token = await authService.register(email, password);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        try {
            const token = await authService.login(email, password);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}