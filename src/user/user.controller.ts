import { Request, Response } from 'express';
import {UserService} from "./user.service";

const userService = new UserService();

export class UserController {
    async createUser(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        const { email, password } = req.body;
        try {
            const user = await userService.createUser(email, password);
            res.json({ message: 'User created successfully', user });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deleteUser(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        const { id } = req.params;
        try {
            const user = await userService.deleteUser(Number(id));
            res.json({ message: 'User deleted successfully', user });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getUserRoles(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        const { id } = req.params;
        try {
            const roles = await userService.getUserRoles(Number(id));
            res.json(roles);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getUsers(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        try {
            const users = await userService.getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}