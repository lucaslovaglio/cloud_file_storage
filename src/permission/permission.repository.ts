import { Permission } from '@prisma/client';
import prisma from '../prisma/client';

export const PermissionRepository = {
    async findPermissionById(id: number): Promise<Permission | null> {
        return prisma.permission.findUnique({
            where: { id },
        });
    },

    async createPermission(name: string): Promise<Permission> {
        return prisma.permission.create({
            data: { name },
        });
    },

    async deletePermission(id: number): Promise<Permission> {
        return prisma.permission.delete({
            where: { id },
        });
    },

    async assignPermissionToRole(permissionId: number, roleId: number) {
        return prisma.rolePermission.create({
            data: {
                permissionId,
                roleId,
            },
        });
    }
};