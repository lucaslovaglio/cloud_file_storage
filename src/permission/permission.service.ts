import { PermissionRepository } from './permission.repository';

export class PermissionService {
    async getPermissionById(id: number) {
        return PermissionRepository.findPermissionById(id);
    }

    async createPermission(name: string) {
        return PermissionRepository.createPermission(name);
    }

    async deletePermission(id: number) {
        return PermissionRepository.deletePermission(id);
    }

    async assignPermissionToRole(permissionId: number, roleId: number) {
        return PermissionRepository.assignPermissionToRole(permissionId, roleId);
    }
}