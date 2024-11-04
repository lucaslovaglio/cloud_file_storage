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
 *     description: "Endpoints para operaciones de almacenamiento"
 */

const router = express.Router();
const storageController = new StorageController();

router.use(AuthMiddleware);

/**
 * @swagger
 * /sample:
 *   get:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
router.post('/upload', uploadFile, AuthMiddleware, storageController.uploadFile.bind(storageController));
router.get('/file/:fileName', storageController.downloadFile.bind(storageController));
router.get('/all', storageController.listFile.bind(storageController));
router.delete('/file/:fileName', storageController.deleteFile.bind(storageController));

router.post('/share', validateData(shareSchema), storageController.shareFile.bind(storageController));
router.post('/unshare', validateData(unshareSchema), storageController.unshareFile.bind(storageController));


export default router;
