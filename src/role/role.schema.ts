import { z } from 'zod';

export const createRoleSchema = z.object({
    name: z.string(),
});

export const assignRoleToUserSchema = z.object({
    roleId: z.number(),
    targetUserId: z.number(),
});