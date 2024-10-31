import {File, FilesListItem} from "../storage.interface";

export interface CloudProvider {
    backupProvider?: CloudProvider;
    getProviderType(): ProviderType;
    uploadFile(file: File): Promise<void>;
    deleteFile(fileName: string): Promise<void>;
    getFileUrl(fileName: string): Promise<string>;
    listFiles(): Promise<FilesListItem[]>;
    addBackupProvider(provider: CloudProvider): void;
    checkAvailability(): Promise<boolean>;
}

export type ProviderType = "azure" | "aws" | "google";

export interface ProviderStatus {
    id: number
    status: boolean;
    previousStatus: boolean;
}