import {CloudProvider, ProviderType} from "../provider.interface";
import {
    BlobSASPermissions,
    BlobSASSignatureValues,
    BlobServiceClient,
    BlockBlobClient,
    BlockBlobUploadResponse,
    ContainerClient,
    StorageSharedKeyCredential,
    generateBlobSASQueryParameters
} from "@azure/storage-blob";
import {File, FilesListItem} from "../../storage.interface";

export class AzureProvider implements CloudProvider {
    backupProvider: CloudProvider | null = null;
    private blobServiceClient: BlobServiceClient;
    private containerClient: ContainerClient;

    constructor() {
        const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME as string;
        if (!accountName) throw Error('Azure Storage accountName not found');
        this.blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

        const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
        if (!containerName) throw Error('Azure Storage containerName not found');
        this.containerClient = this.blobServiceClient.getContainerClient(containerName);
        this.createContainerIfNotExists();
    }

    async deleteFile(fileName: string): Promise<void> {
        const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.delete();
    }

    async getFileUrl(fileName: string): Promise<string> {
        const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
        // const downloadBlockBlobResponse = await blockBlobClient.download(0);
        // return await this.streamToString(downloadBlockBlobResponse.readableStreamBody!);


        const sharedKeyCredential = new StorageSharedKeyCredential(
            process.env.AZURE_STORAGE_ACCOUNT_NAME!,
            process.env.AZURE_STORAGE_ACCOUNT_KEY!
        );

        const sasOptions: BlobSASSignatureValues = {
            containerName: this.containerClient.containerName,
            blobName: fileName,
            permissions: BlobSASPermissions.parse("r"),
            expiresOn: new Date(new Date().valueOf() + 3600 * 1000)  // url expira en 1 hora
        };

        const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

        return `${blockBlobClient.url}?${sasToken}`;
    }

    async uploadFile(file: File): Promise<void> {
        const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(file.name);

        console.log(
            `\nUploading to Azure storage as blob\n\tname: ${file.name}:\n\tURL: ${blockBlobClient.url}`
        );

        const uploadBlobResponse: BlockBlobUploadResponse = await blockBlobClient.upload(file.content, file.content.length);
        console.log(
            `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        );
    }

    async listFiles(): Promise<FilesListItem[]> {
        const blobNames: {name: string, size: number}[] = [];
        for await (const blob of this.containerClient.listBlobsFlat()) {
            blobNames.push(
                {
                    name: blob.name,
                    size: await this.getFileSize(blob.name)
                }
            );
        }
        return blobNames;
    }

    addBackupProvider(backupProvider: CloudProvider): void {
        this.backupProvider = backupProvider;
    }

    async checkAvailability(): Promise<boolean> {
        try {
            await this.listFiles()
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    private async createContainerIfNotExists(): Promise<void> {
        await this.containerClient.createIfNotExists();
    }

    private async streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
        return new Promise((resolve, reject) => {
            const chunks: Uint8Array[] = [];
            readableStream.on("data", (data) => chunks.push(data instanceof Buffer ? data : Buffer.from(data)));
            readableStream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
            readableStream.on("error", reject);
        });
    }

    private async getFileSize(fileName: string): Promise<number> {
        const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
        const properties = await blockBlobClient.getProperties();
        return properties.contentLength;
    }

    getProviderType(): ProviderType {
        return "azure"
    }


}