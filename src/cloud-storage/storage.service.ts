import {BlobServiceClient, ContainerClient} from "@azure/storage-blob";
import {CloudProvider, ProviderStatus} from "./provider/provider.interface";
import {File, FilesListItem, UploadOperation} from "./storage.interface";
import {StorageRepository} from "./storage.repository";
import {ProviderService} from "./provider/provider.service";
import {ProviderRepository} from "./provider/provider.repository";

const providerService = new ProviderService();

export class StorageService {
    constructor(private cloudProvider: CloudProvider) {}

    async uploadFile( file: File, provider: CloudProvider = this.cloudProvider): Promise<void> {
        const providerStatus: ProviderStatus = await providerService.getProviderStatus(provider);
        if (providerStatus.status) {
            // Si el proveedor está disponible, subo el file y sync backups
            await provider.uploadFile(file);
            const fileCreated = await StorageRepository.createFile(file);
            const providerId = await providerService.getProviderId(provider.getProviderType())
            await StorageRepository.logFileUpload(providerId, fileCreated.id);
            await this.syncToBackups(file, "upload", provider);
        } else {
            await this.handleBackupUpload(provider, file);
        }
    }

    async getFileUrl(fileName: string, provider: CloudProvider = this.cloudProvider): Promise<string> {
        const providerStatus: ProviderStatus = await providerService.getProviderStatus(this.cloudProvider);

        if (!providerStatus.status) {
            return await this.handleBackupGetUrl(provider, fileName);
        }
        // En este punto el provider está disponible
        if (!providerStatus.previousStatus) {
            await this.syncFromBackups(provider);
        }
        // Aca ya esta disponible y sincronizado, es decir que si en algun backup esta el archivo, ya esta en el principal
        return await this.cloudProvider.getFileUrl(fileName);

    }

    async listFile(provider: CloudProvider = this.cloudProvider): Promise<FilesListItem[]> {
        const providerStatus: ProviderStatus = await providerService.getProviderStatus(this.cloudProvider);

        if (!providerStatus.status) {
            return await this.handleBackupListFiles(provider);
        }
        // En este punto el provider está disponible
        if (!providerStatus.previousStatus) {
            await this.syncFromBackups(provider);
        }
        return await provider.listFiles();
    }

    async deleteFile(fileName: string, provider: CloudProvider = this.cloudProvider): Promise<void> {
        const providerStatus: ProviderStatus = await providerService.getProviderStatus(this.cloudProvider);

        if (!providerStatus.status) {
            return await this.handleBackupDelete(provider, fileName);
        }
        // En este punto el provider está disponible
        if (!providerStatus.previousStatus) {
            await this.syncFromBackups(provider);
        }
        return await provider.deleteFile(fileName);
    }

    private async syncToBackups(file: File, operation: "upload" | "delete", provider: CloudProvider): Promise<void> {
        let backupProvider = provider.backupProvider;
        while (backupProvider) {
            if (operation === "upload") {
                await this.uploadFile(file, backupProvider).catch(err => console.error("Sync upload error:", err));
            } else {
                await this.deleteFile(file.name, backupProvider).catch(err => console.error("Sync delete error:", err));
            }
            backupProvider = backupProvider.backupProvider;
        }
    }

    private async syncFromBackups(provider: CloudProvider): Promise<void> {
        let backupProvider = provider.backupProvider;
        while (backupProvider) {
            const backupStatus: ProviderStatus = await providerService.getProviderStatus(backupProvider);
            // si el backup esta disponible, y no estuvo caido...
            if (backupStatus.status && backupStatus.previousStatus) {
                const files = await backupProvider.listFiles();
                for (const file of files) {
                    if (!await providerService.existFileInProvider(file.name, provider)) {
                        // extraer a una funcion y testearlo
                        const fileUrl = await backupProvider.getFileUrl(file.name);
                        const fileContent = await this.downloadFileContent(fileUrl);
                        const fileContentAsString = Buffer.from(fileContent).toString('utf-8');
                        await provider.uploadFile({name: file.name, content: fileContentAsString});
                    }
                }
                return
            }
            backupProvider = backupProvider.backupProvider;
        }
    }

    private async handleBackupUpload(provider: CloudProvider, file: File): Promise<void> {
        let backupProvider = provider.backupProvider;
        while (backupProvider) {
            try {
                await this.uploadFile(file, backupProvider);
                return;
            } catch {
                backupProvider = backupProvider.backupProvider;
            }
        }
        throw new Error("No available providers for upload.");
    }

    private async handleBackupDelete(provider: CloudProvider, fileName: string): Promise<void> {
        let backupProvider = provider.backupProvider;
        while (backupProvider) {
            try {
                await this.deleteFile(fileName, backupProvider);
                return;
            } catch {
                backupProvider = backupProvider.backupProvider;
            }
        }
        throw new Error("No available providers for delete.");
    }

    private async handleBackupGetUrl(provider: CloudProvider, fileName: string): Promise<string> {
        let backupProvider = provider.backupProvider;
        while (backupProvider) {
            try {
                return await this.getFileUrl(fileName, backupProvider);
            } catch {
                backupProvider = backupProvider.backupProvider;
            }
        }
        throw new Error("No available providers for get file url.");
    }

    private async handleBackupListFiles(provider: CloudProvider): Promise<FilesListItem[]> {
        let backupProvider = provider.backupProvider;
        while (backupProvider) {
            try {
                return await this.listFile(backupProvider);
            } catch {
                backupProvider = backupProvider.backupProvider;
            }
        }
        throw new Error("No available providers for list files.");
    }

    private async downloadFileContent(url: string): Promise<Uint8Array> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download file: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
    }

}

