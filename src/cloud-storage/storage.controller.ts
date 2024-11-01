import { Request, Response } from "express";
import {StorageService} from "./storage.service";
import { FileData } from "./storage.interface";
import {CloudProviderFactory} from "./provider/provider.factory";

const awsProvider = CloudProviderFactory.createProvider("aws");
const azureProvider = CloudProviderFactory.createProvider("azure");
azureProvider.addBackupProvider(awsProvider);

const storageService = new StorageService(azureProvider);

export class StorageController {
    async uploadFile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.body.userId;
            const fileName = req.body.fileName;
            const content = req.body.content;
            
            const file: FileData = {
                name: fileName,
                content: content
            };
            
            await storageService.uploadFile(file, userId);
            return res.status(201).json({ message: "Archivo subido correctamente" });
        } catch (error) {
            return res.status(500).json({ error: `Error al subir el archivo: ${error.message}` });
        }
    }


    async downloadFile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.body.userId;
            const { fileName } = req.params;
            
            const fileUrl = await storageService.getFileUrl(fileName, userId);
            return res.status(200).json({ fileUrl });
        } catch (error) {
            return res.status(500).json({ error: `Error al solicitar el link de descarga: ${error.message}` });
        }
    }

    async listFile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.body.userId;
            const fileNames = await storageService.listFile(userId);
            return res.status(200).json({ files: fileNames });
        } catch (error) {
            return res.status(500).json({ error: `Error al listar los archivos: ${error.message}` });
        }
    }

    async deleteFile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.body.userId;
            const { fileName } = req.params;
            await storageService.deleteFile(fileName, userId);
            return res.status(200).json({ message: "Archivo eliminado correctamente" });
        } catch (error) {
            return res.status(500).json({ error: "Error al eliminar el archivo" });
        }
    }

    async shareFile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.body.userId;
            const { fileName, targetUserId } = req.body;
            await storageService.shareFileWithUser(fileName, userId, targetUserId);
            return res.status(200).json({ message: "Archivo compartido correctamente" });
        } catch (error) {
            return res.status(500).json({ error: "Error al compartir el blob" });
        }
    }

    async unshareFile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.body.userId;
            const { fileName, targetUserId } = req.body;
            await storageService.cancelFileSharing(fileName, userId, targetUserId);
            return res.status(200).json({message: "Se ha dejado de compartir el archivo exitosamente"});
        } catch (error) {
            return res.status(500).json({error: "Error al dejar de compartir el archivo"});
        }
    }
}