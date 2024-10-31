import prisma from '../prisma/client';
import {File} from './storage.interface'
import {Provider} from "@prisma/client";

export const StorageRepository = {
    async updateFileStatus(providerId: number, fileId: number, status: boolean) {
        await prisma.fileStatusByProvider.upsert({
            where: { fileId_providerId: { fileId, providerId } },
            update: { status },
            create: { providerId, fileId, status }
        });
    },

    async logFileUpload(providerId: number, fileId: number) {
        const provider = await prisma.provider.findUnique({ where: { id: providerId } });
        const file = await prisma.file.findUnique({ where: { id: fileId } });

        if (!provider) {
            throw new Error(`Provider with id ${providerId} does not exist`);
        }

        if (!file) {
            throw new Error(`File with id ${fileId} does not exist`);
        }

        await prisma.fileStatusByProvider.create({
            data: {
                providerId,
                fileId,
                status: true
            }
        });
    },

    async logFileDeletion(providerId: number, fileId: number) {
        await prisma.fileStatusByProvider.updateMany({
            where: { providerId, fileId },
            data: { status: false }
        });
    },

    async createFile(file: File) {
        const existingFile = await prisma.file.findUnique({
            where: { name: file.name },
        });

        if (existingFile) {
            throw new Error(`A file with the name '${file.name}' already exists.`);
        }

        return prisma.file.create({
            data: {
                name: file.name,
                path: file.name,
            }
        });
    },

    async fileExists(name: string) {
        return prisma.file.findUnique({
            where: { name }
        });
    }
}


