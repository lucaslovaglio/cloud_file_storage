import prisma from '../prisma/client';
import {FileData} from './storage.interface'
import {Provider} from "@prisma/client";
import { File } from '@prisma/client';



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

    async createFile(file: FileData, userId: number) {
        const existingFile = await this.getFileByName(file.name);

        if (existingFile) {
            throw new Error(`A file with the name '${file.name}' already exists.`);
        }

        return prisma.file.create({
            data: {
                name: file.name,
                path: file.name,
                createdById: userId
            }
        });
    },

    async getFileByName(name: string) {
        return prisma.file.findUnique({
            where: {name: name},
        });
    },

    async fileExists(name: string) {
        return prisma.file.findUnique({
            where: { name }
        });
    },

    async getFilesFromUserByDate(userId: number, startDate: Date, endDate: Date): Promise<File[]> {
        return prisma.file.findMany({
            where: {
                createdById: userId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
    },

    async getAllUserFiles(userId: number): Promise<File[]> {
        return prisma.file.findMany({
            where: {
                createdById: userId
            }
        });
    }
}


