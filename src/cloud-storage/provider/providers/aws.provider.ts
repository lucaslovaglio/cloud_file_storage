import AWS from 'aws-sdk';
import {CloudProvider, ProviderType} from "../provider.interface";
import {FileData, FilesListItem} from "../../storage.interface";

class S3Provider implements CloudProvider{
    private s3: AWS.S3;
    private readonly bucketName: string;
    backupProvider: CloudProvider | null = null;

    constructor() {
        this.s3 = new AWS.S3({
            region: process.env.AWS_REGION,
        });
        this.bucketName = process.env.S3_BUCKET_NAME as string;
    }

    async uploadFile(file:FileData): Promise<void> {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: this.bucketName,
            Key: file.name,
            Body: file.content
        };

        await this.s3.upload(params).promise();
        console.log(`Archivo ${file.name} subido al bucket ${this.bucketName}.`);
    }

    async deleteFile(fileName: string): Promise<void> {
        const params = {
            Bucket: this.bucketName,
            Key: fileName
        };

        await this.s3.deleteObject(params).promise();
        console.log(`Archivo ${fileName} eliminado del bucket ${this.bucketName}.`);
    }

    async getFileUrl(fileName: string): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Key: fileName,
            Expires: 60 * 60 // url expira en 1 hora
        };

        return this.s3.getSignedUrl('getObject', params);
    }

    async listFiles(): Promise<FilesListItem[]> {
        const params = { Bucket: this.bucketName };
        const data = await this.s3.listObjectsV2(params).promise();

        return data.Contents?.map(file => ({
            name: file.Key as string,
            size: file.Size || 0,
        })) || [];
    }

    async getFileSize(fileName: string): Promise<number | null> {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: fileName
            };

            const data = await this.s3.headObject(params).promise();
            return data.ContentLength || 0; // Tamaño en bytes
        } catch (error) {
            console.error(`Error al obtener el tamaño del archivo ${fileName}:`, error);
            return null;
        }
    }

    addBackupProvider(provider: CloudProvider): void {
        this.backupProvider = provider;
    }

    async checkAvailability(): Promise<boolean> {
        try {
            await this.listFiles()
            await this.s3.getBucketLocation({Bucket: this.bucketName}).promise()
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    getProviderType(): ProviderType {
        return "aws"
    }
}

export default S3Provider;
