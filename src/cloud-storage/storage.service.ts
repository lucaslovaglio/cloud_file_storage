import {CloudProvider} from "./provider/provider.interface";
import {FileData, FilesListItem} from "./storage.interface";
import {StorageRepository} from "./storage.repository";
import {ProviderService} from "./provider/provider.service";
import {FilePermissionService} from "../file-permission/file-permission.service";
import {DaysRange} from "../stats/stats.interface";
import {File} from "@prisma/client";

const providerService = new ProviderService();
const filePermissionService = new FilePermissionService();

const ONE_GB = 1000000000;

export class StorageService {
    constructor(
        private cloudProvider: CloudProvider,
        private storageLimit: number = ONE_GB * 5
    ) {}


    /////////////////////////
    // BASIC FILE OPERATIONS
    /////////////////////////

    async uploadFile(file: FileData, userId: number): Promise<void> {
        await this.checkStorageLimit(userId, file);

        const fileCreated = await StorageRepository.createFile(file, userId);

        const provider = this.cloudProvider;
        await providerService.uploadFile(file, provider);

        const providerId = await providerService.getProviderId(provider.getProviderType())
        await StorageRepository.logFileUpload(providerId, fileCreated.id);

        await filePermissionService.assignOwnerPermissions(userId, fileCreated.id);
    }

    async getFileUrl(fileName: string, userId: number): Promise<string> {
        const file = await StorageRepository.getFileByName(fileName);
        if (!await filePermissionService.canReadFile(userId, file.id)) {
            throw new Error('No tiene permisos para leer este archivo');
        }
        return await providerService.getFileUrl(fileName, this.cloudProvider);
    }

    async listFile(userId: number): Promise<FilesListItem[]> {
        const files = await providerService.listFiles(this.cloudProvider);
        const userFiles = await StorageRepository.getAllUserFiles(userId);
        const userFileNames = userFiles.map(file => file.name);
        return files.filter(file => userFileNames.includes(file.name));
    }

    async deleteFile(fileName: string, userId): Promise<void> {
        const file = await StorageRepository.getFileByName(fileName);
        if (!await filePermissionService.canDeleteFile(userId, file.id)) {
            throw new Error('No tiene permisos para eliminar este archivo');
        }

        await StorageRepository.deleteFile(file.id);

        const provider = this.cloudProvider;
        await providerService.deleteFile(fileName, provider);

        //TODO esto deberia estar en el provider
        // para mejorar el provider puedo agarrar el file como hago aca y que todos reciban los mismos parametros, y ahi hago un mapa y queda joya
        const providerId = await providerService.getProviderId(provider.getProviderType());
        await StorageRepository.logFileDeletion(providerId, file.id);
    }


    /////////////////////////
    // FILE SHARING
    /////////////////////////

    async shareFileWithUser(fileName: string, userId: number, targetUserId: number): Promise<void> {
        const file = await StorageRepository.getFileByName(fileName);
        if (!await filePermissionService.canShareFile(userId, file.id)) {
            throw new Error('No tiene permisos para compartir este archivo');
        }

        await filePermissionService.assignGuestPermissions(targetUserId, file.id);
    }

    async cancelFileSharing(fileName: string, userId: number, targetUserId: number): Promise<void> {
        const file = await StorageRepository.getFileByName(fileName);
        if (!await filePermissionService.canShareFile(userId, file.id)) {
            throw new Error('No tiene permisos para compartir este archivo');
        }

        await filePermissionService.disableGuestPermissions(targetUserId, file.id);
    }


    /////////////////////////
    // UTILS
    /////////////////////////

    async getFilesFromUserByDate(userId: number, startDate: Date, endDate: Date) {
        return StorageRepository.getFilesFromUserByDate(userId, startDate, endDate);
    }

    async getFileSize(fileName: string): Promise<number> {
        return await providerService.getFileSize(fileName, this.cloudProvider);
    }

    async getStorageFromUserByDate(userId: number, daysRange: DaysRange): Promise<number> {
        const files = await this.getFilesFromUserByDate(userId, daysRange.start, daysRange.end);
        return this.getStorageUsedFromFiles(files);
    }

    private async getStorageUsedFromFiles(files: File[]): Promise<number> {
        let storageUsed = 0;
        for (const file of files) {
            const fileSize = await this.getFileSize(file.name);
            storageUsed += fileSize;
        }
        return storageUsed;
    }

    private async calculateUserStorage(userId: number): Promise<number> {
        const monthRange: DaysRange = this.getMonthRange();
        return await this.getStorageFromUserByDate(userId, monthRange);
    }

    private hasStorageAvailable(storageUsed: number): boolean {
        return storageUsed < this.storageLimit;
    }

    private getMonthRange(): DaysRange {
        const startDate = new Date();
        startDate.setDate(1);
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);

        return {
            start: startDate,
            end: endDate
        };
    }

    private async checkStorageLimit(userId: number, file: FileData): Promise<void> {
        const fileSize = await this.calculateFileSize(file);
        const storageUsed = await this.calculateUserStorage(userId);

        if (!this.hasStorageAvailable(storageUsed + fileSize)) {
            throw new Error('No hay espacio suficiente en el almacenamiento');
        }
    }

    private async calculateFileSize(file: FileData): Promise<number> {
        return file.content.length
    }
}

