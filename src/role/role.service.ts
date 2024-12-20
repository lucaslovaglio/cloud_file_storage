import {RoleRepository} from "./role.repository";

export class RoleService {
    async getRoleById(id: number) {
        return RoleRepository.findRoleById(id);
    }

    async createRole(name: string) {
        return RoleRepository.createRole(name);
    }

    async deleteRole(id: number) {
        return RoleRepository.deleteRole(id);
    }

    async assignRoleToUser(userId: number, roleId: number) {
        return RoleRepository.assignRoleToUser(userId, roleId);
    }

    async getRolePermissions(id: number) {
        return RoleRepository.getRolePermissions(id);
    }
}