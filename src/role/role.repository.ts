import prisma from '../prisma/client';

export const RoleRepository = {
    async findRoleById(id: number) {
        return prisma.role.findUnique({
            where: { id },
        });
    },

    async findRoleByName(name: string) {
        return prisma.role.findUnique({
            where: { name }
        });
    },

    async createRole(name: string) {
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