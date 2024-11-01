import { FilePermissionRepository } from './file-permission.repository';
import { FilePermissionTypeEnum} from "./file-permission.interface";

export class FilePermissionService {
    async getFilePermissionTypeById(id: number) {
        return FilePermissionRepository.findFilePermissionTypeById(id)
    }

    async createFilePermissionType(name: string) {
        return FilePermissionRepository.createFilePermissionType(name);
    }

    async deleteFilePermissionType(id: number) {
        return FilePermissionRepository.deleteFilePermissionType(id);
    }

    async assignFilePermission(userId: number, fileId: number, filePermissionType: FilePermissionTypeEnum) {
        return FilePermissionRepository.assignFilePermission(userId, fileId, filePermissionType);
    }

    async getFilePermissions(userId: number, fileId: number) {
        return FilePermissionRepository.getFilePermissions(userId, fileId);
    }

    async deleteFilePermission(userId: number, fileId: number, filePermissionType: FilePermissionTypeEnum) {
        return FilePermissionRepository.deleteFilePermission(userId, fileId, filePermissionType);
    }

    async assignOwnerPermissions(userId: number, fileId: number) {
        await this.assignFilePermission(userId, fileId, 'write');
        await this.assignFilePermission(userId, fileId, 'read');
        await this.assignFilePermission(userId, fileId, 'delete');
        await this.assignFilePermission(userId, fileId, 'share');
    }

    async assignGuestPermissions(userId: number, fileId: number) {
        await this.assignFilePermission(userId, fileId, 'read');
    }

    async disableGuestPermissions(userId: number, fileId: number) {
        await this.deleteFilePermission(userId, fileId, 'read');
    }

    async canReadFile(userId: number, fileId: number): Promise<boolean> {
        return this.canPerformAction(userId, fileId, 'read');
    }

    async canDeleteFile(userId: number, fileId: number): Promise<boolean> {
        return this.canPerformAction(userId, fileId, 'delete');
    }

    async canShareFile(userId: number, fileId: number): Promise<boolean> {
        return this.canPerformAction(userId, fileId, 'share');
    }

    private async canPerformAction(userId: number, fileId: number, permissionType: FilePermissionTypeEnum): Promise<boolean> {
        const permissions = await this.getFilePermissions(userId, fileId);
        const permissionId = await FilePermissionRepository.getFilePermissionTypeIdByName(permissionType);
        return permissions.some(permission => permission.typeId === permissionId);
    }
}
