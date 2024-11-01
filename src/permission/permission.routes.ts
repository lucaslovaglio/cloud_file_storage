import express from 'express';
import {PermissionController} from "./permission.controller";
import {AuthMiddleware} from "../auth/auth.middleware";

const router = express.Router();
const permissionController = new PermissionController();

router.use(AuthMiddleware);

router.post('/', permissionController.createPermission.bind(permissionController));
router.get('/:id', permissionController.getPermissionById.bind(permissionController));
router.delete('/:id', permissionController.deletePermission.bind(permissionController));
router.post('/assign', permissionController.assignPermissionToRole.bind(permissionController));

export default router;
