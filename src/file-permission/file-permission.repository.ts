import { FilePermissionType } from '@prisma/client';
import prisma from '../prisma/client';
import {FilePermissionTypeEnum} from "./file-permission.interface";

export const FilePermissionRepository = {
    async findFilePermissionTypeById(id: number): Promise<FilePermissionType | null> {
        return prisma.filePermissionType.findUnique({
            where: { id },
        });
    },

    async createFilePermissionType(name: string): Promise<FilePermissionType> {
        return prisma.filePermissionType.create({
            data: { name },
        });
    },

    async deleteFilePermissionType(id: number): Promise<FilePermissionType> {
        return prisma.filePermissionType.delete({
            where: { id },
        });
    },

    async assignFilePermission(userId: number, fileId: number, filePermissionType: FilePermissionTypeEnum) {
        const filePermissionTypeId = await this.getFilePermissionTypeIdByName(filePermissionType)
            .catch(() => {throw new Error("File permission type not found")});
        return prisma.filePermission.create({
            data: {
                userId: userId,
                fileId: fileId,
                typeId: filePermissionTypeId,
            },
        });
    },

    async getFilePermissions(userId: number, fileId: number) {
        return prisma.filePermission.findMany({
            where: {
                userId: userId,
                fileId: fileId,
            },
        });
    },

    async deleteFilePermission(userId: number, fileId: number, filePermissionType: FilePermissionTypeEnum) {
        const filePermissionTypeId = await this.getFilePermissionTypeIdByName(filePermissionType)
            .catch(() => {throw new Error("File permission type not found")});
        return prisma.filePermission.deleteMany({
            where: {
                userId: userId,
                fileId: fileId,
                typeId: filePermissionTypeId,
            },
        });
    },

    async getFilePermissionTypeIdByName(name: FilePermissionTypeEnum): Promise<number> {
        const filePermissionType = await prisma.filePermissionType.findUnique({
            where: { name },
            select: { id: true }
        });
        return filePermissionType?.id ?? 0;
    }
};