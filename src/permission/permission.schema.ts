import { z } from 'zod';


export const createPermissionSchema = z.object({
    name: z.string(),
});

export const assignPermissionToRoleSchema = z.object({
    permissionId: z.number(),
    roleId: z.number(),
});