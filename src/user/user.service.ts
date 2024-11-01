import {UserRepository} from "./user.repository";
import {RoleType} from "../role/role.interface";

export class UserService {
    async getUserByEmail(email: string) {
        return UserRepository.findUserByEmail(email);
    }

    async createUser(email: string, password: string) {
        return UserRepository.createUser(email, password)
            .catch(() => {
                throw new Error('User already exists');
            });
    }

    async deleteUser(id: number) {
        return UserRepository.deleteUser(id)
            .catch(() => {
                throw new Error('User not found');
            });
    }

    async getUserRoles(id: number) {
        return UserRepository.getUserRoles(id)
            .catch(() => {
                throw new Error('User not found');
            })
    }

    async getUsers() {
        return UserRepository.getUsers()
            .catch(() => {
                throw new Error('Cannot get users');
            });
    }

    async isUserAdmin(userId: number) {
        const roles: RoleType[] = await this.getUserRoles(userId) as RoleType[];
        return roles.includes('admin');
    }
}