import prisma from '../prisma/client';
import {RoleType} from "./role.interface";

export const RoleRepository = {
    async findRoleById(id: number) {
        return prisma.role.findUnique({
            where: { id },
        });
    },

    async createRole(name: RoleType) {
        return prisma.role.create({
            data: { name },
        });
    },

    async deleteRole(id: number) {
        return prisma.role.delete({
            where: { id },
        });
    },

    async assignRoleToUser(userId: number, roleId: number) {
        return prisma.userRole.create({
            data: {
                userId,
                roleId,
            },
        })
    },

    async getRolePermissions(id: number) {
        return prisma.rolePermission.findMany({
            where: { roleId: id },
            include: {
                permission: {
                    select: { name: true }
                }
            }
        });
    }
}