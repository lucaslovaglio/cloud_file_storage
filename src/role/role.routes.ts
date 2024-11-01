import express from 'express';
import {RoleController} from "./role.controller";
import {AuthMiddleware} from "../auth/auth.middleware";
import { validateData } from "../data-validation/data-validation.middleware";
import { createRoleSchema, assignRoleToUserSchema} from "./role.schema";

const router = express.Router();
const roleController = new RoleController()

router.use(AuthMiddleware);

router.post('/', validateData(createRoleSchema), roleController.createRole.bind(roleController));
router.get('/:id', roleController.getRoleById.bind(roleController));
router.delete('/:id', roleController.deleteRole.bind(roleController));
router.post('/assign', validateData(assignRoleToUserSchema), roleController.assignRoleToUser.bind(roleController));
router.get('/:id/permissions', roleController.getRolePermissions.bind(roleController));


export default router;
