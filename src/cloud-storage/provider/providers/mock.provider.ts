import { CloudProvider, ProviderType } from "../provider.interface";
import { FileData, FilesListItem } from "../../storage.interface";

export class MockProvider implements CloudProvider {
    private files: FileData[] = [];
    private isAvailable: boolean = true;
    backupProvider: CloudProvider | null = null;
    isTestStorageLimit: boolean = false;

    async uploadFile(file: FileData): Promise<void> {
        if (!this.isAvailable) throw new Error("Service unavailable");
        this.files.push(file);
        console.log(`Mock upload: ${file.name}`);
    }

    async deleteFile(fileName: string): Promise<void> {
        if (!this.isAvailable) throw new Error("Service unavailable");
        this.files = this.files.filter(file => file.name !== fileName);
        console.log(`Mock delete: ${fileName}`);
    }

    async getFileUrl(fileName: string): Promise<string> {
        const file = this.files.find(file => file.name === fileName);
        if (!file) throw new Error("File not found");
        return `mock-url-for-${fileName}`;
    }

    async listFiles(): Promise<FilesListItem[]> {
        if (!this.isAvailable) throw new Error("Service unavailable");
        return this.files.map(file => ({
            name: file.name,
            size: file.content.length,
        }));
    }

    async getFileSize(fileName: string): Promise<number> {
        if (!this.isTestStorageLimit){
            if (!this.isAvailable) throw new Error("Service unavailable");
            const file = this.files.find(file => file.name === fileName);
            if (!file) throw new Error("File not found");
            return file.content.length;
        }
        //return 5 gb
        return 5 * 1024 * 1024 * 1024;
    }

    async checkAvailability(): Promise<boolean> {
        return this.isAvailable;
    }

    setAvailability(available: boolean): void {
        this.isAvailable = available;
    }

    addBackupProvider(backupProvider: CloudProvider): void {
        this.backupProvider = backupProvider;
    }

    getProviderType(): ProviderType {
        return "mock";
    }

    testStorageLimit(): void {
        this.isTestStorageLimit = true;
    }
}
