import express from 'express';
import {PermissionController} from "./permission.controller";

const router = express.Router();
const permissionController = new PermissionController();

router.post('/', permissionController.createPermission.bind(permissionController));
router.get('/:id', permissionController.getPermissionById.bind(permissionController));
router.delete('/:id', permissionController.deletePermission.bind(permissionController));
router.post('/assign', permissionController.assignPermissionToRole.bind(permissionController));

export default router;
