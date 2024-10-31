import { Request, Response } from "express";
import {StorageService} from "./storage.service";
import { File } from "./storage.interface";
import {CloudProviderFactory} from "./provider/provider.factory";

const awsProvider = CloudProviderFactory.createProvider("aws");
const azureProvider = CloudProviderFactory.createProvider("azure");
azureProvider.addBackupProvider(awsProvider);

const storageService = new StorageService(azureProvider);

export class StorageController {
    async uploadFile(req: Request, res: Response): Promise<Response> {
        try {
            //TODO: archivos hardcodeados
            const file: File = {
                name: 'blobName10.txt',
                content: 'fileBuffer'
            }
            await storageService.uploadFile(file);
            return res.status(201).json({ message: "Blob subido correctamente" });
        } catch (error) {
            return res.status(500).json({ error: `Error al subir el blob, ${error.message}` });
        }
    }


    async downloadFile(req: Request, res: Response): Promise<Response> {
        try {
            // const { blobName } = req.params;
            //TODO: archivo hardcodeado
            const content = await storageService.getFileUrl('blobName10.txt');
            return res.status(200).json({ content });
        } catch (error) {
            return res.status(500).json({ error: `Error al descargar el blob, ${error.message}` });
        }
    }

    async listFile(req: Request, res: Response): Promise<Response> {
        try {
            const blobNames = await storageService.listFile();
            return res.status(200).json({ blobs: blobNames });
        } catch (error) {
            return res.status(500).json({ error: `Error al listar blobs, ${error.message}` });
        }
    }

    async deleteFile(req: Request, res: Response): Promise<Response> {
        try {
            const { blobName } = req.params;
            await storageService.deleteFile(blobName);
            return res.status(200).json({ message: "Blob eliminado correctamente" });
        } catch (error) {
            return res.status(500).json({ error: "Error al eliminar el blob" });
        }
    }
}