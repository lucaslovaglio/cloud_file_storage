import prisma from '../../prisma/client';
import {ProviderStatus, ProviderType} from "./provider.interface";
import {Provider} from "@prisma/client";

export const ProviderRepository = {
    async createProvider(name: ProviderType): Promise<Provider> {
        return prisma.provider.create({ data: { name } });
    },

    async deleteProvider(id: number): Promise<void> {
        await prisma.provider.delete({ where: { id } });
    },

    async findProviderIdByType(providerType: ProviderType): Promise<number> {
        const provider = await prisma.provider.findUnique({
            where: { name: providerType },
            select: { id: true }
        });
        return provider?.id ?? 0;
    },

    async updateProviderStatus(providerId: number, status: boolean): Promise<ProviderStatus> {
        const previousStatus = (await this.getProviderStatus(providerId)).status;
        const provider: Provider = await prisma.provider.update({
            where: { id: providerId },
            data: { status: status, previousStatus: previousStatus }
        });
        return {
            id: providerId,
            status: provider.status,
            previousStatus: provider.previousStatus
        }
    },

    async getProviderStatus(providerId: number): Promise<ProviderStatus> {
        const provider = await prisma.provider.findUnique({
            where: { id: providerId },
            select: { status: true, previousStatus: true }
        });
        return {
            id: providerId,
            status: provider.status,
            previousStatus: provider.previousStatus
        }
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
}


