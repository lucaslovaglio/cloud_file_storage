import { Request, Response } from 'express';
import {PermissionService} from "./permission.service";
import {UserService} from "../user/user.service";

const permissionService = new PermissionService();
const userService = new UserService();

export class PermissionController {
    async getPermissionById(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        const { id } = req.params;
        try {
            const permission = await permissionService.getPermissionById(Number(id));
            res.json(permission);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async createPermission(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        const { name } = req.body;
        try {
            const permission = await permissionService.createPermission(name);
            res.json({ message: 'Permission created successfully', permission });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deletePermission(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        const { id } = req.params;
        try {
            const permission = await permissionService.deletePermission(Number(id));
            res.json({ message: 'Permission deleted successfully', permission });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async assignPermissionToRole(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        const { permissionId, roleId } = req.body;
        try {
            await permissionService.assignPermissionToRole(permissionId, roleId);
            res.json({ message: 'Permission assigned to role' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}
