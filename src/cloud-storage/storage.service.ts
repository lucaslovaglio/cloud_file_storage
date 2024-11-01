import {CloudProvider} from "./provider/provider.interface";
import {FileData, FilesListItem} from "./storage.interface";
import {StorageRepository} from "./storage.repository";
import {ProviderService} from "./provider/provider.service";
import {DaysRange} from "../stats/stats.interface";
import {File} from "@prisma/client";

const providerService = new ProviderService();

const ONE_GB = 1000000000;

export class StorageService {
    constructor(
        private cloudProvider: CloudProvider,
        private storageLimit: number = ONE_GB * 5
    ) {}

    async uploadFile(file: FileData, userId: number): Promise<void> {
        await this.checkStorageLimit(userId, file);

        const provider = this.cloudProvider;
        await providerService.uploadFile(file, provider);

        const fileCreated = await StorageRepository.createFile(file, userId);
        const providerId = await providerService.getProviderId(provider.getProviderType())
        await StorageRepository.logFileUpload(providerId, fileCreated.id);
    }

    async getFileUrl(fileName: string, userId: number): Promise<string> {
        // TODO chequear si el usuario tiene permisos para leer este archivo
        return await providerService.getFileUrl(fileName, this.cloudProvider);
    }

    async listFile(userId: number): Promise<FilesListItem[]> {
        // TODO aca tengo que filtrar solo los que le corresponden al usuario
        return await providerService.listFiles(this.cloudProvider);
    }

    async deleteFile(fileName: string): Promise<void> {
        const provider = this.cloudProvider;
        await providerService.deleteFile(fileName, provider);

        const file = await StorageRepository.getFileByName(fileName);
        const providerId = await providerService.getProviderId(provider.getProviderType());
        await StorageRepository.logFileDeletion(providerId, file.id);
    }


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
        //TODO esto hay que ahcer que lo reciba en el constructor y que los tipos sean de una interfaz
        const sizeCalculators = new Map<string, (file: FileData) => Promise<number>>([
            ['text/plain', async (file) => {
                return Buffer.byteLength(file.content as string, 'utf8');
            }],
            ['application/pdf', async (file) => {
                return Buffer.isBuffer(file.content) ? file.content.length : 0;
            }],
        ]);

        const fileType = this.getFileType(file)

        const sizeCalculator = sizeCalculators.get(fileType);

        if (sizeCalculator) {
            return await sizeCalculator(file);
        } else {
            throw new Error(`No se encontró un calculador de tamaño para el tipo de archivo: ${fileType}`);
        }
    }

    private getFileType(file: FileData): string {
        //TODO tambien extraer tipos y mapa
        const fileTypes = new Map<string, string>([
            ['.txt', 'text/plain'],
            ['.pdf', 'application/pdf'],
        ]);

        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        return fileTypes.get(extension) || 'text/plain';
    }



}

