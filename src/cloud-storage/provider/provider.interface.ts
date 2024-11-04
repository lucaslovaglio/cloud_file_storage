import {FileData, FilesListItem} from "../storage.interface";

export interface CloudProvider {
    backupProvider?: CloudProvider;
    getProviderType(): ProviderType;
    uploadFile(file: FileData): Promise<void>;
    deleteFile(fileName: string): Promise<void>;
    getFileUrl(fileName: string): Promise<string>;
    listFiles(startDate?: Date, endDate?: Date): Promise<FilesListItem[]>;
    getFileSize(fileName: string): Promise<number>;
    addBackupProvider(provider: CloudProvider): void;
    checkAvailability(): Promise<boolean>;
}

export type ProviderType = "azure" | "aws" | "mock";

export interface ProviderStatus {
    id: number
    status: boolean;
    previousStatus: boolean;
}