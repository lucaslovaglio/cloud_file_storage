import {UserRepository} from "./user.repository";

export class UserService {
    async getUserByEmail(email: string) {
        return UserRepository.findUserByEmail(email);
    }

    async createUser(email: string, password: string) {
        return UserRepository.createUser(email, password);
    }

    async deleteUser(id: number) {
        return UserRepository.deleteUser(id);
    }

    async getUserRoles(id: number) {
        return UserRepository.getUserRoles(id);
    }

    async getUsers() {
        return UserRepository.getUsers();
    }
}