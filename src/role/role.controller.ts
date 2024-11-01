import { Request, Response } from 'express';
import {RoleService} from "./role.service";
import {UserService} from "../user/user.service";

const roleService = new RoleService();
const userService = new UserService();

export class RoleController {
    async getRoleById(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        const { id } = req.params;
        try {
            const role = await roleService.getRoleById(Number(id));
            res.json(role);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async createRole(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        const { name } = req.body;
        try {
            const role = await roleService.createRole(name);
            res.json({ message: 'Role created successfully', role });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async deleteRole(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        const { id } = req.params;
        try {
            const role = await roleService.deleteRole(Number(id));
            res.json({ message: 'Role deleted successfully', role });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async assignRoleToUser(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        const { roleId } = req.body;
        try {
            await roleService.assignRoleToUser(userId, roleId);
            res.json({ message: 'Role assigned to user' });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getRolePermissions(req: Request, res: Response) {
        const userId = req.body.userId;
        await userService.isUserAdmin(userId);
        const { id } = req.params;
        try {
            const permissions = await roleService.getRolePermissions(Number(id));
            res.json(permissions);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}