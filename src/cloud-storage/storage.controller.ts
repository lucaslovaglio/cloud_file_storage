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
            const fileName = req.file.originalname;
            const content = req.file.buffer;
            
            const file: FileData = {
                name: fileName,
                content: content
            };
            
            await storageService.uploadFile(file, userId);
            return res.status(201).json({ message: "File uploaded successfully" });
        } catch (error) {
                return res.status(500).json({ error: `Error uploading the file: ${error.message}` });
        }
    }


    async downloadFile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.body.userId;
            const { fileName } = req.params;
            
            const fileUrl = await storageService.getFileUrl(fileName, userId);
            return res.status(200).json({ fileUrl });
        } catch (error) {
            return res.status(500).json({error: `Error requesting the download link: ${error.message}`});
        }
    }

    async listFile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.body.userId;
            const fileNames = await storageService.listFile(userId);
            return res.status(200).json({ files: fileNames });
        } catch (error) {
            return res.status(500).json({error: `Error listing files: ${error.message}`});
        }
    }

    async deleteFile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.body.userId;
            const { fileName } = req.params;
            await storageService.deleteFile(fileName, userId);
            return res.status(200).json({ message: "File deleted successfully" });
        } catch (error) {
                return res.status(500).json({ error: `Error deleting the file: ${error.message}` });
        }
    }

    async shareFile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.body.userId;
            const { fileName, targetUserId } = req.body;
            await storageService.shareFileWithUser(fileName, userId, targetUserId);
            return res.status(200).json({ message: "File shared successfully" });
        } catch (error) {
            return res.status(500).json({ error: "Error sharing file" });
        }
    }

    async unshareFile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.body.userId;
            const { fileName, targetUserId } = req.body;
            await storageService.cancelFileSharing(fileName, userId, targetUserId);
            return res.status(200).json({ message: "File unshared successfully" });
        } catch (error) {
                return res.status(500).json({ error: "Error unsharing file" });
        }
    }
}