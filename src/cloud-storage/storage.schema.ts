import { z } from 'zod';

export const shareSchema = z.object({
    fileName: z.string(),
    targetUserId: z.number(),
});

export const unshareSchema = z.object({
    fileName: z.string(),
    targetUserId: z.number(),
});