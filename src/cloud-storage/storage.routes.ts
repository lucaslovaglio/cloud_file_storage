import express from 'express';

import { StorageController } from "./storage.controller";
import {AuthMiddleware} from "../auth/auth.middleware";
import {uploadFile} from "./storage.middleware";
import { validateData} from "../data-validation/data-validation.middleware";
import { shareSchema, unshareSchema } from "./storage.schema";

/**
 * @swagger
 * tags:
 *   - name: "Storage"
 *     description: "Endpoints for storage operations"
 */

const router = express.Router();
const storageController = new StorageController();

router.use(AuthMiddleware);

router.post('/upload', uploadFile, AuthMiddleware, storageController.uploadFile.bind(storageController));
router.get('/file/:fileName', storageController.downloadFile.bind(storageController));
router.get('/all', storageController.listFile.bind(storageController));
router.delete('/file/:fileName', storageController.deleteFile.bind(storageController));

router.post('/share', validateData(shareSchema), storageController.shareFile.bind(storageController));
router.post('/unshare', validateData(unshareSchema), storageController.unshareFile.bind(storageController));


export default router;


/**
 * @swagger
 * /storage/upload:
 *   post:
 *     summary: Uploads a file
 *     tags: [Storage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Archivo subido correctamente"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /storage/file/{fileName}:
 *   get:
 *     summary: Downloads a file by name
 *     tags: [Storage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to download
 *     responses:
 *       200:
 *         description: File URL retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 *                   example: "https://example.com/file-url"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /storage/all:
 *   get:
 *     summary: Lists all files for the authenticated user
 *     tags: [Storage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Files listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["file1.txt", "file2.png"]
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /storage/file/{fileName}:
 *   delete:
 *     summary: Deletes a file by name
 *     tags: [Storage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Archivo eliminado correctamente"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /storage/share:
 *   post:
 *     summary: Shares a file with another user
 *     tags: [Storage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 example: "document.txt"
 *               targetUserId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: File shared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Archivo compartido correctamente"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /storage/unshare:
 *   post:
 *     summary: Stops sharing a file with another user
 *     tags: [Storage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 example: "document.txt"
 *               targetUserId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: File unshared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Se ha dejado de compartir el archivo exitosamente"
 *       500:
 *         description: Server error
 */

