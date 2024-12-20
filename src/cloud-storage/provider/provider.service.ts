import {CloudProvider, ProviderStatus, ProviderType} from "./provider.interface";
import {ProviderRepository} from "./provider.repository";
import {FileData, FilesListItem} from "../storage.interface";
import {StorageRepository} from "../storage.repository";


export class ProviderService {

    /*** CRUD ***/

    async createProvider(providerType: ProviderType): Promise<void> {
        await ProviderRepository.createProvider(providerType)
            .catch(() => {throw new Error(`Cannot create provider ${providerType}`)});
    }

    async deleteProvider(providerId: number): Promise<void> {
        await ProviderRepository.deleteProvider(providerId)
            .catch(() => {throw new Error(`Cannot delete provider with id ${providerId}`)});
    }



    /*** UPLOAD ***/

    async uploadFile(file: FileData, provider: CloudProvider): Promise<void> {
        const providerStatus: ProviderStatus = await this.getProviderStatus(provider);
        if (providerStatus.status) {
            // Si el proveedor está disponible, subo el file y sync backups
            await provider.uploadFile(file);
            this.syncUploadToBackups(file, provider);
        } else {
            await this.handleBackupUpload(provider, file);
        }
    }

    private async handleBackupUpload(provider: CloudProvider, file: FileData): Promise<void> {
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

    private async syncUploadToBackups(file: FileData, provider: CloudProvider): Promise<void> {
        let backupProvider: CloudProvider | null = provider.backupProvider;

        while (backupProvider) {
            await this.uploadFile(file, backupProvider)
                .catch(async err => {
                    console.error("Sync upload error:", err)
                    const providerId = await this.getProviderId(provider.getProviderType());
                    ProviderRepository.updateProviderStatus(providerId, false)
                });
            backupProvider = backupProvider.backupProvider;
        }
    }



    /*** GET FILE URL ***/

    async getFileUrl(fileName: string, provider: CloudProvider): Promise<string> {
        const providerStatus: ProviderStatus = await this.getProviderStatus(provider);

        if (!providerStatus.status) {
            return await this.handleBackupGetUrl(provider, fileName);
        }
        // En este punto el provider está disponible
        if (!providerStatus.previousStatus) {
            await this.syncFromBackups(provider);
        }
        // Aca ya esta disponible y sincronizado, es decir que si en algun backup esta el archivo, ya esta en el principal
        return await provider.getFileUrl(fileName);
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



    /*** LIST FILES ***/

    async listFiles(provider: CloudProvider): Promise<FilesListItem[]> {
        const providerStatus: ProviderStatus = await this.getProviderStatus(provider);

        if (!providerStatus.status) {
            return await this.handleBackupListFiles(provider);
        }
        // En este punto el provider está disponible
        if (!providerStatus.previousStatus) {
            await this.syncFromBackups(provider);
        }
        return await provider.listFiles();
    }

    private async handleBackupListFiles(provider: CloudProvider): Promise<FilesListItem[]> {
        let backupProvider = provider.backupProvider;
        while (backupProvider) {
            try {
                return await this.listFiles(backupProvider);
            } catch {
                backupProvider = backupProvider.backupProvider;
            }
        }
        throw new Error("No available providers for list files.");
    }



    /*** DELETE ***/

    async deleteFile(fileName: string, provider: CloudProvider): Promise<void> {
        const providerStatus: ProviderStatus = await this.getProviderStatus(provider);

        if (!providerStatus.status) {
            return await this.handleBackupDelete(provider, fileName);
        }
        // En este punto el provider está disponible
        if (!providerStatus.previousStatus) {
            await this.syncFromBackups(provider);
        }
        await provider.deleteFile(fileName);
        await this.syncDeleteFromBackups(fileName, provider);
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

    private async syncDeleteFromBackups(fileName: string, provider: CloudProvider): Promise<void> {
        let backupProvider: CloudProvider | null = provider.backupProvider;

        while (backupProvider) {
            await this.deleteFile(fileName, backupProvider)
                .catch(err => console.error("Sync delete error:", err));
            backupProvider = backupProvider.backupProvider;
        }
    }



    /*** SYNC ***/

    private async syncFromBackups(provider: CloudProvider): Promise<void> {
        let backupProvider: CloudProvider = provider.backupProvider;

        while (backupProvider) {
            const backupStatus: ProviderStatus = await this.getProviderStatus(backupProvider);

            if (this.isProviderAvailable(backupStatus)) {
                const files = await backupProvider.listFiles();
                await this.syncFilesFromProvider(files, provider, backupProvider);
                return;
            }

            backupProvider = backupProvider.backupProvider;
        }
    }



    /*** GET FILE SIZE ***/

    async getFileSize(fileName: string, provider: CloudProvider): Promise<number> {
        const providerStatus: ProviderStatus = await this.getProviderStatus(provider);

        if (!providerStatus.status) {
            return await this.handleBackupGetFileSize(provider, fileName);
        }
        // En este punto el provider está disponible
        if (!providerStatus.previousStatus) {
            await this.syncFromBackups(provider);
        }
        return await provider.getFileSize(fileName);
    }

    private async handleBackupGetFileSize(provider: CloudProvider, fileName: string): Promise<number> {
        let backupProvider = provider.backupProvider;
        while (backupProvider) {
            try {
                return await this.getFileSize(fileName, backupProvider);
            } catch {
                backupProvider = backupProvider.backupProvider;
            }
        }
        throw new Error("No available providers for get file size.");
    }



    // UTILS

    async getProviderStatus(provider: CloudProvider): Promise<ProviderStatus> {
        const isAvailable = await provider.checkAvailability();
        const providerId = await this.getProviderId(provider.getProviderType());
        return await ProviderRepository.updateProviderStatus(providerId, isAvailable)
    }

    async getProviderId(providerType: ProviderType): Promise<number> {
        return ProviderRepository.findProviderIdByType(providerType);
    }

    async existFileInProvider(fileName: string, provider: CloudProvider): Promise<boolean> {
        const files = await provider.listFiles();
        return files.some(file => file.name === fileName);
    }

    private async syncFilesFromProvider(files: FilesListItem[], targetProvider: CloudProvider, sourceProvider: CloudProvider): Promise<void> {
        for (const file of files) {
            if (!await this.existFileInProvider(file.name, targetProvider)) {
                await this.syncFileFromBackup(file, targetProvider, sourceProvider);
            }
        }
    }

    private isProviderAvailable(status: ProviderStatus): boolean {
        return status.status && status.previousStatus;
    }

    private async syncFileFromBackup(file: FilesListItem, targetProvider: CloudProvider, sourceProvider: CloudProvider): Promise<void> {
        const fileUrl = await sourceProvider.getFileUrl(file.name);
        const fileContent = await this.downloadFileContent(fileUrl);
        const fileContentAsString = Buffer.from(fileContent) //TODO ver esto
        await targetProvider.uploadFile({ name: file.name, content: fileContentAsString });
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
