import express from 'express';

import { StorageController } from "./storage.controller";
import {AuthMiddleware} from "../auth/auth.middleware";
import {uploadFile} from "./storage.middleware";

const router = express.Router();
const storageController = new StorageController();

router.use(AuthMiddleware);

router.post('/upload', uploadFile, AuthMiddleware, storageController.uploadFile.bind(storageController));
router.get('/file/:fileName', storageController.downloadFile.bind(storageController));
router.get('/all', storageController.listFile.bind(storageController));
router.delete('/file/:fileName', storageController.deleteFile.bind(storageController));

router.post('/:fileName/share', storageController.shareFile.bind(storageController));
router.post('/:fileName/unshare', storageController.unshareFile.bind(storageController));


export default router;
