import express from 'express';
import multer from 'multer';

import { StorageController } from "./storage.controller";

const router = express.Router();
const storageController = new StorageController();
const upload = multer();

router.post('/upload', upload.single('file'), storageController.uploadFile.bind(storageController));
router.get('/', storageController.downloadFile.bind(storageController));
router.get('/all', storageController.listFile.bind(storageController));
router.delete('/:fileName', storageController.deleteFile.bind(storageController));


export default router;
