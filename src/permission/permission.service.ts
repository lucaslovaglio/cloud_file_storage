import { PermissionRepository } from './permission.repository';

export class PermissionService {
    async getPermissionById(id: number) {
        return PermissionRepository.findPermissionById(id);
    }

    async createPermission(name: string) {
        return PermissionRepository.createPermission(name)
            .catch(() => {
                throw new Error('Permission already exists')
            });
    }

    async deletePermission(id: number) {
        return PermissionRepository.deletePermission(id)
            .catch(() => {
                throw new Error('Permission not found')
            });
    }

    async assignPermissionToRole(permissionId: number, roleId: number) {
        return PermissionRepository.assignPermissionToRole(permissionId, roleId)
            .catch(() => {
                throw new Error('Cannot assign permission to role')
            });
    }
}