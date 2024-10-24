import { Request, Response } from 'express';
import {RoleService} from "./role.service";

const roleService = new RoleService();

export class RoleController {
    async getRoleById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const role = await roleService.getRoleById(Number(id));
            res.json(role);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async createRole(req: Request, res: Response) {
        const { name } = req.body;
        try {
            const role = await roleService.createRole(name);
            res.json({ message: 'Role created successfully', role });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deleteRole(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const role = await roleService.deleteRole(Number(id));
            res.json({ message: 'Role deleted successfully', role });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async assignRoleToUser(req: Request, res: Response) {
        const { userId, roleId } = req.body;
        try {
            await roleService.assignRoleToUser(userId, roleId);
            res.json({ message: 'Role assigned to user' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getRolePermissions(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const permissions = await roleService.getRolePermissions(Number(id));
            res.json(permissions);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}