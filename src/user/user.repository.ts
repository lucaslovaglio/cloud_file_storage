import prisma from '../prisma/client';
import { User } from '@prisma/client';
import {RoleType} from "../role/role.interface";

export const UserRepository = {
    async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    async createUser(email: string, password: string): Promise<User> {
        return prisma.user.create({
            data: { email, password },
        });
    },

    async deleteUser(id: number): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    },

    async getUserRoles(id: number) {
        const userRoles = await prisma.userRole.findMany({
            where: { userId: id },
            include: {
                role: {
                    select: { name: true }
                }
            }
        });

        return userRoles.map((userRole) => (userRole.role.name as RoleType));
    },

    async getUsers(): Promise<User[] | null> {
        return prisma.user.findMany();
    }
}
