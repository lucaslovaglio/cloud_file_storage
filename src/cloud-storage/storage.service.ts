import {CloudProvider, ProviderStatus} from "./provider/provider.interface";
import {FileData, FilesListItem} from "./storage.interface";
import {StorageRepository} from "./storage.repository";
import {ProviderService} from "./provider/provider.service";

const providerService = new ProviderService();

export class StorageService {
    constructor(private cloudProvider: CloudProvider) {}

    async uploadFile(file: FileData, userId: number): Promise<void> {
        const provider = this.cloudProvider;
        await providerService.uploadFile(file, provider);

        const fileCreated = await StorageRepository.createFile(file, userId);
        const providerId = await providerService.getProviderId(provider.getProviderType())
        await StorageRepository.logFileUpload(providerId, fileCreated.id);
    }

    async getFileUrl(fileName: string, userId: number): Promise<string> {
        // chequear si el usuario tiene permisos para leer este archivo
        return await providerService.getFileUrl(fileName, this.cloudProvider);
    }

    async listFile(userId: number): Promise<FilesListItem[]> {
        // aca tengo que filtrar solo los que le corresponden al usuario
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

}

