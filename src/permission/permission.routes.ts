import express from 'express';
import {PermissionController} from "./permission.controller";
import {AuthMiddleware} from "../auth/auth.middleware";
import { validateData } from "../data-validation/data-validation.middleware";
import { createPermissionSchema, assignPermissionToRoleSchema} from "./permission.schema";

const router = express.Router();
const permissionController = new PermissionController();

router.use(AuthMiddleware);

router.post('/', validateData(createPermissionSchema), permissionController.createPermission.bind(permissionController));
router.get('/:id', permissionController.getPermissionById.bind(permissionController));
router.delete('/:id', permissionController.deletePermission.bind(permissionController));
router.post('/assign', validateData(assignPermissionToRoleSchema), permissionController.assignPermissionToRole.bind(permissionController));

export default router;
